// @ts-check
/**
 * @module mapeo-schema
 */
import fs from 'node:fs'
import b4a from 'b4a'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import glob from 'glob-promise'
import { assert } from 'node:console'

/**
 * @param {string} path
 * @returns {Object}
 */
const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)).toString())

/**
 * @param {any} schema
 * @returns {Object}
 */
const parseId = (schema) => {
  const arr = new URL(schema['$id']).pathname.split('/')
  const schemaVersion = arr.pop()
  const dataTypeId = arr.pop()
  // const [, , schemaVersion, dataTypeId] = arr
  return { schemaVersion, dataTypeId }
}

const ajv = new Ajv()
addFormats(ajv)
const schemaFiles = await glob('./schema/*.json')

const blockPrefixToSchema = {}
for (let schemaFile of schemaFiles) {
  const schema = loadJSON(schemaFile)
  const { schemaVersion, dataTypeId } = parseId(schema)
  const type = schema.title

  // TODO: remove this once every jsonSchema as a corresponding protobufSchema
  let protobufSchema = null
  try {
    protobufSchema = await import(`./types/proto/${type.toLowerCase()}.js`)
    // this is horrible,
    // but I can't index and element directly returned from a dynamic import since its async
    protobufSchema = protobufSchema[type]
  } catch (e) {
    console.log('ERROR', 'protobuf schema not found', type)
  }

  // TODO: research why enum types are failing to compile
  let validate = null
  try {
    validate = ajv.compile(schema)
  } catch (e) {
    console.log('ERROR', 'compiling schema', schemaFile)
  }
  blockPrefixToSchema[`${dataTypeId}/${schemaVersion}`] = {
    type,
    schema,
    validate,
    protobufSchema,
  }
}

// this should be change to 32 once we generate random ids for record types
const dataTypeIdSize = 4
// this should be changed to 4
const schemaVersionSize = 1

/**
 * Given a record type and version, find the corresponding blockPrefix if it exists
 * @param {Object} obj
 * @param {string} obj.type
 * @param {number} obj.version
 * @returns {string | undefined} blockPrefix for corresponding schema
 */
const findSchema = ({ type, version }) =>
  Object.keys(blockPrefixToSchema).find((blockPrefix) => {
    // we need to compare the version since we can have multiple versions of the same schema
    const [, v] = blockPrefix.split('/')
    return (
      blockPrefixToSchema[blockPrefix].type.toLowerCase() === type &&
      version === parseInt(v)
    )
  })

/**
 * Validate an object against the schema type
 * @param {import('./types/schema/observation').Observation} obj - Object to be encoded
 * @returns {Boolean} indicating if the object is valid
 */
export const validate = (obj) => {
  const blockPrefix = findSchema({ type: obj.type, version: obj.schemaVersion })
  return blockPrefixToSchema[blockPrefix].validate(obj)
}

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
  // how can we crash if blockPrefix is undefined? shouldn't an assertion be enough?
  const dataTypeId = b4a.from(blockPrefix.split('/')[0])
  const version = b4a.from([record.schemaVersion])
  const protobuf = schema.profobufSchema.encode(record).finish()
  return b4a.concat([dataTypeId, version, protobuf])
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
