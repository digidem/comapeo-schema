// @ts-check
/**
 * @module mapeo-schema
 */

import { Observation } from './types/proto/observation.js'
import fs from 'node:fs'
import b4a from 'b4a'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

/**
 * @param {string} path
 * @returns {Object}
 */
const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)).toString())

const ajv = new Ajv()
addFormats(ajv)

const recordTypeBlockSize = 4
const schemaVersionSize = 1

// TODO: generate random 32 byte string for the value of each schema to use as a prefix
const recordTypeToBlockPrefix = {
  observation: 'obse',
}

const blockPrefixToSchema = {
  obse: {
    protobufSchema: Observation,
    validate: ajv.compile(loadJSON('./schema/observation.json')),
  },
}

/**
 * Validate an object against the schema type
 * @param {import('./types/schema/observation').Observation} obj - Object to be encoded
 * @returns {Boolean} indicating if the object is valid
 */
export const validate = (obj) => {
  const blockPrefix = recordTypeToBlockPrefix[obj.type]
  return blockPrefixToSchema[blockPrefix].validate(obj)
}

/**
 * TODO: obj should be more generic since there are other recordTypes
 * Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
 * @param {import('./types/schema/observation').Observation} obj - Object to be encoded
 * @returns {Buffer} protobuf encoded buffer with recordTypeBlockSize + schemaVersionSize bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const record = Object.assign({}, obj)
  const blockPrefix = recordTypeToBlockPrefix[record.type]
  const recordType = blockPrefixToSchema[blockPrefix]
  // id is a hex encoded string, but is turned into bytes when protobufed,
  // so we turn it into a buffer before that
  record.id = b4a.from(record.id, 'hex')
  const schema = recordType.protobufSchema
  const type = b4a.from(blockPrefix)
  const version = b4a.from([record.schemaVersion])
  const protobuf = schema.encode(record).finish()
  return b4a.concat([type, version, protobuf])
}

/**
 * Decode a Buffer as an object validated against the corresponding schema
 * @param {Buffer} buf - Buffer to be decoded (probably obtained from an hypercore)
 * @param {Object} opts - Object containing key and index of the hypercore
 * @param {Buffer} opts.key - Public key of the hypercore
 * @param {Number} opts.index - Index of the entry
 * @returns {import('./types/schema/observation')}
 * */
export const decode = (buf, opts) => {
  const blockPrefix = buf.subarray(0, recordTypeBlockSize).toString()
  const schemaVersion = buf.subarray(
    recordTypeBlockSize,
    recordTypeBlockSize + schemaVersionSize
  )[0]
  const schema = blockPrefixToSchema[blockPrefix].protobufSchema
  let record = schema.decode(
    buf.subarray(recordTypeBlockSize + schemaVersionSize, buf.length)
  )

  return {
    ...record,
    id: record.id.toString('hex'),
    type: Object.keys(recordTypeToBlockPrefix).find(
      (recordType) => recordTypeToBlockPrefix[recordType] === blockPrefix
    ),
    schemaVersion: schemaVersion,
    version: `${opts.key.toString('hex')}/${opts.index.toString()}`,
  }
}
