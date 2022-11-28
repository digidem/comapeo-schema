import test from 'tape'
import { encode, decode } from '../index.js'
import Hypercore from 'hypercore'
import ram from 'random-access-memory'
import { randomBytes } from 'node:crypto'

test('test encoding of record with missing fields', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode({
      id: randomBytes(32).toString('hex'),
    })
  })
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
  })
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
  })
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
  })
})

test('test encoding of rightfully formated record', async (t) => {
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
  t.plan(3)
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
  const record = encode(obj)
  const core = new Hypercore(ram, { valueEncoding: 'binary' })
  await core.ready()
  const index = 0

  const decodedRecord = decode(record, { key: core.key, index })

  t.equals(decodedRecord.id, obj.id)
  t.equals(decodedRecord.version, `${core.key.toString('hex')}/${index}`)
  t.equals(decodedRecord.created_at, obj.created_at)
})
