import type { SetOptional } from 'type-fest'
import { CurrentProtoTypes } from '../proto/types.js'
import {
  ProtoTypesWithSchemaInfo,
  SchemaName,
  MapeoCommon,
  TagValuePrimitive,
  JsonTagValue,
  CoreOwnershipSignatures,
  MapeoDocEncode,
} from '../types.js'
import { TagValue_1, type TagValue_1_PrimitiveValue } from '../proto/tags/v1.js'
import { Icon } from '../schema/icon.js'
import { type Icon_1_IconVariant } from '../proto/icon/v1.js'
import { type Observation_1_Attachment } from '../proto/observation/v1.js'
import { ExhaustivenessError, parseVersionId } from './utils.js'
import { CoreOwnership, valueSchemas, type Observation } from '../index.js'

/** Function type for converting a protobuf type of any version for a particular
 * schema name, and returning the most recent JSONSchema type */
type ConvertFunction<TSchemaName extends SchemaName> = (
  mapeoDoc: Extract<MapeoDocEncode, { schemaName: TSchemaName }>
) => CurrentProtoTypes[TSchemaName]

export const convertProjectSettings: ConvertFunction<'projectSettings'> = (
  mapeoDoc
) => {
  const { defaultPresets } = mapeoDoc
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    defaultPresets: defaultPresets
      ? {
          point: defaultPresets.point.map((p) => Buffer.from(p, 'hex')),
          area: defaultPresets.area.map((a) => Buffer.from(a, 'hex')),
          vertex: defaultPresets.vertex.map((v) => Buffer.from(v, 'hex')),
          line: defaultPresets.line.map((l) => Buffer.from(l, 'hex')),
          relation: defaultPresets.relation.map((r) => Buffer.from(r, 'hex')),
        }
      : undefined,
  }
}

export const convertField: ConvertFunction<'field'> = (mapeoDoc) => {
  return {
    common: convertCommon(mapeoDoc),
    // Spread to ensure that we do not miss any fields (otherwise optional
    // fields on the protoObj that exist on mapeoDoc will be missed)
    ...mapeoDoc,
    // Set defaults for optional fields
    options: mapeoDoc.options
      ? mapeoDoc.options.map((opt) => {
          return {
            label: opt.label,
            value: convertTagPrimitive(opt.value),
          }
        })
      : [],
    universal: Boolean(mapeoDoc.universal),
  }
}

export const convertPreset: ConvertFunction<'preset'> = (mapeoDoc) => {
  const colorRegex = RegExp(valueSchemas.preset.properties.color.pattern)
  if (mapeoDoc.color && !colorRegex.test(mapeoDoc.color)) {
    throw new Error(`invalid color string ${mapeoDoc.color}`)
  }

  let iconRef
  if (mapeoDoc.iconRef) {
    iconRef = {
      docId: Buffer.from(mapeoDoc.iconRef.docId, 'hex'),
      versionId: parseVersionId(mapeoDoc.iconRef.versionId),
    }
  }

  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    tags: convertTags(mapeoDoc.tags),
    addTags: convertTags(mapeoDoc.addTags),
    removeTags: convertTags(mapeoDoc.removeTags),
    fieldRefs: mapeoDoc.fieldRefs.map(({ docId, versionId }) => ({
      docId: Buffer.from(docId, 'hex'),
      versionId: parseVersionId(versionId),
    })),
    iconRef,
  }
}

export const convertObservation: ConvertFunction<'observation'> = (
  mapeoDoc
) => {
  const attachments = mapeoDoc.attachments.map(convertAttachment)
  let presetRef
  if (mapeoDoc.presetRef) {
    presetRef = {
      docId: Buffer.from(mapeoDoc.presetRef.docId, 'hex'),
      versionId: parseVersionId(mapeoDoc.presetRef.versionId),
    }
  }

  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    attachments,
    tags: convertTags(mapeoDoc.tags),
    presetRef,
  }
}

export const convertRole: ConvertFunction<'role'> = (mapeoDoc) => {
  const roleId = Buffer.from(mapeoDoc.roleId, 'hex')
  if (roleId.length === 0) {
    throw new Error('Invalid roleId')
  }
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    roleId: Buffer.from(mapeoDoc.roleId, 'hex'),
  }
}

export const convertDeviceInfo: ConvertFunction<'deviceInfo'> = (mapeoDoc) => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
  }
}

export const convertCoreOwnership = (
  mapeoDoc: Omit<CoreOwnership, 'versionId' | 'originalVersionId'> &
    CoreOwnershipSignatures
): CurrentProtoTypes['coreOwnership'] => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    authCoreId: Buffer.from(mapeoDoc.authCoreId, 'hex'),
    configCoreId: Buffer.from(mapeoDoc.configCoreId, 'hex'),
    dataCoreId: Buffer.from(mapeoDoc.dataCoreId, 'hex'),
    blobCoreId: Buffer.from(mapeoDoc.blobCoreId, 'hex'),
    blobIndexCoreId: Buffer.from(mapeoDoc.blobIndexCoreId, 'hex'),
  }
}

