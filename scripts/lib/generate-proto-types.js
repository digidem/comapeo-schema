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
    'export type ProtoTypes =\n  | ' +
    protoTypeDefs
      .map(({ typeName }) => {
        return `${typeName}`
      })
      .join('\n  | ')

  const protoTypesWithSchemaInfo =
    '/** Union of all Proto Types (including non-current versions) with schemaName and schemaVersion */' +
    'export type ProtoTypesWithSchemaInfo =\n  | ' +
    protoTypeDefs
      .map(({ schemaName, schemaVersion, typeName }) => {
        return `${typeName} & { schemaName: '${schemaName}', schemaVersion: ${schemaVersion} }`
      })
      .join('\n  | ')

  const currentProtoTypes =
    'export type CurrentProtoTypes =\n  | ' +
    protoTypeDefs
      .filter(({ schemaName, schemaVersion }) => {
        return currentSchemaVersions[schemaName] === schemaVersion
      })
      .map(({ schemaName, schemaVersion }) => {
        const typeName = getTypeName(schemaName, schemaVersion)
        return `${typeName}`
      })
      .join('\n  | ')

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
