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
 * @param {ReturnType<import('./parse-config').parseConfig>} config
 */
export function readJSONSchema({ currentSchemaVersions }) {
  const jsonSchemaFiles = glob.sync(`schema/!(common)/*.json`, {
    cwd: PROJECT_ROOT,
    absolute: true,
  })

  const common = readJSON('./schema/common/v1.json')

  const jsonSchemaDefs = jsonSchemaFiles.map((filepath) => {
    /** @type {import('json-schema').JSONSchema7} */
    const jsonSchema = readJSON(filepath)
    const { dir, name } = path.parse(filepath)
    const folderName = path.basename(dir)
    // @ts-ignore - enum not defined on JSONSchema v7
    const schemaName = jsonSchema.properties?.schemaType?.enum[0]
    if (folderName !== schemaName) {
      throw new Error(`Unexpected schemaType '${schemaName}' in ${filepath}`)
    }
    const schemaVersion = Number.parseInt(name.replace(/^v/, ''))
    // TODO: Check $id is correct
    return {
      schemaName,
      schemaVersion,
      jsonSchema: mergeCommon(jsonSchema, common),
    }
  })

  /** @type {Record<string, import('json-schema').JSONSchema7>} schemaName: JSONSchema */
  const jsonSchemas = {}

  for (const { schemaName, schemaVersion, jsonSchema } of jsonSchemaDefs) {
    if (schemaVersion !== currentSchemaVersions[schemaName]) continue
    jsonSchemas[schemaName] = jsonSchema
  }

  for (const schemaName of Object.keys(currentSchemaVersions)) {
    if (!jsonSchemas[schemaName]) {
      throw new Error(
        `Missing JSON schema def for ${schemaName} v${currentSchemaVersions[schemaName]}`
      )
    }
  }

  return jsonSchemas
}

function removeDuplicates(arr, elem) {
  if (!arr.includes(elem)) {
    arr.push(elem)
  }
  return arr
}

/**
 *
 * @param {import('json-schema').JSONSchema7} schema
 * @param {import('json-schema').JSONSchema7} common
 * @returns {import('json-schema').JSONSchema7}
 */
function mergeCommon(schema, common) {
  const required = [
    ...(schema.required || []),
    ...(common.required || []),
  ].reduce(removeDuplicates, [])
  return {
    ...schema,
    required,
    properties: {
      ...common.properties,
      ...schema.properties,
    },
  }
}
