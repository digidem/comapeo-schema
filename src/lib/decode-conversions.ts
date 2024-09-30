// This file exports a function for converting each supported schema type (all
// known versions) to the latest JSONSchema type
import {
  type TagValue_1,
  type TagValue_1_PrimitiveValue,
} from '../proto/tags/v1.js'

import {
  type Icon_1_IconVariant,
  Icon_1_IconVariantPng_PixelDensity,
} from '../proto/icon/v1.js'

import {
  type MapeoDoc,
  type ProtoTypesWithSchemaInfo,
  type SchemaName,
  type FilterBySchemaName,
  type MapeoCommon,
  type TagValuePrimitive,
  type JsonTagValue,
  type MapeoDocDecode,
} from '../types.js'
import {
  type Icon,
  type Observation,
  type Track,
  valueSchemas,
} from '../index.js'
import type {
  Observation_1_Attachment,
  Observation_1_Metadata,
  Observation_1_Metadata_Position,
} from '../proto/observation/v1.js'
import type { Track_1_Position } from '../proto/track/v1.js'
import { ProjectSettings_1_ConfigMetadata } from '../proto/projectSettings/v1.js'
import { ProjectSettings } from '../schema/projectSettings.js'
import type { Position } from '../schema/observation.js'
import {
  assert,
  ExhaustivenessError,
  getVersionId,
  VersionIdObject,
} from './utils.js'

/** Function type for converting a protobuf type of any version for a particular
 * schema name, and returning the most recent JSONSchema type */
type ConvertFunction<TSchemaName extends SchemaName> = (
  message: Extract<ProtoTypesWithSchemaInfo, { schemaName: TSchemaName }>,
  versionObj: VersionIdObject
) => FilterBySchemaName<MapeoDocDecode, TSchemaName>

function ensure(
  condition: unknown,
  objectName: string,
  propertyName: string
): asserts condition {
  assert(condition, `${objectName} missing required property ${propertyName}`)
}

export const convertProjectSettings: ConvertFunction<'projectSettings'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, defaultPresets, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)

  let configMetadata: undefined | ProjectSettings['configMetadata']
  if (rest.configMetadata) {
    configMetadata = convertConfigMetadata(rest.configMetadata)
  }

  return {
    ...jsonSchemaCommon,
    ...rest,
    defaultPresets: defaultPresets
      ? {
          point: defaultPresets.point.map((p) => p.toString('hex')),
          area: defaultPresets.area.map((a) => a.toString('hex')),
          vertex: defaultPresets.vertex.map((v) => v.toString('hex')),
          line: defaultPresets.line.map((l) => l.toString('hex')),
          relation: defaultPresets.relation.map((r) => r.toString('hex')),
        }
      : undefined,
    configMetadata,
  }
}

function convertConfigMetadata(
  configMetadata: ProjectSettings_1_ConfigMetadata
): ProjectSettings['configMetadata'] {
  // TODO: Consider moving this default to the frontend.
  const defaultDate = new Date(0).toISOString()
  const {
    name,
    importDate = defaultDate,
    buildDate = defaultDate,
    fileVersion,
  } = configMetadata
  return { name, importDate, buildDate, fileVersion }
}

