import test from 'tape'
import { fixtures } from './fixture.js'
import { encode } from '../dist/encode.js'
import { decode } from '../dist/decode.js'
import { parseVersionId } from '../dist/lib/utils.js'
import { and } from 'ajv/dist/compile/codegen/index.js'
// import { randomBytes } from 'node:crypto'

{
  const { text, plan, doc } = fixtures.onlyId
  test(text, async (t) => {
    t.plan(plan)
    t.throws(() => {
      encode(doc)
    })
  })
}

{
  const { text, plan, doc } = fixtures.badDocName
  test(text, async (t) => {
    t.plan(plan)
    t.throws(() => {
      encode(doc)
    })
  })
}

test(`testing encoding of doc with minimal required values,
  then decoding and comparing the two objects`, async (t) => {
  for (let { doc, expected } of fixtures.goodDocsMinimal) {
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
  for (let { doc, expected } of fixtures.goodDocsCompleted) {
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
  for (let { doc, expected } of fixtures.goodDocsWithExtraFields) {
    let buf
    t.doesNotThrow(() => {
      buf = encode(doc)
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
