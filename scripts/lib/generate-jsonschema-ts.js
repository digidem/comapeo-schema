// @ts-check
import { compile } from 'json-schema-to-typescript'
import { capitalize } from './utils.js'

/**
 * Returns generated typescript definitions for JSONSchemas
 *
 * @param {ReturnType<import('./parse-config').parseConfig>} config
 * @param {Record<string, import('json-schema').JSONSchema7>} jsonSchemas
 */
export async function generateJSONSchemaTS(config, jsonSchemas) {
  /** @type {Record<string, string>} */
  const typescriptDefs = {}
  for (const [schemaName, jsonSchema] of Object.entries(jsonSchemas)) {
    // @ts-ignore
    const ts = await compile(jsonSchema, capitalize(schemaName), {
      additionalProperties: false,
    })
    typescriptDefs[schemaName] = ts
  }
  return typescriptDefs
}
