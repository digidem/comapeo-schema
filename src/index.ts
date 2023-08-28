export { encode, encodeBlockPrefix } from './encode.js'
export { decode, decodeBlockPrefix } from './decode.js'
export { currentSchemaVersions } from './config.js'
export { validate } from './validate.js'
export {
  getVersionId,
  parseVersionId,
  type VersionIdObject,
} from './lib/utils.js'

export * from './schema/index.js'
export * from './schemas.js'
export { type MapeoDocInternal } from './types.js'
