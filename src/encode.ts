import { JsonSchemaTypes, SchemaName, ValidSchemaDef } from './types'
import { currentSchemaVersions, dataTypeIds } from '../config'
// @ts-ignore
import * as cenc from 'compact-encoding'
import { DATA_TYPE_ID_BYTES } from './constants'
import { getProtoTypeName } from './lib/utils'
import * as ProtobufEncodeDecode from '../types/proto/index.mapeo'

/**
 * Encode a an object validated against a schema as a binary protobuf prefixed
 * with the encoded data type ID and schema version, to send to an hypercore.
 */
export function encode(mapeoDoc: JsonSchemaTypes): Buffer {
  const { schemaName } = mapeoDoc
  const schemaVersion = currentSchemaVersions[schemaName]
  const schemaDef = { schemaName, schemaVersion }
  assertCurrentSchemaDef(schemaDef)

  const protoTypeName = getProtoTypeName(schemaDef)

  // check if protoTypeName is valid
  if (!ProtobufEncodeDecode[protoTypeName]) {
    throw new Error(
      `Unexpected type: schemaName: '${schemaName}', schemaVersion: ${schemaVersion}`
    )
  }

  const blockPrefix = encodeBlockPrefix(schemaDef)

  let protobuf: Buffer

  switch (mapeoDoc.schemaName) {
    case 'field':
      protobuf = Buffer.alloc(0)
      break
    case 'observation':
      protobuf = Buffer.alloc(0)
      break
    case 'project':
      protobuf = Buffer.alloc(0)
      break
    default:
      const _exhaustiveCheck: never = mapeoDoc
      protobuf = Buffer.alloc(0)
  }

  return Buffer.concat([blockPrefix, protobuf])
}

/**
 * @private - exported for unit tests
 * Encode schemaVersion and schemaName to a Buffer (schemaName replaced with corresponding dataTypeId)
 */
export function encodeBlockPrefix({
  schemaName,
  schemaVersion,
}: ValidSchemaDef): Buffer {
  const dataTypeId = dataTypeIds[schemaName]
  return Buffer.concat([
    cenc.encode(cenc.hex.fixed(DATA_TYPE_ID_BYTES), dataTypeId),
    cenc.encode(cenc.uint16, schemaVersion),
  ])
}

/**
 * Assert that a given schemaName and schemaVersion is "current", e.g. does it
 * match the current JSONSchema types that we know how to deal with?
 */
function assertCurrentSchemaDef(schemaDef: {
  schemaName: SchemaName
  schemaVersion: number
}): asserts schemaDef is ValidSchemaDef {
  const { schemaName, schemaVersion } = schemaDef
  if (schemaVersion !== currentSchemaVersions[schemaName]) {
    throw new Error(
      `Invalid schema version '${schemaVersion}' for schema '${schemaName}'`
    )
  }
}
