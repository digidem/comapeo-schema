// @ts-check
/**
 * @module mapeo-schema
 */
// console.log('test')

import assert from 'node:assert'
// import b4a from 'b4a'
import * as cenc from 'compact-encoding'
import * as JSONSchemas from './dist/schemas.js'
import * as ProtobufSchemas from './types/proto/index.js'
import schemasPrefix from './dist/schemasPrefix.js'
import { randomBytes } from 'node:crypto'

const dataTypeIdSize = 6
const schemaVersionSize = 2

// /**
//  * @param {String} str
//  * @returns {String}
//  */
// const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 *  @returns {import('./types/proto/index').ProtobufSchemas}
 */
const jsonSchemaToProto = (obj) => {
  const commonKeys = [
    'id',
    'created_at',
    'links',
    'timestamp',
    'userId',
    'deviceId',
  ]

  /** @type {Object} */
  const uncommon = Object.keys(obj)
    .filter((k) => !commonKeys.includes(k))
    .reduce((acc, k) => {
      acc[k] = obj[k]
      return acc
    }, {})
  const protoObj = {
    ...uncommon,
    common: {
      id: Buffer.from(obj.id, 'hex'),
      created_at: obj.created_at,
      links: obj.links,
      timestamp: obj.timestamp,
      userId: obj.userId,
      deviceId: obj.deviceId,
    },
  }
  return protoObj
}

// const protoToJsonSchema = (obj, { dataTypeId, schemaVersion }) => {
//   const jsonSchemaObj = {
//     ...obj,
//     id: b4a.from(obj.id).toString('hex'),
//     dataTypeId,
//     schemaVersion,
//   }
//   return jsonSchemaObj
// }

/**
 * given a schemaVersion and type, return a buffer with the corresponding data
 * @param {Object} obj
 * @param {string} obj.dataTypeId hex encoded string of a 6-byte buffer indicating type
 * @param {string} obj.schemaVersion hex encoded string of a 2-byte buffer indicating schema version
 * @returns {Buffer} blockPrefix for corresponding schema
 */
const encodeBlockPrefix = ({ dataTypeId, schemaVersion }) =>
  // @ts-ignore
  Buffer.concat([
    cenc.encode(cenc.hex.fixed(dataTypeIdSize), dataTypeId),
    cenc.encode(cenc.hex.fixed(schemaVersionSize), schemaVersion),
  ])

/**
 *  given a buffer, return schemaVersion and type
 *  @param {Buffer} buf
 *  @returns {{dataTypeId:String, schemaVersion:String}}
 */
const decodeBlockPrefix = (buf) => {
  const state = cenc.state()
  // @ts-ignore
  state.buffer = buf
  state.start = 0
  state.end = dataTypeIdSize
  const dataTypeId = cenc.hex.fixed(6).decode(state)

  state.start = dataTypeIdSize
  state.end = dataTypeIdSize + schemaVersionSize
  const schemaVersion = cenc.hex.fixed(2).decode(state)

  return { dataTypeId, schemaVersion }
}

// const buf = encodeBlockPrefix({
//   dataTypeId: 'f5fd57de7067',
//   schemaVersion: '0004',
// })
// console.log(buf)
// const obj = decodeBlockPrefix(buf)
// console.log(obj)

/**
 * Validate an object against the schema type
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 * @returns {Boolean} indicating if the object is valid
 */
export const validate = (obj) => {
  const key = `${obj.type.toLowerCase()}_${obj.schemaVersion}`
  return JSONSchemas[key](obj)
}

/**
 * TODO: obj should be more generic since there are other recordTypes
 * Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 * @returns {Buffer} protobuf encoded buffer with recordTypeBlockSize + schemaVersionSize bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const blockPrefix = encodeBlockPrefix(schemasPrefix[obj.type])
  const record = jsonSchemaToProto(obj)
  assert(
    blockPrefix,
    `schema of type ${obj.type} and version ${obj.schemaVersion} not found`
  )
  const protobuf = ProtobufSchemas[obj.type].encode(record).finish()
  return Buffer.concat([blockPrefix, protobuf])
}

const rec = encode({
  id: randomBytes(32).toString('hex'),
  type: 'Observation',
  schemaVersion: 4,
  version: '1',
  links: [],
  timestamp: new Date().toJSON(),
  created_at: new Date().toJSON(),
  refs: [],
  attachments: [],
})
console.log(rec)
console.log(decodeBlockPrefix(rec))

// /**
//  * Decode a Buffer as an object validated against the corresponding schema
//  * @param {Buffer} buf - Buffer to be decoded
//  * @param {Object} opts - Object containing key and index of the hypercore
//  * @param {Buffer} opts.key - Public key of the hypercore
//  * @param {Number} opts.index - Index of the entry
//  * @returns {import('./types/schema/observation')}
//  * */
// export const decode = (buf, opts) => {
//   const dataTypeId = buf.subarray(0, dataTypeIdSize).toString()
//   const schemaVersion = buf.subarray(
//     dataTypeIdSize,
//     dataTypeIdSize + schemaVersionSize
//   )[0]
//   const blockPrefix = `${dataTypeId}/${schemaVersion}`
//   const schema = blockPrefixToSchema[blockPrefix].protobufSchema
//   let record = schema.decode(
//     buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length)
//   )
//   return {
//     ...record,
//     id: record.id.toString('hex'),
//     type: blockPrefixToSchema[blockPrefix].type.toLowerCase(),
//     schemaVersion: schemaVersion,
//     version: `${opts.key.toString('hex')}/${opts.index.toString()}`,
//   }
// }
