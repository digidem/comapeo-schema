// @ts-check
import test from 'tape'
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

test('throws for schemas with null at top level', (t) => {
  for (const def of fixtures) {
    t.throws(() =>
      validateJsonSchema({
        type: 'object',
        properties: { foo: def },
      })
    )
  }
  t.throws(() => validateJsonSchema({ type: 'string' }))
  t.end()
})
