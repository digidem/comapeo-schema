#! /usr/bin/env node
const fs = require('fs')
const path = require('path')

const examplesFolder = path.join(__dirname, '../examples')

const exampleFilenames = fs.readdirSync(examplesFolder)

const typeImports = exampleFilenames.map(getTypeName).reduce(uniqueReducer, [])

const fileContents = `// @flow
import type { ${typeImports.join(',')} } from '../'
` + exampleFilenames.map((filename, index) => {
  return `const var${index}: ${getTypeName(filename)} = ` +
    fs.readFileSync(path.join(examplesFolder, filename), 'utf-8')
}).join('\n')

fs.writeFileSync(path.join(__dirname, '../test/test.js.flow'), fileContents)

function getTypeName (str) {
  return capitalizeFirst(str.split('.')[0])
}

function capitalizeFirst (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function uniqueReducer (acc, curr) {
  return acc.indexOf(curr) > -1 ? acc : acc.concat(curr)
}
