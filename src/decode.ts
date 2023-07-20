import {
  type AllProtoDefs,
  type CurrentProtoTypes,
  type Project_1,
  type Project_2,
  type ProtoTypeNames,
} from '../types/proto/types'
import { type JsonSchemaTypes } from '../types/schema'
import * as ProtobufEncodeDecode from '../types/proto/index.mapeo'
import { dataTypeIds } from '../config'
// TODO: Move the capitalize function somewhere else
import { capitalize } from '../scripts/lib/utils'
import * as cenc from 'compact-encoding'

type CurrentProtoTypesUnion = CurrentProtoTypes[keyof CurrentProtoTypes]
type ProtoTypeCommonKeys = keyof Exclude<
  CurrentProtoTypesUnion['common'],
  undefined
>
type JsonSchemaTypesUnion = JsonSchemaTypes[keyof JsonSchemaTypes]
type JsonSchemaCommon = Pick<JsonSchemaTypesUnion, ProtoTypeCommonKeys>
type VersionObj = { coreId: Buffer; seq: number }
type DataTypeIdsUnion = typeof dataTypeIds[keyof typeof dataTypeIds]
type SchemaNamesUnion = keyof typeof dataTypeIds

const dataTypeIdSize = 6
const schemaVersionSize = 2

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
  const { schemaName, schemaVersion } = schemaDef

  const encodedMsg = buf.subarray(
    dataTypeIdSize + schemaVersionSize,
    buf.length
  )
  const protoTypeName = (capitalize(schemaName) +
    '_' +
    schemaVersion) as ProtoTypeNames

  const message = ProtobufEncodeDecode[protoTypeName].decode(encodedMsg)

  // I think this one might be impossible to fix with Typescript, since it can't
  // discriminate this correctly, since too much is unknown
  // @ts-ignore
  return protoToJsonSchema({ schemaName, schemaVersion, message }, versionObj)
}

/**
 *  given a buffer, return schemaVersion and dataTypeId
 */
function decodeBlockPrefix(buf: Buffer): Omit<AllProtoDefs, 'message'> | null {
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

function migrateProjectV1ToV2(obj: Project_1): Project_2 {
  return obj
}

/**
 * Convert a decoded protobuf message to its corresponding JSONSchema type.
 */
function protoToJsonSchema<TProtoDef extends AllProtoDefs>(
  schemaDef: TProtoDef,
  versionObj: VersionObj
): JsonSchemaTypes[TProtoDef['schemaName']] {
  let currentMessage: CurrentProtoTypesUnion

  if (schemaDef.schemaVersion === 1 && schemaDef.schemaName === 'project') {
    currentMessage = migrateProjectV1ToV2(schemaDef.message)
  } else {
    currentMessage = schemaDef.message
  }

  const { common, ...rest } = currentMessage
  if (!common) throw new Error('Missing common')

  const jsonSchemaCommon: JsonSchemaCommon = {
    id: common.id.toString('hex'),
    links: common.links.map(versionObjToHexString),
    createdAt: common.createdAt || '',
    updatedAt: common.updatedAt || '',
  }

  const partial: Omit<
    JsonSchemaTypes[typeof schemaDef.schemaName],
    'schemaType'
  > = {
    ...jsonSchemaCommon,
    version: versionObjToHexString(versionObj),
    ...rest,
  }

  // Typescript is unable to discriminate the JSONSchema type based on the
  // schemaName passed to the function, but everything above here is strictly
  // typed, so not too much risk in ignoring this.
  // @ts-ignore
  partial.schemaType = schemaDef.schemaName
  // @ts-ignore
  return partial
}

const project: Project_1 = {
  common: {
    id: Buffer.alloc(1),
    links: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  name: 'test',
}

// Typed as Project (from JSONSchema types)
const output = protoToJsonSchema(
  {
    schemaName: 'project',
    schemaVersion: 1,
    message: project,
  },
  { coreId: Buffer.alloc(0), seq: 1 }
)

/**
 * Turn coreId and seq to a version string of ${hex-encoded coreId}/${seq}
 */
function versionObjToHexString({ coreId, seq }: VersionObj) {
  return `${coreId.toString('hex')}/${seq}`
}
