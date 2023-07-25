import { CurrentProtoTypes, Observation_5 } from '../../types/proto/types'
import {
  JsonSchemaTypes,
  ProtoTypesWithSchemaInfo,
  SchemaName,
  JsonSchemaCommon,
  TagValuePrimitive,
  JsonTagValue,
  VersionObj,
} from '../types'
import {
  TagValue_1,
  type TagValue_1_ListValue,
  type TagValue_1_PrimitiveValue,
} from '../../types/proto/tags/v1'

/** Function type for converting a protobuf type of any version for a particular
 * schema name, and returning the most recent JSONSchema type */
type ConvertFunction<TSchemaName extends SchemaName> = (
  mapeoDoc: Extract<JsonSchemaTypes, { schemaName: TSchemaName }>
) => CurrentProtoTypes[TSchemaName]

export const convertProject: ConvertFunction<'project'> = (mapeoDoc) => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
  }
}

export const convertField: ConvertFunction<'field'> = (mapeoDoc) => {
  return {
    common: convertCommon(mapeoDoc),
    // Spread to ensure that we do not miss any fields (otherwise optional
    // fields on the protoObj that exist on mapeoDoc will be missed)
    ...mapeoDoc,
    // Set defaults for optional fields
    appearance: mapeoDoc.appearance || 'multiline',
    snakeCase: mapeoDoc.snakeCase || false,
    universal: mapeoDoc.universal || false,
    options: mapeoDoc.options
      ? mapeoDoc.options.map((opt) => {
          return {
            label: opt.label,
            value: convertTagPrimitive(opt.value),
          }
        })
      : [],
  }
}

export const convertPreset: ConvertFunction<'preset'> = (mapeoDoc) => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    tags: convertTags(mapeoDoc.tags),
    addTags: convertTags(mapeoDoc.addTags),
    removeTags: convertTags(mapeoDoc.removeTags),
    fieldIds: mapeoDoc.fields.map((field) => Buffer.from(field, 'hex')),
    iconId: mapeoDoc.icon ? Buffer.from(mapeoDoc.icon, 'hex') : undefined,
  }
}

export const convertObservation: ConvertFunction<'observation'> = (
  mapeoDoc
) => {
  const refs = mapeoDoc.refs.map((ref) => {
    return { id: Buffer.from(ref.id, 'hex') }
  })
  const attachments = mapeoDoc.attachments.map((attachment) => {
    return {
      driveId: Buffer.from(attachment.driveId, 'hex'),
      name: attachment.name,
      type: attachment.type,
    }
  })

  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    refs,
    attachments,
    tags: convertTags(mapeoDoc.tags),
  }
}

function convertCommon(
  common: JsonSchemaCommon
): ProtoTypesWithSchemaInfo['common'] {
  return {
    id: Buffer.from(common.id, 'hex'),
    createdAt: common.createdAt,
    updatedAt: common.updatedAt,
    links: common.links.map((link) => versionStringToObj(link)),
  }
}

function convertTags(tags: {
  [key: string]: Exclude<JsonTagValue, undefined>
}): {
  [key: string]: TagValue_1
} {
  return Object.keys(tags).reduce(
    (acc: { [key: string]: TagValue_1 }, k: string) => {
      return {
        [k]: convertTagValue(tags[k]),
      }
    },
    {}
  )
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
      const _exhaustiveCheck: never = tagPrimitive
  }
  return { kind }
}

/**
 * Turn a hex-encoded version string to a version objected with the coreId and index (seq)
 */
function versionStringToObj(hexStr: string): VersionObj {
  const [id, seq] = hexStr.split('/')
  return { coreId: Buffer.from(id, 'hex'), seq: Number(seq) }
}
