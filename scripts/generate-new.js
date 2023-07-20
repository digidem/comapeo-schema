// @ts-check
import fs from 'fs'
import path from 'path'
import { mkdirp } from 'mkdirp'
import { rimraf } from 'rimraf'

import { parseConfig } from './lib/parse-config.js'
import { generateProtoTypes } from './lib/proto-types.js'
import { PROJECT_ROOT } from './lib/utils.js'
import { generateConfig } from './lib/generate-config.js'
import { readJSONSchema } from './lib/read-json-schema.js'
import { generateValidations } from './lib/generate-validations.js'
import { generateJSONSchemaTS } from './lib/generate-jsonschema-ts.js'

const DIST_DIRNAME = path.join(PROJECT_ROOT, 'dist')
const TYPES_DIRNAME = path.join(PROJECT_ROOT, 'types')
rimraf.sync(DIST_DIRNAME)
rimraf.sync(TYPES_DIRNAME)
mkdirp.sync(DIST_DIRNAME)
mkdirp.sync(path.join(TYPES_DIRNAME, 'proto'))
mkdirp.sync(path.join(TYPES_DIRNAME, 'schema'))

const config = parseConfig()

const protoTypesFile = generateProtoTypes(config)
fs.writeFileSync(
  path.join(PROJECT_ROOT, 'types/proto/types.ts'),
  protoTypesFile
)

const configFile = generateConfig(config)
fs.writeFileSync(path.join(PROJECT_ROOT, 'config.ts'), configFile)

const jsonSchemas = readJSONSchema(config)

const validationCode = generateValidations(config, jsonSchemas)
fs.writeFileSync(path.join(DIST_DIRNAME, 'schemas.js'), validationCode)

const jsonSchemaTSDefs = await generateJSONSchemaTS(config, jsonSchemas)
for (const [filenameBase, ts] of Object.entries(jsonSchemaTSDefs)) {
  const filepath = path.join(
    PROJECT_ROOT,
    'types',
    'schema',
    filenameBase + '.ts'
  )
  fs.writeFileSync(filepath, ts)
}
