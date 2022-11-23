[API](../README.md) / [mapeo-schema](../modules/mapeo_schema.md) / encode

# Function: encode

[mapeo-schema](../modules/mapeo_schema.md).encode

▸ **encode**(`obj`): `Buffer`

Encode a an object validated against a schema as a binary protobuf to send to an hypercore.
*

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | [`types/schema/observation`](../modules/types_schema_observation.md) | Object to be encoded * |

#### Returns

`Buffer`

protobuf encoded buffer with 2 bytes prepended, one for the type of record and the other for the version of the schema

#### Defined in

[src/index.js:26](https://github.com/digidem/mapeo-schema/blob/4111126/src/index.js#L26)
