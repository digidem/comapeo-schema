import * as ProtobufEncodeDecode from '../types/proto/index.mapeo';
import { dataTypeIds } from '../config';
// TODO: Move the capitalize function somewhere else
import { capitalize } from '../scripts/lib/utils';
import * as cenc from 'compact-encoding';
const dataTypeIdSize = 6;
const schemaVersionSize = 2;
const dataTypeIdToSchemaName = {};
for (const [schemaName, dataTypeId] of Object.entries(dataTypeIds)) {
    dataTypeIdToSchemaName[dataTypeId] = schemaName;
}
/**
 * Decode a Buffer as an object validated against the corresponding schema
 * @param buf Buffer to be decoded
 * @param versionObj CoreId and seq
 * */
export function decode(buf, versionObj) {
    const schemaDef = decodeBlockPrefix(buf);
    if (!schemaDef)
        return null;
    const { schemaName, schemaVersion } = schemaDef;
    const encodedMsg = buf.subarray(dataTypeIdSize + schemaVersionSize, buf.length);
    const protoTypeName = (capitalize(schemaName) +
        '_' +
        schemaVersion);
    const protobufObj = ProtobufEncodeDecode[protoTypeName].decode(encodedMsg);
    return protoToJsonSchema(protobufObj, { schemaType, version });
}
/**
 *  given a buffer, return schemaVersion and dataTypeId
 */
function decodeBlockPrefix(buf) {
    const state = cenc.state();
    // @ts-ignore
    state.buffer = buf;
    state.start = 0;
    state.end = dataTypeIdSize;
    const dataTypeId = cenc.hex.fixed(dataTypeIdSize).decode(state);
    state.start = dataTypeIdSize;
    state.end = dataTypeIdSize + schemaVersionSize;
    const schemaVersion = cenc.uint16.decode(state);
    const schemaName = dataTypeIdToSchemaName[dataTypeId];
    if (!schemaName)
        return null;
    return { schemaName, schemaVersion };
}
function migrateProjectV1ToV2(obj) {
    return obj;
}
/**
 * Convert a decoded protobuf message to its corresponding JSONSchema type.
 */
function protoToJsonSchema(schemaDef, versionObj) {
    let currentMessage;
    if (schemaDef.schemaVersion === 1 && schemaDef.schemaName === 'project') {
        currentMessage = migrateProjectV1ToV2(schemaDef.message);
    }
    else {
        currentMessage = schemaDef.message;
    }
    const { common, ...rest } = currentMessage;
    if (!common)
        throw new Error('Missing common');
    const jsonSchemaCommon = {
        id: common.id.toString('hex'),
        links: common.links.map(versionObjToHexString),
        createdAt: common.createdAt || '',
        updatedAt: common.updatedAt || '',
    };
    const partial = {
        ...jsonSchemaCommon,
        version: versionObjToHexString(versionObj),
        ...rest,
    };
    // Typescript is unable to discriminate the JSONSchema type based on the
    // schemaName passed to the function, but everything above here is strictly
    // typed, so not too much risk in ignoring this.
    // @ts-ignore
    partial.schemaType = schemaDef.schemaName;
    // @ts-ignore
    return partial;
}
const project = {
    common: {
        id: Buffer.alloc(1),
        links: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    name: 'test',
};
// Typed as Project (from JSONSchema types)
const output = protoToJsonSchema({
    schemaName: 'project',
    schemaVersion: 1,
    message: project,
}, { coreId: Buffer.alloc(0), seq: 1 });
/**
 * Turn coreId and seq to a version string of ${hex-encoded coreId}/${seq}
 */
function versionObjToHexString({ coreId, seq }) {
    return `${coreId.toString('hex')}/${seq}`;
}
