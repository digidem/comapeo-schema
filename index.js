// @ts-check
/**
 * @module mapeo-schema
 */
import * as cenc from 'compact-encoding'
import * as JSONSchemas from './dist/schemas.js'
import * as ProtobufSchemas from './types/proto/index.js'
import schemasPrefix from './schemasPrefix.js'

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

  const common = commonKeys.reduce((common, field) => {
    if (obj[field]) common[field] = obj[field]
    return common
  }, {})

  return {
    ...uncommon,
    common,
  }
}

/**
 * @param {import('./types/proto/index').ProtobufSchemas} protobufObj
 * @param {Object} obj
 * @param {Number} obj.schemaVersion
 * @param {String} obj.type
 * @param {String} obj.version
 * @returns {import('./types/schema/index').MapeoRecord}
 */
const protoToJsonSchema = (protobufObj, { schemaVersion, type, version }) => {
  return {
    ...protobufObj,
    ...protobufObj.common,
    schemaVersion,
    type,
    version,
    // I really don't like this
    id: protobufObj.common?.id.toString('hex') || '',
  }
}

/**
 * given a schemaVersion and type, return a buffer with the corresponding data
 * @param {Object} obj
 * @param {string} obj.dataTypeId hex encoded string of a 6-byte buffer indicating type
 * @param {number} obj.schemaVersion number to indicate version. Gets converted to a padded 4-byte hex string
 * @returns {Buffer} blockPrefix for corresponding schema
 */
export const encodeBlockPrefix = ({ dataTypeId, schemaVersion }) => {
  // @ts-ignore
  return Buffer.concat([
    cenc.encode(cenc.hex.fixed(dataTypeIdSize), dataTypeId),
    cenc.encode(cenc.uint16, schemaVersion),
  ])
}

/**
 *  given a buffer, return schemaVersion and type
 *  @param {Buffer} buf
 *  @returns {{dataTypeId:String, schemaVersion:Number}}
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
  const schemaVersion = cenc.uint16.decode(state)

  return { dataTypeId, schemaVersion }
}

/**
 * Validate an object against the schema type
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 * @returns {Boolean} indicating if the object is valid
 */
export const validate = (obj) => {
  const key = `${obj.type.toLowerCase()}_${obj.schemaVersion}`

  const validatefn = JSONSchemas[key]
  const isValid = validatefn(obj)
  if (!isValid) throw new Error(JSON.stringify(validatefn.errors, null, 4))
  return isValid
}

/**
 * Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 * @returns {Buffer} protobuf encoded buffer with recordTypeBlockSize + schemaVersionSize bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const blockPrefix = encodeBlockPrefix({
    dataTypeId: schemasPrefix[obj.type],
    schemaVersion: obj.schemaVersion === undefined ? 0 : obj.schemaVersion,
  })
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
    (key) => schemasPrefix[key] === dataTypeId
  )[0]
  const version = `${coreId.toString('hex')}/${seq.toString()}`
  const record = buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length)
  const protobufObj = ProtobufSchemas[type].decode(record)
  return protoToJsonSchema(protobufObj, { schemaVersion, type, version })
}
