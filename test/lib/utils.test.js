// @ts-check
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ensure,
  ExhaustivenessError,
  getOwn,
  getVersionId,
} from '../../dist/lib/utils.js'

test('ensure', () => {
  // These should not throw.
  ensure(true, 'ignored', 'ignored')
  ensure(123, 'ignored', 'ignored')

  assert.throws(
    () => ensure(false, 'ABC', 'XYZ'),
    (err) => {
      assert(err instanceof Error)
      assert(err.message.includes('ABC'))
      assert(err.message.includes('XYZ'))
      return true
    }
  )
  assert.throws(
    () => ensure(null, 'ABC', 'XYZ'),
    (err) => {
      assert(err instanceof Error)
      assert(err.message.includes('ABC'))
      assert(err.message.includes('XYZ'))
      return true
    }
  )
})

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

test('getVersionId', () => {
  const coreDiscoveryKeyHex =
    '1f1c774ac1041092c5d8334316919f43fc9e4db48b2074a2d9d7ecf6df7a1181'
  const valid = {
    coreDiscoveryKey: Buffer.from(coreDiscoveryKeyHex, 'hex'),
    index: 123,
  }

  assert.equal(getVersionId(valid), coreDiscoveryKeyHex + '/' + 123)

  assert.throws(() => getVersionId({ ...valid, index: -1 }))
  assert.throws(() => getVersionId({ ...valid, index: 1.2 }))

  assert.throws(() =>
    getVersionId({ ...valid, coreDiscoveryKey: Buffer.alloc(0) })
  )
  assert.throws(() =>
    getVersionId({
      ...valid,
      coreDiscoveryKey: valid.coreDiscoveryKey.subarray(0, 31),
    })
  )
})
