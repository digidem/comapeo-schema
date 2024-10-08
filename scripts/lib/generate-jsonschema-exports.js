// @ts-check
import { default as _ } from '@json-schema-tools/dereferencer'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const GeometryJSONSchema = require('@comapeo/geometry/json/geometry.json')

// Dereferencer's exports are all wrong for ESM imports
/** @type {any} */
const JsonSchemaDereferencer =
  // @ts-expect-error
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
    const dereferencer = new JsonSchemaDereferencer(
      // Need to create a deep clone to avoid issue described in https://github.com/digidem/mapeo-schema/issues/109
      JSON.parse(JSON.stringify(jsonSchema)),
      {
        mutate: false,
        refCache: {
          [GeometryJSONSchema.$id]: GeometryJSONSchema,
        },
      }
    )
    dereferencedDocSchemas[schemaName] = await dereferencer.resolve()
  }

  for (const [schemaName, jsonSchema] of Object.entries(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    valueSchemas[schemaName] = jsonSchema
  }

  return `import { type JSONSchema7 } from 'json-schema'
import { type SchemaNameAll } from './types.js'
import { type ReadonlyDeep } from 'type-fest'

declare module 'json-schema' {
  interface JSONSchema7 {
    'meta:enum'?: Record<string, string> | undefined
  }
}

type SchemaRecord = Record<SchemaNameAll, ReadonlyDeep<JSONSchema7>>

export const docSchemas = ${printf(docSchemas)} as const satisfies SchemaRecord

export const dereferencedDocSchemas = ${printf(
    dereferencedDocSchemas
  )} as const satisfies SchemaRecord

export const valueSchemas = ${printf(
    valueSchemas
  )} as const satisfies SchemaRecord
`
}

function printf(obj) {
  return JSON.stringify(obj, null, 2)
}
