// @ts-check
import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone/index.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const GeometryJSONSchema = require('@comapeo/geometry/json/geometry.json')

const ucs2lengthCode = 'require("ajv/dist/runtime/ucs2length").default'

/**
 * Returns generated code for validation functions
 *
 * @param {ReturnType<import('./parse-config.js').parseConfig>} config
 * @param {ReturnType<import('./read-json-schema.js').readJSONSchema>} jsonSchemas
 */
export function generateValidations(config, jsonSchemas) {
  const schemas = Object.entries(jsonSchemas.values)

  const schemaExports = schemas.reduce((acc, [schemaName, jsonSchema]) => {
    if (!jsonSchema['$id']) throw new Error(`Missing $id prop on ${schemaName}`)
    acc[schemaName] = jsonSchema['$id']
    return acc
  }, /** @type {Record<string, string>} */ ({}))

  // compile schemas
  const ajv = new Ajv({
    schemas: schemas.map(([, jsonSchema]) => jsonSchema),
    code: { source: true, esm: true },
    formats: { 'date-time': true },
  })
  ajv.addKeyword('meta:enum').addSchema(GeometryJSONSchema)

  // generate validation code
  return [
    '// @ts-nocheck',
    // AJV has [a bug when generating ESM code][0]: it includes `require` in the
    // output. We should be able to remove this once the bug is fixed.
    // [0]: https://github.com/ajv-validator/ajv/issues/2209
    "import ucs2length from './lib/ucs2length.js';",
    standaloneCode(ajv, schemaExports).replace(ucs2lengthCode, 'ucs2length'),
  ].join('\n')
}
