// @ts-check
/**
 * @module mapeo-schema
 */
import * as cenc from 'compact-encoding'
import * as Schemas from './dist/schemas.js'
import * as ProtobufSchemas from './types/proto/index.js'
import schemasPrefix from './schemasPrefix.js'
import {
  formatSchemaKey,
  hexStringToBuffer,
  bufferToHexString,
  hexStringToCoreVersion,
  coreVersionToHexString,
  getLastVersionForSchema,
} from './utils.js'

const dataTypeIdSize = 6
const schemaVersionSize = 2

const dataTypeIdToSchema = Object.keys(schemasPrefix).reduce(
  (prefixMap, schemaType) => {
    const val = schemasPrefix[schemaType]
    if (val.dataTypeId) {
      prefixMap[val.dataTypeId] = {
        schemaType,
        schemaVersion: val.schemaVersions,
      }
    }
    return prefixMap
  },
  {}
)

/**
 * @param {import('./types').JSONSchema} obj - Object to be encoded
 * @returns {import('./types').ProtobufSchema}
 */
const jsonSchemaToProto = (obj) => {
  // @ts-ignore
  return {
    ...obj,
    id: hexStringToBuffer(obj.id),
    links: obj.links.map(hexStringToCoreVersion),
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}

/**
 * @param {import('./types').ProtobufSchema} protobufObj
 * @param {Object} obj
 * @param {import('./types').schemaType} obj.schemaType
 * @param {string} obj.version
 * @returns {import('./types').JSONSchema}
 */
const protoToJsonSchema = (protobufObj, { schemaType, version }) => {
  // @ts-ignore
  return {
    ...protobufObj,
    // @ts-ignore
    schemaType,
    id: bufferToHexString(protobufObj.id),
    links: protobufObj.links.map(coreVersionToHexString),
    createdAt: protobufObj.createdAt || '',
    updatedAt: protobufObj.updatedAt || '',
    version,
  }
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
  const key = formatSchemaKey(obj.schemaType)
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
  const key = `${formatSchemaKey(obj.schemaType)}`
  // check if schemaType is valid
  if (!ProtobufSchemas[key]) {
    throw new Error(
      `Invalid schemaVersion for ${obj.schemaType} version ${obj.schemaVersion}`
    )
  }

  // check if using lastSchemaVersion
  const lastSchemaVersion = getLastVersionForSchema(obj.schemaType)
  if (obj.schemaVersion && lastSchemaVersion !== obj.schemaVersion) {
    throw new Error(
      `Invalid schema version ${obj.schemaVersion} for ${obj.schemaType}.
Only valid to use schema version ${lastSchemaVersion}`
    )
  }

  const blockPrefix = encodeBlockPrefix({
    dataTypeId: schemasPrefix[obj.schemaType].dataTypeId,
    schemaVersion: lastSchemaVersion,
  })
  const record = jsonSchemaToProto(obj)
  const partial = ProtobufSchemas[key].fromPartial(record)
  const protobuf = ProtobufSchemas[key].encode(partial).finish()
  return Buffer.concat([blockPrefix, protobuf])
}

/**
 * Decode a Buffer as an object validated against the corresponding schema
 * @param {Buffer} buf - Buffer to be decoded
 * @returns {import('./types').JSONSchema}
 * */
export const decode = (buf, { coreId, seq }) => {
  const { dataTypeId, schemaVersion } = decodeBlockPrefix(buf)
  const schemaType = dataTypeIdToSchema[dataTypeId].schemaType
  const key = formatSchemaKey(schemaType)
  if (!ProtobufSchemas[key]) {
    throw new Error(
      `Invalid schemaVersion for ${schemaType} version ${schemaVersion}`
    )
  }
  const version = coreVersionToHexString({ coreId, seq })

  const record = buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length)
  const protobufObj = ProtobufSchemas[key].decode(record)

  return protoToJsonSchema(protobufObj, { schemaType, version })
}
