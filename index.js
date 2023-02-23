// @ts-check
/**
 * @module mapeo-schema
 */
import * as cenc from 'compact-encoding'
import * as JSONSchemas from './dist/schemas.js'
import * as ProtobufSchemas from './types/proto/index.js'
import schemasPrefix from './schemasPrefix.js'
import { inheritsFromCommon, formatSchemaKey } from './utils.js'

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
    .reduce((uncommon, field) => ({ ...uncommon, [field]: obj[field] }), {})

  /** @type {Object} */
  const common = commonKeys
    .filter((field) => obj[field])
    .reduce((common, field) => ({ ...common, [field]: obj[field] }), {})
  common.id = Buffer.from(obj['id'], 'hex')

  const key = formatSchemaKey(obj.type, obj.schemaVersion)
  // when we inherit from common, common is actually a field inside the protobuf object,
  // so we don't destructure it
  return inheritsFromCommon(key)
    ? { ...uncommon, common }
    : { ...uncommon, ...common }
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
  const key = formatSchemaKey(type, schemaVersion)
  /** @type {Object} */
  let obj = { ...protobufObj, schemaVersion, type }
  if (obj.common) {
    obj = { ...obj, ...obj.common }
    delete obj.common
  }

  // Preset_1 and Field_1 don't have a version field and doesn't accept additional fields
  if (key !== 'Preset_1' && key !== 'Field_1') {
    obj.version = version
  }

  obj.id = obj.id.toString('hex')
  return obj
}

/**
 * given a schemaVersion and type, return a buffer with the corresponding data
 * @param {Object} obj
 * @param {string} obj.dataTypeId hex encoded string of a 6-byte buffer indicating type
 * @param {number | undefined} obj.schemaVersion number to indicate version. Gets converted to a padded 4-byte hex string
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
  const dataTypeId = cenc.hex.fixed(dataTypeIdSize).decode(state)

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
  const key = formatSchemaKey(obj.type, obj.schemaVersion)

  // Preset_1 doesn't have a type field, so validation won't pass
  // but we still need it to now which schema to validate, so we delete it after grabbing the key
  if (key === 'Preset_1') delete obj['type']
  // Field_1 doesn't have a schemaVersion field, so validation won't pass
  // but we still need it to now which schema to validate, so we delete it after grabbing the key
  if (key === 'Field_1') delete obj['schemaVersion']

  const validatefn = JSONSchemas[key]
  const isValid = validatefn(obj)
  if (!isValid) throw new Error(JSON.stringify(validatefn.errors, null, 4))
  return isValid
}

/**
 * Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
 * @param {import('./types/schema/index').MapeoRecord} obj - Object to be encoded
 * @returns {Buffer} protobuf encoded buffer with dataTypeIdSize + schemaVersionSize bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const key = formatSchemaKey(obj.type, obj.schemaVersion)
  // some schemas don't have type field so it can be undefined
  const type = obj.type || ''
  if (!ProtobufSchemas[key]) {
    throw new Error(
      `Invalid schemaVersion for ${type} version ${obj.schemaVersion}`
    )
  }

  const blockPrefix = encodeBlockPrefix({
    dataTypeId: schemasPrefix[type].dataTypeId,
    schemaVersion: obj.schemaVersion,
  })
  const record = jsonSchemaToProto(obj)
  const partial = ProtobufSchemas[key].fromPartial(record)
  const protobuf = ProtobufSchemas[key].encode(partial).finish()
  return Buffer.concat([blockPrefix, protobuf])
}

/**
 * Decode a Buffer as an object validated against the corresponding schema
 * @param {Buffer} buf - Buffer to be decoded
 * @returns {import('./types/schema/index').MapeoRecord}
 * */
export const decode = (buf, { coreId, seq }) => {
  const { dataTypeId, schemaVersion } = decodeBlockPrefix(buf)
  const type = Object.keys(schemasPrefix).reduce(
    (type, key) => (schemasPrefix[key].dataTypeId === dataTypeId ? key : type),
    ''
  )
  const key = formatSchemaKey(type, schemaVersion)
  if (!ProtobufSchemas[key]) {
    throw new Error(
      `Invalid schemaVersion for ${type} version ${schemaVersion}`
    )
  }

  const version = `${coreId.toString('hex')}/${seq.toString()}`
  const record = buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length)

  const protobufObj = ProtobufSchemas[key].decode(record)
  return protoToJsonSchema(protobufObj, { schemaVersion, type, version })
}