export const convertIcon: ConvertFunction<'icon'> = (mapeoDoc) => {
  const { variants, ...rest } = mapeoDoc
  return {
    common: convertCommon(mapeoDoc),
    ...rest,
    variants: convertIconVariants(variants),
  }
}

function convertIconVariants(variants: Icon['variants']): Icon_1_IconVariant[] {
  return variants.map((variant) => {
    const { size, blobVersionId } = variant
    switch (variant.mimeType) {
      case 'image/png':
        return {
          variant: {
            $case: 'pngIcon',
            pngIcon: {
              pixelDensity: convertIconPixelDensity(variant.pixelDensity),
            },
          },
          size,
          blobVersionId: parseVersionId(blobVersionId),
        }
      case 'image/svg+xml':
        return {
          variant: {
            $case: 'svgIcon',
            svgIcon: {},
          },
          size,
          blobVersionId: parseVersionId(blobVersionId),
        }
      default:
        throw new ExhaustivenessError(variant)
    }
  })
}

function convertIconPixelDensity(pixelDensity: 1 | 2 | 3) {
  switch (pixelDensity) {
    case 1:
      return 'x1'
    case 2:
      return 'x2'
    case 3:
      return 'x3'
  }
}

export const convertTranslation: ConvertFunction<'translation'> = (
  mapeoDoc
) => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    docRef: {
      docId: Buffer.from(mapeoDoc.docRef.docId, 'hex'),
      versionId: parseVersionId(mapeoDoc.docRef.versionId),
    },
  }
}

export const convertTrack: ConvertFunction<'track'> = (mapeoDoc) => {
  const observationRefs = mapeoDoc.observationRefs.map(
    ({ docId, versionId }) => {
      return {
        docId: Buffer.from(docId, 'hex'),
        versionId: parseVersionId(versionId),
      }
    }
  )

  const track: CurrentProtoTypes['track'] = {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    observationRefs,
    tags: convertTags(mapeoDoc.tags),
    locations: mapeoDoc.locations,
  }
  return track
}

function convertCommon(
  common: SetOptional<MapeoCommon, 'versionId' | 'originalVersionId'>
): ProtoTypesWithSchemaInfo['common'] {
  return {
    docId: Buffer.from(common.docId, 'hex'),
    originalVersionId: common.originalVersionId
      ? parseVersionId(common.originalVersionId)
      : undefined,
    createdAt: common.createdAt,
    updatedAt: common.updatedAt,
    links: common.links.map((link) => parseVersionId(link)),
    deleted: common.deleted,
  }
}

function convertTags(tags: {
  [key: string]: Exclude<JsonTagValue, undefined>
}): {
  [key: string]: TagValue_1
} {
  return Object.keys(tags).reduce<{ [key: string]: TagValue_1 }>((acc, k) => {
    acc[k] = convertTagValue(tags[k])
    return acc
  }, {})
}

function convertTagValue(tagValue: JsonTagValue): TagValue_1 {
  let kind: TagValue_1['kind']
  if (Array.isArray(tagValue)) {
    kind = {
      $case: 'list_value',
      list_value: {
        list_value: tagValue
          .filter((v) => typeof v !== 'undefined')
          .map((v) => convertTagPrimitive(v)),
      },
    }
  } else {
    kind = {
      $case: 'primitive_value',
      primitive_value: convertTagPrimitive(tagValue),
    }
  }
  return { kind }
}

function convertTagPrimitive(
  tagPrimitive: TagValuePrimitive
): TagValue_1_PrimitiveValue {
  let kind: TagValue_1_PrimitiveValue['kind']
  switch (typeof tagPrimitive) {
    case 'boolean':
      kind = {
        $case: 'boolean_value',
        boolean_value: tagPrimitive,
      }
      break
    case 'string':
      kind = {
        $case: 'string_value',
        string_value: tagPrimitive,
      }
      break
    case 'number':
      kind = {
        $case: 'number_value',
        number_value: tagPrimitive,
      }
      break
    case 'undefined':
      kind = undefined
      break
    case 'object': // null
      kind = {
        $case: 'null_value',
        null_value: 'NULL_VALUE',
      }
      break
    default:
      throw new ExhaustivenessError(tagPrimitive)
  }
  return { kind }
}

function convertAttachment(
  attachment: Observation['attachments'][number]
): Observation_1_Attachment {
  return {
    driveDiscoveryId: Buffer.from(attachment.driveDiscoveryId, 'hex'),
    name: attachment.name,
    type: attachment.type,
    hash: Buffer.from(attachment.hash, 'hex'),
  }
}
