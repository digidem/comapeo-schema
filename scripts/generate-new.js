// @ts-check
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

import { parseConfig } from './lib/parse-config.js'
import { generateProtoTypes } from './lib/proto-types.js'
import { PROJECT_ROOT } from './lib/utils.js'
import { generateConfig } from './lib/generate-config.js'
import { readJSONSchema } from './lib/read-json-schema.js'
import { generateValidations } from './lib/generate-validations.js'

const config = parseConfig()

const protoTypesFile = generateProtoTypes(config)
fs.writeFileSync(
  path.join(PROJECT_ROOT, 'types/proto/types.ts'),
  protoTypesFile
)

const configFile = generateConfig(config)
fs.writeFileSync(path.join(PROJECT_ROOT, 'config.ts'), configFile)

const jsonSchemas = readJSONSchema(config)

const DIST_DIRNAME = path.join(PROJECT_ROOT, 'dist')
mkdirp.sync(DIST_DIRNAME)
const validationCode = generateValidations(config, jsonSchemas)
fs.writeFileSync(path.join(DIST_DIRNAME, 'schemas.js'), validationCode)
