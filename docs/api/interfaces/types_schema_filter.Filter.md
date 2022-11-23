[API](../README.md) / [types/schema/filter](../modules/types_schema_filter.md) / Filter

# Interface: Filter

[types/schema/filter](../modules/types_schema_filter.md).Filter

A filter is a saved view of data in the Mapeo database, filtered by tag or date. E.g. a filter could define observations between two dates, or only observations with the tag `public=true`

## Indexable

▪ [k: `string`]: `unknown`

## Table of contents

### Properties

- [created\_at](types_schema_filter.Filter.md#created_at)
- [deviceId](types_schema_filter.Filter.md#deviceid)
- [filter](types_schema_filter.Filter.md#filter)
- [id](types_schema_filter.Filter.md#id)
- [links](types_schema_filter.Filter.md#links)
- [name](types_schema_filter.Filter.md#name)
- [schemaVersion](types_schema_filter.Filter.md#schemaversion)
- [timestamp](types_schema_filter.Filter.md#timestamp)
- [type](types_schema_filter.Filter.md#type)
- [userId](types_schema_filter.Filter.md#userid)
- [version](types_schema_filter.Filter.md#version)

## Properties

### created\_at

• **created\_at**: `string`

RFC3339-formatted datetime of when the first version of the element was created

#### Defined in

[types/schema/filter.d.ts:23](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L23)

___

### deviceId

• `Optional` **deviceId**: `string`

ID of the device that made this edit

#### Defined in

[types/schema/filter.d.ts:35](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L35)

___

### filter

• **filter**: `unknown`[]

A filter expression as defined in https://docs.mapbox.com/mapbox-gl-js/style-spec/#other-filter but where the special fields `$type` refers to the mapeo type (observation, node, way etc) and `$id` is the mapeo id.

#### Defined in

[types/schema/filter.d.ts:51](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L51)

___

### id

• **id**: `string`

Unique value that identifies this element

#### Defined in

[types/schema/filter.d.ts:15](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L15)

___

### links

• `Optional` **links**: `string`[]

Version ids of the previous document versions this one is replacing

#### Defined in

[types/schema/filter.d.ts:43](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L43)

___

### name

• **name**: `string`

A human-readable name for this filter.

#### Defined in

[types/schema/filter.d.ts:55](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L55)

___

### schemaVersion

• **schemaVersion**: ``1``

Version of this schema. Should increment for breaking changes to the schema

#### Defined in

[types/schema/filter.d.ts:47](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L47)

___

### timestamp

• `Optional` **timestamp**: `string`

RFC3339-formatted datetime of when this version of the element was created

#### Defined in

[types/schema/filter.d.ts:27](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L27)

___

### type

• **type**: ``"filter"``

Must be `filter`

#### Defined in

[types/schema/filter.d.ts:39](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L39)

___

### userId

• `Optional` **userId**: `string`

ID of the user who edited/created this record

#### Defined in

[types/schema/filter.d.ts:31](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L31)

___

### version

• **version**: `string`

Unique value that identifies this particular version of this element

#### Defined in

[types/schema/filter.d.ts:19](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/filter.d.ts#L19)
