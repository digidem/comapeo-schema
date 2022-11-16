import { Type } from '@sinclair/typebox'

export const Observation = Type.Object({
  type: Type.String(),
  schemaVersion: Type.String(),
  id: Type.String(),
  // createdAt: Type.Date(),
  version: Type.Optional(Type.String())
})
