// @ts-check
import { compile } from 'json-schema-to-typescript'
import { capitalize } from './utils.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const GeometryJSONSchema = require('@comapeo/geometry/json/geometry.json')

/** @import { ResolverOptions, JSONSchema } from '@apidevtools/json-schema-ref-parser' */

/**
 * Returns generated typescript definitions for JSONSchemas
 *
 * @param {ReturnType<import('./parse-config.js').parseConfig>} config
 * @param {ReturnType<import('./read-json-schema.js').readJSONSchema>} jsonSchemas
 */
export async function generateJSONSchemaTS(config, jsonSchemas) {
  /** @type {Record<string, string>} */
  const typescriptDefs = {}
  for (const [schemaName, jsonSchema] of Object.entries(jsonSchemas.values)) {
    const ts = await compile(
      /**
       * This argument is a v7 JSON Schema but the function expects a v4 schema.
       * It should be fine, so we cast it to `any`.
       * @type {any}
       */ (jsonSchema),
      capitalize(schemaName),
      {
        additionalProperties: false,
        unknownAny: false,
        $refOptions: {
          resolve: {
            http: false,
            geometry: geometryResolver,
          },
        },
      }
    )
    typescriptDefs[schemaName] = ts
  }

  const indexLines = []

  for (const schemaName of Object.keys(jsonSchemas.values)) {
    const typeName = capitalize(schemaName)
    const asName = '_' + typeName

    indexLines.push(
      `import { type ${typeName} as ${asName} } from './${schemaName}.js'`
    )
  }

  indexLines.push(
    '',
    'export type MapeoCommon = Simplify<_Common>',
    '',
    'type Simplify<T> = {[KeyType in keyof T]: T[KeyType]} & {};',
    ''
  )

  for (const [schemaName, schema] of Object.entries(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    const typeName = capitalize(schemaName)
    const interfaceName = '_' + typeName
    const valueName = getValueName(schemaName)
    if (schema.description) indexLines.push(`/** ${schema.description} */`)
    indexLines.push(
      `export type ${typeName} = Simplify<${interfaceName} & _Common>`
    )
    if (schema.description) indexLines.push(`/** ${schema.description} */`)
    // Unwrap generated TS, from an interface to a type alias, for improved type
    // hints and to aide assignability see
    // https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts
    indexLines.push(`export type ${valueName} = Simplify<${interfaceName}>`)
  }

  indexLines.push('', 'export type MapeoDoc = ')

  for (const schemaName of Object.keys(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    const typeName = capitalize(schemaName)
    indexLines.push(`  | ${typeName}`)
  }

  indexLines.push('', 'export type MapeoValue = ')

  for (const schemaName of Object.keys(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    const typeName = getValueName(schemaName)
    indexLines.push(`  | ${typeName}`)
  }

  indexLines.push('')

  typescriptDefs.index = indexLines.join('\n') + '\n'

  return typescriptDefs
}

/** @param {string} schemaName */
function getValueName(schemaName) {
  return schemaName === 'common'
    ? 'MapeoCommon'
    : capitalize(schemaName) + 'Value'
}

/** @type {ResolverOptions<JSONSchema>} */
const geometryResolver = {
  order: 1,
  canRead(file) {
    return file.url === GeometryJSONSchema.$id
  },
  read() {
    return GeometryJSONSchema
  },
}
