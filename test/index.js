// @ts-check
import test from 'tape'
import { encode, decode } from '../dist/index.js'
import { parseVersionId } from '../dist/index.js'
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
  for (let { doc, expected } of goodDocsMinimal) {
    let buf
    t.doesNotThrow(() => {
      buf = encode(doc)
    }, `tested encoding of ${doc.schemaName}`)
    let decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    t.deepEqual(
      decodedDoc,
      expected,
      `tested deep equal of ${doc.schemaName} with only required values`
    )
  }
})

test(`testing encoding of doc with additional optional values,
  then decoding and comparing the two objects`, async (t) => {
  for (let { doc, expected } of goodDocsCompleted) {
    let buf
    t.doesNotThrow(() => {
      buf = encode(doc)
    }, `tested encoding of ${doc.schemaName}`)
    let decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    t.deepEqual(
      decodedDoc,
      expected,
      `tested deep equal of ${doc.schemaName} with additional values`
    )
  }
})

test(`testing encoding of doc with additional extra values,
then decoding and comparing the two objects - extra values shouldn't be present`, async (t) => {
  for (let { doc, expected } of goodDocsCompleted) {
    let buf
    t.doesNotThrow(() => {
      buf = encode({
        ...doc,
        // @ts-expect-error
        extraFieldNotInSchema: 'whatever',
      })
    }, `tested encoding of ${doc.schemaName}`)
    let decodedDoc = stripUndef(decode(buf, parseVersionId(doc.versionId)))
    t.deepEqual(
      decodedDoc,
      expected,
      `tested deep equal of ${doc.schemaName} with extra - non valid - values`
    )
  }
})

/**
 * @param {object} obj
 * @return {object}
 * */
function stripUndef(obj) {
  return JSON.parse(JSON.stringify(obj))
}
