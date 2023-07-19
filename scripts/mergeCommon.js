// this file will,
// 1. load every schema file on schema/**/
// 2. merge properties of schema/common/v1.json onto the properties of every other schema
// 3. save that to a file tree
// 4. generate validation code for those schemas
// 5. save that to dist/schemas.js

import fs from 'node:fs'
import path from 'path'
import { URL } from 'url'
import glob from 'glob-promise'
import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone/index.js'
import { formatSchemaKey } from '../utils.js'

const __dirname = new URL('.', import.meta.url).pathname
const readJSON = (f) =>
  JSON.parse(fs.readFileSync(new URL(f, import.meta.url)).toString())

/**
 * @param {string} p
 * @returns {{schemaType: String, schemaVersion: Number, schema:Object}}
 */
const loadSchema = (p) => {
  const { dir, name } = path.parse(p)
  return {
    // we get the type of the schema from the directory
    schemaType: dir.replace('../schema/', ''),
    // we get the version from the filename
    schemaVersion: parseInt(name.replace('v', '')),
    schema: readJSON(p),
    filePath: `${dir.replace('../', '')}/${name}.json`,
  }
}

const schemas = glob
  .sync('../schema/*/*.json', { cwd: 'scripts' })
  .map(loadSchema)
  // avoid having common in loaded schemas since we are embeding it
  .filter(({ schemaType }) => schemaType !== 'common')

const common = readJSON('../schema/common/v1.json')

const schemaExports = schemas.reduce((acc, { schema, schemaType }) => {
  const key = formatSchemaKey(schemaType)
  acc[key] = schema['$id']
  return acc
}, {})

const removeDuplicates = (arr, elem) => {
  if (!arr.includes(elem)) {
    arr.push(elem)
  }
  return arr
}

const mergeCommon = (s) => {
  s.schema.required = [...(s.schema.required || []), ...common.required].reduce(
    removeDuplicates,
    []
  )
  s.schema.properties = { ...common.properties, ...s.schema.properties }
  return s
}

const saveSchemas = ({ filePath, schema }) => {
  fs.mkdirSync(`/tmp/${path.dirname(filePath)}`, { recursive: true })
  fs.writeFileSync(`/tmp/${filePath}`, JSON.stringify(schema, null, 2))
}
schemas.map(mergeCommon).map(saveSchemas)

// compile schemas
const ajv = new Ajv({
  schemas: schemas.map((s) => mergeCommon(s).schema),
  code: { source: true, esm: true },
  formats: { 'date-time': true },
})
ajv.addKeyword('meta:enum')

// generate validation code
let schemaValidations = standaloneCode(ajv, schemaExports)

const dist = path.join(__dirname, '../dist')
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist)
}

// write to -> dist/schemas.js
fs.writeFileSync(
  path.join(__dirname, '../dist', 'schemas.js'),
  schemaValidations
)
