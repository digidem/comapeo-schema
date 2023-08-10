[API](../README.md) / encode

# Function: encode

▸ **encode**(`mapeoDoc`): `Buffer`

Encode a an object validated against a schema as a binary protobuf prefixed
with the encoded data type ID and schema version, to send to an hypercore.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapeoDoc` | `OmitUnion`<`MapeoDoc`, ``"versionId"``\> |

#### Returns

`Buffer`

#### Defined in

[src/encode.ts:21](https://github.com/digidem/mapeo-schema/blob/7850f8a/src/encode.ts#L21)
