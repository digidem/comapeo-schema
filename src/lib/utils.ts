import { type ProtoTypeNames } from '../proto/types.js'
import { type ValidSchemaDef } from '../types.js'

/**
 * Get the name of the type, e.g. `Observation_5` for schemaName `observation`
 * and schemaVersion `1`
 */
export function getProtoTypeName(schemaDef: ValidSchemaDef): ProtoTypeNames {
  return (capitalize(schemaDef.schemaName) +
    '_' +
    schemaDef.schemaVersion) as ProtoTypeNames
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as any
}

export type VersionIdObject = {
  coreKey: Buffer
  index: number
}

/**
 * Get a string versionId from a core key and index in that core. A versionId
 * uniquely identifies a record in the underlying Hypercore storage used by
 * Mapeo
 * @param versionIdObject
 * @returns versionId string
 */
export function getVersionId({ coreKey, index }: VersionIdObject) {
  return coreKey.toString('hex') + '/' + index
}

/**
 * Parse a versionId string to get the core key and index in that core. A
 * versionId uniquely identifies a record in the underlying Hypercore storage
 * used by Mapeo
 * @param versionId hex-encoded 32-byte core key and index in the core, separated with `/`
 * @returns coreKey as a Buffer and index in the core
 */
export function parseVersionId(versionId: string): VersionIdObject {
  const items = versionId.split('/')
  if (!items[0] || !items[1]) throw new Error('Invalid versionId')
  const coreKey = Buffer.from(items[0], 'hex')
  if (coreKey.length !== 32) throw new Error('Invalid versionId')
  const index = Number.parseInt(items[1])
  if (isNaN(index)) throw new Error('Invalid versionId')
  return { coreKey, index }
}
