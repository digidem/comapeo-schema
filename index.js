// @ts-check
/**
 * @module mapeo-schema
 */
import * as cenc from 'compact-encoding'
import * as Schemas from './dist/schemas.js'
import * as ProtobufSchemas from './types/proto/index.js'
import schemasPrefix from './schemasPrefix.js'
import { inheritsFromCommon, formatSchemaKey } from './utils.js'

const dataTypeIdSize = 6
const schemaVersionSize = 2
/**
 * @param {import('./types').JSONSchema} obj - Object to be encoded
 * @returns {import('./types').ProtobufSchema}
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

  // observation v4 and filter v1 will keep representing Dates as protobuf Timestamps
  if ((obj.schemaType === 'observation' && obj.schemaVersion === 4) ||
    (obj.schemaType === 'filter' && obj.schemaVersion === 1)) {
    common.created_at = new Date(common.created_at)
    common.timestamp = new Date(common.timestamp)
  } else {
    // turn date represented as int to Date
    common.created_at = new Date(common.created_at).valueOf()
    common.timestamp = new Date(common.timestamp).valueOf()
  }

  const key = formatSchemaKey(obj.schemaType, obj.schemaVersion)
  // when we inherit from common, common is actually a field inside the protobuf object,
  // so we don't destructure it
  return inheritsFromCommon(key)
    ? { ...uncommon, common }
    : { ...uncommon, ...common }
}

/**
 * @param {import('./types').ProtobufSchema} protobufObj
 * @param {Object} obj
 * @param {Number} obj.schemaVersion
 * @param {String} obj.schemaType
 * @param {String} obj.version
 * @returns {import('./types').JSONSchema}
 */
const protoToJsonSchema = (
  protobufObj,
  { schemaVersion, schemaType, version }
) => {
  /** @type {Object} */
  let obj = { ...protobufObj, schemaVersion, schemaType }
  if (obj.common) {
    obj = { ...obj, ...obj.common }
    delete obj.common
  }

  // Preset_1 and Field_1 don't have a version field and don't accept additional fields
  const key = formatSchemaKey(schemaType, schemaVersion)
  if (key !== 'Preset_1' && key !== 'Field_1') {
    obj.version = version
  }
  // if (key === 'Field_1') obj.key = obj.key.value.toString()
  obj.id = obj.id.toString('hex')
  // since timestamp is optional, check if === 0 and delete it
  if (obj.timestamp === 0) delete obj.timestamp
  // turn date represented as int to string
  if (obj.created_at) obj.created_at = new Date(obj.created_at).toJSON()
  if (obj.timestamp) obj.timestamp = new Date(obj.timestamp).toJSON()
  return obj
}

/**
 * given a schemaVersion and type, return a buffer with the corresponding data
 * @param {Object} obj
 * @param {string} obj.dataTypeId hex encoded string of a 6-byte buffer indicating schemaType
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
 *  given a buffer, return schemaVersion and dataTypeId
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
 * @param {import('./types').JSONSchema} obj - Object to be encoded
 * @returns {Boolean} indicating if the object is valid
 */
export const validate = (obj) => {
  const key = formatSchemaKey(obj.schemaType, obj.schemaVersion)

  // Preset_1 doesn't have a type field, so validation won't pass
  // but we still need it to know which schema to validate, so we delete it after grabbing the key
  if (key === 'Preset_1') delete obj['schemaType']
  // Field_1 doesn't have a schemaVersion nor schemaType field, so validation won't pass
  // but we still need it to now which schema to validate, so we delete it after grabbing the key
  if (key === 'Field_1') {
    delete obj['schemaVersion']
    delete obj['schemaType']
  }

  if (key === 'Observation_4' || key === 'Filter_1') {
    obj.type = obj.schemaType
    delete obj.schemaType
  }

  const validatefn = Schemas[key]
  const isValid = validatefn(obj)
  if (!isValid) throw new Error(JSON.stringify(validatefn.errors, null, 4))
  return isValid
}

/**
 * Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
 * @param {import('./types').JSONSchema} obj - Object to be encoded
 * @returns {Buffer} protobuf encoded buffer with dataTypeIdSize + schemaVersionSize bytes prepended, one for the type of record and the other for the version of the schema */
export const encode = (obj) => {
  const key = formatSchemaKey(obj.schemaType, obj.schemaVersion)
  // some schemas don't have type field so it can be undefined
  const schemaType = obj.schemaType || ''
  if (!ProtobufSchemas[key]) {
    throw new Error(
      `Invalid schemaVersion for ${schemaType} version ${obj.schemaVersion}`
    )
  }

  const blockPrefix = encodeBlockPrefix({
    dataTypeId: schemasPrefix[schemaType].dataTypeId,
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
 * @param {Object} obj
 * @param {Buffer} obj.coreId
 * @param {Number} obj.seq
 * @returns {import('./types').JSONSchema}
 * */
export const decode = (buf, { coreId, seq }) => {
  const { dataTypeId, schemaVersion } = decodeBlockPrefix(buf)
  const schemaType = Object.keys(schemasPrefix).reduce(
    (type, key) => (schemasPrefix[key].dataTypeId === dataTypeId ? key : type),
    ''
  )
  const key = formatSchemaKey(schemaType, schemaVersion)
  if (!ProtobufSchemas[key]) {
    throw new Error(
      `Invalid schemaVersion for ${schemaType} version ${schemaVersion}`
    )
  }
  const version = `${coreId.toString('hex')}/${seq.toString()}`
  const record = buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length)

  const protobufObj = ProtobufSchemas[key].decode(record)
  return protoToJsonSchema(protobufObj, { schemaVersion, schemaType, version })
}
