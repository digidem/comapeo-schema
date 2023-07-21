import {
  type AllProtoTypes,
  type ProtoTypesWithSchemaInfo,
  type CurrentProtoTypes,
  type ProtoTypeNames,
} from '../types/proto/types'
import { type JsonSchemaTypes } from '../types/schema'
import * as ProtobufEncodeDecode from '../types/proto/index.mapeo'
import { dataTypeIds } from '../config'
import * as cenc from 'compact-encoding'

// HELPER TYPES
/**
 * This is a Pick over a union, that keeps it as a distributive type
 * (normal pick will loose the distributive type)
 */
type PickUnion<T, K extends keyof T> = T extends any ? Pick<T, K> : never
/** Omit over a union, that keeps it as a distributive type */
type OmitUnion<T, K extends keyof any> = T extends any ? Omit<T, K> : never
/** Return a union of object values */
type Values<T> = T[keyof T]

/** Union of all *current* proto types */
type CurrentProtoTypesUnion = CurrentProtoTypes[keyof CurrentProtoTypes]
/** Union of keys from the common prop on Proto types */
type ProtoTypeCommonKeys = keyof Exclude<
  CurrentProtoTypesUnion['common'],
  undefined
>
/** Union of all Proto Types (including non-current versions) with schemaName and schemaVersion */
type ProtoTypesWithSchemaInfoUnion = Values<ProtoTypesWithSchemaInfo>
/** Union of all current Proto Types with schemaName and schemaVersion */
type CurrentProtoTypesWithSchemaInfoUnion = Extract<
  ProtoTypesWithSchemaInfoUnion,
  CurrentProtoTypesUnion
>
/** Union of all current JSON Schema types */
type JsonSchemaTypesUnion = Values<JsonSchemaTypes>
/** Just the common (shared) props from JSON schema types */
type JsonSchemaCommon = Pick<JsonSchemaTypesUnion, ProtoTypeCommonKeys>
/** Uniquely identifies a block in a core */
type VersionObj = { coreId: Buffer; seq: number }
/** Union of all valid data type ids */
type DataTypeIdsUnion = Values<typeof dataTypeIds>
/** Union of all valid schema names */
type SchemaNamesUnion = keyof typeof dataTypeIds
/** Union of all valid schemaName and schemaVersion combinations (not just current versions) */
type SchemaDefUnion = PickUnion<
  ProtoTypesWithSchemaInfoUnion,
  'schemaName' | 'schemaVersion'
>

const dataTypeIdSize = 6
const schemaVersionSize = 2

/** Map of dataTypeIds to schema names for quick lookups */
const dataTypeIdToSchemaName: Record<string, SchemaNamesUnion> = {}
for (const [schemaName, dataTypeId] of Object.entries(dataTypeIds) as Array<
  [SchemaNamesUnion, DataTypeIdsUnion]
>) {
  dataTypeIdToSchemaName[dataTypeId] = schemaName
}

/**
 * Decode a Buffer as an object validated against the corresponding schema
 * @param buf Buffer to be decoded
 * @param versionObj CoreId and seq
 * */
export function decode(
  buf: Buffer,
  versionObj: VersionObj
): JsonSchemaTypesUnion | null {
  const schemaDef = decodeBlockPrefix(buf)
  if (!schemaDef) return null
  if (schemaDef.schemaName === 'observation') {
    schemaDef.schemaVersion
  }

  const encodedMsg = buf.subarray(
    dataTypeIdSize + schemaVersionSize,
    buf.length
  )
  const protoTypeName = (capitalize(schemaDef.schemaName) +
    '_' +
    schemaDef.schemaVersion) as ProtoTypeNames

  const message = ProtobufEncodeDecode[protoTypeName].decode(encodedMsg)

  const messageWithSchemaInfo = mutatingSetSchemaDef(message, schemaDef)

  return protoToJsonSchema(messageWithSchemaInfo, versionObj)
}

/**
 * Adds schemaName and schemaVersion to a decoded prototype message.
 * __MUTATES__ the passed parameter, for performance reasons. Ok because we
 * do not use the passed paramter anywhere else.
 * Not strictly type checked, but the returns strict types which can be trusted
 */
function mutatingSetSchemaDef<
  T extends AllProtoTypes,
  K extends SchemaDefUnion
>(obj: T, props: K): ProtoTypesWithSchemaInfoUnion {
  for (const prop of Object.keys(props)) {
    ;(obj as any)[prop] = (props as any)[prop]
  }
  return obj as any
}

/**
 * @private - exported for unit tests
 * Given a buffer, return schemaVersion and schemaName
 */
export function decodeBlockPrefix(buf: Buffer): SchemaDefUnion | null {
  const state = cenc.state()
  // @ts-ignore
  state.buffer = buf
  state.start = 0
  state.end = dataTypeIdSize
  const dataTypeId = cenc.hex.fixed(dataTypeIdSize).decode(state)

  state.start = dataTypeIdSize
  state.end = dataTypeIdSize + schemaVersionSize
  const schemaVersion = cenc.uint16.decode(state)
  const schemaName = dataTypeIdToSchemaName[dataTypeId]

  if (!schemaName) return null

  return { schemaName, schemaVersion }
}

function migrateProjectV1ToV2(
  obj: ProtoTypesWithSchemaInfo['Project_1']
): ProtoTypesWithSchemaInfo['Project_2'] {
  return {
    ...obj,
    schemaVersion: 2,
  }
}

/**
 * Convert a decoded protobuf message to its corresponding JSONSchema type.
 * __Mutates__ the input `message`, for performance reasons.
 */
function protoToJsonSchema<TProtoType extends ProtoTypesWithSchemaInfoUnion>(
  message: TProtoType,
  versionObj: VersionObj
): JsonSchemaTypes[TProtoType['schemaName']] | null {
  let currentMessage: CurrentProtoTypesWithSchemaInfoUnion

  if (message.schemaVersion === 1 && message.schemaName === 'project') {
    currentMessage = migrateProjectV1ToV2(message)
  } else {
    currentMessage = message
  }

  const { common } = currentMessage
  // Don't use currentMessage or message after this, because they are mutated
  const rest = mutatingOmit(currentMessage, 'common')

  if (!common || !common.id || !common.createdAt || !common.updatedAt)
    return null

  const jsonSchemaCommon: JsonSchemaCommon = {
    id: common.id.toString('hex'),
    links: common.links.map(versionObjToHexString),
    createdAt: common.createdAt,
    updatedAt: common.updatedAt,
  }

  const typed: JsonSchemaTypes[typeof message.schemaName] = {
    ...jsonSchemaCommon,
    version: versionObjToHexString(versionObj),
    ...rest,
  }
  return typed
}

// Below is an example to test the types

const project = {
  common: {
    id: Buffer.alloc(1),
    links: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  name: 'test',
  schemaName: 'project' as const,
  schemaVersion: 1 as const,
}

// Typed as Project (from JSONSchema types)
const output = protoToJsonSchema(project, { coreId: Buffer.alloc(0), seq: 1 })

/**
 * Turn coreId and seq to a version string of ${hex-encoded coreId}/${seq}
 */
function versionObjToHexString({ coreId, seq }: VersionObj) {
  return `${coreId.toString('hex')}/${seq}`
}

function mutatingOmit<T, K extends keyof any>(obj: T, key: K): OmitUnion<T, K> {
  delete (obj as any)[key]
  return obj as any
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as any
}
