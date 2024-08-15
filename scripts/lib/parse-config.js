// @ts-check
import path from 'path'
import fs from 'fs'
import { globSync } from 'glob'
import schema from 'protocol-buffers-schema'
import { capitalize, PROJECT_ROOT } from './utils.js'

// These messages are embedded in others and do not define Mapeo data types
const EMBEDDED_MESSAGES = ['tags', 'common', 'versionId']

// We avoid creating data type IDs that match these, since blobs (e.g. icons)
// can be stored in Mapeo hypercores, and we want to avoid trying to parse a
// file blob as a Mapeo datatype. This just minimizes cases where the Mapeo
// indexer might try to parse (and fail) a document that is not actually a Mapeo
// doc.
const KNOWN_FILE_SIGNATURE_PREFIXES = [
  [0xef, 0xbb, 0xbf], // UTF-8 BOM
  [0xfe, 0xff], // UTF-16 BOM
  [0x3c, 0x3f, 0x78, 0x6d, 0x6c], // `<?xml` e.g. SVG file (icons are written as raw XML blobs)
  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // PNG file
  [0x42, 0x4d], // BMP
  [0xff], // MP4 AAC, MP3 - a few formats start with this
  [0x66], // M4A / AAC, FLAC - a few formats start with this
  [0x52, 0x49, 0x46, 0x46, 0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20], // WAV
]

/** @param {string} dataTypeId */
function validateDatatypeId(dataTypeId) {
  const buf = Buffer.from(dataTypeId, 'hex')
  if (buf.length !== 6) {
    throw new Error('datatypeId must be 6 bytes encoded as hex: ' + dataTypeId)
  }
  const matchingKnownFileSignature = KNOWN_FILE_SIGNATURE_PREFIXES.find(
    (prefix) => {
      let doesMatch = true
      for (let i = 0; i < Math.min(prefix.length, 6); i++) {
        if (prefix[i] !== buf[i]) {
          doesMatch = false
        }
      }
      return doesMatch
    }
  )
  if (matchingKnownFileSignature) {
    throw new Error(
      'This datatype ID (' +
        dataTypeId +
        ') matches a known file signature, please choose a different one'
    )
  }
}

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
  const protobufFiles = globSync(
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
    validateDatatypeId(dataTypeId)

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
