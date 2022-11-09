import { Observation } from '../types/observation.js'

const schemaTypesMap = {
  observation: { magicByte: '1', schema: Observation }
}

export const encode = (obj) => {
  // obj is validated against the protobuf and has the necessary fields
  // returns a buf ready to be sended to a core
  // this bufs has the protobuf data prepended with 2 magic bytes
  // informing record type and schema version respectively
  const schema = schemaTypesMap[obj.type].schema
  const type = Buffer.from(schemaTypesMap[obj.type].magicByte)
  const version = obj.schemaVersion
  const buf = schema.encode(obj).finish()
  return Buffer.concat([type, version, buf])
}

const findSchema = (type) => (acc, val) => schemaTypesMap[val].magicByte === type ? val : acc

export const decode = (buf) => {
  // receives a Buffer and turns it into an object validated against the schema
  const type = buf.slice(0, 1).toString()
  const version = buf.slice(1, 2)
  const record = buf.slice(2, buf.length)
  const recordType = Object.keys(schemaTypesMap).reduce(findSchema(type), null)
  const schema = schemaTypesMap[recordType].schema
  console.log('record of type', recordType)
  console.log('schema version', version.toString())
  return schema.decode(record)
}
