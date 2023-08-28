// @ts-check
import test from 'tape'
import {
  encode,
  decode,
  encodeBlockPrefix,
  parseVersionId,
} from '../dist/index.js'
import { dataTypeIds, currentSchemaVersions } from '../dist/config.js'
import { DATA_TYPE_ID_BYTES, SCHEMA_VERSION_BYTES } from '../dist/constants.js'
import * as cenc from 'compact-encoding'
import {
  goodDocsMinimal,
  goodDocsCompleted,
  badDocs,
} from './fixtures/index.js'

test('Bad docs throw when encoding', (t) => {
  for (const { text, doc } of badDocs) {
    t.throws(() => {
      // @ts-expect-error
      encode(doc)
    }, text)
  }
  t.end()
})

test(`testing encoding of doc with minimal required values,
  then decoding and comparing the two objects`, async (t) => {
  for (const { doc, expected } of goodDocsMinimal) {
    const buf = encode(doc)
    const decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    t.deepEqual(
      decodedDoc,
      { ...doc, ...expected },
      `tested deep equal of ${doc.schemaName} with only required values`
    )
  }
})

test(`testing encoding of doc with additional optional values,
  then decoding and comparing the two objects`, async (t) => {
  for (const { doc, expected } of goodDocsCompleted) {
    const buf = encode(doc)
    const decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    t.deepEqual(
      decodedDoc,
      { ...doc, ...expected },
      `tested deep equal of ${doc.schemaName} with additional values`
    )
  }
})

test(`testing encoding of doc with additional extra values,
then decoding and comparing the two objects - extra values shouldn't be present`, async (t) => {
  for (const { doc, expected } of goodDocsCompleted) {
    const buf = encode({
      ...doc,
      // @ts-expect-error
      extraFieldNotInSchema: 'whatever',
    })
    const decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    t.deepEqual(
      decodedDoc,
      { ...doc, ...expected },
      `tested deep equal of ${doc.schemaName} with extra - non valid - values`
    )
  }
})

test(`testing decoding of header that should match the dataTypeId and version`, async (t) => {
  for (const { doc } of goodDocsCompleted) {
    /** @type { import('../src/types.js').ValidSchemaDef } */
    const obj = {
      schemaName: doc.schemaName,
      schemaVersion: currentSchemaVersions[doc.schemaName],
    }
    const prefix = encodeBlockPrefix(obj)
    const expectedDataTypeId = dataTypeIds[doc.schemaName]
    const expectedVersion = currentSchemaVersions[doc.schemaName]

    const state = cenc.state()
    state.buffer = prefix

    state.start = 0
    state.end = DATA_TYPE_ID_BYTES
    const dataTypeId = cenc.hex.fixed(DATA_TYPE_ID_BYTES).decode(state)

    state.start = DATA_TYPE_ID_BYTES
    state.end = DATA_TYPE_ID_BYTES + SCHEMA_VERSION_BYTES
    const version = cenc.uint16.decode(state)

    t.equal(
      version,
      expectedVersion,
      `testing matching version of ${doc.schemaName}`
    )
    t.equal(
      dataTypeId,
      expectedDataTypeId,
      `testing matching dataTypeId of ${doc.schemaName}`
    )
  }
})

test(`test failing of decoding when scrambling the header`, async (t) => {
  for (const { doc } of goodDocsCompleted) {
    const buffer = encode(doc)
    /** @type {Buffer} */
    const newBuf = buffer.map(() => {
      const newIdx = Math.floor(Math.random() * buffer.length)
      return buffer[newIdx]
    })
    t.throws(() => {
      decode(newBuf, parseVersionId(doc.versionId))
    }, `failing on decoding ${doc.schemaName}`)
  }
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
