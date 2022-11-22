[API](../README.md) / [types/schema/preset](../modules/types_schema_preset.md) / Preset

# Interface: Preset

[types/schema/preset](../modules/types_schema_preset.md).Preset

Presets define how map entities are displayed to the user. They define the icon used on the map, and the fields / questions shown to the user when they create or edit the entity on the map. The `tags` property of a preset is used to match the preset with observations, nodes, ways and relations. If multiple presets match, the one that matches the most tags is used.

## Table of contents

### Properties

- [addTags](types_schema_preset.Preset.md#addtags)
- [additionalFields](types_schema_preset.Preset.md#additionalfields)
- [fields](types_schema_preset.Preset.md#fields)
- [geometry](types_schema_preset.Preset.md#geometry)
- [icon](types_schema_preset.Preset.md#icon)
- [id](types_schema_preset.Preset.md#id)
- [name](types_schema_preset.Preset.md#name)
- [removeTags](types_schema_preset.Preset.md#removetags)
- [schemaVersion](types_schema_preset.Preset.md#schemaversion)
- [sort](types_schema_preset.Preset.md#sort)
- [tags](types_schema_preset.Preset.md#tags)
- [terms](types_schema_preset.Preset.md#terms)

## Properties

### addTags

• `Optional` **addTags**: `Object`

Tags that are added when changing to the preset (default is the same value as 'tags')

#### Index signature

▪ [k: `string`]: `unknown`

#### Defined in

[types/schema/preset.d.ts:42](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L42)

___

### additionalFields

• `Optional` **additionalFields**: `string`[]

Additional fields to display (used internally by Mapeo Desktop, no need to define this in preset)

#### Defined in

[types/schema/preset.d.ts:58](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L58)

___

### fields

• `Optional` **fields**: `string`[]

IDs of fields to displayed to the user when the preset is created or edited

#### Defined in

[types/schema/preset.d.ts:54](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L54)

___

### geometry

• **geometry**: [``"point"`` \| ``"vertex"`` \| ``"line"`` \| ``"area"`` \| ``"relation"``, ...("point" \| "vertex" \| "line" \| "area" \| "relation")[]]

Valid geometry types for the feature - this preset will only match features of this geometry type `"point", "vertex", "line", "area", "relation"`

**`Min Items`**

1

#### Defined in

[types/schema/preset.d.ts:29](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L29)

___

### icon

• `Optional` **icon**: `string`

ID of preset icon which represents this preset

#### Defined in

[types/schema/preset.d.ts:62](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L62)

___

### id

• **id**: `string`

Unique value that identifies this element

#### Defined in

[types/schema/preset.d.ts:19](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L19)

___

### name

• **name**: `string`

Name for the feature in default language.

#### Defined in

[types/schema/preset.d.ts:23](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L23)

___

### removeTags

• `Optional` **removeTags**: `Object`

Tags that are removed when changing to another preset (default is the same value as 'addTags' which in turn defaults to 'tags')

#### Index signature

▪ [k: `string`]: `unknown`

#### Defined in

[types/schema/preset.d.ts:48](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L48)

___

### schemaVersion

• `Optional` **schemaVersion**: ``1``

Version of schema. Should increment for breaking changes to the schema

#### Defined in

[types/schema/preset.d.ts:15](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L15)

___

### sort

• `Optional` **sort**: `number`

When presets are displayed as a list, defines the order it should be sorted. Presets with lowest sort numbers are displayed first

#### Defined in

[types/schema/preset.d.ts:70](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L70)

___

### tags

• **tags**: `Object`

The tags are used to match the preset to existing map entities. You can match based on multiple tags E.g. if you have existing points with the tags `nature:tree` and `species:oak` then you can add both these tags here in order to match only oak trees.

#### Index signature

▪ [k: `string`]: `unknown`

#### Defined in

[types/schema/preset.d.ts:36](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L36)

___

### terms

• `Optional` **terms**: `string`[]

Synonyms or related terms (used for search)

#### Defined in

[types/schema/preset.d.ts:66](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/preset.d.ts#L66)
