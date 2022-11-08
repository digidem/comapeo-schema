/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ListValue, nullValueFromJSON, nullValueToJSON } from "./google/protobuf/struct";
import { Timestamp } from "./google/protobuf/timestamp";
export const protobufPackage = "observation";
function createBaseValue() {
    return {
        nullValue: undefined,
        numberValue: undefined,
        stringValue: undefined,
        boolValue: undefined,
        structValue: undefined,
        listValue: undefined,
    };
}
export const Value = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.nullValue !== undefined) {
            writer.uint32(8).int32(message.nullValue);
        }
        if (message.numberValue !== undefined) {
            writer.uint32(17).double(message.numberValue);
        }
        if (message.stringValue !== undefined) {
            writer.uint32(26).string(message.stringValue);
        }
        if (message.boolValue !== undefined) {
            writer.uint32(32).bool(message.boolValue);
        }
        if (message.structValue !== undefined) {
            Struct.encode(message.structValue, writer.uint32(42).fork()).ldelim();
        }
        if (message.listValue !== undefined) {
            ListValue.encode(ListValue.wrap(message.listValue), writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValue();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.nullValue = reader.int32();
                    break;
                case 2:
                    message.numberValue = reader.double();
                    break;
                case 3:
                    message.stringValue = reader.string();
                    break;
                case 4:
                    message.boolValue = reader.bool();
                    break;
                case 5:
                    message.structValue = Struct.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.listValue = ListValue.unwrap(ListValue.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            nullValue: isSet(object.nullValue) ? nullValueFromJSON(object.nullValue) : undefined,
            numberValue: isSet(object.numberValue) ? Number(object.numberValue) : undefined,
            stringValue: isSet(object.stringValue) ? String(object.stringValue) : undefined,
            boolValue: isSet(object.boolValue) ? Boolean(object.boolValue) : undefined,
            structValue: isSet(object.structValue) ? Struct.fromJSON(object.structValue) : undefined,
            listValue: Array.isArray(object.listValue) ? [...object.listValue] : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.nullValue !== undefined &&
            (obj.nullValue = message.nullValue !== undefined ? nullValueToJSON(message.nullValue) : undefined);
        message.numberValue !== undefined && (obj.numberValue = message.numberValue);
        message.stringValue !== undefined && (obj.stringValue = message.stringValue);
        message.boolValue !== undefined && (obj.boolValue = message.boolValue);
        message.structValue !== undefined &&
            (obj.structValue = message.structValue ? Struct.toJSON(message.structValue) : undefined);
        message.listValue !== undefined && (obj.listValue = message.listValue);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseValue();
        message.nullValue = (_a = object.nullValue) !== null && _a !== void 0 ? _a : undefined;
        message.numberValue = (_b = object.numberValue) !== null && _b !== void 0 ? _b : undefined;
        message.stringValue = (_c = object.stringValue) !== null && _c !== void 0 ? _c : undefined;
        message.boolValue = (_d = object.boolValue) !== null && _d !== void 0 ? _d : undefined;
        message.structValue = (object.structValue !== undefined && object.structValue !== null)
            ? Struct.fromPartial(object.structValue)
            : undefined;
        message.listValue = (_e = object.listValue) !== null && _e !== void 0 ? _e : undefined;
        return message;
    },
};
function createBaseStruct() {
    return { fields: {} };
}
export const Struct = {
    encode(message, writer = _m0.Writer.create()) {
        Object.entries(message.fields).forEach(([key, value]) => {
            Struct_FieldsEntry.encode({ key: key, value }, writer.uint32(10).fork()).ldelim();
        });
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStruct();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    const entry1 = Struct_FieldsEntry.decode(reader, reader.uint32());
                    if (entry1.value !== undefined) {
                        message.fields[entry1.key] = entry1.value;
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            fields: isObject(object.fields)
                ? Object.entries(object.fields).reduce((acc, [key, value]) => {
                    acc[key] = Value.fromJSON(value);
                    return acc;
                }, {})
                : {},
        };
    },
    toJSON(message) {
        const obj = {};
        obj.fields = {};
        if (message.fields) {
            Object.entries(message.fields).forEach(([k, v]) => {
                obj.fields[k] = Value.toJSON(v);
            });
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStruct();
        message.fields = Object.entries((_a = object.fields) !== null && _a !== void 0 ? _a : {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = Value.fromPartial(value);
            }
            return acc;
        }, {});
        return message;
    },
};
function createBaseStruct_FieldsEntry() {
    return { key: "", value: undefined };
}
export const Struct_FieldsEntry = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== undefined) {
            Value.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStruct_FieldsEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = Value.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? Value.fromJSON(object.value) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value ? Value.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStruct_FieldsEntry();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
        message.value = (object.value !== undefined && object.value !== null) ? Value.fromPartial(object.value) : undefined;
        return message;
    },
};
function createBaseObservation() {
    return {
        id: new Uint8Array(),
        createdAt: undefined,
        timestamp: undefined,
        userId: undefined,
        links: [],
        lat: undefined,
        lon: undefined,
        refs: [],
        attachments: [],
        tags: undefined,
    };
}
export const Observation = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.id.length !== 0) {
            writer.uint32(10).bytes(message.id);
        }
        if (message.createdAt !== undefined) {
            Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(18).fork()).ldelim();
        }
        if (message.timestamp !== undefined) {
            Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(26).fork()).ldelim();
        }
        if (message.userId !== undefined) {
            writer.uint32(34).string(message.userId);
        }
        for (const v of message.links) {
            writer.uint32(42).string(v);
        }
        if (message.lat !== undefined) {
            writer.uint32(53).float(message.lat);
        }
        if (message.lon !== undefined) {
            writer.uint32(61).float(message.lon);
        }
        for (const v of message.refs) {
            Struct.encode(v, writer.uint32(66).fork()).ldelim();
        }
        for (const v of message.attachments) {
            Struct.encode(v, writer.uint32(74).fork()).ldelim();
        }
        if (message.tags !== undefined) {
            Struct.encode(message.tags, writer.uint32(82).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseObservation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.bytes();
                    break;
                case 2:
                    message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.userId = reader.string();
                    break;
                case 5:
                    message.links.push(reader.string());
                    break;
                case 6:
                    message.lat = reader.float();
                    break;
                case 7:
                    message.lon = reader.float();
                    break;
                case 8:
                    message.refs.push(Struct.decode(reader, reader.uint32()));
                    break;
                case 9:
                    message.attachments.push(Struct.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.tags = Struct.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? bytesFromBase64(object.id) : new Uint8Array(),
            createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
            timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
            userId: isSet(object.userId) ? String(object.userId) : undefined,
            links: Array.isArray(object === null || object === void 0 ? void 0 : object.links) ? object.links.map((e) => String(e)) : [],
            lat: isSet(object.lat) ? Number(object.lat) : undefined,
            lon: isSet(object.lon) ? Number(object.lon) : undefined,
            refs: Array.isArray(object === null || object === void 0 ? void 0 : object.refs) ? object.refs.map((e) => Struct.fromJSON(e)) : [],
            attachments: Array.isArray(object === null || object === void 0 ? void 0 : object.attachments) ? object.attachments.map((e) => Struct.fromJSON(e)) : [],
            tags: isSet(object.tags) ? Struct.fromJSON(object.tags) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = base64FromBytes(message.id !== undefined ? message.id : new Uint8Array()));
        message.createdAt !== undefined && (obj.createdAt = message.createdAt.toISOString());
        message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
        message.userId !== undefined && (obj.userId = message.userId);
        if (message.links) {
            obj.links = message.links.map((e) => e);
        }
        else {
            obj.links = [];
        }
        message.lat !== undefined && (obj.lat = message.lat);
        message.lon !== undefined && (obj.lon = message.lon);
        if (message.refs) {
            obj.refs = message.refs.map((e) => e ? Struct.toJSON(e) : undefined);
        }
        else {
            obj.refs = [];
        }
        if (message.attachments) {
            obj.attachments = message.attachments.map((e) => e ? Struct.toJSON(e) : undefined);
        }
        else {
            obj.attachments = [];
        }
        message.tags !== undefined && (obj.tags = message.tags ? Struct.toJSON(message.tags) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = createBaseObservation();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.createdAt = (_b = object.createdAt) !== null && _b !== void 0 ? _b : undefined;
        message.timestamp = (_c = object.timestamp) !== null && _c !== void 0 ? _c : undefined;
        message.userId = (_d = object.userId) !== null && _d !== void 0 ? _d : undefined;
        message.links = ((_e = object.links) === null || _e === void 0 ? void 0 : _e.map((e) => e)) || [];
        message.lat = (_f = object.lat) !== null && _f !== void 0 ? _f : undefined;
        message.lon = (_g = object.lon) !== null && _g !== void 0 ? _g : undefined;
        message.refs = ((_h = object.refs) === null || _h === void 0 ? void 0 : _h.map((e) => Struct.fromPartial(e))) || [];
        message.attachments = ((_j = object.attachments) === null || _j === void 0 ? void 0 : _j.map((e) => Struct.fromPartial(e))) || [];
        message.tags = (object.tags !== undefined && object.tags !== null) ? Struct.fromPartial(object.tags) : undefined;
        return message;
    },
};
function createBaseObservation_Metadata() {
    return { manualLocation: undefined };
}
export const Observation_Metadata = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.manualLocation !== undefined) {
            writer.uint32(24).bool(message.manualLocation);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseObservation_Metadata();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 3:
                    message.manualLocation = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { manualLocation: isSet(object.manualLocation) ? Boolean(object.manualLocation) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.manualLocation !== undefined && (obj.manualLocation = message.manualLocation);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseObservation_Metadata();
        message.manualLocation = (_a = object.manualLocation) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseObservation_Metadata_Location() {
    return { precision: undefined, altitude: undefined };
}
export const Observation_Metadata_Location = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.precision !== undefined) {
            writer.uint32(13).float(message.precision);
        }
        if (message.altitude !== undefined) {
            writer.uint32(16).int32(message.altitude);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseObservation_Metadata_Location();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.precision = reader.float();
                    break;
                case 2:
                    message.altitude = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            precision: isSet(object.precision) ? Number(object.precision) : undefined,
            altitude: isSet(object.altitude) ? Number(object.altitude) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.precision !== undefined && (obj.precision = message.precision);
        message.altitude !== undefined && (obj.altitude = Math.round(message.altitude));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseObservation_Metadata_Location();
        message.precision = (_a = object.precision) !== null && _a !== void 0 ? _a : undefined;
        message.altitude = (_b = object.altitude) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function bytesFromBase64(b64) {
    if (globalThis.Buffer) {
        return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = globalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (globalThis.Buffer) {
        return globalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(String.fromCharCode(byte));
        });
        return globalThis.btoa(bin.join(""));
    }
}
function toTimestamp(date) {
    const seconds = date.getTime() / 1000;
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = t.seconds * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(Timestamp.fromJSON(o));
    }
}
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
}
