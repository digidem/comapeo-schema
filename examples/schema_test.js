import { encode, decode } from '../src/index.js'
import Hypercore from 'hypercore'
import ram from 'random-access-memory'
import { randomBytes } from 'node:crypto'

const record = encode({
  type: 'observation',
  schemaVersion: '1',
  id: randomBytes(32).toString('hex'),
  createdAt: new Date(),
  links: [],
  refs: [],
  attachments: []
})

const core = new Hypercore(ram, { valueEncoding: 'binary' })
await core.ready()
core.append(record)

try {
  const index = 0
  const data = await core.get(index)
  console.log(decode(data, { key: core.key, index }))
  if (Buffer.compare(data, record) !== 0) {
    throw new Error(`data doesn't match: ${data} != ${record}`)
  } else {
    console.log('data matches <3')
  }
} catch (err) {
  console.log(err)
}
