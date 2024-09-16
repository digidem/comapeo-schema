import { type ProtoTypeNames } from '../proto/types.js'
import {
  type MapeoDoc,
  type MapeoValue,
  type FilterBySchemaName,
} from '../types.js'

export function getOwn<T extends object, K extends keyof T>(
  obj: T,
  key: K
): undefined | T[K] {
  return Object.hasOwn(obj, key) ? obj[key] : undefined
}

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

export class ExhaustivenessError extends Error {
  constructor(value: never) {
    super(`Exhaustiveness check failed. ${value} should be impossible`)
  }
}

/**
 * Get the name of the type, e.g. `Observation_5` for schemaName `observation`
 * and schemaVersion `5`
 */
export function getProtoTypeName(
  schemaName: string,
  schemaVersion: number
): ProtoTypeNames {
  return (capitalize(schemaName) + '_' + schemaVersion) as ProtoTypeNames
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as any
}

export type VersionIdObject = {
  coreDiscoveryKey: Buffer
  index: number
}

/**
 * Get a string versionId from a core key and index in that core. A versionId
 * uniquely identifies a record in the underlying Hypercore storage used by
 * Mapeo
 * @param versionIdObject
 * @returns versionId string
 */
export function getVersionId({ coreDiscoveryKey, index }: VersionIdObject) {
  return coreDiscoveryKey.toString('hex') + '/' + index
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
  const coreDiscoveryKey = Buffer.from(items[0], 'hex')
  if (coreDiscoveryKey.length !== 32) throw new Error('Invalid versionId')
  const index = Number.parseInt(items[1])
  if (isNaN(index)) throw new Error('Invalid versionId')
  return { coreDiscoveryKey, index }
}

/**
 * @template {import('@mapeo/schema').MapeoDoc & { forks?: string[] }} T
 * @param {T} doc
 * @returns {Omit<T, 'docId' | 'versionId' | 'originalVersionId' | 'links' | 'forks' | 'createdAt' | 'updatedAt' | 'deleted'>}
 */
export function valueOf<TDoc extends MapeoDoc>(
  doc: TDoc & { forks?: string[] }
): FilterBySchemaName<MapeoValue, TDoc['schemaName']> {
  /* eslint-disable no-unused-vars */
  const {
    docId,
    versionId,
    originalVersionId,
    links,
    forks,
    createdAt,
    updatedAt,
    deleted,
    ...rest
  } = doc
  /* eslint-enable no-unused-vars */
  return rest as any
}
