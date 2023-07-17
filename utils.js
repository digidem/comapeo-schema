import schemasPrefix from './schemasPrefix.js'
/**
 * Format schema type string to match protobuf/schema prefix type lookups
 * @param {String} str
 * @returns {String} First letter capitalized, the rest lowercased
 */
export const formatSchemaType = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Turn a schema type and version into `${type}_${schemaVersion}`
 * @param {String | undefined} type
 * @param {Number | undefined} schemaVersion
 */
export const formatSchemaKey = (type, schemaVersion) =>
  `${formatSchemaType(type)}_${schemaVersion || getLastVersionForSchema(type)}`

/**
 * Get the last version of a schema given a schemaType
 * @param {String} schemaType
 * @returns {String} schemaVersion
 */
export const getLastVersionForSchema = (schemaType) => {
  const versions = schemasPrefix[schemaType]['schemaVersions']
  return versions.reduce((a, b) => Math.max(a, b), -Infinity).toString()
}

/**
 * Turn a hex-encoded string to a byte buffer
 * @param {String} hexStr
 * @returns {Buffer}
 */
export const hexStringToBuffer = (hexStr) => Buffer.from(hexStr, 'hex')

/**
 * Turn a hex-encoded string to a byte buffer
 * @param {Buffer} buf
 * @returns {String}
 */
export const bufferToHexString = (buf) => buf.toString('hex')

/**
 * Checks if the type of record inherits from a common one
 * @param {String} key - type of doc build from ${type}_${schemaVersion}
 * @returns {boolean}
 */
export const inheritsFromCommon = (key) =>
  key !== 'Observation_4' &&
  key !== 'Preset_1' &&
  key !== 'Filter_1' &&
  key !== 'Field_1'
