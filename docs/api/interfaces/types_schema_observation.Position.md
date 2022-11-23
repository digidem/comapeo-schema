[API](../README.md) / [types/schema/observation](../modules/types_schema_observation.md) / Position

# Interface: Position

[types/schema/observation](../modules/types_schema_observation.md).Position

Details of the position recorded for the observation

## Indexable

▪ [k: `string`]: `unknown`

## Table of contents

### Properties

- [coords](types_schema_observation.Position.md#coords)
- [mocked](types_schema_observation.Position.md#mocked)
- [timestamp](types_schema_observation.Position.md#timestamp)

## Properties

### coords

• `Optional` **coords**: `Object`

Position details, should be self explanatory. Units in meters

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accuracy?` | `number` |
| `altitude?` | `number` |
| `heading?` | `number` |
| `latitude?` | `number` |
| `longitude?` | `number` |
| `speed?` | `number` |

#### Defined in

[types/schema/observation.d.ts:136](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L136)

___

### mocked

• `Optional` **mocked**: `boolean`

`true` if the position was mocked

#### Defined in

[types/schema/observation.d.ts:132](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L132)

___

### timestamp

• `Optional` **timestamp**: `number`

Timestamp of when the current position was obtained

#### Defined in

[types/schema/observation.d.ts:128](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L128)
