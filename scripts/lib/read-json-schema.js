// @ts-check

import fs from 'node:fs'
import path from 'path'
import glob from 'glob-promise'
import { PROJECT_ROOT } from './utils.js'

/** @param {string} relativeFilepath filepath relative to project root */
function readJSON(relativeFilepath) {
  const filepath = path.resolve(PROJECT_ROOT, relativeFilepath)
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'))
}

/**
 * Returns the most recent version of JSONSchema files in `schema/**` with
 * properties from schema/common/v1.json merged
 *
 * @param {ReturnType<import('./parse-config.js').parseConfig>} config
 */
export function readJSONSchema({ currentSchemaVersions }) {
  const jsonSchemaFiles = glob.sync(`schema/!(common)/*.json`, {
    cwd: PROJECT_ROOT,
    absolute: true,
  })

  const common = readJSON('./schema/common/v1.json')
  common.properties.schemaName.enum = []

  const jsonSchemaDefs = jsonSchemaFiles.map((filepath) => {
    /** @type {import('json-schema').JSONSchema7} */
    const jsonSchema = readJSON(filepath)
    const { dir, name } = path.parse(filepath)
    const folderName = path.basename(dir)
    // @ts-ignore - enum not defined on JSONSchema v7
    const schemaName = jsonSchema.properties?.schemaName?.enum[0]
    if (folderName !== schemaName) {
      throw new Error(`Unexpected schemaName '${schemaName}' in ${filepath}`)
    }
    const schemaVersion = Number.parseInt(name.replace(/^v/, ''))
    // TODO: Check $id is correct
    return {
      schemaName,
      schemaVersion,
      jsonSchema,
    }
  })

  /** @type {Record<string, import('json-schema').JSONSchema7>} schemaName: JSONSchema */
  const merged = {}
  /** @type {Record<string, import('json-schema').JSONSchema7>} schemaName: JSONSchema */
  const values = {
    common,
  }

  for (const { schemaName, schemaVersion, jsonSchema } of jsonSchemaDefs) {
    if (schemaVersion !== currentSchemaVersions[schemaName]) continue
    common.properties.schemaName.enum.push(schemaName)
    values[schemaName] = jsonSchema
    merged[schemaName] = mergeCommon(jsonSchema, common)
  }

  for (const schemaName of Object.keys(currentSchemaVersions)) {
    if (!values[schemaName]) {
      throw new Error(
        `Missing JSON schema def for ${schemaName} v${currentSchemaVersions[schemaName]}`
      )
    }
  }

  return { merged, values }
}

/**
 *
 * @param {import('json-schema').JSONSchema7} schema
 * @param {import('json-schema').JSONSchema7} common
 * @returns {import('json-schema').JSONSchema7}
 */
function mergeCommon(schema, common) {
  const required = new Set([
    ...(schema.required || []),
    ...(common.required || []),
  ])
  return {
    ...schema,
    required: Array.from(required),
    properties: {
      ...common.properties,
      ...schema.properties,
    },
  }
}
