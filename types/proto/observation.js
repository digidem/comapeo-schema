/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ListValue, nullValueFromJSON, nullValueToJSON } from "./google/protobuf/struct";
import { Timestamp } from "./google/protobuf/timestamp";
export const protobufPackage = "observation";
function createBaseValue() {
    return {
        null_value: undefined,
        number_value: undefined,
        string_value: undefined,
        bool_value: undefined,
        struct_value: undefined,
        list_value: undefined,
    };
}
export const Value = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.null_value !== undefined) {
            writer.uint32(8).int32(message.null_value);
        }
        if (message.number_value !== undefined) {
            writer.uint32(17).double(message.number_value);
        }
        if (message.string_value !== undefined) {
            writer.uint32(26).string(message.string_value);
        }
        if (message.bool_value !== undefined) {
            writer.uint32(32).bool(message.bool_value);
        }
        if (message.struct_value !== undefined) {
            Struct.encode(message.struct_value, writer.uint32(42).fork()).ldelim();
        }
        if (message.list_value !== undefined) {
            ListValue.encode(ListValue.wrap(message.list_value), writer.uint32(50).fork()).ldelim();
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
                    message.null_value = reader.int32();
                    break;
                case 2:
                    message.number_value = reader.double();
                    break;
                case 3:
                    message.string_value = reader.string();
                    break;
                case 4:
                    message.bool_value = reader.bool();
                    break;
                case 5:
                    message.struct_value = Struct.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.list_value = ListValue.unwrap(ListValue.decode(reader, reader.uint32()));
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
            null_value: isSet(object.null_value) ? nullValueFromJSON(object.null_value) : undefined,
            number_value: isSet(object.number_value) ? Number(object.number_value) : undefined,
            string_value: isSet(object.string_value) ? String(object.string_value) : undefined,
            bool_value: isSet(object.bool_value) ? Boolean(object.bool_value) : undefined,
            struct_value: isSet(object.struct_value) ? Struct.fromJSON(object.struct_value) : undefined,
            list_value: Array.isArray(object.list_value) ? [...object.list_value] : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.null_value !== undefined &&
            (obj.null_value = message.null_value !== undefined ? nullValueToJSON(message.null_value) : undefined);
        message.number_value !== undefined && (obj.number_value = message.number_value);
        message.string_value !== undefined && (obj.string_value = message.string_value);
        message.bool_value !== undefined && (obj.bool_value = message.bool_value);
        message.struct_value !== undefined &&
            (obj.struct_value = message.struct_value ? Struct.toJSON(message.struct_value) : undefined);
        message.list_value !== undefined && (obj.list_value = message.list_value);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseValue();
        message.null_value = (_a = object.null_value) !== null && _a !== void 0 ? _a : undefined;
        message.number_value = (_b = object.number_value) !== null && _b !== void 0 ? _b : undefined;
        message.string_value = (_c = object.string_value) !== null && _c !== void 0 ? _c : undefined;
        message.bool_value = (_d = object.bool_value) !== null && _d !== void 0 ? _d : undefined;
        message.struct_value = (object.struct_value !== undefined && object.struct_value !== null)
            ? Struct.fromPartial(object.struct_value)
            : undefined;
        message.list_value = (_e = object.list_value) !== null && _e !== void 0 ? _e : undefined;
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
        created_at: "",
        timestamp: undefined,
        user_id: undefined,
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
        if (message.created_at !== "") {
            writer.uint32(18).string(message.created_at);
        }
        if (message.timestamp !== undefined) {
            Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(26).fork()).ldelim();
        }
        if (message.user_id !== undefined) {
            writer.uint32(34).string(message.user_id);
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
                    message.created_at = reader.string();
                    break;
                case 3:
                    message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.user_id = reader.string();
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
            created_at: isSet(object.created_at) ? String(object.created_at) : "",
            timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
            user_id: isSet(object.user_id) ? String(object.user_id) : undefined,
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
        message.created_at !== undefined && (obj.created_at = message.created_at);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
        message.user_id !== undefined && (obj.user_id = message.user_id);
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
        message.created_at = (_b = object.created_at) !== null && _b !== void 0 ? _b : "";
        message.timestamp = (_c = object.timestamp) !== null && _c !== void 0 ? _c : undefined;
        message.user_id = (_d = object.user_id) !== null && _d !== void 0 ? _d : undefined;
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
    return { manual_location: undefined };
}
export const Observation_Metadata = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.manual_location !== undefined) {
            writer.uint32(24).bool(message.manual_location);
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
                    message.manual_location = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { manual_location: isSet(object.manual_location) ? Boolean(object.manual_location) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.manual_location !== undefined && (obj.manual_location = message.manual_location);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseObservation_Metadata();
        message.manual_location = (_a = object.manual_location) !== null && _a !== void 0 ? _a : undefined;
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
