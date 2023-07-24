// @ts-check
import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone/index.js'

/**
 * Returns generated code for validation functions
 *
 * @param {ReturnType<import('./parse-config').parseConfig>} config
 * @param {Record<string, import('json-schema').JSONSchema7>} jsonSchemas
 */
export function generateValidations(config, jsonSchemas) {
  const schemas = Object.entries(jsonSchemas)

  const schemaExports = schemas.reduce((acc, [schemaName, jsonSchema]) => {
    acc[schemaName] = jsonSchema['$id']
    return acc
  }, {})

  // compile schemas
  const ajv = new Ajv({
    schemas: schemas.map(([, jsonSchema]) => jsonSchema),
    code: { source: true, esm: true },
    formats: { 'date-time': true },
  })
  ajv.addKeyword('meta:enum')

  // generate validation code
  return standaloneCode(ajv, schemaExports)
}
