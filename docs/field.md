# Field

A field defines a form field that will be shown to the user when creating or editing a map entity. Presets define which
fields are shown to the user for a particular map entity. The field definition defines whether the field should show as
a text box, multiple choice, single-select, etc. It defines what tag-value is set when the field is entered.

# Properties

| Property                    | Type      | Required     | Nullable | Default       |
| --------------------------- | --------- | ------------ | -------- | ------------- |
| [appearance](#appearance)   | `enum`    | Optional     | No       | `"multiline"` | Field (this schema) |
| [helperText](#helpertext)   | `string`  | Optional     | No       |               | Field (this schema) |
| [id](#id)                   | `string`  | **Required** | No       |               | Field (this schema) |
| [key](#key)                 | complex   | **Required** | No       |               | Field (this schema) |
| [label](#label)             | `string`  | Optional     | No       |               | Field (this schema) |
| [max_value](#max_value)     | `integer` | Optional     | No       |               | Field (this schema) |
| [min_value](#min_value)     | `integer` | Optional     | No       |               | Field (this schema) |
| [options](#options)         | `array`   | Optional     | No       |               | Field (this schema) |
| [placeholder](#placeholder) | `string`  | Optional     | No       |               | Field (this schema) |
| [readonly](#readonly)       | `boolean` | Optional     | No       | `false`       | Field (this schema) |
| [snake_case](#snake_case)   | `boolean` | Optional     | No       | `false`       | Field (this schema) |
| [type](#type)               | `enum`    | **Required** | No       |               | Field (this schema) |
| [universal](#universal)     | `boolean` | Optional     | No       | `false`       | Field (this schema) |

## `appearance`

For text fields, display as a single-line or multi-line field

- is optional
- default: `"multiline"`
- type: `enum` The value of this property **must** be equal to one of the
  [known values below](#appearance-known-values).

  | Value        | Description                                        |
  | ------------ | -------------------------------------------------- |
  | `singleline` | Text will be cut-off if more than one line         |
  | `multiline`  | Text will wrap to multiple lines within text field |

## `helperText`

Additional context about the field, e.g. hints about how to answer the question.

- is optional
- type: `string`

## `id`

Unique value that identifies this element

- is **required**
- type: `string`

## `key`

They key in a tags object that this field applies to. For nested properties, key can be an array e.g. for tags =
`{ foo: { bar: 1 } }` the key is `['foo', 'bar']`

- is **required**
- type: complex

  **One** of the following _conditions_ need to be fulfilled.

  #### Condition 1

  type: `string`

  #### Condition 2

  type: `array`

  - Array type
  - All items must be of the type: `string`

## `label`

Default language label for the form field label

- is optional
- type: `string`

## `max_value`

Maximum field value (number, date or datetime fields only). For date or datetime fields, is seconds since unix epoch

- is optional
- type: `integer`

## `min_value`

Minimum field value (number, date or datetime fields only). For date or datetime fields, is seconds since unix epoch

- is optional
- type: `integer`

## `options`

List of options the user can select for single- or multi-select fields

- is optional
- type: `array`

  - Array type
  - All items must be of the type:

  **Any** following _options_ needs to be fulfilled.

  #### Option 1

  type: `string`

  #### Option 2

  type: `boolean`

  #### Option 3

  type: `number`

  #### Option 4

  type: `null`

  #### Option 5

  `object` with following properties:

  | Property | Type   | Required     |
  | -------- | ------ | ------------ |
  | `label`  | string | Optional     |
  | `value`  |        | **Required** |

  #### `label`

  Label in default language to display to the user for this option

  - is optional
  - type: `string`

  #### `value`

  Value for tag when this option is selected

  - is **required**
  - type: complex

  **Any** following _options_ needs to be fulfilled.

  #### Option 1

  type: `string`

  #### Option 2

  type: `boolean`

  #### Option 3

  type: `number`

  #### Option 4

  type: `null`

## `placeholder`

Displayed as a placeholder in an empty text or number field before the user begins typing. Use 'helperText' for
important information, because the placeholder is not visible after the user has entered data.

- is optional
- type: `string`

## `readonly`

Field is displayed, but it can't be edited

- is optional
- default: `false`
- type: `boolean`

## `snake_case`

Convert field value into snake_case (replace spaces with underscores and convert to lowercase)

- is optional
- default: `false`
- type: `boolean`

## `type`

Type of field - defines how the field is displayed to the user.

- is **required**
- type: `enum` The value of this property **must** be equal to one of the [known values below](#type-known-values).

  | Value             | Description                                                                                                                      |
  | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
  | `text`            | Freeform text field                                                                                                              |
  | `localized`       | Text field with localization abilities (e.g. name=_, name:es=_, etc.). Currently only supported in Mapeo Desktop territory view. |
  | `number`          | Allows only numbers                                                                                                              |
  | `select_one`      | Select one item from a list of pre-defined options                                                                               |
  | `select_multiple` | Select any number of items from a list of pre-defined options                                                                    |
  | `date`            | Select a date                                                                                                                    |
  | `datetime`        | Select a date and time                                                                                                           |

## `universal`

If true, this field will appear in the Add Field list for all presets

- is optional
- default: `false`
- type: `boolean`
