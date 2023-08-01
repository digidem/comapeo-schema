import * as validations from './validations.js'

export function validate(schemaName: keyof typeof validations, obj: unknown) {
  return validations[schemaName](obj)
}
