import { Type } from '@sinclair/typebox'

/**
* Observation record
*/
export const Observation = Type.Object({
  type: Type.Literal('observation'),
  schemaVersion: Type.String(),
  id: Type.String(),
  // createdAt: Type.Date(),
  version: Type.Optional(Type.String())
})
