import test from 'tape'
import { fixtures } from './fixture.js'
import { encode } from '../dist/encode.js'
import { decode } from '../dist/decode.js'
import { validate } from '../dist/validate.js'
import { parseVersionId } from '../dist/lib/utils.js'
// import { randomBytes } from 'node:crypto'

{
  const {text,plan,doc} = fixtures.onlyId
  test(text, async(t) => {
    t.plan(plan)
    t.throws(() => {
      encode(doc)
    })
  })
}
{
  const {text,plan, doc} = fixtures.badDocName
  test(text,async(t) => {
    t.plan(plan)
    t.throws(() => {
      encode(doc)
    })
  })
}
{
  const {text,docs} = fixtures.goodDocs
  test({text},async(t) => {
    t.plan(Object.keys(docs).length)
    Object.keys(docs).forEach((docName) => {
      const doc = docs[docName]
      t.doesNotThrow(() =>  {
        const buf = encode(doc)
        console.log(decode(buf, parseVersionId(doc.versionId)))
      }, `testing ${docName}`)
    })
  })

}

// test('test encoding of rightfully formated record', async (t) => {
//   const goodDocs = Object.keys(docs.good)
//   t.plan(goodDocs.length)
//   goodDocs.forEach((k) => {
//     const doc = docs.good[k]
//     t.doesNotThrow(() => {
//       encode(doc)
//     }, `testing ${k}`)
//   })
// })

// test('test validation of record', async (t) => {
//   const goodDocs = Object.keys(docs.good)
//   t.plan(goodDocs.length)
//   goodDocs.forEach((k) => {
//     const doc = docs.good[k]
//     const record = decode(encode(doc), {
//       coreKey: randomBytes(32),
//       index: 0,
//     })
//     t.doesNotThrow(() => {
//       // field has a type which is different from the rest :|
//       if (k !== 'field') validate(record)
//     }, `testing validation of ${k}`)
//   })
// })

// test('test encoding, decoding of record and comparing the two versions', async (t) => {
//   const goodDocs = Object.keys(docs.good)
//   goodDocs.forEach((k) => {
//     const doc = docs.good[k]
//     const record = decode(encode(doc), {
//       coreKey: randomBytes(32),
//       index: 0,
//     })
//     const fields = Object.keys(doc)
//     // t.plan(goodDocs.length * fields.length * 2)
//     fields.forEach((f) => {
//       console.log(typeof record[f], typeof doc[f])
//       const msg = `checking ${f} for ${k}`
//       record[f] && doc[f] ? t.pass(msg) : t.fail(msg)

//       // if field is not an object, check equality
//       // since objects as fields usually mean the possibility of additionalFields in jsonSchemas
//       if (typeof record[f] !== 'object') {
//         t.equal(record[f], doc[f], `comparing value of ${f} for ${k}`)
//       }
//     })
//   })
// })

// test('test decoding of record without passing core key and index', async (t) => {
//   const goodDocs = Object.keys(docs.good)
//   t.plan(goodDocs.length)
//   goodDocs.forEach((key) => {
//     const doc = docs.good[key]
//     const record = encode(doc)
//     t.throws(() => {
//       decode(record)
//     }, `testing ${key}`)
//   })
// })
