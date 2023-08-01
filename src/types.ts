// Shared types
import { type ProtoTypesWithSchemaInfo as AllProtoTypesWithSchemaInfo } from '../types/proto/types'
import { type JsonSchemaTypes as AllJsonSchemaTypes } from '../types/schema'
import { dataTypeIds } from '../config'

/** Temporary: once we have completed this module everything should be supported */
type SupportedSchemaNames = 'project' | 'observation' | 'field'

export type SchemaName = Extract<keyof typeof dataTypeIds, SupportedSchemaNames>

/** Union of all valid schemaName and schemaVersion combinations (not just current versions) */
export type ValidSchemaDef = PickUnion<
  ProtoTypesWithSchemaInfo,
  'schemaName' | 'schemaVersion'
>

/** Filter a union of objects to only include those that have a prop `schemaName` that matches U */
export type FilterBySchemaName<
  T extends { schemaName: string },
  U extends string
> = Extract<T, { schemaName: U }>

/** Uniquely identifies a block in a core */
export type VersionObj = { coreId: Buffer; seq: number }

/** Only proto types we currently support (whilst in dev) */
export type ProtoTypesWithSchemaInfo = FilterBySchemaName<
  AllProtoTypesWithSchemaInfo,
  SupportedSchemaNames
>

/** Only jsonschema types we currently support (whilst in dev) */
export type JsonSchemaTypes = FilterBySchemaName<
  AllJsonSchemaTypes,
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
type OmitUnion<T, K extends keyof any> = T extends any ? Omit<T, K> : never
/** Return a union of object values */
type Values<T> = T[keyof T]
