const test = require('tape')
const validators = require('../')
const fs = require('fs')
const path = require('path')

const examplesFolder = path.join(__dirname, '../examples')
const examples = fs.readdirSync(examplesFolder)

test('Validate examples', function (t) {
  examples.forEach(filename => {
    const validatorName = 'validate' + filename.split('.')[0].replace(/^[a-z]/, str => str.toUpperCase())
    const validate = validators[validatorName]
    if (typeof validate !== 'function') {
      t.fail('No validation function found for example ' + filename)
      return
    }
    const testObject = JSON.parse(fs.readFileSync(path.join(examplesFolder, filename)))
    t.ok(validate(testObject), filename + ' validates')
    t.error(validate.errors, 'No validation errors for ' + filename)
  })
  t.end()
})
