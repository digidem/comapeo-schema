#! /usr/bin/env node

const Ajv = require('ajv')
const pack = require('ajv-pack')
const { parseSchema } = require('@marudor/json-schema-to-flow-type')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp').sync

const flowDefs = []
const moduleFilenames = []
const schemaFolder = path.join(__dirname, '../schema')
const outputFolder = path.join(__dirname, '..')

const schemaFiles = fs.readdirSync(schemaFolder)

// For each schema in the schema folder we create a validate function and a flow
// type definition.
schemaFiles.forEach(filename => {
  const schema = JSON.parse(
    fs.readFileSync(path.join(schemaFolder, filename), 'utf-8')
  )
  const name = stripExt(filename)
  const flowDef = generateFlowDef(schema, capitalizeFirst(name))
  const moduleCode = generateValidateCode(schema)
  const moduleFilename = 'validate' + capitalizeFirst(name) + '.js'
  fs.writeFileSync(path.join(outputFolder, moduleFilename), moduleCode)
  flowDefs.push(flowDef)
  moduleFilenames.push(moduleFilename)
})

// Generate an index file that exports each of the generated validation functions
const indexFile = 'module.exports = {\n' +
  moduleFilenames.map(filename =>
    `  ${stripExt(filename)}: require('./${filename}')`
  ).join(',\n') + '\n}\n'

// Generate a flow file that exports all of the generated types
const flowFile = '// @flow\n\n' + flowDefs.join('\n\n') + '\n' +
  fs.readFileSync(path.join(__dirname, '../types.js.flow')) + '\n'

fs.writeFileSync(path.join(outputFolder, 'index.js'), indexFile)
fs.writeFileSync(path.join(outputFolder, 'index.js.flow'), flowFile)

const examplesFolder = path.join(__dirname, '../examples')
const exampleFilenames = fs.readdirSync(examplesFolder)

// For each example in the examples folder we create a sample JavaScript file
// that we can check with `flow check` to check it is a valid type. The first
// part of the filename in examples must match the schema filename.
const typeNames = exampleFilenames.map(getTypeName).reduce(uniqueReducer, [])

// Header imports flow types used in examples
const header = `// @flow
import type { ${typeNames.join(',')} } from '../../'
`
// Generate code that declares a variable for each example json and declares the
// corresponding type, so that flow can statically check it.
const contents = exampleFilenames.map((filename, index) => {
  const varName = path.basename(filename, '.json').replace(/[-\.]/g, '_')
  return '\n// Export un-typed for checking against strict types\n' +
    `export const ${varName} = ` +
    fs.readFileSync(path.join(examplesFolder, filename), 'utf-8') +
    '\n// This is the type check' +
    `\n;({...${varName}}: ${getTypeName(filename)})\n`
}).join('\n')

const validFlowDir = path.join(__dirname, '../test/valid_flow')
mkdirp(validFlowDir)
fs.writeFileSync(path.join(validFlowDir, 'generated.js.flow'), header + contents)

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

function generateFlowDef (schema, name) {
  const flowDef = parseSchema(schema)
  return flowDef
    .replace(/^declare type =/gm, 'export type ' + name + ' =')
    .replace(/^declare type/gm, 'export type')
}

function generateValidateCode (schema) {
  const ajv = new Ajv({ sourceCode: true })
  const validate = ajv.compile(schema)
  return pack(ajv, validate)
}

function stripExt (filename) {
  return path.basename(filename, path.extname(filename))
}
