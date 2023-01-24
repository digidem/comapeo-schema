// @ts-check
/**
 * @module mapeo-schema
 */
import * as cenc from 'compact-encoding'
import * as JSONSchemas from './dist/schemas.js'
import * as ProtobufSchemas from './types/proto/index.js'
import schemasPrefix from './dist/schemasPrefix.js'

const dataTypeIdSize = 6
const schemaVersionSize = 2

/**
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 * @returns {import('./types/proto/index').ProtobufSchemas}
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

  /** @type {import('./types/proto/index').ProtobufSchemas} */
  return {
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
}

/**
 * @param {import('./types/proto/index').ProtobufSchemas} protobufObj
 * @param {Object} obj
 * @param {String} obj.schemaVersion
 * @param {String} obj.type
 * @param {String} obj.version
 * @returns {import('./types/schema/index').MapeoRecord}
 */
const protoToJsonSchema = (protobufObj, { schemaVersion, type, version }) => {
  const common = protobufObj.common
  delete protobufObj.common
  const jsonSchemaObj = {
    ...protobufObj,
    ...common,
    schemaVersion,
    type,
    version,
  }
  jsonSchemaObj.id = jsonSchemaObj.id.toString('hex')
  return jsonSchemaObj
}

/**
 * given a schemaVersion and type, return a buffer with the corresponding data
 * @param {Object} obj
 * @param {string} obj.dataTypeId hex encoded string of a 6-byte buffer indicating type
 * @param {string} obj.schemaVersion hex encoded string of a 2-byte buffer indicating schema version
 * @returns {Buffer} blockPrefix for corresponding schema
 */
export const encodeBlockPrefix = ({ dataTypeId, schemaVersion }) =>
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
export const decodeBlockPrefix = (buf) => {
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

/**
 * Validate an object against the schema type
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 * @returns {Boolean} indicating if the object is valid
 */
export const validate = (obj) => {
  console.log(obj.type.toLowerCase, JSONSchemas)
  const key = `${obj.type.toLowerCase()}_${obj.schemaVersion}`
  return JSONSchemas[key](obj)
}

/**
 * Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 * @returns {Buffer} protobuf encoded buffer with recordTypeBlockSize + schemaVersionSize bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const blockPrefix = encodeBlockPrefix(schemasPrefix[obj.type])
  const record = jsonSchemaToProto(obj)
  const protobuf = ProtobufSchemas[obj.type].encode(record).finish()
  return Buffer.concat([blockPrefix, protobuf])
}

/**
 * Decode a Buffer as an object validated against the corresponding schema
 * @param {Buffer} buf - Buffer to be decoded
 * @returns {import('./types/schema/index').MapeoRecord}
 * */
export const decode = (buf, { coreId, seq }) => {
  const { dataTypeId, schemaVersion } = decodeBlockPrefix(buf)
  const type = Object.keys(schemasPrefix).filter(
    (key) => schemasPrefix[key]['dataTypeId'] === dataTypeId
  )[0]
  const version = `${coreId}/${seq}`
  const record = buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length)
  const protobufObj = ProtobufSchemas[type].decode(record)
  return protoToJsonSchema(protobufObj, { schemaVersion, type, version })
}
