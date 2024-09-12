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
import { cachedValues } from './fixtures/cached.js'

/** @import { SchemaName } from '../dist/types.js' */

const schemaNames = /** @type {SchemaName[]} */ (Object.keys(dataTypeIds))

test('Bad docs throw when encoding', () => {
  for (const { text, doc } of badDocs) {
    assert.throws(() => {
      // @ts-expect-error
      encode(doc)
    }, text)
  }
})

test('Bad docs throw when validating if bad schema name', () => {
  for (const { text, doc } of badDocs) {
    const { schemaName } = doc
    if (isSchemaName(schemaName)) continue

    assert.throws(() => {
      validate(/** @type {any} */ (schemaName), doc)
    }, text)
  }
})

test(`Bad docs won't validate`, () => {
  for (const { text, doc } of badDocs) {
    const { schemaName } = doc
    if (!isSchemaName(schemaName)) continue

    assert(!validate(schemaName, doc), text)
  }
})

test('validate empty docs', () => {
  for (const schemaName of schemaNames) {
    assert(
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

test('decoding a block prefix with a far-future schema version', () => {
  const schemaName = 'observation'
  const schemaVersion = 9999

  const buf = encodeBlockPrefix({ schemaName, schemaVersion })

  assert.deepEqual(decodeBlockPrefix(buf), { schemaName, schemaVersion })
})

test('decoding a doc with a far-future schema version', () => {
  const [{ doc, expected }] = goodDocsCompleted
  const { schemaName } = doc
  const schemaVersion = 9999

  const buf = Buffer.concat([
    encodeBlockPrefix({ schemaName, schemaVersion }),
    removeBlockPrefix(encode(doc)),
  ])

  assert.deepEqual(decodeBlockPrefix(buf), { schemaName, schemaVersion })

  const decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
  assert.deepEqual(decodedDoc, { ...doc, ...expected })
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

/** @type {import('../dist/index.js').Observation} */
const minimalObservation = {
  docId: cachedValues.docId,
  versionId: cachedValues.versionId,
  originalVersionId: cachedValues.originalVersionId,
  schemaName: 'observation',
  createdAt: cachedValues.createdAt,
  updatedAt: cachedValues.updatedAt,
  links: [],
  lat: 24.0424,
  lon: 21.0214,
  attachments: [],
  tags: {},
  metadata: {},
  deleted: false,
}

test(`encoding observation with missing position metadata`, async () => {
  /** @type {import('../dist/index.js').Observation} */
  const doc = {
    ...minimalObservation,
    metadata: {
      position: /** @type {any} */ ({ coords: {} }),
    },
  }
  const buf = encode(doc)
  const decodedDoc = decode(buf, parseVersionId(doc.versionId))
  assert.equal(decodedDoc.schemaName, 'observation')
  // a previous bug meant that protobuf defaults of 0 were being set for lat/lon
  assert.equal(
    typeof decodedDoc.metadata?.position?.coords?.longitude,
    'undefined'
  )
  assert.equal(
    typeof decodedDoc.metadata?.position?.coords?.latitude,
    'undefined'
  )
})

test(`decoding observation with missing position provider props`, async () => {
  /** @type {import('../dist/index.js').Observation} */
  const doc = {
    ...minimalObservation,
    metadata: {
      positionProvider: {
        locationServicesEnabled: true,
      },
    },
  }
  const buf = encode(doc)
  const decodedDoc = decode(buf, parseVersionId(doc.versionId))
  assert.equal(decodedDoc.schemaName, 'observation')
  assert.equal(
    typeof decodedDoc.metadata?.positionProvider?.gpsAvailable,
    'undefined',
    'optional gpsAvailable prop should be undefined'
  )
  assert.equal(
    typeof decodedDoc.metadata?.positionProvider?.networkAvailable,
    'undefined',
    'optional networkAvailable prop should be undefined'
  )
  assert.equal(
    typeof decodedDoc.metadata?.positionProvider?.passiveAvailable,
    'undefined',
    'optional passiveAvailable prop should be undefined'
  )
})

/**
 * @param {unknown} value
 * @returns {value is SchemaName}
 */
function isSchemaName(value) {
  return schemaNames.includes(/** @type {any} */ (value))
}

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

/**
 * @param {Readonly<Buffer>} buf
 * @returns {Buffer}
 */
function removeBlockPrefix(buf) {
  const blockPrefix = encodeBlockPrefix(decodeBlockPrefix(buf))
  return buf.slice(blockPrefix.byteLength)
}
