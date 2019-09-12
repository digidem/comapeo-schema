# Filter

A filter is a saved view of data in the Mapeo database, filtered by tag or date. E.g. a filter could define
observations between two dates, or only observations with the tag `public=true`

# Properties

| Property                        | Type       | Required     | Nullable |
| ------------------------------- | ---------- | ------------ | -------- |
| [created_at](#created_at)       | `string`   | **Required** | No       | Filter (this schema) |
| [filter](#filter)               | `array`    | **Required** | No       | Filter (this schema) |
| [id](#id)                       | `string`   | **Required** | No       | Filter (this schema) |
| [links](#links)                 | `string[]` | Optional     | No       | Filter (this schema) |
| [name](#name)                   | `string`   | **Required** | No       | Filter (this schema) |
| [schemaVersion](#schemaversion) | `enum`     | **Required** | No       | Filter (this schema) |
| [timestamp](#timestamp)         | `string`   | Optional     | No       | Filter (this schema) |
| [type](#type)                   | `enum`     | **Required** | No       | Filter (this schema) |
| [userId](#userid)               | `string`   | Optional     | No       | Filter (this schema) |
| [version](#version)             | `string`   | **Required** | No       | Filter (this schema) |
| `*`                             | any        | Additional   | Yes      | this schema _allows_ additional properties |

## `created_at`

RFC3339-formatted datetime of when the first version of the element was created

- is **required**
- type: `string`

  - format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))

## `filter`

A filter expression as defined in https://docs.mapbox.com/mapbox-gl-js/style-spec/#other-filter but where the special
fields `$type` refers to the mapeo type (observation, node, way etc) and `$id` is the mapeo id.

- is **required**
- type: `array`

  - Array type

## `id`

Unique value that identifies this element

- is **required**
- type: `string`

## `links`

Version ids of the previous document versions this one is replacing

- is optional
- type: `string[]`

  - Array type
  - All items must be of the type: `string`

## `name`

A human-readable name for this filter.

- is **required**
- type: `string`

## `schemaVersion`

Version of this schema. Should increment for breaking changes to the schema

- is **required**
- type: `enum` The value of this property **must** be equal to one of the
  [known values below](#schemaversion-known-values).

  | Value | Description |
  | ----- | ----------- |
  | `1`   |             |

## `timestamp`

RFC3339-formatted datetime of when this version of the element was created

- is optional
- type: `string`

  - format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))

## `type`

Must be `filter`

- is **required**
- type: `enum` The value of this property **must** be equal to one of the [known values below](#type-known-values).

  | Value    | Description |
  | -------- | ----------- |
  | `filter` |             |

## `userId`

ID of the user who edited/created this record

- is optional
- type: `string`

## `version`

Unique value that identifies this particular version of this element

- is **required**
- type: `string`
