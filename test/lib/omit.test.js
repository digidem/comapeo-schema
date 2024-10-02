// @ts-check
import assert from 'node:assert/strict'
import test from 'node:test'
import { omit } from '../../dist/lib/omit.js'

test('omitting properties', () => {
  const obj = { foo: 1, bar: 2, baz: 3 }

  assert.deepEqual(
    omit(obj, ['foo']),
    { bar: 2, baz: 3 },
    'omitting 1 property'
  )
  assert.deepEqual(
    omit(obj, ['foo', 'baz']),
    { bar: 2 },
    'omitting 2 properties'
  )
  assert.deepEqual(
    omit(obj, ['foo', 'bar', 'baz']),
    {},
    'omitting all properties'
  )

  const omittingNothing = omit(obj, [])
  assert.deepEqual(
    omittingNothing,
    { foo: 1, bar: 2, baz: 3 },
    'can omit nothing'
  )
  assert.notEqual(omittingNothing, obj, 'omitting nothing returns a new object')

  assert.deepEqual(
    obj,
    { foo: 1, bar: 2, baz: 3 },
    "omit doesn't mutate its argument"
  )
})