export const convertObservation: ConvertFunction<'observation'> = (
  message,
  versionObj
) => {
  const { common, metadata, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  let presetRef

  if (rest.presetRef) {
    ensure(rest.presetRef.versionId, 'observation.presetRef', 'versionId')
    presetRef = {
      docId: rest.presetRef.docId.toString('hex'),
      versionId: getVersionId(rest.presetRef.versionId),
    }
  }

  const attachments: Observation['attachments'] = []
  for (const attachment of message.attachments) {
    try {
      const converted = convertAttachment(attachment)
      attachments.push(converted)
    } catch (_err) {
      // TODO: Log something here.
    }
  }

  const obs: Observation = {
    ...jsonSchemaCommon,
    ...rest,
    attachments,
    tags: convertTags(message.tags),
    metadata: metadata ? removeInvalidPositionMetadata(metadata) : {},
    presetRef,
  }
  return obs
}

type FieldOptions = FilterBySchemaName<MapeoDoc, 'field'>['options']

export const convertField: ConvertFunction<'field'> = (message, versionObj) => {
  const { common, schemaVersion, tagKey, type, label, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  ensure(tagKey, 'field', 'tagKey')
  return {
    ...jsonSchemaCommon,
    ...rest,
    tagKey: tagKey,
    label: label || tagKey,
    type,
    options:
      message.options.length > 0
        ? message.options.reduce<Exclude<FieldOptions, undefined>>(
            (acc, { label, value }) => {
              // Filter out any options where value is undefined (this would still be valid protobuf, but not valid for our code)
              if (!value) return acc
              const convertedValue = convertTagPrimitive(value)
              if (typeof convertedValue === 'undefined') return acc
              acc.push({ label, value: convertedValue })
              return acc
            },
            []
          )
        : undefined,
  }
}

type JsonSchemaPresetGeomItem = FilterBySchemaName<
  MapeoDoc,
  'preset'
>['geometry'][number]

export const convertPreset: ConvertFunction<'preset'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)

  const geometry = rest.geometry.filter(
    (geomType): geomType is JsonSchemaPresetGeomItem =>
      geomType !== 'UNRECOGNIZED'
  )

  let iconRef
  if (rest.iconRef) {
    ensure(rest.iconRef.versionId, 'preset.iconRef', 'versionId')
    iconRef = {
      docId: rest.iconRef.docId.toString('hex'),
      versionId: getVersionId(rest.iconRef.versionId),
    }
  }

  return {
    ...jsonSchemaCommon,
    ...rest,
    geometry,
    tags: convertTags(rest.tags),
    addTags: convertTags(rest.addTags),
    removeTags: convertTags(rest.removeTags),
    fieldRefs: rest.fieldRefs.map(({ docId, versionId }) => {
      if (!versionId) throw new Error('missing fieldRef.versionId for preset')
      return {
        docId: docId.toString('hex'),
        versionId: getVersionId(versionId),
      }
    }),
    iconRef,
  }
}

export const convertRole: ConvertFunction<'role'> = (message, versionObj) => {
  const { common, schemaVersion, fromIndex, roleId, ...rest } = message
  ensure(roleId.length, 'role', 'roleId')
  ensure(typeof fromIndex === 'number', 'role', 'fromIndex')
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    roleId: roleId.toString('hex'),
    fromIndex,
  }
}

export const convertDeviceInfo: ConvertFunction<'deviceInfo'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, name, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    name,
  }
}

export const convertCoreOwnership: ConvertFunction<'coreOwnership'> = (
  message,
  versionObj
) => {
  const {
    common,
    schemaVersion,
    authCoreId,
    configCoreId,
    dataCoreId,
    blobCoreId,
    blobIndexCoreId,
    coreSignatures,
    ...rest
  } = message
  ensure(coreSignatures, 'coreOwnership', 'coreSignatures')
  ensure(authCoreId.byteLength, 'coreOwnership', 'authCoreId')
  ensure(configCoreId.byteLength, 'coreOwnership', 'configCoreId')
  ensure(dataCoreId.byteLength, 'coreOwnership', 'dataCoreId')
  ensure(blobCoreId.byteLength, 'coreOwnership', 'blobCoreId')
  ensure(blobIndexCoreId.byteLength, 'coreOwnership', 'blobIndexCoreId')
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    authCoreId: authCoreId.toString('hex'),
    configCoreId: configCoreId.toString('hex'),
    dataCoreId: dataCoreId.toString('hex'),
    blobCoreId: blobCoreId.toString('hex'),
    blobIndexCoreId: blobIndexCoreId.toString('hex'),
    coreSignatures,
  }
}

export const convertIcon: ConvertFunction<'icon'> = (message, versionObj) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)

  const variants: Icon['variants'] = []
  for (const variant of message.variants) {
    try {
      const converted = convertIconVariant(variant)
      variants.push(converted)
    } catch (_err) {
      // TODO: Log something here.
    }
  }

  return { ...jsonSchemaCommon, ...rest, variants }
}

