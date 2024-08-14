// @ts-check
import assert from 'node:assert/strict'
import test from 'node:test'
import { ExhaustivenessError, getOwn } from '../../dist/lib/utils.js'

test('getOwn', () => {
  class Foo {
    ownProperty = 123
    inheritedProperty() {
      return 789
    }
  }
  const foo = new Foo()
  assert.equal(getOwn(foo, 'ownProperty'), 123)
  assert.equal(getOwn(foo, 'inheritedProperty'), undefined)
  assert.equal(
    getOwn(foo, /** @type {keyof Foo} */ ('hasOwnProperty')),
    undefined
  )

  const nullProto = Object.create(null)
  nullProto.foo = 123
  assert.equal(getOwn(nullProto, 'foo'), 123)
  assert.equal(getOwn(nullProto, 'bar'), undefined)
  assert.equal(getOwn(nullProto, 'hasOwnProperty'), undefined)
})

test('ExhaustivenessError', () => {
  // These should not throw.
  const bools = [true, false]
  bools.forEach((bool) => {
    switch (bool) {
      case true:
      case false:
        break
      default:
        throw new ExhaustivenessError(bool)
    }
  })
})
