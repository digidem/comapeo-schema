[API](../README.md) / [types/schema/field](../modules/types_schema_field.md) / Field

# Interface: Field

[types/schema/field](../modules/types_schema_field.md).Field

A field defines a form field that will be shown to the user when creating or editing a map entity. Presets define which fields are shown to the user for a particular map entity. The field definition defines whether the field should show as a text box, multiple choice, single-select, etc. It defines what tag-value is set when the field is entered.

## Table of contents

### Properties

- [appearance](types_schema_field.Field.md#appearance)
- [helperText](types_schema_field.Field.md#helpertext)
- [id](types_schema_field.Field.md#id)
- [key](types_schema_field.Field.md#key)
- [label](types_schema_field.Field.md#label)
- [max\_value](types_schema_field.Field.md#max_value)
- [min\_value](types_schema_field.Field.md#min_value)
- [options](types_schema_field.Field.md#options)
- [placeholder](types_schema_field.Field.md#placeholder)
- [readonly](types_schema_field.Field.md#readonly)
- [snake\_case](types_schema_field.Field.md#snake_case)
- [type](types_schema_field.Field.md#type)
- [universal](types_schema_field.Field.md#universal)

## Properties

### appearance

• `Optional` **appearance**: ``"singleline"`` \| ``"multiline"``

For text fields, display as a single-line or multi-line field

#### Defined in

[types/schema/field.d.ts:35](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L35)

___

### helperText

• `Optional` **helperText**: `string`

Additional context about the field, e.g. hints about how to answer the question.

#### Defined in

[types/schema/field.d.ts:71](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L71)

___

### id

• **id**: `string`

Unique value that identifies this element

#### Defined in

[types/schema/field.d.ts:15](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L15)

___

### key

• **key**: `string` \| `string`[]

They key in a tags object that this field applies to. For nested properties, key can be an array e.g. for tags = `{ foo: { bar: 1 } }` the key is `['foo', 'bar']`

#### Defined in

[types/schema/field.d.ts:19](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L19)

___

### label

• `Optional` **label**: `string`

Default language label for the form field label

#### Defined in

[types/schema/field.d.ts:27](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L27)

___

### max\_value

• `Optional` **max\_value**: `number`

Maximum field value (number, date or datetime fields only). For date or datetime fields, is seconds since unix epoch

#### Defined in

[types/schema/field.d.ts:79](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L79)

___

### min\_value

• `Optional` **min\_value**: `number`

Minimum field value (number, date or datetime fields only). For date or datetime fields, is seconds since unix epoch

#### Defined in

[types/schema/field.d.ts:75](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L75)

___

### options

• `Optional` **options**: (``null`` \| `string` \| `number` \| `boolean` \| { `[k: string]`: `unknown`; `label?`: `string` ; `value`: ``null`` \| `string` \| `number` \| `boolean`  })[]

List of options the user can select for single- or multi-select fields

#### Defined in

[types/schema/field.d.ts:43](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L43)

___

### placeholder

• `Optional` **placeholder**: `string`

Displayed as a placeholder in an empty text or number field before the user begins typing. Use 'helperText' for important information, because the placeholder is not visible after the user has entered data.

#### Defined in

[types/schema/field.d.ts:67](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L67)

___

### readonly

• `Optional` **readonly**: `boolean`

Field is displayed, but it can't be edited

#### Defined in

[types/schema/field.d.ts:31](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L31)

___

### snake\_case

• `Optional` **snake\_case**: `boolean`

Convert field value into snake_case (replace spaces with underscores and convert to lowercase)

#### Defined in

[types/schema/field.d.ts:39](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L39)

___

### type

• **type**: ``"number"`` \| ``"date"`` \| ``"text"`` \| ``"localized"`` \| ``"select_one"`` \| ``"select_multiple"`` \| ``"datetime"``

Type of field - defines how the field is displayed to the user.

#### Defined in

[types/schema/field.d.ts:23](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L23)

___

### universal

• `Optional` **universal**: `boolean`

If true, this field will appear in the Add Field list for all presets

#### Defined in

[types/schema/field.d.ts:63](https://github.com/digidem/mapeo-schema/blob/4111126/types/schema/field.d.ts#L63)
