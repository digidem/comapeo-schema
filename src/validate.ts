import { MapeoValue, FilterBySchemaName, SchemaName } from './types.js'
import * as validations from './validations.js'
import { getOwn } from './lib/utils.js'
import {
  type ValidateFunction as AjvValidateFunction,
  type DefinedError,
} from 'ajv'

interface ValidateFunction {
  <TSchemaName extends Extract<keyof typeof validations, SchemaName>>(
    schemaName: TSchemaName,
    obj: unknown
  ): obj is FilterBySchemaName<MapeoValue, TSchemaName>
  errors: null | DefinedError[]
}

const validate: ValidateFunction = <
  TSchemaName extends Extract<keyof typeof validations, SchemaName>,
>(
  schemaName: TSchemaName,
  obj: unknown
): obj is FilterBySchemaName<MapeoValue, TSchemaName> => {
  validate.errors = null

  const validateSchema = getOwn(validations, schemaName) as
    | undefined
    | AjvValidateFunction
  if (!validateSchema) {
    return false
  }

  const result = validateSchema(obj)
  validate.errors = validateSchema.errors as DefinedError[]
  return result
}
validate.errors = null

export { validate }
