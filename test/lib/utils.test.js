// @ts-check
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ExhaustivenessError,
  getOwn,
  getVersionId,
} from '../../dist/lib/utils.js'

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

  assert.equal(
    getVersionId(valid),
    coreDiscoveryKeyHex + '/' + 123,
    'serializing version ID'
  )

  assert.throws(
    () => getVersionId({ ...valid, index: -1 }),
    'throws when index is negative'
  )
  assert.throws(
    () => getVersionId({ ...valid, index: 1.2 }),
    'throws when index is not an integer'
  )
  assert.throws(
    () => getVersionId({ ...valid, index: NaN }),
    'throws when index is NaN'
  )
  assert.throws(
    () => getVersionId({ ...valid, index: Infinity }),
    'throws when index is Infinity'
  )

  assert.throws(
    () => getVersionId({ ...valid, coreDiscoveryKey: Buffer.alloc(0) }),
    'throws when core discovery key is empty'
  )
  assert.throws(
    () =>
      getVersionId({
        ...valid,
        coreDiscoveryKey: valid.coreDiscoveryKey.subarray(0, 31),
      }),
    'throws when core discovery key is too short'
  )
})
