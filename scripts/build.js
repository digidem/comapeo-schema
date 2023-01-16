#! /usr/bin/env node

import * as fs from 'fs/promises'
import * as path from 'path'

import * as dirname from 'desm'
import Ajv from 'ajv'
import addFormats from '@sethvincent/ajv-formats'
import { compile } from 'json-schema-to-typescript'
import standalone from 'ajv/dist/standalone/index.js'

const moduleFilenames = []
const rootDirectory = dirname.join(import.meta.url, '..')
const libDirectory = path.join(rootDirectory, 'lib')
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
  const moduleFilepath = path.join(libDirectory, moduleFilename)
  await fs.writeFile(moduleFilepath, moduleCode)

  moduleFilenames.push(moduleFilename)

  const ts = await compile(schema, name, { additionalProperties: false })
  const typeFilename = `${name}.d.ts`
  const typeFilepath = path.join(typesDirectory, typeFilename)
  await fs.writeFile(typeFilepath, ts)
}

// Generate an index file that exports each of the generated validation functions
const indexFilepath = path.join(rootDirectory, 'index.js')

let moduleImports = ''
let moduleExports = ''
let schemaReads = ''
let schemaExports = ''
let schemaDeclarationExports = ''

moduleFilenames.forEach((filename) => {
  moduleImports += `import { ${stripExt(filename)} } from './lib/${filename}';\n`
  moduleExports += `export { ${stripExt(filename)} };\n`
})

schemaFiles.forEach((filename) => {
  const parsedName = capitalizeFirst(stripExt(filename))
  schemaReads += `const ${parsedName} = JSON.parse(await readFile(new URL('./schema/${filename}', import.meta.url), 'utf-8'));\n`
  schemaExports += `export { ${parsedName} };\n`
  schemaDeclarationExports += `export * from './types/${parsedName}';\n`
})

const indexFileContents = `import { readFile } from 'fs/promises';

${moduleImports}
${moduleExports}
${schemaReads}
${schemaExports}
`

await fs.writeFile(indexFilepath, indexFileContents)

const tsDeclarationFilePath = path.join(rootDirectory, 'index.d.ts')
const tsDeclarationFileContents = `${moduleImports}\n${moduleExports}\n${schemaDeclarationExports}`
await fs.writeFile(tsDeclarationFilePath, tsDeclarationFileContents)

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
  const ajv = new Ajv({
    strict: false, // TODO: consider making formats for meta:* properties to avoid this
    code: {
      lines: true,
      source: true,
      esm: true
    }
  })
  addFormats(ajv)
  const validate = ajv.compile(schema)
  const functionName = 'validate' + capitalizeFirst(schema.title)
  const functionNameOptions = {}
  functionNameOptions[functionName] = schema.$id
  const code = standalone(ajv, functionNameOptions, validate)
  const jsdoc = `/**
  * @param {import('../types/${schema.title}').${schema.title}} data
  * @param {Object} options
  * @param {string} [options.instancePath]
  * @param {Object} [options.parentData]
  * @param {string} [options.parentDataProperty]
  * @param {Object} [options.rootData]
  */`
  return code.replace('function validate', `${jsdoc}\nfunction validate`)
}

function stripExt (filename) {
  return path.basename(filename, path.extname(filename))
}
