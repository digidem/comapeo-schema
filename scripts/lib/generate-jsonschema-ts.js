// @ts-check
import { compile } from 'json-schema-to-typescript'
import { capitalize } from './utils.js'

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
    // @ts-ignore
    const ts = await compile(jsonSchema, capitalize(schemaName), {
      additionalProperties: false,
      unknownAny: false,
    })
    typescriptDefs[schemaName] = ts
  }

  const indexLines = []

  for (const schemaName of Object.keys(jsonSchemas.values)) {
    const typeName = capitalize(schemaName)
    const valueName = getValueName(schemaName)

    indexLines.push(
      `import { type ${typeName} as ${valueName} } from './${schemaName}.js'`
    )
  }

  indexLines.push(
    '',
    'type Simplify<T> = {[KeyType in keyof T]: T[KeyType]} & {};',
    ''
  )

  for (const [schemaName, schema] of Object.entries(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    const typeName = capitalize(schemaName)
    const valueName = getValueName(schemaName)
    if (schema.description) {
      indexLines.push(`/** ${schema.description} */`)
    }
    indexLines.push(
      `export type ${typeName} = Simplify<${valueName} & MapeoCommon>`
    )
  }

  indexLines.push('', 'export type MapeoDoc = ')

  for (const schemaName of Object.keys(jsonSchemas.values)) {
    if (schemaName === 'common') continue
    const typeName = capitalize(schemaName)
    indexLines.push(` |  ${typeName}`)
  }

  indexLines.push('')

  for (const schemaName of Object.keys(jsonSchemas.values)) {
    const typeName = getValueName(schemaName)
    indexLines.push(`export { ${typeName} }`)
  }

  typescriptDefs.index = indexLines.join('\n') + '\n'

  return typescriptDefs
}

/** @param {string} schemaName */
function getValueName(schemaName) {
  return schemaName === 'common'
    ? 'MapeoCommon'
    : capitalize(schemaName) + 'Value'
}
