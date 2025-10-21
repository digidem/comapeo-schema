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
    '/** Common properties for all Comapeo docs */',
    'export type ComapeoCommon = Simplify<_Common>',
    '/** @deprecated Use ComapeoCommon instead */',
    'export type MapeoCommon = ComapeoCommon',
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

  indexLines.push(
    '',
    '/** @deprecated Use ComapeoDoc instead */',
    'export type MapeoDoc = ComapeoDoc',
    'type AllComapeoDocs = '
  )

  for (const schemaName of Object.keys(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    const typeName = capitalize(schemaName)
    indexLines.push(`  | ${typeName}`)
  }

  indexLines.push(
    '',
    '/** All Comapeo doc types (schema names) */',
    'export type ComapeoDocType = AllComapeoDocs["schemaName"]',
    '',
    '/** Output CoMapeo doc types. Union of all types, or pass a TDocType to filter a specific doc type */',
    'export type ComapeoDoc<TDocType extends ComapeoDocType = ComapeoDocType> = ',
    '  Extract<AllComapeoDocs, { schemaName: TDocType }>'
  )

  indexLines.push(
    '',
    '/** @deprecated Use ComapeoValue instead */',
    'export type MapeoValue = ComapeoValue',
    'type AllComapeoValues = '
  )

  for (const schemaName of Object.keys(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    const typeName = getValueName(schemaName)
    indexLines.push(`  | ${typeName}`)
  }

  indexLines.push(
    '',
    '/** Input CoMapeo doc types. Union of all types, or pass a TDocType to filter a specific doc type */',
    'export type ComapeoValue<TDocType extends ComapeoDocType = ComapeoDocType> = ',
    '  Extract<AllComapeoValues, { schemaName: TDocType }>',
    ''
  )

  typescriptDefs.index = indexLines.join('\n') + '\n'

  return typescriptDefs
}

/** @param {string} schemaName */
function getValueName(schemaName) {
  return schemaName === 'common'
    ? 'ComapeoCommon'
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
