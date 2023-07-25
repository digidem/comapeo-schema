import { CurrentProtoTypes } from '../../types/proto/types'
import { JsonSchemaTypes, SchemaName } from '../types'
import { hexStringToCoreVersion } from '../../utils'
import { TagValue_1_ListValue } from '../../types/proto/tags/v1'

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
    common: {
      id:Buffer.from(mapeoDoc.id,'hex'),
      createdAt:mapeoDoc.createdAt,
      updatedAt: mapeoDoc.updatedAt,
      links: mapeoDoc.links.map(hexStringToCoreVersion)
    },
    refs:mapeoDoc.refs
      ? mapeoDoc.refs.map((ref) => { return {id: Buffer.from(ref.id, 'hex')}})
      : [],
    attachments: mapeoDoc.attachments
    ? mapeoDoc.attachments.map((attachment) => {
      return {
        driveId: Buffer.from(attachment.driveId, 'hex'),
        name: attachment.name,
        type: attachment.type
      }
    })
    : [],
    tags: {}
    // tags: Object.keys(mapeoDoc.tags).map(k => { })
  }
}
