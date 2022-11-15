import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

export const Observation = Type.Object({
  type: Type.String(),
  schemaVersion: Type.String(),
  id: Type.String(),
  // createdAt: Type.Date(),
  version: Type.Optional(Type.String())
})
const createAjv = () => addFormats(new Ajv({}), ['date-time', 'time', 'date'])
const ajv = createAjv()
export const isValid = (t) => ajv.compile(t)
