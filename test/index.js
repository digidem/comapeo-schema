import test from 'tape'
import { encode, decode, validate } from '../index.js'
import glob from 'glob-promise'
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { randomBytes } from 'node:crypto'

const loadJSON = (path) => {
  return {
    name: basename(path).replace('.json', ''),
    doc: JSON.parse(readFileSync(new URL(path, import.meta.url)).toString()),
  }
}

const docs = glob
  .sync('./docs/*.json', { cwd: 'test' })
  .map(loadJSON)
  .reduce((acc, val) => {
    acc[val.name] = val.doc
    return acc
  }, {})

test('test encoding of record with missing fields', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode(docs.onlyId)
  })
})

test('test encoding of wrong record type', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode(docs.badDocType)
  })
})

test('test encoding of record with wrong schema version', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode(docs.badSchemaVersion)
  })
})

test('test encoding of rightfully formated record', async (t) => {
  const goodDocs = Object.keys(docs.good)
  t.plan(goodDocs.length)
  goodDocs.forEach((k) => {
    const doc = docs.good[k]
    t.doesNotThrow(() => {
      encode(doc)
    })
  })
})

test('test validation of record', async (t) => {
  const goodDocs = Object.keys(docs.good)
  t.plan(goodDocs.length)
  goodDocs.forEach((k) => {
    const doc = docs.good[k]
    const record = decode(encode(doc), {
      coreId: randomBytes(32),
      seq: 0,
    })
    t.doesNotThrow(() => {
      // field has a type which is different from the rest :|
      if (k !== 'field') validate(record)
    }, `testing validation of ${k}`)
  })
})

test('test encoding, decoding of record and comparing the two versions', async (t) => {
  const goodDocs = Object.keys(docs.good)
  goodDocs.forEach((k) => {
    const doc = docs.good[k]
    const record = decode(encode(doc), {
      coreId: randomBytes(32),
      seq: 0,
    })
    const fields = Object.keys(doc)
    // t.plan(goodDocs.length * fields.length * 2)
    fields.forEach((f) => {
      const msg = `checking ${f} for ${k}`
      record[f] && doc[f] ? t.pass(msg) : t.fail(msg)

      // if field is not an object, check equality
      // since objects as fields usually mean the possibility of additionalFields in jsonSchemas
      if (typeof record[f] !== 'object') {
        t.equal(record[f], doc[f], `comparing value of ${f} for ${k}`)
      }
    })
  })
})

test('test decoding of record without passing core key and index', async (t) => {
  const goodDocs = Object.keys(docs.good)
  t.plan(goodDocs.length)
  goodDocs.forEach((key) => {
    const doc = docs.good[key]
    const record = encode(doc)
    t.throws(() => {
      decode(record)
    }, `testing ${key}`)
  })
})
