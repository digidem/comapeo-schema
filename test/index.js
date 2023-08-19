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

/**
 * @param {object} obj
 * @return {object}
 * */
function stripUndef(obj) {
  // Apologies, if I was not so lazy I would write a deep compare function that
  // ignores undefined properties, but instead we do it the lazy way and round
  // trip to JSON in order to remove undefined properties. Properties that are
  // Buffers won't survive the round trip, so we remove them and add them back.
  // Messy, but works well enough for tests. Sorry.
  const { coreSignatures, identitySignature, ...rest } = obj
  const noUndef = JSON.parse(JSON.stringify(rest))
  if (coreSignatures) {
    noUndef.coreSignatures = coreSignatures
  }
  if (identitySignature) {
    noUndef.identitySignature = identitySignature
  }
  return noUndef
}
