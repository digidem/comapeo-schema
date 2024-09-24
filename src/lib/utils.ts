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

export type VersionObject = VersionDiscoveryKeyObject | VersionDiscoveryIdObject

export type VersionDiscoveryKeyObject = {
  coreDiscoveryKey: Buffer
  index: number
}

export type VersionDiscoveryIdObject = {
  coreDiscoveryId: string
  index: number
}

export const VERSION_ID_SEPARATOR = '/'

/**
 * Get a string versionId from a core discovery key or discovery id and index in
 * that core. A versionId uniquely identifies a record in the underlying
 * Hypercore storage used by Mapeo
 * @param versionIdObject
 * @returns versionId string
 */
export function getVersionId(versionIdObject: VersionObject) {
  const { index } = versionIdObject
  assert(
    Number.isSafeInteger(index) && index >= 0,
    'version ID index must be a non-negative integer'
  )
  let discoveryId
  if ('coreDiscoveryId' in versionIdObject) {
    discoveryId = versionIdObject.coreDiscoveryId
    assert(
      discoveryId.length > 0,
      'version ID core discovery id must be non-empty string'
    )
  } else {
    assert(
      versionIdObject.coreDiscoveryKey.byteLength >= 32,
      'version ID core discovery key must be have at least 32 bytes'
    )
    discoveryId = versionIdObject.coreDiscoveryKey.toString('hex')
  }
  return discoveryId + VERSION_ID_SEPARATOR + index
}

/**
 * Parse a versionId string to get the core key and index in that core. A
 * versionId uniquely identifies a record in the underlying Hypercore storage
 * used by Mapeo
 * @param versionId hex-encoded 32-byte core key and index in the core, separated with `/`
 * @returns coreKey as a Buffer and index in the core
 */
export function parseVersionId(versionId: string): VersionDiscoveryKeyObject {
  const items = versionId.split(VERSION_ID_SEPARATOR)
  if (!items[0] || !items[1]) throw new Error('Invalid versionId')
  const coreDiscoveryKey = Buffer.from(items[0], 'hex')
  if (coreDiscoveryKey.length !== 32) throw new Error('Invalid versionId')
  const index = Number.parseInt(items[1])
  if (isNaN(index)) throw new Error('Invalid versionId')
  return { coreDiscoveryKey, index }
}

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
