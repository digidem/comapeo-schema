import test from 'tape'
import { encode, decode } from '../index.js'
import Hypercore from 'hypercore'
import ram from 'random-access-memory'
import { randomBytes } from 'node:crypto'
import { AssertionError } from 'node:assert'

test('test encoding of record with missing fields', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode({
      id: randomBytes(32).toString('hex'),
    })
  }, TypeError)
})

test('test encoding of wrong record type', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode({
      id: randomBytes(32).toString('hex'),
      type: 'OBsERvatIon',
      schemaVersion: 4,
      links: [],
      created_at: new Date().toJSON(),
      refs: [],
      attachments: [],
      metadata: {
        manual_location: true,
      },
    })
  }, TypeError)
})

test('test encoding of record with wrong schema version', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode({
      id: randomBytes(32).toString('hex'),
      type: 'observation',
      schemaVersion: 2,
      links: [],
      created_at: new Date().toJSON(),
      refs: [],
      attachments: [],
      metadata: {
        manual_location: true,
      },
    })
  }, AssertionError)
})

test('test encoding of record with wrong date format', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode({
      id: randomBytes(32).toString('hex'),
      type: 'observation',
      schemaVersion: 4,
      links: [],
      created_at: new Date(),
      refs: [],
      attachments: [],
      metadata: {
        manual_location: true,
      },
    })
  }, AssertionError)
})

test('test encoding of rightfully formated record', async (t) => {
  t.plan(1)
  t.doesNotThrow(() => {
    encode({
      id: randomBytes(32).toString('hex'),
      type: 'observation',
      schemaVersion: 4,
      links: [],
      created_at: new Date().toJSON(),
      refs: [],
      attachments: [],
      metadata: {
        manual_location: true,
      },
    })
  })
})

test('test encoding, saving and retreiving same record from hypercore', async (t) => {
  t.plan(1)
  const record = encode({
    id: randomBytes(32).toString('hex'),
    type: 'observation',
    schemaVersion: 4,
    links: [],
    created_at: new Date().toJSON(),
    refs: [],
    attachments: [],
    metadata: {
      manual_location: true,
    },
  })
  const core = new Hypercore(ram, { valueEncoding: 'binary' })
  await core.ready()
  core.append(record)
  const index = 0
  const data = await core.get(index)
  t.equals(data.toString(), record.toString())
})

test('test decoding of record without passing core key and index', async (t) => {
  t.plan(1)
  const record = encode({
    id: randomBytes(32).toString('hex'),
    type: 'observation',
    schemaVersion: 4,
    links: [],
    created_at: new Date().toJSON(),
    refs: [],
    attachments: [],
    metadata: {
      manual_location: true,
    },
  })
  t.throws(() => {
    decode(record)
  })
})

test('test decoding of record passing core key and index', async (t) => {
  t.plan(1)
  const record = encode({
    id: randomBytes(32).toString('hex'),
    type: 'observation',
    schemaVersion: 4,
    links: [],
    created_at: new Date().toJSON(),
    refs: [],
    attachments: [],
    metadata: {
      manual_location: true,
    },
  })
  const core = new Hypercore(ram, { valueEncoding: 'binary' })
  await core.ready()
  const index = 0

  t.doesNotThrow(() => {
    decode(record, { key: core.key, index })
  })
})

test('test if we get valid decoded object comparing various fields returned', async (t) => {
  const obj = {
    id: randomBytes(32).toString('hex'),
    type: 'observation',
    schemaVersion: 4,
    links: [],
    created_at: new Date().toJSON(),
    refs: [],
    attachments: [],
    metadata: {
      manual_location: true,
    },
  }
  const fields = Object.keys(obj)
  const record = encode(obj)
  const core = new Hypercore(ram, { valueEncoding: 'binary' })
  await core.ready()
  const index = 0
  const decodedRecord = decode(record, { key: core.key, index })
  t.plan(fields.length)
  fields.forEach((field) => {
    t.deepEqual(decodedRecord[field], obj[field], `comparing ${field}`)
  })
})
