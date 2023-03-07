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

// DEVICE
// const obj = {
//   type: 'Device',
//   schemaVersion: 1,
//   id: randomBytes(32).toString('hex'),
//   action: 'device:add',
//   authorId: randomBytes(32).toString('hex'),
//   projectId: randomBytes(32).toString('hex'),
//   signature: 'hi',
//   authorIndex: 10,
//   deviceIndex: 10,
// }

// ROLE
const obj = {
  id: randomBytes(32).toString('hex'),
  type: 'Role',
  schemaVersion: 1,
  role: 'project-creator',
  created_at: new Date(),
  projectId: randomBytes(32).toString('hex'),
  action: 'role:set',
  signature: 'hi',
  authorIndex: 10,
  deviceIndex: 10,
}

// CORE OWNERSHIP
// const obj = {
//   type: 'coreOwnership',
//   schemaVersion: 1,
//   id: randomBytes(32).toString('hex'),
//   coreId: randomBytes(32).toString('hex'),
//   projectId: randomBytes(32).toString('hex'),
//   storeType: 'blob',
//   authorIndex: 10,
//   deviceIndex: 10,
//   action: 'core:owner',
// }

// PRESET_1
// const obj = {
//   id: randomBytes(32).toString('hex'),
//   type: 'Preset',
//   schemaVersion: 1,
//   tags: { nature: 'tree' },
//   geometry: ['point'],
//   name: 'john',
// }

// FIELD_1
// const obj = {
//   id: randomBytes(32).toString('hex'),
//   type: 'Field',
//   schemaVersion: 1,
//   key: 'hi',
// }

// OBSERVATION 4
// const obj = {
//   id: randomBytes(32).toString('hex'),
//   type: 'observation',
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
