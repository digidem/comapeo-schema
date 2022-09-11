#! /usr/bin/env node

import * as fs from 'fs/promises'
import * as path from 'path'

import * as dirname from 'desm'
import Ajv from 'ajv'
import pack from 'ajv-pack'
import { compile } from 'json-schema-to-typescript'

const moduleFilenames = []
const rootDirectory = dirname.join(import.meta.url, '..')
const schemaDirectory = path.join(rootDirectory, 'schema')
const typesDirectory = path.join(rootDirectory, 'types')

const schemaFiles = await fs.readdir(schemaDirectory)

// For each schema in the schema folder we create a validate function and a typescript type definition.
for (const filename of schemaFiles) {
  const filepath = path.join(schemaDirectory, filename)
  const fileContents = await fs.readFile(filepath)
  const schema = JSON.parse(fileContents)
  const name = capitalizeFirst(stripExt(filename))
  
  const moduleCode = generateValidateCode(schema, name)
  const moduleFilename = `validate${name}.js`
  const moduleFilepath = path.join(rootDirectory, moduleFilename)
  await fs.writeFile(moduleFilepath, moduleCode)

  moduleFilenames.push(moduleFilename)

  const ts = await compile(schema, name, { additionalProperties: false })
  const typeFilename = `${name}.ts`
  const typeFilepath = path.join(typesDirectory, typeFilename)
  await fs.writeFile(typeFilepath, ts)
}

// Generate an index file that exports each of the generated validation functions
const indexFilepath = path.join(rootDirectory, 'index.js')

const indexFile = moduleFilenames.map((filename) => {
  return `export ${filename} from './${filename}.js'`
}) + '\n'

await fs.writeFile(indexFilepath, indexFile)


// Generate a flow file that exports all of the generated types
// const flowFile = '// @flow\n\n' + flowDefs.join('\n\n') + '\n' +
//   fs.readFileSync(path.join(__dirname, '../types.js.flow')) + '\n'
// fs.writeFileSync(path.join(outputFolder, 'index.js.flow'), flowFile)

const examplesFolder = path.join(rootDirectory, 'examples')
const exampleFilenames = await fs.readdir(examplesFolder)

// For each example in the examples folder we create a sample JavaScript file
// that we can check with `flow check` to check it is a valid type. The first
// part of the filename in examples must match the schema filename.
const typeNames = exampleFilenames.map(getTypeName).reduce(uniqueReducer, [])

// Header imports flow types used in examples
// const header = `// @flow
// import type { ${typeNames.join(',')} } from '../../'
// `

// Generate code that declares a variable for each example json and declares the
// corresponding type, so that flow can statically check it.
// const contents = exampleFilenames.map((filename, index) => {
//   const varName = path.basename(filename, '.json').replace(/[-\.]/g, '_')
//   return '\n// Export un-typed for checking against strict types\n' +
//     `export const ${varName} = ` +
//     fs.readFileSync(path.join(examplesFolder, filename), 'utf-8') +
//     '\n// This is the type check' +
//     `\n;({...${varName}}: ${getTypeName(filename)})\n`
// }).join('\n')

// const validFlowDir = path.join(__dirname, '../test/valid_flow')
// mkdirp(validFlowDir)
// fs.writeFileSync(path.join(validFlowDir, 'generated.js.flow'), header + contents)

/**
 * Helper functions
 */

function getTypeName (str) {
  return capitalizeFirst(str.split('.')[0])
}

function capitalizeFirst (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function uniqueReducer (acc, curr) {
  return acc.indexOf(curr) > -1 ? acc : acc.concat(curr)
}

function generateValidateCode (schema) {
  const ajv = new Ajv({ sourceCode: true })
  const validate = ajv.compile(schema)
  return pack(ajv, validate)
}

function stripExt (filename) {
  return path.basename(filename, path.extname(filename))
}
