# Preset

Presets are matched to observations, nodes, ways and relations and defined how the entity should be displayed and what
field should be visible to the user. The best matching preset is used if multiple presets match an entity.

# Properties

| Property                        | Type       | Required     | Nullable |
| ------------------------------- | ---------- | ------------ | -------- |
| [addTags](#addtags)             | `object`   | Optional     | No       | Preset (this schema) |
| [fields](#fields)               | `string[]` | Optional     | No       | Preset (this schema) |
| [geometry](#geometry)           | `enum[]`   | **Required** | No       | Preset (this schema) |
| [icon](#icon)                   | `string`   | Optional     | No       | Preset (this schema) |
| [name](#name)                   | `string`   | **Required** | No       | Preset (this schema) |
| [removeTags](#removetags)       | `object`   | Optional     | No       | Preset (this schema) |
| [schemaVersion](#schemaversion) | `enum`     | Optional     | No       | Preset (this schema) |
| [sort](#sort)                   | `integer`  | Optional     | No       | Preset (this schema) |
| [tags](#tags)                   | `object`   | **Required** | No       | Preset (this schema) |
| [terms](#terms)                 | `string[]` | Optional     | No       | Preset (this schema) |
| [`^name:`](#pattern-name)       | `string`   | Pattern      | No       |

## `addTags`

Tags that are added when changing to the preset (default is the same value as 'tags')

- is optional
- type: `object`

  `object` with following properties:

  | Property | Type | Required |
  | -------- | ---- | -------- |


## `fields`

Ids of fields to displayed to the user when the preset is shown

- is optional
- type: `string[]`

  - Array type
  - All items must be of the type: `string`

## `geometry`

Valid geometry types for the feature

- is **required**
- type: `enum[]`
- at least `1` items in the array

  - Array type
  - All items must be of the type: `string`

## `icon`

Id of preset icon which represents this preset

- is optional
- type: `string`

## `name`

Name for the feature in default language when no translations are available

- is **required**
- type: `string`

## `removeTags`

Tags that are removed when changing to another preset (default is the same value as 'addTags' which in turn defaults to
'tags')

- is optional
- type: `object`

  `object` with following properties:

  | Property | Type | Required |
  | -------- | ---- | -------- |


## `schemaVersion`

Version of schema. Should increment for breaking changes to the schema

- is optional
- type: `enum` The value of this property **must** be equal to one of the
  [known values below](#schemaversion-known-values).

  | Value | Description |
  | ----- | ----------- |
  | `1`   |             |

## `sort`

When presets are displayed as a list, defines the order it should be sorted

- is optional
- type: `integer`

## `tags`

Tags that must be present for the preset to match

- is **required**
- type: `object`

  `object` with following properties:

  | Property | Type | Required |
  | -------- | ---- | -------- |


## `terms`

Synonyms or related terms (used for search)

- is optional
- type: `string[]`

  - Array type
  - All items must be of the type: `string`

## Pattern: `^name:`

Applies to all properties that match the regular expression `^name:`

Translated name with property key `label:<language>` where <language> is a valid IETF BCP 47 language code

`^name:`

- is a property pattern
- type: `string`
- defined in this schema
