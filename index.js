// @ts-check
/**
 * @module mapeo-schema
 */
import assert from 'node:assert'
import b4a from 'b4a'
import * as JSONSchemas from './dist/schemas.js'
import * as ProtobufSchemas from './types/proto/index.js'
import schemasPrefix from './dist/schemasPrefix.js'
import * as cenc from 'compact-encoding'

// console.log(cenc.encode(cenc.uint8array, Uint8Array.of(1, 2, 4, 5, 6, 255)))
// console.log(randomBytes(6).toString('hex'))
// console.log(cenc.encode(cenc.raw.uint8array, Uint8Array.from(bytebuf)))
// console.log(Buffer.from(bytebuf.toString('hex'), 'hex'))

const dataTypeIdSize = 6
const schemaVersionSize = 2

/**
 * given a schemaVersion and type, return a buffer with the corresponding data
 * @param {Object} obj
 * @param {string} obj.dataTypeId hex encoded string of a 6-byte buffer indicating type
 * @param {string} obj.schemaVersion hex encoded string of a 2-byte buffer indicating schema version
 * @returns {Buffer} blockPrefix for corresponding schema
 */
const encodeBlockPrefix = ({ dataTypeId, schemaVersion }) =>
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
 * @param {import('./types/schema/observation').Observation} obj - Object to be encoded
 * @returns {Boolean} indicating if the object is valid
 */
export const validate = (obj) => JSONSchemas[obj.type](obj)

/**
 * TODO: obj should be more generic since there are other recordTypes
 * Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
 * @param {import('./types/schema/observation').Observation} obj - Object to be encoded
 * @returns {Buffer | Uint8Array} protobuf encoded buffer with recordTypeBlockSize + schemaVersionSize bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const record = Object.assign({}, obj)
  const blockPrefix = findSchema({ type: obj.type, version: obj.schemaVersion })
  assert(
    blockPrefix,
    `schema of type ${obj.type} and version ${obj.schemaVersion} not found`
  )
  const schema = blockPrefixToSchema[blockPrefix]
  // id is a hex encoded string, but is turned into bytes when protobufed,
  // so we turn it into a buffer before that. TS doesn't like this since we are turning a string (id) into a buffer in-place
  record.id = b4a.from(record.id, 'hex')
  // how can we crash if blockPrefix is undefined? shouldn't an assertion be enough?
  const dataTypeId = b4a.from(blockPrefix.split('/')[0])
  const version = b4a.from([record.schemaVersion])
  const protobuf = schema.protobufSchema.encode(record).finish()
  return b4a.concat([dataTypeId, version, protobuf])
}

/**
 * Decode a Buffer as an object validated against the corresponding schema
 * @param {Buffer} buf - Buffer to be decoded
 * @param {Object} opts - Object containing key and index of the hypercore
 * @param {Buffer} opts.key - Public key of the hypercore
 * @param {Number} opts.index - Index of the entry
 * @returns {import('./types/schema/observation')}
 * */
export const decode = (buf, opts) => {
  const dataTypeId = buf.subarray(0, dataTypeIdSize).toString()
  const schemaVersion = buf.subarray(
    dataTypeIdSize,
    dataTypeIdSize + schemaVersionSize
  )[0]
  const blockPrefix = `${dataTypeId}/${schemaVersion}`
  const schema = blockPrefixToSchema[blockPrefix].protobufSchema
  let record = schema.decode(
    buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length)
  )
  return {
    ...record,
    id: record.id.toString('hex'),
    type: blockPrefixToSchema[blockPrefix].type.toLowerCase(),
    schemaVersion: schemaVersion,
    version: `${opts.key.toString('hex')}/${opts.index.toString()}`,
  }
}
