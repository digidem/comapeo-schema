# Observation

An observation is something that has been observed at a particular time and place. It is a subjective statement of 'I
saw/heard this, here'

# Observation Definitions

| Property          | Type      | Group                                                               |
| ----------------- | --------- | ------------------------------------------------------------------- |
| [coords](#coords) | `object`  | `http://mapeo.world/schemas/observation.json#/definitions/position` |
| [mocked](#mocked) | `boolean` | `http://mapeo.world/schemas/observation.json#/definitions/position` |

## `coords`

Position details, should be self explanatory. Units in meters

- is optional
- type: `object`

  `object` with following properties:

  | Property    | Type   | Required |
  | ----------- | ------ | -------- |
  | `accuracy`  | number | Optional |
  | `altitude`  | number | Optional |
  | `heading`   | number | Optional |
  | `latitude`  | number | Optional |
  | `longitude` | number | Optional |
  | `speed`     | number | Optional |

  #### `accuracy`

  - is optional
  - type: `number`

  #### `altitude`

  - is optional
  - type: `number`

  #### `heading`

  - is optional
  - type: `number`

  #### `latitude`

  - is optional
  - type: `number`

  #### `longitude`

  - is optional
  - type: `number`

  #### `speed`

  - is optional
  - type: `number`

## `mocked`

`true` if the position was mocked

- is optional
- default: `false`
- type: `boolean`

# Properties

| Property                        | Type       | Required     | Nullable |
| ------------------------------- | ---------- | ------------ | -------- |
| [attachments](#attachments)     | `object[]` | Optional     | No       | Observation (this schema) |
| [created_at](#created_at)       | `string`   | **Required** | No       | Observation (this schema) |
| [id](#id)                       | `string`   | **Required** | No       | Observation (this schema) |
| [lat](#lat)                     | `number`   | Optional     | Yes      | Observation (this schema) |
| [links](#links)                 | `string[]` | Optional     | No       | Observation (this schema) |
| [lon](#lon)                     | `number`   | Optional     | Yes      | Observation (this schema) |
| [metadata](#metadata)           | `object`   | Optional     | No       | Observation (this schema) |
| [refs](#refs)                   | `object[]` | Optional     | No       | Observation (this schema) |
| [schemaVersion](#schemaversion) | `enum`     | **Required** | No       | Observation (this schema) |
| [tags](#tags)                   | `object`   | Optional     | No       | Observation (this schema) |
| [timestamp](#timestamp)         | `string`   | Optional     | No       | Observation (this schema) |
| [type](#type)                   | `enum`     | **Required** | No       | Observation (this schema) |
| [userId](#userid)               | `string`   | Optional     | No       | Observation (this schema) |
| [version](#version)             | `string`   | **Required** | No       | Observation (this schema) |
| `*`                             | any        | Additional   | Yes      | this schema _allows_ additional properties |

## `attachments`

media or other data that are attached to this observation

- is optional
- type: `object[]`

  - Array type
  - All items must be of the type: `object` with following properties:

  | Property | Type   | Required     |
  | -------- | ------ | ------------ |
  | `id`     | string | **Required** |
  | `type`   | string | Optional     |

  #### `id`

  unique ID that identifies the attachment

  - is **required**
  - type: `string`

  #### `type`

  string that describes the type of the attachment

  - is optional
  - type: `string`

## `created_at`

RFC3339-formatted datetime of when the first version of the element was created

- is **required**
- type: `string`

  - format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))

## `id`

Unique value that identifies this element

- is **required**
- type: `string`

## `lat`

latitude of the observation

- is optional
- type: `number`

  - nullable
  - minimum value: `-90`
  - maximum value: `90`

## `links`

Version ids of the previous document versions this one is replacing

- is optional
- type: `string[]`

  - Array type
  - All items must be of the type: `string`

## `lon`

longitude of the observation

- is optional
- type: `number`

  - nullable
  - minimum value: `-180`
  - maximum value: `180`

## `metadata`

Additional metadata associated with the observation (e.g. location precision, altitude, heading)

- is optional
- type: `object`

  `object` with following properties:

  | Property            | Type    | Required | Default |
  | ------------------- | ------- | -------- | ------- |
  | `lastSavedPosition` |         | Optional |         |
  | `manualLocation`    | boolean | Optional | `false` |
  | `position`          |         | Optional |         |
  | `positionProvider`  | object  | Optional |         |

  #### `lastSavedPosition`

  Details of the last saved position when the observation was recorded - useful if position is not recorded

  - is optional
  - type: reference

  * []() – `#/definitions/position`

  #### `manualLocation`

  Whether location has been set manually

  - is optional
  - type: `boolean`
  - default: `false`

  #### `position`

  Details of the position recorded for the observation

  - is optional
  - type: reference

  * []() – `#/definitions/position`

  #### `positionProvider`

  Details of the location providers that were available on the device when the observation was recorded

  - is optional
  - type: `object`

  `object` with following properties:

  | Property                  | Type    | Required |
  | ------------------------- | ------- | -------- |
  | `gpsAvailable`            | boolean | Optional |
  | `locationServicesEnabled` | boolean | Optional |
  | `networkAvailable`        | boolean | Optional |
  | `passiveAvailable`        | boolean | Optional |

  #### `gpsAvailable`

  Whether the user has enabled GPS for device location (this is not the same as whether location is turned on or off,
  this is a device setting whether to use just wifi and bluetooth or use GPS for location)

  - is optional
  - type: `boolean`

  #### `locationServicesEnabled`

  Has the user enabled location services on the device (this is often turned off when the device is in airplane mode)

  - is optional
  - type: `boolean`

  #### `networkAvailable`

  Whether the device can lookup location based on cell phone towers

  - is optional
  - type: `boolean`

  #### `passiveAvailable`

  Whether the device is configured to lookup location based on wifi and bluetooth networks

  - is optional
  - type: `boolean`

## `refs`

References to any nodes or ways that this observation is related to.

- is optional
- type: `object[]`

  - Array type
  - All items must be of the type: `object` with following properties:

  | Property | Type   | Required     |
  | -------- | ------ | ------------ |
  | `id`     | string | **Required** |

  #### `id`

  ID of the element that this observation references

  - is **required**
  - type: `string`

## `schemaVersion`

Version of this schema. Should increment for breaking changes to the schema

- is **required**
- type: `enum` The value of this property **must** be equal to one of the
  [known values below](#schemaversion-known-values).

  | Value | Description |
  | ----- | ----------- |
  | `4`   |             |

## `tags`

User-defined key-value pairs relevant to this observation

- is optional
- type: `object`

  `object` with following properties:

  | Property | Type | Required |
  | -------- | ---- | -------- |


## `timestamp`

RFC3339-formatted datetime of when this version of the element was created

- is optional
- type: `string`

  - format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))

## `type`

Must be `observation`

- is **required**
- type: `enum` The value of this property **must** be equal to one of the [known values below](#type-known-values).

  | Value         | Description |
  | ------------- | ----------- |
  | `observation` |             |

## `userId`

ID of the user who made this edit

- is optional
- type: `string`

## `version`

Unique value that identifies this particular version of this element

- is **required**
- type: `string`
