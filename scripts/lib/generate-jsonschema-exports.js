// @ts-check

/**
 * Returns JSONSchema exports for docs and values
 *
 * @param {ReturnType<import('./read-json-schema.js').readJSONSchema>} jsonSchemas
 */
export function generateJSONSchemaExports(jsonSchemas) {
  /** @type {Record<import('../../src/types.js').SchemaName, import('json-schema').JSONSchema7>} */
  const docSchemas = {}
  /** @type {Record<import('../../src/types.js').SchemaName, import('json-schema').JSONSchema7>} */
  const valueSchemas = {}

  for (const [schemaName, jsonSchema] of Object.entries(jsonSchemas.merged)) {
    docSchemas[schemaName] = jsonSchema
  }

  for (const [schemaName, jsonSchema] of Object.entries(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    valueSchemas[schemaName] = jsonSchema
  }

  return `import { type JSONSchema7 } from 'json-schema'
import { type SchemaNameAll } from './types.js'

declare module 'json-schema' {
  interface JSONSchema7 {
    'meta:enum'?: Record<string, string> | undefined
  }
}

type SchemaRecord = Record<SchemaNameAll, JSONSchema7>

export const docSchemas: SchemaRecord = ${printf(docSchemas)}

export const valueSchemas: SchemaRecord = ${printf(valueSchemas)}
`
}

function printf(obj) {
  return JSON.stringify(obj, null, 2)
}
