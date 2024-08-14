/**
 * @param {ReturnType<import('./parse-config').parseConfig>} config
 */
export function generateConfig({ currentSchemaVersions, dataTypeIds }) {
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

  return [...idsLines, '', ...versionsLines].join('\n')
}
