// @ts-check
/**
 * Validate the JSON schema matches certain app-secific criteria we have. Currently:
 *
 * - top-level properties cannot be null or nullable
 *
 * @param {import('json-schema').JSONSchema7} schema
 */
export function validateJsonSchema(schema) {
  if (typeof schema.properties !== 'object') {
    throw new Error('Schema must be an object')
  }
  for (const value of Object.values(schema.properties)) {
    validateValueNotNullable(value)
  }
}

/**
 * @param {import('json-schema').JSONSchema7Definition} value
 */
function validateValueNotNullable(value) {
  if (typeof value === 'boolean') {
    throw new Error('top-level properties cannot be booleans')
  }
  if (
    value.type === 'null' ||
    (Array.isArray(value.type) && value.type.includes('null')) ||
    value.const === null ||
    (Array.isArray(value.enum) && value.enum.includes(null))
  ) {
    throw new Error('top-level properties cannot be of type null')
  }
  for (const xof of /** @type {const} */ (['oneOf', 'allOf', 'anyOf'])) {
    const subValues = value[xof]
    if (Array.isArray(subValues)) {
      for (const subValue of subValues) {
        validateValueNotNullable(subValue)
      }
    }
  }
}
