// @ts-check
/**
 * @param {ReturnType<import('./parse-config.js').parseConfig>} config
 */
export function generateEncodeDecode({ currentSchemaVersions, protoTypeDefs }) {
  const typeImports = protoTypeDefs.map(
    ({ schemaName, schemaVersion, typeName }) => {
      return `import { ${typeName} } from './${schemaName}/v${schemaVersion}.js'`
    }
  )

  const currentProtoTypeDefs = protoTypeDefs.filter(
    ({ schemaName, schemaVersion }) => {
      return currentSchemaVersions[schemaName] === schemaVersion
    }
  )

  const encodeLines = ['export const Encode = {']
  for (const { schemaName, typeName } of currentProtoTypeDefs) {
    encodeLines.push(`  ${schemaName}: ${typeName}.encode,`)
  }
  encodeLines.push('}')

  const decodeLines = ['export const Decode = {']
  for (const { typeName } of protoTypeDefs) {
    decodeLines.push(`  ${typeName}: ${typeName}.decode,`)
  }
  decodeLines.push('}')

  return [...typeImports, '', ...encodeLines, '', ...decodeLines, ''].join('\n')
}
