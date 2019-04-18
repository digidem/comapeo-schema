const test = require('tape')
const { validateObservation } = require('../')

test('full observation validates', function (t) {
  const obs = require('../examples/observation.full.json')
  t.ok(validateObservation(obs), 'Observation passes validation')
  t.error(validateObservation.errors, 'No validation errors')
  t.end()
})

test('minimal observation validates', function (t) {
  const obs = require('../examples/observation.minimal.json')
  t.ok(validateObservation(obs), 'Observation passes validation')
  t.error(validateObservation.errors, 'No validation errors')
  t.end()
})
