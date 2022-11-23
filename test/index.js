import test from 'tape'
import { encode, decode } from '../src/index.js'
import { randomBytes } from 'node:crypto'

test('test encoding of observation with missing fields', async (t) => {
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
      type: 'OBsERvatIon',
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
