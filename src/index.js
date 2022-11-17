import { Observation } from '../types/proto/observation.js'
import assert from 'node:assert'
import fs from 'node:fs'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))
const ajv = new Ajv()
addFormats(ajv)

const schemaTypesMap = {
  observation: {
    magicByte: '1',
    protobufSchema: Observation,
    jsonSchema: loadJSON('./../schema/observation.json')
  }
}
/**
Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
* @param {ObservationSchema} obj - Object to be encoded
* @returns {Buffer} protobuf encoded buffer with 2 bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const recordType = schemaTypesMap[obj.type]
  const validate = ajv.compile(recordType.jsonSchema)
  const isValid = validate(obj)
  assert(isValid, JSON.stringify(validate.errors, true, 2))

  const schema = recordType.protobufSchema
  const type = Buffer.from(recordType.magicByte)
  const version = Buffer.from(obj.schemaVersion.toString())
  const protobuf = schema.encode(obj).finish()
  return Buffer.concat([type, version, protobuf])
}

const findSchema = (type) => (acc, val) => schemaTypesMap[val].magicByte === type ? val : acc

/** Decode a Buffer as an object validated against the corresponding schema
* @param {Buffer} buf - Buffer to be decoded (probably obtained from an hypercore)
* @param {Object} opts - Object containing key and index of the hypercore
* @param {Buffer} opts.key - Public key of the hypercore
* @param {Number} opts.index - Index of the entry
* @returns {ObservationSchema}
* */
export const decode = (buf, opts) => {
  assert(typeof opts === 'object', 'opts is missing')
  assert(
    opts.key !== undefined && Buffer.isBuffer(opts.key),
    'opts.key should be a Buffer'
  )
  assert(
    opts.index !== undefined && typeof opts.index === 'number',
    'index should be a Number'
  )
  const type = buf.subarray(0, 1).toString()
  const schemaVersion = buf.subarray(1, 2).toString()
  const recordType = Object.keys(schemaTypesMap).reduce(findSchema(type), null)
  const schema = schemaTypesMap[recordType].protobufSchema
  const record = schema.decode(buf.subarray(2, buf.length))

  record.id = record.id.toString('hex')
  record.type = recordType
  record.schemaVersion = parseInt(schemaVersion)
  record.version = opts.key.toString('hex') + '/' + opts.index.toString()

  const validate = ajv.compile(schemaTypesMap[recordType].jsonSchema)
  const isValid = validate(record)
  assert(isValid, JSON.stringify(validate.errors, true, 2))

  return record
}
