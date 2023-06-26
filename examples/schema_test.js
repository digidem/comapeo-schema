// @ts-check
import { encode, decode, validate } from '../index.js'
import Hypercore from 'hypercore'
import ram from 'random-access-memory'
import { randomBytes } from 'node:crypto'

const objs = [
  // FILTER_1
  {
    id: randomBytes(32).toString('hex'),
    schemaType: 'filter',
    schemaVersion: 1,
    created_at: new Date(),
    filter: ['observation'],
    name: 'john',
  },
  // DEVICE
  {
    schemaType: 'Device',
    schemaVersion: 1,
    created_at: new Date(),
    id: randomBytes(32).toString('hex'),
    action: 'device:add',
    authorId: randomBytes(32).toString('hex'),
    projectId: randomBytes(32).toString('hex'),
    signature: 'hi',
    authorIndex: 10,
    deviceIndex: 10,
  },
  // ROLE
  {
    id: randomBytes(32).toString('hex'),
    schemaType: 'Role',
    schemaVersion: 1,
    role: 'project-creator',
    created_at: new Date(),
    projectId: randomBytes(32).toString('hex'),
    action: 'role:set',
    signature: 'hi',
    authorIndex: 10,
    deviceIndex: 10,
  },
  // CORE OWNERSHIP
  {
    schemaType: 'coreOwnership',
    created_at: new Date(),
    schemaVersion: 1,
    id: randomBytes(32).toString('hex'),
    coreId: randomBytes(32).toString('hex'),
    projectId: randomBytes(32).toString('hex'),
    storeType: 'blob',
    authorIndex: 10,
    deviceIndex: 10,
    action: 'core:owner',
  },
  // PRESET_1
  {
    id: randomBytes(32).toString('hex'),
    schemaType: 'Preset',
    schemaVersion: 1,
    tags: { nature: 'tree' },
    geometry: ['point'],
    name: 'john',
  },
  // FIELD_1
  {
    id: randomBytes(32).toString('hex'),
    schemaType: 'Field',
    schemaVersion: 1,
    key: ['hi'],
    type: 'text',
  },
  // OBSERVATION 4
  {
    id: randomBytes(32).toString('hex'),
    schemaType: 'observation',
    schemaVersion: 4,
    created_at: new Date(),
  },
  // OBSERVATION 5
  {
    id: randomBytes(32).toString('hex'),
    schemaType: 'Observation',
    schemaVersion: 5,
    created_at: new Date(),
  },
]


objs.forEach(test)

async function test(obj){
  const record = encode(obj)
  const k = obj.schemaType || obj.type
  const core = new Hypercore(ram, { valueEncoding: 'binary' })
  await core.ready()
  core.append(record)

  try {
    const index = 0
    const data = await core.get(index)
    const decodedData = decode(data, { coreId: core.key, seq: index })
    console.log(`trying ${k}`)
    console.log('data', decodedData)
    console.log(`VALID? `, validate(decodedData), '\n')
    if (Buffer.compare(data, record) !== 0) {
      throw new Error(`data doesn't match: ${data} != ${record}`)
    } else {
      console.log('data matches <3')
    }
  } catch (err) {
    console.log(err)
  }
}
