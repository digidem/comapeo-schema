import { CurrentProtoTypes } from '../../types/proto/types'
import {
  JsonSchemaTypes,
  ProtoTypesWithSchemaInfo,
  SchemaName,
  JsonSchemaCommon,
  TagValuePrimitive,
  JsonTagValue,
} from '../types'
import { hexStringToCoreVersion } from '../../utils'
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
  return mapeoDoc as any
}
export const convertField: ConvertFunction<'field'> = (mapeoDoc) => {
  return mapeoDoc as any
}
export const convertObservation: ConvertFunction<'observation'> = (
  mapeoDoc
) => {
  // I can name this return with a variable of type of
  // CurrentProtoTypes['observation']
  return {
    common: convertCommon(mapeoDoc),
    refs: mapeoDoc.refs
      ? mapeoDoc.refs.map((ref) => {
          return { id: Buffer.from(ref.id, 'hex') }
        })
      : [],
    attachments: mapeoDoc.attachments
      ? mapeoDoc.attachments.map((attachment) => {
          return {
            driveId: Buffer.from(attachment.driveId, 'hex'),
            name: attachment.name,
            type: attachment.type,
          }
        })
      : [],
    tags: {},
    // tags: Object.keys(mapeoDoc.tags).map(k => { })
  }
}

function convertCommon(
  common: JsonSchemaCommon
): ProtoTypesWithSchemaInfo['common'] {
  return {
    id: Buffer.from(common.id, 'hex'),
    createdAt: common.createdAt,
    updatedAt: common.updatedAt,
    links: common.links.map(hexStringToCoreVersion),
  }
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
