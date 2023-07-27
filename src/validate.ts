import { MapeoValue, FilterBySchemaName, SchemaName } from './types.js'
import * as validations from './validations.js'

export function validate<
  TSchemaName extends Extract<keyof typeof validations, SchemaName>
>(
  schemaName: TSchemaName,
  obj: unknown
): obj is FilterBySchemaName<MapeoValue, TSchemaName> {
  return validations[schemaName](obj)
}

let obj = JSON.parse('')

if (validate('observation', obj)) {
  obj.attachments
}
