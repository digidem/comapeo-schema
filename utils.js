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
 */
export const formatSchemaKey = (type) =>
  `${formatSchemaType(type)}_${getLastVersionForSchema(type).toString()}`

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
 * Get the last version of a schema given a schemaType
 * @param {String} schemaType
 * @returns {number} schemaVersion
 */
export const getLastVersionForSchema = (schemaType) => {
  const versions = schemasPrefix[schemaType]['schemaVersions']
  return versions.reduce((a, b) => Math.max(a, b), -Infinity)
}

export const hexStringToCoreVersion = (hexStr) => {
  const [id, seq] = hexStr.split('/')
  return { coreId: Buffer.from(id, 'hex'), seq: Number(seq) }
}

/**
 * Turn a an object with {coreId:Buffer, seq:Number} to hex-encoded string of coreId/seq to
 * @param {coreVersion} coreVersionObj
 * @returns {String}
 */
export const coreVersionToHexString = (coreVersionObj) =>
  `${coreVersionObj.coreId.toString('hex')}/${coreVersionObj.seq}`
