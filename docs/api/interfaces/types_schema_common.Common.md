[API](../README.md) / [types/schema/common](../modules/types_schema_common.md) / Common

# Interface: Common

[types/schema/common](../modules/types_schema_common.md).Common

These properties are shared by all objects in the Mapeo database.

## Indexable

▪ [k: `string`]: `unknown`

## Table of contents

### Properties

- [created\_at](types_schema_common.Common.md#created_at)
- [deviceId](types_schema_common.Common.md#deviceid)
- [id](types_schema_common.Common.md#id)
- [links](types_schema_common.Common.md#links)
- [schemaVersion](types_schema_common.Common.md#schemaversion)
- [timestamp](types_schema_common.Common.md#timestamp)
- [type](types_schema_common.Common.md#type)
- [userId](types_schema_common.Common.md#userid)
- [version](types_schema_common.Common.md#version)

## Properties

### created\_at

• **created\_at**: `string`

RFC3339-formatted datetime of when the first version of the element was created

#### Defined in

[types/schema/common.d.ts:23](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L23)

___

### deviceId

• `Optional` **deviceId**: `string`

ID of the device that made this edit

#### Defined in

[types/schema/common.d.ts:35](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L35)

___

### id

• **id**: `string`

Unique value that identifies this element

#### Defined in

[types/schema/common.d.ts:15](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L15)

___

### links

• `Optional` **links**: `string`[]

Version ids of the previous document versions this one is replacing

#### Defined in

[types/schema/common.d.ts:43](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L43)

___

### schemaVersion

• `Optional` **schemaVersion**: `number`

Version of schema. Should increment for breaking changes to the schema

#### Defined in

[types/schema/common.d.ts:47](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L47)

___

### timestamp

• `Optional` **timestamp**: `string`

RFC3339-formatted datetime of when this version of the element was created

#### Defined in

[types/schema/common.d.ts:27](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L27)

___

### type

• **type**: `string`

enum that defines the type of document in the database (defines which schema should be used)

#### Defined in

[types/schema/common.d.ts:39](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L39)

___

### userId

• `Optional` **userId**: `string`

ID of the user who made this edit

#### Defined in

[types/schema/common.d.ts:31](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L31)

___

### version

• **version**: `string`

Unique value that identifies this particular version of this element

#### Defined in

[types/schema/common.d.ts:19](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/common.d.ts#L19)
