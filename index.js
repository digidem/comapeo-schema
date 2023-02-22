// @ts-check
/**
 * @module mapeo-schema
 */
import * as cenc from 'compact-encoding'
import * as JSONSchemas from './dist/schemas.js'
import * as ProtobufSchemas from './types/proto/index.js'
import schemasPrefix from './schemasPrefix.js'
import { formatSchemaType, formatSchemaKey } from './utils.js'

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
    if (obj[field]) {
      if (field === 'id') {
        common[field] = Buffer.from(obj[field], 'hex')
      } else {
        common[field] = obj[field]
      }
    }
    return common
  }, {})

  const key = formatSchemaKey(obj.type, obj.schemaVersion)
  // this matches for every schema that doesn't inherit common/v1.json
  if (
    key === 'Observation_4' ||
    key === 'Preset_1' ||
    key === 'Filter_1' ||
    key === 'Field_1'
  ) {
    return {
      ...uncommon,
      ...common,
    }
  }
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
  const key = formatSchemaKey(type, schemaVersion)
  const obj = {
    ...protobufObj,
    schemaVersion,
    type,
  }
  // Observation_4 and Filter_1 have a lowecase 'type'
  if (key === 'Observation_4' || key === 'Filter_1') {
    return {
      ...obj,
      id: obj.id.toString('hex'),
      type: obj.type.toLowerCase(),
      version,
    }
  }

  // Preset_1 and Field_1 don't have a version field and doesn't accept additional fields
  if (key === 'Preset_1' || key === 'Field_1') {
    delete obj['version']
    return {
      ...obj,
      id: obj.id.toString('hex'),
    }
  }

  const common = protobufObj.common
  delete obj.common
  return {
    ...obj,
    ...common,
    id: common ? common.id.toString('hex') : '',
    version,
  }
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
  if (!ProtobufSchemas[key]) {
    throw new Error(
      `Invalid schemaVersion for ${obj.type} version ${obj.schemaVersion}`
    )
  }

  const blockPrefix = encodeBlockPrefix({
    dataTypeId: schemasPrefix[formatSchemaType(obj.type)].dataTypeId,
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
  const version = `${coreId.toString('hex')}/${seq.toString()}`
  const record = buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length)
  const key = formatSchemaKey(type, schemaVersion)
  if (!ProtobufSchemas[key]) {
    throw new Error(
      `Invalid schemaVersion for ${type} version ${schemaVersion}`
    )
  }
  const protobufObj = ProtobufSchemas[key].decode(record)
  return protoToJsonSchema(protobufObj, { schemaVersion, type, version })
}
