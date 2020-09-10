# Preset

Presets define how map entities are displayed to the user. They define the icon used on the map, and the fields /
questions shown to the user when they create or edit the entity on the map. The `tags` property of a preset is used to
match the preset with observations, nodes, ways and relations. If multiple presets match, the one that matches the most
tags is used.

# Properties

| Property                              | Type       | Required     | Nullable |
| ------------------------------------- | ---------- | ------------ | -------- |
| [addTags](#addtags)                   | `object`   | Optional     | No       | Preset (this schema) |
| [additionalFields](#additionalfields) | `string[]` | Optional     | No       | Preset (this schema) |
| [fields](#fields)                     | `string[]` | Optional     | No       | Preset (this schema) |
| [geometry](#geometry)                 | `enum[]`   | **Required** | No       | Preset (this schema) |
| [icon](#icon)                         | `string`   | Optional     | No       | Preset (this schema) |
| [id](#id)                             | `string`   | **Required** | No       | Preset (this schema) |
| [name](#name)                         | `string`   | **Required** | No       | Preset (this schema) |
| [removeTags](#removetags)             | `object`   | Optional     | No       | Preset (this schema) |
| [schemaVersion](#schemaversion)       | `enum`     | Optional     | No       | Preset (this schema) |
| [sort](#sort)                         | `integer`  | Optional     | No       | Preset (this schema) |
| [tags](#tags)                         | `object`   | **Required** | No       | Preset (this schema) |
| [terms](#terms)                       | `string[]` | Optional     | No       | Preset (this schema) |

## `addTags`

Tags that are added when changing to the preset (default is the same value as 'tags')

- is optional
- type: `object`

  `object` with following properties:

  | Property | Type | Required |
  | -------- | ---- | -------- |


## `additionalFields`

Additional fields to display (used internally by Mapeo Desktop, no need to define this in preset)

- is optional
- type: `string[]`

  - Array type
  - All items must be of the type: `string`

## `fields`

IDs of fields to displayed to the user when the preset is created or edited

- is optional
- type: `string[]`

  - Array type
  - All items must be of the type: `string`

## `geometry`

Valid geometry types for the feature - this preset will only match features of this geometry type
`"point", "vertex", "line", "area", "relation"`

- is **required**
- type: `enum[]`
- at least `1` items in the array

  - Array type
  - All items must be of the type: `string`

## `icon`

ID of preset icon which represents this preset

- is optional
- type: `string`

## `id`

Unique value that identifies this element

- is **required**
- type: `string`

## `name`

Name for the feature in default language.

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

  | Value | Description                   |
  | ----- | ----------------------------- |
  | `1`   | Current schema version is `1` |

## `sort`

When presets are displayed as a list, defines the order it should be sorted. Presets with lowest sort numbers are
displayed first

- is optional
- type: `integer`

## `tags`

The tags are used to match the preset to existing map entities. You can match based on multiple tags E.g. if you have
existing points with the tags `nature:tree` and `species:oak` then you can add both these tags here in order to match
only oak trees.

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
