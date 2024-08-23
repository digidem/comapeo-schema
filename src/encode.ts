import {
  type MapeoDocInternal,
  type OmitUnion,
  type SchemaName,
  type ValidSchemaDef,
} from './types.js'
import { currentSchemaVersions, dataTypeIds } from './config.js'
// @ts-ignore
import * as cenc from 'compact-encoding'
import { DATA_TYPE_ID_BYTES } from './constants.js'
import { Encode } from './proto/index.js'
import {
  convertField,
  convertObservation,
  convertPreset,
  convertProjectSettings,
  convertMembership,
  convertDeviceInfo,
  convertCoreOwnership,
  convertIcon,
  convertTranslation,
  convertTrack,
} from './lib/encode-conversions.js'
import { CoreOwnership } from './index.js'
import { ExhaustivenessError } from './lib/utils.js'

/**
 * Encode a an object validated against a schema as a binary protobuf prefixed
 * with the encoded data type ID and schema version, to send to an hypercore.
 */
export function encode(
  mapeoDoc: OmitUnion<MapeoDocInternal, 'versionId'>
): Buffer {
  const { schemaName } = mapeoDoc
  const schemaVersion = currentSchemaVersions[schemaName]
  const schemaDef = { schemaName, schemaVersion }
  assertCurrentSchemaDef(schemaDef)

  const blockPrefix = encodeBlockPrefix(schemaDef)

  let protobuf: Uint8Array

  switch (mapeoDoc.schemaName) {
    case 'field': {
      const message = convertField(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'observation': {
      const message = convertObservation(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'projectSettings': {
      const message = convertProjectSettings(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'preset': {
      const message = convertPreset(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'membership': {
      const message = convertMembership(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'deviceInfo': {
      const message = convertDeviceInfo(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'coreOwnership': {
      const message = convertCoreOwnership(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'icon': {
      const message = convertIcon(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'translation': {
      const message = convertTranslation(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    case 'track': {
      const message = convertTrack(mapeoDoc)
      protobuf = Encode[mapeoDoc.schemaName](message).finish()
      break
    }
    default:
      throw new ExhaustivenessError(mapeoDoc)
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
