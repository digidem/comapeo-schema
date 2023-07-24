import { type ProtoTypeNames, ProtoTypes } from '../types/proto/types'
import {
  type JsonSchemaTypes,
  type ProtoTypesWithSchemaInfo,
  type VersionObj,
  type SchemaName,
  type DataTypeId,
  type ValidSchemaDef,
} from './types'

import * as ProtobufEncodeDecode from '../types/proto/index.mapeo'
import { dataTypeIds, knownSchemaVersions } from '../config'
import {
  convertProject,
  convertField,
  convertObservation,
} from './lib/decode-conversions'
// @ts-ignore
import * as cenc from 'compact-encoding'

const dataTypeIdSize = 6
const schemaVersionSize = 2

/** Map of dataTypeIds to schema names for quick lookups */
const dataTypeIdToSchemaName: Record<string, SchemaName> = {}
for (const [schemaName, dataTypeId] of Object.entries(dataTypeIds) as Array<
  [SchemaName, DataTypeId]
>) {
  dataTypeIdToSchemaName[dataTypeId] = schemaName
}

/**
 * Decode a Buffer as an object validated against the corresponding schema
 *
 * @param buf Buffer to be decoded
 * @param versionObj public key (coreId) of the core where this block is stored, and the index (seq) of the block in the core.
 * */
export function decode(buf: Buffer, versionObj: VersionObj): JsonSchemaTypes {
  const schemaDef = decodeBlockPrefix(buf)

  const encodedMsg = buf.subarray(
    dataTypeIdSize + schemaVersionSize,
    buf.length
  )

  const messageWithSchemaInfo =
    ProtobufEncodeDecode[getProtoTypeName(schemaDef)].decode(encodedMsg)

  const message = mutatingSetSchemaDef(messageWithSchemaInfo, schemaDef)

  switch (message.schemaName) {
    case 'project':
      return convertProject(message, versionObj)
    case 'observation':
      return convertObservation(message, versionObj)
    case 'field':
      return convertField(message, versionObj)
    default:
      const _exhaustiveCheck: never = message
      return message
  }
}

/**
 * @private - exported for unit tests
 * Given a buffer, return a (valid) schemaVersion and schemaName
 * Will throw if dataTypeId and schema version is unknown
 */
export function decodeBlockPrefix(buf: Buffer): ValidSchemaDef {
  if (buf.length < dataTypeIdSize + schemaVersionSize) {
    throw new Error('Invalid block prefix - unexpected prefix length')
  }
  const state = cenc.state()
  state.buffer = buf
  state.start = 0
  state.end = dataTypeIdSize
  const dataTypeId = cenc.hex.fixed(dataTypeIdSize).decode(state)

  if (typeof dataTypeId !== 'string') {
    throw new Error('Invalid block prefix, could not decode dataTypeId')
  }

  state.start = dataTypeIdSize
  state.end = dataTypeIdSize + schemaVersionSize
  const schemaVersion = cenc.uint16.decode(state)

  if (typeof schemaVersion !== 'number') {
    throw new Error('Invalid block prefix, could not decode schemaVersion')
  }

  const schemaName = dataTypeIdToSchemaName[dataTypeId]

  if (!schemaName) {
    throw new Error(`Unknown dataTypeId '${dataTypeId}'`)
  }

  const schemaDef = { schemaName, schemaVersion }
  assertKnownSchemaDef(schemaDef)
  return schemaDef
}

/**
 * Adds schemaName and schemaVersion to a decoded prototype message.
 * __MUTATES__ the passed parameter, for performance reasons. Ok because we
 * do not use the passed paramter anywhere else.
 * Not strictly type checked, but the returns strict types which can be trusted
 */
function mutatingSetSchemaDef<T extends ProtoTypes, K extends ValidSchemaDef>(
  obj: T,
  props: K
): ProtoTypesWithSchemaInfo {
  for (const prop of Object.keys(props)) {
    ;(obj as any)[prop] = (props as any)[prop]
  }
  return obj as any
}

/**
 * Assert that a given schemaName and schemaVersion is "known", e.g. do we know how to process it?
 * TODO: Accept "future" schema versions, because protobuf decoding should be forward-compatible
 */
function assertKnownSchemaDef(schemaDef: {
  schemaName: SchemaName
  schemaVersion: number
}): asserts schemaDef is ValidSchemaDef {
  const { schemaName, schemaVersion } = schemaDef
  if (knownSchemaVersions[schemaName].includes(schemaDef.schemaVersion)) {
    throw new Error(
      `Unknown schema version '${schemaVersion}' for schema '${schemaName}'`
    )
  }
}

/**
 * Get the name of the type, e.g. `Observation_5` for schemaName `observation`
 * and schemaVersion `1`
 */
function getProtoTypeName(schemaDef: ValidSchemaDef): ProtoTypeNames {
  return (capitalize(schemaDef.schemaName) +
    '_' +
    schemaDef.schemaVersion) as ProtoTypeNames
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as any
}

// function mutatingOmit<T, K extends keyof any>(obj: T, key: K): OmitUnion<T, K> {
//   delete (obj as any)[key]
//   return obj as any
// }
