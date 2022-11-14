import { Observation } from '../types/observation.js'
import assert from 'node:assert'

const schemaTypesMap = {
  observation: { magicByte: '1', schema: Observation }
}

export const encode = (obj) => {
  // obj is validated against the client schema and has the necessary fields
  // returns a buf ready to be sended to a core
  // this bufs has the protobuf data prepended with 2 magic bytes
  // informing record type and schema version respectively
  const schema = schemaTypesMap[obj.type].schema
  const type = Buffer.from(schemaTypesMap[obj.type].magicByte)
  const version = Buffer.from(obj.schemaVersion)
  const buf = schema.encode(obj).finish()
  return Buffer.concat([type, version, buf])
}

const findSchema = (type) => (acc, val) => schemaTypesMap[val].magicByte === type ? val : acc

// opts is { key: Buffer, index: Number }
export const decode = (buf, opts) => {
  assert(typeof opts === 'object', 'opts is missing')
  assert(opts.key !== undefined && Buffer.isBuffer(opts.key), 'opts.key should be a Buffer')
  assert(opts.index !== undefined && typeof opts.index === 'number', 'index should be a Number')
  const type = buf.slice(0, 1).toString()
  const version = buf.slice(1, 2)
  const record = buf.slice(2, buf.length)
  const recordType = Object.keys(schemaTypesMap).reduce(findSchema(type), null)
  const schema = schemaTypesMap[recordType].schema
  const doc = schema.decode(record)
  doc.id = doc.id.toString('hex')
  doc.type = recordType
  doc.schemaVersion = version.toString()
  doc.version = opts.key.toString('hex') + '/' + opts.index.toString()
  return doc
}
