[API](../README.md) / [mapeo-schema](../modules/mapeo_schema.md) / decode

# Function: decode

[mapeo-schema](../modules/mapeo_schema.md).decode

▸ **decode**(`buf`, `opts`): [`types/schema/observation`](../modules/types_schema_observation.md)

Decode a Buffer as an object validated against the corresponding schema

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | Buffer to be decoded (probably obtained from an hypercore) |
| `opts` | `Object` | Object containing key and index of the hypercore |
| `opts.index` | `number` | Index of the entry |
| `opts.key` | `Buffer` | Public key of the hypercore |

#### Returns

[`types/schema/observation`](../modules/types_schema_observation.md)

#### Defined in

[src/index.js:48](https://github.com/digidem/mapeo-schema/blob/4111126/src/index.js#L48)
