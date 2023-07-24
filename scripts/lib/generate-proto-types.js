// @ts-check

// types/proto/index.d.ts and types/proto/index.js
import { capitalize } from './utils.js'

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
    'export type AllProtoTypes =\n  | ' +
    protoTypeDefs
      .map(({ typeName }) => {
        return `${typeName}`
      })
      .join('\n  | ')

  const protoTypesWithSchemaInfo =
    'export type ProtoTypesWithSchemaInfo = {\n' +
    protoTypeDefs
      .map(({ schemaName, schemaVersion, typeName }) => {
        return `  ${typeName}: ${typeName} & { schemaName: '${schemaName}', schemaVersion: ${schemaVersion} }`
      })
      .join(',\n') +
    '\n}'

  const currentProtoTypes =
    'export type CurrentProtoTypes = {\n' +
    protoTypeDefs
      .filter(({ schemaName, schemaVersion }) => {
        return currentSchemaVersions[schemaName] === schemaVersion
      })
      .map(({ schemaName, schemaVersion }) => {
        const typeName = getTypeName(schemaName, schemaVersion)
        return `  ${schemaName}: ${typeName}`
      })
      .join(',\n') +
    '\n}'

  const protoTypesExports = protoTypeDefs
    .map(({ typeName }) => {
      return `export { ${typeName} }`
    })
    .join('\n')

  const protoTypeNames =
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

function getTypeName(schemaName, schemaVersion) {
  return capitalize(schemaName) + '_' + schemaVersion
}
