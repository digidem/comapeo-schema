/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "google.protobuf";
/**
 * `NullValue` is a singleton enumeration to represent the null value for the
 * `Value` type union.
 *
 *  The JSON representation for `NullValue` is JSON `null`.
 */
export var NullValue;
(function (NullValue) {
    /** NULL_VALUE - Null value. */
    NullValue[NullValue["NULL_VALUE"] = 0] = "NULL_VALUE";
    NullValue[NullValue["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(NullValue || (NullValue = {}));
export function nullValueFromJSON(object) {
    switch (object) {
        case 0:
        case "NULL_VALUE":
            return NullValue.NULL_VALUE;
        case -1:
        case "UNRECOGNIZED":
        default:
            return NullValue.UNRECOGNIZED;
    }
}
export function nullValueToJSON(object) {
    switch (object) {
        case NullValue.NULL_VALUE:
            return "NULL_VALUE";
        case NullValue.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
function createBaseStruct() {
    return { fields: {} };
}
export const Struct = {
    encode(message, writer = _m0.Writer.create()) {
        Object.entries(message.fields).forEach(([key, value]) => {
            if (value !== undefined) {
                Struct_FieldsEntry.encode({ key: key, value }, writer.uint32(10).fork()).ldelim();
            }
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
                    acc[key] = value;
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
                obj.fields[k] = v;
            });
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStruct();
        message.fields = Object.entries((_a = object.fields) !== null && _a !== void 0 ? _a : {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});
        return message;
    },
    wrap(object) {
        const struct = createBaseStruct();
        if (object !== undefined) {
            Object.keys(object).forEach((key) => {
                struct.fields[key] = object[key];
            });
        }
        return struct;
    },
    unwrap(message) {
        const object = {};
        Object.keys(message.fields).forEach((key) => {
            object[key] = message.fields[key];
        });
        return object;
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
            Value.encode(Value.wrap(message.value), writer.uint32(18).fork()).ldelim();
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
                    message.value = Value.unwrap(Value.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object === null || object === void 0 ? void 0 : object.value) ? object.value : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseStruct_FieldsEntry();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
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
            Struct.encode(Struct.wrap(message.struct_value), writer.uint32(42).fork()).ldelim();
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
                    message.struct_value = Struct.unwrap(Struct.decode(reader, reader.uint32()));
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
            struct_value: isObject(object.struct_value) ? object.struct_value : undefined,
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
        message.struct_value !== undefined && (obj.struct_value = message.struct_value);
        message.list_value !== undefined && (obj.list_value = message.list_value);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseValue();
        message.null_value = (_a = object.null_value) !== null && _a !== void 0 ? _a : undefined;
        message.number_value = (_b = object.number_value) !== null && _b !== void 0 ? _b : undefined;
        message.string_value = (_c = object.string_value) !== null && _c !== void 0 ? _c : undefined;
        message.bool_value = (_d = object.bool_value) !== null && _d !== void 0 ? _d : undefined;
        message.struct_value = (_e = object.struct_value) !== null && _e !== void 0 ? _e : undefined;
        message.list_value = (_f = object.list_value) !== null && _f !== void 0 ? _f : undefined;
        return message;
    },
    wrap(value) {
        const result = createBaseValue();
        if (value === null) {
            result.null_value = NullValue.NULL_VALUE;
        }
        else if (typeof value === "boolean") {
            result.bool_value = value;
        }
        else if (typeof value === "number") {
            result.number_value = value;
        }
        else if (typeof value === "string") {
            result.string_value = value;
        }
        else if (Array.isArray(value)) {
            result.list_value = value;
        }
        else if (typeof value === "object") {
            result.struct_value = value;
        }
        else if (typeof value !== "undefined") {
            throw new Error("Unsupported any value type: " + typeof value);
        }
        return result;
    },
    unwrap(message) {
        if ((message === null || message === void 0 ? void 0 : message.string_value) !== undefined) {
            return message.string_value;
        }
        else if ((message === null || message === void 0 ? void 0 : message.number_value) !== undefined) {
            return message.number_value;
        }
        else if ((message === null || message === void 0 ? void 0 : message.bool_value) !== undefined) {
            return message.bool_value;
        }
        else if ((message === null || message === void 0 ? void 0 : message.struct_value) !== undefined) {
            return message.struct_value;
        }
        else if ((message === null || message === void 0 ? void 0 : message.list_value) !== undefined) {
            return message.list_value;
        }
        else if ((message === null || message === void 0 ? void 0 : message.null_value) !== undefined) {
            return null;
        }
        return undefined;
    },
};
function createBaseListValue() {
    return { values: [] };
}
export const ListValue = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.values) {
            Value.encode(Value.wrap(v), writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListValue();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.values.push(Value.unwrap(Value.decode(reader, reader.uint32())));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { values: Array.isArray(object === null || object === void 0 ? void 0 : object.values) ? [...object.values] : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.values) {
            obj.values = message.values.map((e) => e);
        }
        else {
            obj.values = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseListValue();
        message.values = ((_a = object.values) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
    wrap(value) {
        const result = createBaseListValue();
        result.values = value !== null && value !== void 0 ? value : [];
        return result;
    },
    unwrap(message) {
        return message.values;
    },
};
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
}