export const convertTranslation: ConvertFunction<'translation'> = (
  message,
  versionObj
) => {
  const {
    common,
    schemaVersion,
    propertyRef,
    languageCode,
    regionCode,
    ...rest
  } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  ensure(message.docRef, 'translation', 'docRef')
  ensure(message.docRef.versionId, 'translation.docRef', 'versionId')
  ensure(propertyRef, 'translation', 'propertyRef')
  ensure(languageCode, 'translation', 'languageCode')
  return {
    ...jsonSchemaCommon,
    ...rest,
    propertyRef,
    languageCode,
    regionCode,
    docRef: {
      docId: message.docRef.docId.toString('hex'),
      versionId: getVersionId(message.docRef.versionId),
    },
  }
}

export const convertTrack: ConvertFunction<'track'> = (message, versionObj) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  const locations = message.locations.map(convertTrackPosition)

  const observationRefs: Track['observationRefs'] = []
  for (const { docId, versionId } of message.observationRefs) {
    try {
      ensure(versionId, 'track.observationRefs[]', 'versionId')
      observationRefs.push({
        docId: docId.toString('hex'),
        versionId: getVersionId(versionId),
      })
    } catch (_err) {
      // TODO: Log something here.
    }
  }

  return {
    ...jsonSchemaCommon,
    ...rest,
    observationRefs,
    locations,
    tags: convertTags(message.tags),
  }
}

export const convertRemoteDetectionAlert: ConvertFunction<
  'remoteDetectionAlert'
> = (message, versionObj) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  if (!rest.detectionDateStart) {
    throw new Error('missing required detectionDateStart')
  }
  if (!rest.detectionDateEnd) {
    throw new Error('missing required detectionDateEnd')
  }
  if (!rest.geometry) {
    throw new Error('missing required geometry')
  }
  return {
    ...jsonSchemaCommon,
    ...rest,
    detectionDateStart: rest.detectionDateStart,
    detectionDateEnd: rest.detectionDateEnd,
    metadata: convertTags(rest.metadata),
    geometry: rest.geometry,
  }
}

function convertIconVariant(
  variant: Icon_1_IconVariant
): Icon['variants'][number] {
  switch (variant.variant?.$case) {
    case 'pngIcon': {
      const { pixelDensity } = variant.variant.pngIcon
      ensure(
        pixelDensity !== 'pixel_density_unspecified',
        'icon.variants[].pngIcon',
        'pixelDensity'
      )
      return convertIconVariantPng({ ...variant, pixelDensity })
    }
    case 'svgIcon':
      return convertIconVariantSvg(variant)
    case undefined:
      throw new Error('Cannot decode this icon variant')
    default:
      throw new ExhaustivenessError(variant.variant)
  }
}

function convertIconVariantPng(
  variant: Icon_1_IconVariant & {
    pixelDensity: Icon_1_IconVariantPng_PixelDensity
  }
): Icon['variants'][number] {
  const { blobVersionId, size, pixelDensity } = variant
  ensure(blobVersionId, 'icon.variants[]', 'blobVersionId')
  return {
    blobVersionId: getVersionId(blobVersionId),
    mimeType: 'image/png' as const,
    size: size === 'UNRECOGNIZED' ? 'medium' : size,
    pixelDensity: convertIconPixelDensity(pixelDensity),
  }
}

function convertIconVariantSvg(
  variant: Icon_1_IconVariant
): Icon['variants'][number] {
  const { blobVersionId, size } = variant
  ensure(blobVersionId, 'icon.variants[]', 'blobVersionId')
  return {
    blobVersionId: getVersionId(blobVersionId),
    mimeType: 'image/svg+xml' as const,
    size: size === 'UNRECOGNIZED' ? 'medium' : size,
  }
}

function convertIconPixelDensity(
  pixelDensity: Icon_1_IconVariantPng_PixelDensity
): 1 | 2 | 3 {
  switch (pixelDensity) {
    case 'x1':
      return 1
    case 'x2':
      return 2
    case 'x3':
      return 3
    default:
      return 1
  }
}

