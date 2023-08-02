// This file exports a function for converting each supported schema type (all
// known versions) to the latest JSONSchema type
import {
  type TagValue_1,
  type TagValue_1_PrimitiveValue,
} from '../proto/tags/v1.js'
import {
  type MapeoDoc,
  type ProtoTypesWithSchemaInfo,
  type VersionObj,
  type SchemaName,
  type FilterBySchemaName,
  type MapeoCommon,
  type TagValuePrimitive,
  type JsonTagValue,
} from '../types.js'

/** Function type for converting a protobuf type of any version for a particular
 * schema name, and returning the most recent JSONSchema type */
type ConvertFunction<TSchemaName extends SchemaName> = (
  message: Extract<ProtoTypesWithSchemaInfo, { schemaName: TSchemaName }>,
  versionObj: VersionObj
) => FilterBySchemaName<MapeoDoc, TSchemaName>

export const convertProject: ConvertFunction<'project'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    defaultPresets: message.defaultPresets || {}
  }
}

export const convertObservation: ConvertFunction<'observation'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)

  return {
    ...jsonSchemaCommon,
    ...rest,
    refs: message.refs?.map(({ id }) => ({ id: id.toString('hex') })),
    attachments: message.attachments?.map(({ driveId, name, type }) => {
      return { driveId: driveId.toString('hex'), name, type }
    }),
    tags: convertTags(message.tags),
    metadata: message.metadata || {},
  }
}

type FieldOptions = FilterBySchemaName<MapeoDoc, 'field'>['options']

export const convertField: ConvertFunction<'field'> = (message, versionObj) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  if (!message.tagKey) {
    // We can't do anything with a field without a tag key, so we ignore these
    throw new Error('Missing tagKey on field')
  } else {
    return {
      ...jsonSchemaCommon,
      ...rest,
      type: message.type == 'UNRECOGNIZED' ? 'text' : message.type,
      tagKey: message.tagKey,
      label: message.label || message.tagKey,
      appearance:
        message.appearance === 'UNRECOGNIZED'
          ? 'multiline'
          : message.appearance,
      options: message.options.reduce<Exclude<FieldOptions, undefined>>(
        (acc, { label, value }) => {
          // Filter out any options where value is undefined (this would still be valid protobuf, but not valid for our code)
          if (!value) return acc
          const convertedValue = convertTagPrimitive(value)
          if (typeof convertedValue === 'undefined') return acc
          acc.push({ label, value: convertedValue })
          return acc
        },
        []
      ),
    }
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

  return {
    ...jsonSchemaCommon,
    ...rest,
    geometry,
    tags: convertTags(rest.tags),
    addTags: convertTags(rest.addTags),
    removeTags: convertTags(rest.removeTags),
    fieldIds: rest.fieldIds.map((id) => id.toString('hex')),
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
  if (!kind) return undefined
  switch (kind.$case) {
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
    default:
      const _exhaustiveCheck: never = kind
      return kind
  }
}

function convertTagPrimitive({
  kind,
}: TagValue_1_PrimitiveValue): TagValuePrimitive {
  if (!kind) return undefined
  switch (kind.$case) {
    case 'null_value':
      return null
    case 'boolean_value':
      return kind.boolean_value
    case 'number_value':
      return kind.number_value
    case 'string_value':
      return kind.string_value
    default:
      const _exhaustiveCheck: never = kind
      return _exhaustiveCheck
  }
}

function convertCommon(
  common: ProtoTypesWithSchemaInfo['common'],
  versionObj: VersionObj
): Omit<MapeoCommon, 'schemaName'> {
  if (!common || !common.docId || !common.createdAt || !common.updatedAt) {
    throw new Error('Missing required common properties')
  }

  return {
    docId: common.docId.toString('hex'),
    versionId: versionObjToString(versionObj),
    links: common.links.map(versionObjToString),
    createdAt: common.createdAt,
    updatedAt: common.updatedAt,
  }
}

/**
 * Turn coreId and seq to a version string of ${hex-encoded coreId}/${seq}
 */
function versionObjToString({ coreId, seq }: VersionObj) {
  return `${coreId.toString('hex')}/${seq}`
}
