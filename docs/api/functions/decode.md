[API](../README.md) / decode

# Function: decode

▸ **decode**(`buf`, `versionObj`): `MapeoDoc`

Decode a Buffer as an object validated against the corresponding schema

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | Buffer to be decoded |
| `versionObj` | [`VersionIdObject`](../types/VersionIdObject.md) | public key (coreKey) of the core where this block is stored, and the index of the block in the core. |

#### Returns

`MapeoDoc`

#### Defined in

[src/decode.ts:40](https://github.com/digidem/mapeo-schema/blob/7850f8a/src/decode.ts#L40)
