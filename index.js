/**
 * @module mapeo-schema
 */

import { Observation } from './types/proto/observation.js'
import assert from 'node:assert'
import fs from 'node:fs'
import b4a from 'b4a'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))
const ajv = new Ajv()
addFormats(ajv)

const schemaTypesMap = {
  observation: {
    blockPrefix: 'obse', // 4 byte string
    protobufSchema: Observation,
    jsonSchema: loadJSON('./schema/observation.json'),
  },
}
/**
 * Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
 * @param {import('./types/schema/observation')} obj - Object to be encoded
 * @returns {Buffer} protobuf encoded buffer with 2 bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const record = Object.assign({}, obj)
  const recordType = schemaTypesMap[record.type]
  const validate = ajv.compile(recordType.jsonSchema)
  const isValid = validate(record)
  assert(isValid, JSON.stringify(validate.errors, true, 2))
  // id is a hex encoded string, but is turned into bytes when protobufed,
  // so we turn it into a buffer before that
  record.id = b4a.from(record.id, 'hex')
  const schema = recordType.protobufSchema
  const type = b4a.from(recordType.blockPrefix)
  const version = b4a.from([record.schemaVersion])
  const protobuf = schema.encode(record).finish()
  return b4a.concat([type, version, protobuf])
}

const findSchema = (type) => (acc, val) =>
  schemaTypesMap[val].blockPrefix === type ? val : acc

/**
 * Decode a Buffer as an object validated against the corresponding schema
 * @param {Buffer} buf - Buffer to be decoded (probably obtained from an hypercore)
 * @param {Object} opts - Object containing key and index of the hypercore
 * @param {Buffer} opts.key - Public key of the hypercore
 * @param {Number} opts.index - Index of the entry
 * @returns {import('./types/schema/observation')}
 * */
export const decode = (buf, opts) => {
  assert(typeof opts === 'object', 'opts is missing')
  assert(
    opts.key !== undefined && b4a.isBuffer(opts.key),
    'opts.key should be a Buffer'
  )
  assert(
    opts.index !== undefined && typeof opts.index === 'number',
    'index should be a Number'
  )
  const type = buf.subarray(0, 4).toString()
  const schemaVersion = buf.subarray(4, 5)[0]
  const recordType = Object.keys(schemaTypesMap).reduce(findSchema(type), null)
  const schema = schemaTypesMap[recordType].protobufSchema

  let record = schema.decode(buf.subarray(5, buf.length))
  record = {
    ...record,
    id: record.id.toString('hex'),
    type: recordType,
    schemaVersion: parseInt(schemaVersion),
    version: `${opts.key.toString('hex')}/${opts.index.toString()}`,
  }

  const validate = ajv.compile(schemaTypesMap[recordType].jsonSchema)
  const isValid = validate(record)
  assert(isValid, JSON.stringify(validate.errors, true, 2))

  return record
}
