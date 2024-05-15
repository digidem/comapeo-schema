// @ts-check
import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import {
  encode,
  decode,
  decodeBlockPrefix,
  parseVersionId,
  validate,
  valueOf,
} from '../dist/index.js'

import { encodeBlockPrefix } from '../dist/encode.js'
import { dataTypeIds, currentSchemaVersions } from '../dist/config.js'
import { DATA_TYPE_ID_BYTES, SCHEMA_VERSION_BYTES } from '../dist/constants.js'
import {
  goodDocsMinimal,
  goodDocsCompleted,
  badDocs,
} from './fixtures/index.js'

test('Bad docs throw when encoding', () => {
  for (const { text, doc } of badDocs) {
    assert.throws(() => {
      // @ts-expect-error
      encode(doc)
    }, text)
  }
})

test(`Bad docs won't validate`, () => {
  for (const { text, doc } of badDocs) {
    assert.throws(() => {
      // @ts-expect-error
      validate(doc)
    }, text)
  }
})

test('validate bad docs', () => {
  for (const schemaName of Object.keys(currentSchemaVersions)) {
    assert(
      // @ts-ignore
      !validate(schemaName, {}),
      `${schemaName} with missing properties should not validate`
    )
    assert(
      Array.isArray(validate.errors),
      'validate.errors should be an array after failed validation'
    )
    assert.equal(
      validate.errors.length,
      1,
      'validate.errors should have one error'
    )
  }
})

test('validate good docs', () => {
  for (const { doc, expected } of [...goodDocsMinimal, ...goodDocsCompleted]) {
    // skip docs with UNRECOGNIZED values - these are used for testing encoding/decoding and will not validate (the decoded versions should validate)
    if (Object.values(expected).includes('UNRECOGNIZED')) continue
    assert(
      // @ts-ignore
      validate(doc.schemaName, valueOf(doc)),
      `${doc.schemaName} with all required properties should validate`
    )
  }
})

test(`testing encoding of doc with minimal required values,
  then decoding and comparing the two objects`, async () => {
  for (const { doc, expected } of goodDocsMinimal) {
    const buf = encode(doc)
    const decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    assert.deepEqual(
      decodedDoc,
      { ...doc, ...expected },
      `tested deep equal of ${doc.schemaName} with only required values`
    )
  }
})

test(`testing encoding of doc with additional optional values,
  then decoding and comparing the two objects`, async () => {
  for (const { doc, expected } of goodDocsCompleted) {
    const buf = encode(doc)
    const decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    assert.deepEqual(
      decodedDoc,
      { ...doc, ...expected },
      `tested deep equal of ${doc.schemaName} with additional values`
    )
  }
})

test(`testing encoding of doc with additional extra values,
then decoding and comparing the two objects - extra values shouldn't be present`, async () => {
  for (const { doc, expected } of goodDocsCompleted) {
    const buf = encode({
      ...doc,
      // @ts-expect-error
      extraFieldNotInSchema: 'whatever',
    })
    const decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    assert.deepEqual(
      decodedDoc,
      { ...doc, ...expected },
      `tested deep equal of ${doc.schemaName} with extra - non valid - values`
    )
  }
})

test(`testing decoding of header that should match the dataTypeId and version`, async () => {
  for (const [schemaName, dataTypeId] of Object.entries(dataTypeIds)) {
    // TODO: test also schemaVersions greater than the current, for foward compat
    const schemaVersion = currentSchemaVersions[schemaName]
    /** @type { import('../src/types.js').ValidSchemaDef } */
    const schemaDef = { schemaName, schemaVersion }
    const buf = encodeBlockPrefix(schemaDef)
    assert.deepEqual(
      decodeBlockPrefix(buf),
      schemaDef,
      `test equality of schema definition with the decoded block prefix for ${schemaName}`
    )
    assert.equal(
      buf.subarray(0, DATA_TYPE_ID_BYTES).toString('hex'),
      dataTypeId,
      `test equality of dataTypeId for ${schemaName}`
    )
  }
})

test(`test encoding and decoding of block prefix, ignoring data that comes after`, async () => {
  for (let [schemaName, schemaVersion] of Object.entries(
    currentSchemaVersions
  )) {
    /** @type { import('../src/types.js').ValidSchemaDef } */
    const schemaDef = {
      schemaName,
      schemaVersion,
    }
    const blockPrefix = encodeBlockPrefix(schemaDef)
    const prefixLength = DATA_TYPE_ID_BYTES + SCHEMA_VERSION_BYTES
    const buf = Buffer.concat([blockPrefix, randomBytes(50)])
    assert.equal(
      blockPrefix.length,
      prefixLength,
      `test proper length of block prefix`
    )
    assert.deepEqual(
      decodeBlockPrefix(buf),
      schemaDef,
      `test equality of schema definition for ${schemaName}`
    )
  }
})

test(`test encoding of wrongly formatted header`, async () => {
  /** @type { import('../src/types.js').ValidSchemaDef } */
  let schemaDef = {
    schemaName: 'presot',
    schemaVersion: 2,
  }
  assert.throws(() => {
    encodeBlockPrefix(schemaDef)
  }, `when encoding a prefix with wrong schema name`)

  /** @type { import('../src/types.js').ValidSchemaDef } */
  schemaDef = {
    schemaName: 'observation',
    schemaVersion: 5,
  }
  let buf = encodeBlockPrefix(schemaDef).subarray(0, 7)
  assert.throws(() => {
    decodeBlockPrefix(buf)
  }, `when decoding a header with the wrong length`)

  // hardcoded since there's a slim chance we produce a correct header
  const randomBuf = Buffer.from(
    '806a8dbb56e1994c8ea6887cda1d21b441eb9122',
    'hex'
  )
  assert.throws(() => {
    decodeBlockPrefix(randomBuf)
  }, `when trying to decode a header that is random data`)

  assert.throws(() => {
    decodeBlockPrefix(Buffer.alloc(50))
  }, `when trying to decode a header that is empty`)

  schemaDef = { schemaName: 'projectSettings', schemaVersion: 2 }
  buf = encodeBlockPrefix(schemaDef)
  // hardcoded since there's a slim chance we produce a correct header
  const unknownDataTypeId = Buffer.from('7a79b8b773b2', 'hex')
  unknownDataTypeId.copy(buf)
  assert.throws(() => {
    decodeBlockPrefix(buf)
  })
})

/**
 * Remove undefined properties (deeply) from an object, by round-tripping to
 * JSON. Also handles Buffers via JSON.parse reviver
 *
 * @param {object} obj
 * @return {object}
 * */
function stripUndef(obj) {
  return JSON.parse(JSON.stringify(obj), (key, value) => {
    if (value.type === 'Buffer') {
      return Buffer.from(value.data)
    }
    return value
  })
}
