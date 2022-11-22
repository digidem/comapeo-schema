[API](../README.md) / [types/schema/observation](../modules/types_schema_observation.md) / Observation

# Interface: Observation

[types/schema/observation](../modules/types_schema_observation.md).Observation

An observation is something that has been observed at a particular time and place. It is a subjective statement of 'I saw/heard this, here'

## Indexable

▪ [k: `string`]: `unknown`

## Table of contents

### Properties

- [attachments](types_schema_observation.Observation.md#attachments)
- [created\_at](types_schema_observation.Observation.md#created_at)
- [deviceId](types_schema_observation.Observation.md#deviceid)
- [id](types_schema_observation.Observation.md#id)
- [lat](types_schema_observation.Observation.md#lat)
- [links](types_schema_observation.Observation.md#links)
- [lon](types_schema_observation.Observation.md#lon)
- [metadata](types_schema_observation.Observation.md#metadata)
- [refs](types_schema_observation.Observation.md#refs)
- [schemaVersion](types_schema_observation.Observation.md#schemaversion)
- [tags](types_schema_observation.Observation.md#tags)
- [timestamp](types_schema_observation.Observation.md#timestamp)
- [type](types_schema_observation.Observation.md#type)
- [userId](types_schema_observation.Observation.md#userid)
- [version](types_schema_observation.Observation.md#version)

## Properties

### attachments

• `Optional` **attachments**: { `[k: string]`: `unknown`; `id`: `string` ; `type?`: `string`  }[]

media or other data that are attached to this observation

#### Defined in

[types/schema/observation.d.ts:102](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L102)

___

### created\_at

• **created\_at**: `string`

RFC3339-formatted datetime of when the first version of the element was created

#### Defined in

[types/schema/observation.d.ts:23](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L23)

___

### deviceId

• `Optional` **deviceId**: `string`

ID of the device that made this edit

#### Defined in

[types/schema/observation.d.ts:35](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L35)

___

### id

• **id**: `string`

Unique value that identifies this element

#### Defined in

[types/schema/observation.d.ts:15](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L15)

___

### lat

• `Optional` **lat**: ``null`` \| `number`

latitude of the observation

#### Defined in

[types/schema/observation.d.ts:51](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L51)

___

### links

• `Optional` **links**: `string`[]

Version ids of the previous document versions this one is replacing

#### Defined in

[types/schema/observation.d.ts:43](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L43)

___

### lon

• `Optional` **lon**: ``null`` \| `number`

longitude of the observation

#### Defined in

[types/schema/observation.d.ts:55](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L55)

___

### metadata

• `Optional` **metadata**: `Object`

Additional metadata associated with the observation (e.g. location precision, altitude, heading)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `lastSavedPosition?` | [`Position1`](types_schema_observation.Position1.md) | - |
| `manual_location?` | `boolean` | Whether location has been set manually |
| `position?` | [`Position`](types_schema_observation.Position.md) | - |
| `positionProvider?` | { `[k: string]`: `unknown`; `gpsAvailable?`: `boolean` ; `locationServicesEnabled?`: `boolean` ; `networkAvailable?`: `boolean` ; `passiveAvailable?`: `boolean`  } | Details of the location providers that were available on the device when the observation was recorded |
| `positionProvider.gpsAvailable?` | `boolean` | Whether the user has enabled GPS for device location (this is not the same as whether location is turned on or off, this is a device setting whether to use just wifi and bluetooth or use GPS for location) |
| `positionProvider.locationServicesEnabled?` | `boolean` | Has the user enabled location services on the device (this is often turned off when the device is in airplane mode) |
| `positionProvider.networkAvailable?` | `boolean` | Whether the device can lookup location based on cell phone towers |
| `positionProvider.passiveAvailable?` | `boolean` | Whether the device is configured to lookup location based on wifi and bluetooth networks |

#### Defined in

[types/schema/observation.d.ts:59](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L59)

___

### refs

• `Optional` **refs**: { `[k: string]`: `unknown`; `id`: `string`  }[]

References to any nodes or ways that this observation is related to.

#### Defined in

[types/schema/observation.d.ts:92](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L92)

___

### schemaVersion

• **schemaVersion**: ``4``

Version of this schema. Should increment for breaking changes to the schema

#### Defined in

[types/schema/observation.d.ts:47](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L47)

___

### tags

• `Optional` **tags**: `Object`

User-defined key-value pairs relevant to this observation

#### Index signature

▪ [k: `string`]: `unknown`

#### Defined in

[types/schema/observation.d.ts:116](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L116)

___

### timestamp

• `Optional` **timestamp**: `string`

RFC3339-formatted datetime of when this version of the element was created

#### Defined in

[types/schema/observation.d.ts:27](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L27)

___

### type

• **type**: ``"observation"``

Must be `observation`

#### Defined in

[types/schema/observation.d.ts:39](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L39)

___

### userId

• `Optional` **userId**: `string`

ID of the user who made this edit

#### Defined in

[types/schema/observation.d.ts:31](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L31)

___

### version

• `Optional` **version**: `string`

Unique value that identifies this particular version of this element

#### Defined in

[types/schema/observation.d.ts:19](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/observation.d.ts#L19)
