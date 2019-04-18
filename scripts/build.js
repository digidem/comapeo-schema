#! /usr/bin/env node

const Ajv = require('ajv')
const pack = require('ajv-pack')
const { parseSchema } = require('@marudor/json-schema-to-flow-type')
const fs = require('fs')
const path = require('path')

const flowDefs = []
const moduleFilenames = []
const schemaFolder = path.join(__dirname, '../schema')
const outputFolder = path.join(__dirname, '..')

const schemaFiles = fs.readdirSync(schemaFolder)

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

const indexFile = 'module.exports = {\n' +
  moduleFilenames.map(filename =>
    `  ${stripExt(filename)}: require('./${filename}')`
  ).join(',\n') + '\n}\n'

const flowFile = '// @flow\n\n' + flowDefs.join('\n\n') + '\n'

fs.writeFileSync(path.join(outputFolder, 'index.js'), indexFile)
fs.writeFileSync(path.join(outputFolder, 'index.js.flow'), flowFile)

function generateFlowDef (schema, name) {
  const flowDef = parseSchema(schema)
  return flowDef.replace(/^declare type/, 'export type ' + name)
}

function generateValidateCode (schema) {
  const ajv = new Ajv({ sourceCode: true })
  const validate = ajv.compile(schema)
  return pack(ajv, validate)
}

function capitalizeFirst (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function stripExt (filename) {
  return path.basename(filename, path.extname(filename))
}