function convertTags(tags: { [key: string]: TagValue_1 } | undefined): {
  [key: string]: Exclude<JsonTagValue, undefined>
} {
  if (!tags) return {}
  return Object.keys(tags).reduce<{
    [key: string]: Exclude<JsonTagValue, undefined>
  }>((acc, key) => {
    // Ignore (filter out) undefined entries in an array
    const convertedValue = tags[key] && convertTagValue(tags[key])
    if (typeof convertedValue !== 'undefined') {
      acc[key] = convertedValue
    }
    return acc
  }, {})
}

function convertTagValue({ kind }: TagValue_1): JsonTagValue {
  switch (kind?.$case) {
    case 'list_value':
      return kind.list_value.list_value.reduce<
        Exclude<TagValuePrimitive, undefined>[]
      >((acc, value) => {
        const convertedValue = convertTagPrimitive(value)
        if (typeof convertedValue !== 'undefined') {
          acc.push(convertedValue)
        }
        return acc
      }, [])
    case 'primitive_value':
      return convertTagPrimitive(kind.primitive_value)
    case undefined:
      return undefined
    default:
      throw new ExhaustivenessError(kind)
  }
}

function convertTagPrimitive({
  kind,
}: TagValue_1_PrimitiveValue): TagValuePrimitive {
  switch (kind?.$case) {
    case 'null_value':
      return null
    case 'boolean_value':
      return kind.boolean_value
    case 'number_value':
      return kind.number_value
    case 'string_value':
      return kind.string_value
    case undefined:
      return undefined
    default:
      throw new ExhaustivenessError(kind)
  }
}

function convertCommon(
  common: ProtoTypesWithSchemaInfo['common'],
  versionObj: VersionIdObject
): Omit<MapeoCommon, 'schemaName'> {
  if (
    !common ||
    !common.docId.byteLength ||
    !common.createdAt ||
    !common.updatedAt
  ) {
    throw new Error('Missing required common properties')
  }

  const versionId = getVersionId(versionObj)

  /** @type {string} */ let originalVersionId
  if (common.originalVersionId) {
    originalVersionId = getVersionId(common.originalVersionId)
  } else if (common.links.length === 0) {
    originalVersionId = versionId
  } else {
    throw new Error('Cannot determine original version ID; data is malformed')
  }

  return {
    docId: common.docId.toString('hex'),
    versionId,
    originalVersionId,
    links: common.links.map((link) => getVersionId(link)),
    createdAt: common.createdAt,
    updatedAt: common.updatedAt,
    deleted: common.deleted,
  }
}

function convertAttachment({
  driveDiscoveryId,
  name,
  type,
  hash,
}: Observation_1_Attachment): Observation['attachments'][number] {
  ensure(
    driveDiscoveryId.byteLength,
    'observation.attachments[]',
    'driveDiscoveryId'
  )
  ensure(name, 'observation.attachments[]', 'name')
  return {
    driveDiscoveryId: driveDiscoveryId.toString('hex'),
    name,
    type,
    hash: hash.toString('hex'),
  }
}

function convertTrackPosition(
  position: Track_1_Position
): Track['locations'][number] {
  const { timestamp, coords, ...rest } = position
  ensure(timestamp, 'track.locations.position[]', 'timestamp')
  ensure(coords, 'track.locations.position[]', 'coords')
  return { coords, timestamp, ...rest }
}

/**
 * Because of the way protobuf works, it's possible that a protobuf message is
 * missing required fields. In this case `timestamp` and the `latitude` and
 * `longitude` fields on `coords`. We shouldn't have any observations with these
 * fields missing, but if we do, rather than throwing (and not indexing the
 * observation at all), we remove the position metadata, since it is not useful
 * without this metadata.
 */
function removeInvalidPositionMetadata(
  metadata: Observation_1_Metadata
): Observation['metadata'] {
  const { position, lastSavedPosition, ...rest } = metadata
  return {
    ...rest,
    position: position && removeInvalidPosition(position),
    lastSavedPosition:
      lastSavedPosition && removeInvalidPosition(lastSavedPosition),
  }
}

function removeInvalidPosition(
  position: Observation_1_Metadata_Position
): Position | undefined {
  if (position.coords === undefined || position.timestamp === undefined) {
    return undefined
  }
  return position as Position
}
