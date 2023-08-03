// Shared types
import { type ProtoTypesWithSchemaInfo as AllProtoTypesWithSchemaInfo } from './proto/types.js'
import {
  type MapeoDoc as AllMapeoDocs,
  type MapeoValue as AllMapeoValues,
  type MapeoCommon,
} from './schema/index.js'
import { dataTypeIds } from './config.js'

/** Temporary: once we have completed this module everything should be supported */
type SupportedSchemaNames = 'project' | 'observation' | 'field' | 'preset' | 'role' | 'device' | 'coreOwnership'

export type SchemaName = Extract<keyof typeof dataTypeIds, SupportedSchemaNames>
export type SchemaNameAll = keyof typeof dataTypeIds

/** Union of all valid schemaName and schemaVersion combinations (not just current versions) */
export type ValidSchemaDef = PickUnion<
  ProtoTypesWithSchemaInfo,
  'schemaName' | 'schemaVersion'
>

/** The `tags` field supports only a subset of JSON values - we don't support nested tags, just primitives or arrays of primitives */
export type TagValuePrimitive = number | string | boolean | null | undefined
export type JsonTagValue =
  | TagValuePrimitive
  | Array<Exclude<TagValuePrimitive, undefined>>

export { MapeoCommon }

/** Filter a union of objects to only include those that have a prop `schemaName` that matches U */
export type FilterBySchemaName<
  T extends { schemaName: string },
  U extends string,
> = Extract<T, { schemaName: U }>

/** Only proto types we currently support (whilst in dev) */
export type ProtoTypesWithSchemaInfo = FilterBySchemaName<
  AllProtoTypesWithSchemaInfo,
  SupportedSchemaNames
>

/** Only jsonschema types we currently support (whilst in dev) */
export type MapeoDoc = FilterBySchemaName<AllMapeoDocs, SupportedSchemaNames>
export type MapeoValue = FilterBySchemaName<
  AllMapeoValues,
  SupportedSchemaNames
>

/** Union of all valid data type ids */
export type DataTypeId = Values<typeof dataTypeIds>

// HELPER TYPES
/**
 * This is a Pick over a union, that keeps it as a distributive type
 * (normal pick will loose the distributive type)
 */
type PickUnion<T, K extends keyof T> = T extends any ? Pick<T, K> : never
/** Omit over a union, that keeps it as a distributive type */
export type OmitUnion<T, K extends keyof T> = T extends any ? Omit<T, K> : never
/** Return a union of object values */
type Values<T> = T[keyof T]
