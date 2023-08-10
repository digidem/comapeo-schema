[API](../README.md) / parseVersionId

# Function: parseVersionId

▸ **parseVersionId**(`versionId`): [`VersionIdObject`](../types/VersionIdObject.md)

Parse a versionId string to get the core key and index in that core. A
versionId uniquely identifies a record in the underlying Hypercore storage
used by Mapeo

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `versionId` | `string` | hex-encoded 32-byte core key and index in the core, separated with `/` |

#### Returns

[`VersionIdObject`](../types/VersionIdObject.md)

coreKey as a Buffer and index in the core

#### Defined in

[src/lib/utils.ts:41](https://github.com/digidem/mapeo-schema/blob/7850f8a/src/lib/utils.ts#L41)
