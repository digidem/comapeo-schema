// @ts-check
import { encode, decode, validate } from '../index.js'
import Hypercore from 'hypercore'
import ram from 'random-access-memory'
import { randomBytes } from 'node:crypto'

// FILTER_1
// const obj = {
//   id: randomBytes(32).toString('hex'),
//   type: 'filter',
//   schemaVersion: 1,
//   created_at: new Date().toJSON(),
//   filter: ['observation'],
//   name: 'john',
// }

// PRESET_1
// const obj = {
//   id: randomBytes(32).toString('hex'),
//   type: 'preset',
//   schemaVersion: 1,
//   created_at: new Date().toJSON(),
//   tags: { nature: 'tree' },
//   geometry: ['point'],
//   name: 'john',
// }

// FIELD_1
const obj = {
  id: randomBytes(32).toString('hex'),
  type: 'Field',
  schemaVersion: 1,
  key: 'hi',
}

// OBSERVATION 4
// const obj = {
//   id: randomBytes(32).toString('hex'),
//   type: 'Observation',
//   schemaVersion: 4,
//   created_at: new Date().toJSON(),
// }

// OBSERVATION 5
// const obj = {
//   id: randomBytes(32).toString('hex'),
//   type: 'Observation',
//   schemaVersion: 5,
//   created_at: new Date().toJSON(),
// }

const record = encode(obj)

const core = new Hypercore(ram, { valueEncoding: 'binary' })
await core.ready()
core.append(record)

try {
  const index = 0
  const data = await core.get(index)
  const decodedData = decode(data, { coreId: core.key, seq: index })
  console.log('decoded', decodedData)
  console.log('VALID?', validate(decodedData))
  if (Buffer.compare(data, record) !== 0) {
    throw new Error(`data doesn't match: ${data} != ${record}`)
  } else {
    console.log('data matches <3')
  }
} catch (err) {
  console.log(err)
}
