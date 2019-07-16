# Observation

An observation is something that has been observed at a particular time and place. It is a subjective statement of 'I
saw/heard this, here'

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

  | Property         | Type    | Required | Default |
  | ---------------- | ------- | -------- | ------- |
  | `location`       | object  | Optional |         |
  | `manualLocation` | boolean | Optional | `false` |

  #### `location`

  Additional location information

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

  #### `manualLocation`

  Whether location has been set manually

  - is optional
  - type: `boolean`
  - default: `false`

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
