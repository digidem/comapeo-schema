/**
 * @param {ReturnType<import('./parse-config').parseConfig>} config
 */
export function generateConfig({
  currentSchemaVersions,
  dataTypeIds,
  protoTypeDefs,
}) {
  const idsLines = ['export const dataTypeIds = {']
  for (const [schemaName, dataTypeId] of Object.entries(dataTypeIds)) {
    idsLines.push(`  ${schemaName}: '${dataTypeId}',`)
  }
  idsLines.push('} as const')

  const versionsLines = ['export const currentSchemaVersions = {']
  for (const [schemaName, schemaVersion] of Object.entries(
    currentSchemaVersions
  )) {
    versionsLines.push(`  ${schemaName}: ${schemaVersion},`)
  }
  versionsLines.push('} as const')

  const knownVersions = {}
  for (const { schemaName, schemaVersion } of protoTypeDefs) {
    const existing = knownVersions[schemaName]
    knownVersions[schemaName] = existing
      ? [...existing, schemaVersion]
      : [schemaVersion]
  }

  const knownVersionsLines = ['export const knownSchemaVersions = {']
  for (const [schemaName, schemaVersions] of Object.entries(knownVersions)) {
    knownVersionsLines.push(`  ${schemaName}: [${schemaVersions.join(', ')}],`)
  }
  knownVersionsLines.push('}')

  return [
    ...idsLines,
    '',
    ...versionsLines,
    '',
    ...knownVersionsLines,
    '',
  ].join('\n')
}
