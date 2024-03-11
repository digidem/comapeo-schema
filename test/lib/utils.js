// @ts-check
import test from 'tape'
import { ExhaustivenessError } from '../../dist/lib/utils.js'

test('ExhaustivenessError', (t) => {
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

  t.end()
})