import fs from 'fs'
import path from 'path'

import { parseConfig } from './lib/parse-config.js'
import { generateProtoTypes } from './lib/proto-types.js'
import { PROJECT_ROOT } from './lib/utils.js'
import { generateConfig } from './lib/generate-config.js'

const config = parseConfig()
const protoTypesFile = generateProtoTypes(config)

fs.writeFileSync(
  path.join(PROJECT_ROOT, 'types/proto/types.ts'),
  protoTypesFile
)

const configFile = generateConfig(config)

fs.writeFileSync(path.join(PROJECT_ROOT, 'config.ts'), configFile)
