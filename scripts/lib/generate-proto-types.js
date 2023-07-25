// @ts-check
import { getTypeName } from './utils.js'

/**
 * @param {ReturnType<import('./parse-config.js').parseConfig>} config
 */
export function generateProtoTypes({ currentSchemaVersions, protoTypeDefs }) {
  const typeImports = protoTypeDefs
    .map(({ schemaName, schemaVersion, typeName }) => {
      return `import { ${typeName} } from './${schemaName}/v${schemaVersion}'`
    })
    .join('\n')

  const allProtoDefs =
    'export type ProtoTypes =\n  | ' +
    protoTypeDefs
      .map(({ typeName }) => {
        return `${typeName}`
      })
      .join('\n  | ')

  const protoTypesWithSchemaInfo =
    '/** Union of all Proto Types (including non-current versions) with schemaName and schemaVersion */\n' +
    'export type ProtoTypesWithSchemaInfo =\n  | ' +
    protoTypeDefs
      .map(({ schemaName, schemaVersion, typeName }) => {
        return `(${typeName} & { schemaName: '${schemaName}', schemaVersion: ${schemaVersion} })`
      })
      .join('\n  | ')

  const currentProtoTypes =
    '/** Union of current proto types */\n' +
    'export type CurrentProtoTypes = {\n' +
    protoTypeDefs
      .filter(({ schemaName, schemaVersion }) => {
        return currentSchemaVersions[schemaName] === schemaVersion
      })
      .map(({ schemaName, schemaVersion }) => {
        const typeName = getTypeName(schemaName, schemaVersion)
        return `  ${schemaName}: ${typeName},`
      })
      .join('\n') +
    '}\n'

  const protoTypesExports = protoTypeDefs
    .map(({ typeName }) => {
      return `export { ${typeName} }`
    })
    .join('\n')

  const protoTypeNames =
    '/** Union of all valid names of proto types (`${capitalizedSchemaName}_${schemaVersion}`) */\n' +
    'export type ProtoTypeNames =\n  | ' +
    protoTypeDefs.map(({ typeName }) => `'${typeName}'`).join('\n  | ')

  return (
    typeImports +
    '\n\n' +
    allProtoDefs +
    '\n\n' +
    protoTypesWithSchemaInfo +
    '\n\n' +
    currentProtoTypes +
    '\n\n' +
    protoTypesExports +
    '\n\n' +
    protoTypeNames +
    '\n'
  )
}
