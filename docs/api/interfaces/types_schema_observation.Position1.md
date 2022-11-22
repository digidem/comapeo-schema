[API](../README.md) / [types/schema/observation](../modules/types_schema_observation.md) / Position1

# Interface: Position1

[types/schema/observation](../modules/types_schema_observation.md).Position1

Details of the last saved position when the observation was recorded - useful if position is not recorded

## Indexable

▪ [k: `string`]: `unknown`

## Table of contents

### Properties

- [coords](types_schema_observation.Position1.md#coords)
- [mocked](types_schema_observation.Position1.md#mocked)
- [timestamp](types_schema_observation.Position1.md#timestamp)

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

[types/schema/observation.d.ts:162](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L162)

___

### mocked

• `Optional` **mocked**: `boolean`

`true` if the position was mocked

#### Defined in

[types/schema/observation.d.ts:158](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L158)

___

### timestamp

• `Optional` **timestamp**: `number`

Timestamp of when the current position was obtained

#### Defined in

[types/schema/observation.d.ts:154](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L154)
