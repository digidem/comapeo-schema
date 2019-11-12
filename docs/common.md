# common

These properties are shared by all objects in the Mapeo database.

# Properties

| Property                        | Type       | Required     | Nullable |
| ------------------------------- | ---------- | ------------ | -------- |
| [created_at](#created_at)       | `string`   | **Required** | No       | common (this schema) |
| [deviceId](#deviceid)           | `string`   | Optional     | No       | common (this schema) |
| [id](#id)                       | `string`   | **Required** | No       | common (this schema) |
| [links](#links)                 | `string[]` | Optional     | No       | common (this schema) |
| [schemaVersion](#schemaversion) | `number`   | Optional     | No       | common (this schema) |
| [timestamp](#timestamp)         | `string`   | Optional     | No       | common (this schema) |
| [type](#type)                   | `string`   | **Required** | No       | common (this schema) |
| [userId](#userid)               | `string`   | Optional     | No       | common (this schema) |
| [version](#version)             | `string`   | **Required** | No       | common (this schema) |
| `*`                             | any        | Additional   | Yes      | this schema _allows_ additional properties |

## `created_at`

RFC3339-formatted datetime of when the first version of the element was created

- is **required**
- type: `string`

  - format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))

## `deviceId`

ID of the device that made this edit

- is optional
- type: `string`

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

## `schemaVersion`

Version of schema. Should increment for breaking changes to the schema

- is optional
- type: `number`

  - minimum value: `1`

## `timestamp`

RFC3339-formatted datetime of when this version of the element was created

- is optional
- type: `string`

  - format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))

## `type`

enum that defines the type of document in the database (defines which schema should be used)

- is **required**
- type: `string`

## `userId`

ID of the user who made this edit

- is optional
- type: `string`

## `version`

Unique value that identifies this particular version of this element

- is **required**
- type: `string`
