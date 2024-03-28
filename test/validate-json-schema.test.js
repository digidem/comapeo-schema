// @ts-check
import test from 'node:test'
import assert from 'node:assert/strict'
import { validateJsonSchema } from '../scripts/lib/validate-json-schema.js'

/** @type {import('json-schema').JSONSchema7Definition[]} */
const fixtures = [
  {
    type: 'null',
  },
  {
    type: ['string', 'null'],
  },
  {
    const: null,
  },
  {
    enum: [1, 2, null],
  },
  {
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'null',
      },
    ],
  },
  {
    anyOf: [
      {
        type: 'string',
      },
      {
        type: 'null',
      },
    ],
  },
  {
    allOf: [
      {
        type: 'string',
      },
      {
        type: 'null',
      },
    ],
  },
  true,
  false,
]

test('throws for schemas with null at top level', () => {
  for (const def of fixtures) {
    assert.throws(() =>
      validateJsonSchema({
        type: 'object',
        properties: { foo: def },
      })
    )
  }
  assert.throws(() => validateJsonSchema({ type: 'string' }))
})
