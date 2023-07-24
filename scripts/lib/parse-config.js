// @ts-check
import path from 'path'
import fs from 'fs'
import glob from 'glob-promise'
import schema from 'protocol-buffers-schema'
import { capitalize, PROJECT_ROOT } from './utils.js'

// These messages are embedded in others and do not define Mapeo data types
const EMBEDDED_MESSAGES = ['tags', 'common']

/**
 * Parse the proto message types and check:
 *
 * - All message types have a dataTypeId and schemaName
 * - dataTypeId does not collide
 * - Message names match folder names
 *
 * Then return map of schemaName to dataTypeId
 * and map of schemaName to current schemaVersion
 */
export function parseConfig() {
  const protobufFiles = glob.sync(
    `proto/!(${EMBEDDED_MESSAGES.join('|')})/*.proto`,
    {
      cwd: PROJECT_ROOT,
      absolute: true,
    }
  )

  /** @type {Map<string, string>} dataTypeId: schemaName */
  const duplicateIdCheck = new Map()

  /** @type {Record<string, string>} */
  const dataTypeIds = {}
  /** @type {Record<string, number>} */
  const currentSchemaVersions = {}
  /** @type {Array<{ schemaVersion: number, schemaName: string, typeName: string }>} */
  const protoTypeDefs = []

  for (const filepath of protobufFiles) {
    const sch = schema.parse(fs.readFileSync(filepath))
    const folderName = path.basename(path.dirname(filepath))
    const message = sch.messages.find((m) => {
      return m.name.startsWith(capitalize(folderName) + '_')
    })
    if (!message) throw new Error('No message found in ' + filepath)
    const match = /_(\d+)$/.exec(message.name)
    if (!match) {
      throw new Error(
        'Message name must end with `_` and version number in ' + filepath
      )
    }
    const schemaVersion = Number(match[1])
    const { dataTypeId, schemaName } = message.options
    if (typeof dataTypeId !== 'string') {
      throw new Error('Missing dataTypeId option in ' + filepath)
    }
    if (typeof schemaName !== 'string') {
      throw new Error('Missing schemaName option in ' + filepath)
    }
    if (
      duplicateIdCheck.has(dataTypeId) &&
      duplicateIdCheck.get(dataTypeId) !== schemaName
    ) {
      throw new Error('Duplicate dataTypeId in ' + filepath)
    }
    duplicateIdCheck.set(dataTypeId, schemaName)

    dataTypeIds[schemaName] = dataTypeId

    const prevSchemaVersion = currentSchemaVersions[schemaName]
    if (!prevSchemaVersion || schemaVersion > prevSchemaVersion) {
      currentSchemaVersions[schemaName] = schemaVersion
    }

    protoTypeDefs.push({
      schemaVersion,
      schemaName,
      typeName: message.name,
    })
  }

  return {
    dataTypeIds,
    currentSchemaVersions,
    protoTypeDefs,
  }
}
