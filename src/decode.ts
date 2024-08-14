import { ProtoTypes } from './proto/types.js'
import {
  type ProtoTypesWithSchemaInfo,
  type SchemaName,
  type DataTypeId,
  type ValidSchemaDef,
  type MapeoDocInternal,
} from './types.js'

import { Decode } from './proto/index.js'
import { dataTypeIds, currentSchemaVersions } from './config.js'
import {
  convertProjectSettings,
  convertField,
  convertObservation,
  convertPreset,
  convertRole,
  convertDeviceInfo,
  convertCoreOwnership,
  convertIcon,
  convertTranslation,
  convertTrack,
} from './lib/decode-conversions.js'
// @ts-ignore
import * as cenc from 'compact-encoding'
import { DATA_TYPE_ID_BYTES, SCHEMA_VERSION_BYTES } from './constants.js'
import {
  ExhaustivenessError,
  VersionIdObject,
  getOwn,
  getProtoTypeName,
} from './lib/utils.js'

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
 * @param versionObj public key (coreKey) of the core where this block is stored, and the index of the block in the core.
 * */
export function decode(
  buf: Buffer,
  versionObj: VersionIdObject
): MapeoDocInternal {
  const schemaDef = decodeBlockPrefix(buf)

  const encodedMsg = buf.subarray(
    DATA_TYPE_ID_BYTES + SCHEMA_VERSION_BYTES,
    buf.length
  )

  const messageWithoutSchemaInfo = decodeDoc(encodedMsg, schemaDef.schemaName)

  const message = mutatingSetSchemaDef(messageWithoutSchemaInfo, schemaDef)

  switch (message.schemaName) {
    case 'projectSettings':
      return convertProjectSettings(message, versionObj)
    case 'observation':
      return convertObservation(message, versionObj)
    case 'field':
      return convertField(message, versionObj)
    case 'preset':
      return convertPreset(message, versionObj)
    case 'role':
      return convertRole(message, versionObj)
    case 'deviceInfo':
      return convertDeviceInfo(message, versionObj)
    case 'coreOwnership':
      return convertCoreOwnership(message, versionObj)
    case 'icon':
      return convertIcon(message, versionObj)
    case 'translation':
      return convertTranslation(message, versionObj)
    case 'track':
      return convertTrack(message, versionObj)
    default:
      throw new ExhaustivenessError(message)
  }
}

/**
 * Given a buffer, return a (valid) schemaVersion and schemaName
 * Will throw if dataTypeId is unknown
 */
export function decodeBlockPrefix(buf: Buffer): ValidSchemaDef {
  if (buf.length < DATA_TYPE_ID_BYTES + SCHEMA_VERSION_BYTES) {
    throw new Error('Invalid block prefix - unexpected prefix length')
  }
  const state = cenc.state()
  state.buffer = buf
  state.start = 0
  state.end = DATA_TYPE_ID_BYTES
  const dataTypeId = cenc.hex.fixed(DATA_TYPE_ID_BYTES).decode(state)

  if (typeof dataTypeId !== 'string') {
    throw new Error('Invalid block prefix, could not decode dataTypeId')
  }

  state.start = DATA_TYPE_ID_BYTES
  state.end = DATA_TYPE_ID_BYTES + SCHEMA_VERSION_BYTES
  const schemaVersion = cenc.uint16.decode(state)

  if (typeof schemaVersion !== 'number') {
    throw new Error('Invalid block prefix, could not decode schemaVersion')
  }

  const schemaName = dataTypeIdToSchemaName[dataTypeId]

  if (!schemaName) {
    throw new Error(`Unknown dataTypeId '${dataTypeId}'`)
  }

  return { schemaName, schemaVersion }
}

function decodeDoc(encodedMsg: Readonly<Buffer>, schemaName: SchemaName) {
  const currentSchemaVersion = getOwn(currentSchemaVersions, schemaName)
  if (!currentSchemaVersion) {
    throw new Error(`Unknown schema name '${schemaName}'`)
  }
  const protoTypeName = getProtoTypeName(schemaName, currentSchemaVersion)
  return Decode[protoTypeName](encodedMsg)
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

// function mutatingOmit<T, K extends keyof any>(obj: T, key: K): OmitUnion<T, K> {
//   delete (obj as any)[key]
//   return obj as any
// }
