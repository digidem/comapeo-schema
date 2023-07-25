import { CurrentProtoTypes } from '../../types/proto/types'
import { JsonSchemaTypes, SchemaName } from '../types'

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
  return mapeoDoc as any
}
