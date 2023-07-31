// @ts-check
import { default as _ } from '@json-schema-tools/dereferencer'

// Dereferencer's exports are all wrong for ESM imports
/** @type {any} */
const JsonSchemaDereferencer =
  // @ts-ignore
  _.default

/** @typedef {import('../../src/types.js').SchemaName} SchemaName */
/** @typedef {import('json-schema').JSONSchema7} JSONSchema */

/**
 * Returns JSONSchema exports for docs and values
 *
 * @param {ReturnType<import('./read-json-schema.js').readJSONSchema>} jsonSchemas
 */
export async function generateJSONSchemaExports(jsonSchemas) {
  /** @type {Record<SchemaName, JSONSchema>} */
  const dereferencedDocSchemas = {}
  /** @type {Record<SchemaName, JSONSchema>} */
  const docSchemas = {}
  /** @type {Record<SchemaName, JSONSchema>} */
  const valueSchemas = {}

  for (const [schemaName, jsonSchema] of Object.entries(jsonSchemas.merged)) {
    docSchemas[schemaName] = jsonSchema
    const dereferencer = new JsonSchemaDereferencer(jsonSchema)
    dereferencedDocSchemas[schemaName] = await dereferencer.resolve()
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

export const docSchemas: SchemaRecord = ${printf(docSchemas)} as const

export const dereferencedDocSchemas = ${printf(dereferencedDocSchemas)} as const

export const valueSchemas: SchemaRecord = ${printf(valueSchemas)} as const
`
}

function printf(obj) {
  return JSON.stringify(obj, null, 2)
}
