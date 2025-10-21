// Shared types
import { type ProtoTypesWithSchemaInfo as AllProtoTypesWithSchemaInfo } from './proto/types.js'
import { CoreOwnership, ComapeoDoc } from './schema/index.js'
import { dataTypeIds } from './config.js'

export type SchemaName = keyof typeof dataTypeIds

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

/** Filter a union of objects to only include those that have a prop `schemaName` that matches U */
type FilterBySchemaName<
  T extends { schemaName: string },
  U extends string,
> = Extract<T, { schemaName: U }>

/** Only proto types we currently support (whilst in dev) */
export type ProtoTypesWithSchemaInfo = FilterBySchemaName<
  AllProtoTypesWithSchemaInfo,
  SchemaName
>

// The decode and encode functions expect core ownership signatures as buffers,
// but these are not included in the JSON schema definitions because they are
// stripped before they are indexed
type AllComapeoDocDecode =
  | Exclude<ComapeoDoc, CoreOwnership>
  | (CoreOwnership & CoreOwnershipSignatures)

/** ComapeoDoc for decoding (with core ownership signatures) */
export type ComapeoDocDecode<TDocType extends SchemaName = SchemaName> =
  FilterBySchemaName<AllComapeoDocDecode, TDocType>

// ComapeoDoc for encoding does not need a versionId, and if links is an empty
// array, it does not need a originalVersionId either.
type AllComapeoDocEncode =
  | (OmitUnion<
      ComapeoDocDecode,
      'versionId' | 'originalVersionId' | 'links'
    > & {
      links: []
    })
  | OmitUnion<ComapeoDocDecode, 'versionId'>

/** ComapeoDoc for encoding */
export type ComapeoDocEncode<TDocType extends SchemaName = SchemaName> =
  FilterBySchemaName<AllComapeoDocEncode, TDocType>

/** @deprecated Use ComapeoDocDecode instead */
export type MapeoDocDecode = ComapeoDocDecode

/** @deprecated Use ComapeoDocEncode instead */
export type MapeoDocEncode = ComapeoDocEncode

/** Union of all valid data type ids */
export type DataTypeId = Values<typeof dataTypeIds>

type Namespace = 'auth' | 'config' | 'data' | 'blob' | 'blobIndex'

export type CoreOwnershipSignatures = {
  coreSignatures: Record<Namespace, Buffer>
  identitySignature: Buffer
}

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
