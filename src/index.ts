export { encode } from './encode.js'
export { decode, decodeBlockPrefix } from './decode.js'
export { currentSchemaVersions } from './config.js'
export { validate } from './validate.js'
export {
  getVersionId,
  parseVersionId,
  valueOf,
  /** Deprecated: rename VersionIdObject to VersionObject */
  type VersionObject as VersionIdObject,
  type VersionObject,
} from './lib/utils.js'

export * from './schema/index.js'
export * from './schemas.js'
export { type MapeoDocDecode, type MapeoDocEncode } from './types.js'
