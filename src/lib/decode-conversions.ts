// This file exports a function for converting each supported schema type (all
// known versions) to the latest JSONSchema type
import {
  type TagValue_1,
  type TagValue_1_PrimitiveValue,
} from '../../types/proto/tags/v1'
import {
  type JsonSchemaTypes,
  type ProtoTypesWithSchemaInfo,
  type VersionObj,
  type SchemaName,
  type FilterBySchemaName,
} from '../types'

/** The `tags` field supports only a subset of JSON values - we don't support nested tags, just primitives or arrays of primitives */
type TagValuePrimitive = number | string | boolean | null | undefined
type JsonTagValue =
  | TagValuePrimitive
  | Array<Exclude<TagValuePrimitive, undefined>>

/** Just the common (shared) props from JSON schema types */
type JsonSchemaCommon = Pick<JsonSchemaTypes, ProtoTypeCommonKeys | 'version'>

/** Union of keys from the common prop on Proto types */
type ProtoTypeCommonKeys = keyof Exclude<
  ProtoTypesWithSchemaInfo['common'],
  undefined
>

/** Function type for converting a protobuf type of any version for a particular
 * schema name, and returning the most recent JSONSchema type */
type ConvertFunction<TSchemaName extends SchemaName> = (
  message: Extract<ProtoTypesWithSchemaInfo, { schemaName: TSchemaName }>,
  versionObj: VersionObj
) => FilterBySchemaName<JsonSchemaTypes, TSchemaName>

export const convertProject: ConvertFunction<'project'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
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
  }
}

type FieldOptions = FilterBySchemaName<JsonSchemaTypes, 'field'>['options']

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
): JsonSchemaCommon {
  if (!common || !common.id || !common.createdAt || !common.updatedAt) {
    throw new Error('Missing required common properties')
  }

  return {
    id: common.id.toString('hex'),
    version: versionObjToString(versionObj),
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
