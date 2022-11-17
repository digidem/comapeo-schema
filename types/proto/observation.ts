/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ListValue, NullValue, nullValueFromJSON, nullValueToJSON } from "./google/protobuf/struct";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "observation";

export interface Value {
  /** Represents a null value. */
  null_value:
    | NullValue
    | undefined;
  /** Represents a double value. */
  number_value:
    | number
    | undefined;
  /** Represents a string value. */
  string_value:
    | string
    | undefined;
  /** Represents a boolean value. */
  bool_value:
    | boolean
    | undefined;
  /** Represents a structured value. */
  struct_value:
    | Struct
    | undefined;
  /** Represents a repeated `Value`. */
  list_value: Array<any> | undefined;
}

export interface Struct {
  /** Unordered map of dynamically typed values */
  fields: { [key: string]: Value };
}

export interface Struct_FieldsEntry {
  key: string;
  value: Value | undefined;
}

export interface Observation {
  /** 32-byte random generated number */
  id: Uint8Array;
  /**
   * When the record was created
   * google.protobuf.Timestamp created_at = 2;
   */
  created_at: string;
  /** When the record was last modified */
  timestamp?: Date | undefined;
  user_id?: string | undefined;
  links: string[];
  lat?: number | undefined;
  lon?: number | undefined;
  refs: Struct[];
  attachments: Struct[];
  tags?: Struct | undefined;
}

export interface Observation_Metadata {
  manual_location?: boolean | undefined;
}

export interface Observation_Metadata_Location {
  precision?: number | undefined;
  altitude?: number | undefined;
}

function createBaseValue(): Value {
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
  encode(message: Value, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): Value {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.null_value = reader.int32() as any;
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

  fromJSON(object: any): Value {
    return {
      null_value: isSet(object.null_value) ? nullValueFromJSON(object.null_value) : undefined,
      number_value: isSet(object.number_value) ? Number(object.number_value) : undefined,
      string_value: isSet(object.string_value) ? String(object.string_value) : undefined,
      bool_value: isSet(object.bool_value) ? Boolean(object.bool_value) : undefined,
      struct_value: isSet(object.struct_value) ? Struct.fromJSON(object.struct_value) : undefined,
      list_value: Array.isArray(object.list_value) ? [...object.list_value] : undefined,
    };
  },

  toJSON(message: Value): unknown {
    const obj: any = {};
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

  fromPartial<I extends Exact<DeepPartial<Value>, I>>(object: I): Value {
    const message = createBaseValue();
    message.null_value = object.null_value ?? undefined;
    message.number_value = object.number_value ?? undefined;
    message.string_value = object.string_value ?? undefined;
    message.bool_value = object.bool_value ?? undefined;
    message.struct_value = (object.struct_value !== undefined && object.struct_value !== null)
      ? Struct.fromPartial(object.struct_value)
      : undefined;
    message.list_value = object.list_value ?? undefined;
    return message;
  },
};

function createBaseStruct(): Struct {
  return { fields: {} };
}

export const Struct = {
  encode(message: Struct, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.fields).forEach(([key, value]) => {
      Struct_FieldsEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Struct {
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

  fromJSON(object: any): Struct {
    return {
      fields: isObject(object.fields)
        ? Object.entries(object.fields).reduce<{ [key: string]: Value }>((acc, [key, value]) => {
          acc[key] = Value.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Struct): unknown {
    const obj: any = {};
    obj.fields = {};
    if (message.fields) {
      Object.entries(message.fields).forEach(([k, v]) => {
        obj.fields[k] = Value.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Struct>, I>>(object: I): Struct {
    const message = createBaseStruct();
    message.fields = Object.entries(object.fields ?? {}).reduce<{ [key: string]: Value }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Value.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseStruct_FieldsEntry(): Struct_FieldsEntry {
  return { key: "", value: undefined };
}

export const Struct_FieldsEntry = {
  encode(message: Struct_FieldsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Value.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Struct_FieldsEntry {
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

  fromJSON(object: any): Struct_FieldsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? Value.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: Struct_FieldsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Struct_FieldsEntry>, I>>(object: I): Struct_FieldsEntry {
    const message = createBaseStruct_FieldsEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null) ? Value.fromPartial(object.value) : undefined;
    return message;
  },
};

function createBaseObservation(): Observation {
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
  encode(message: Observation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
      writer.uint32(42).string(v!);
    }
    if (message.lat !== undefined) {
      writer.uint32(53).float(message.lat);
    }
    if (message.lon !== undefined) {
      writer.uint32(61).float(message.lon);
    }
    for (const v of message.refs) {
      Struct.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.attachments) {
      Struct.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    if (message.tags !== undefined) {
      Struct.encode(message.tags, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Observation {
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

  fromJSON(object: any): Observation {
    return {
      id: isSet(object.id) ? bytesFromBase64(object.id) : new Uint8Array(),
      created_at: isSet(object.created_at) ? String(object.created_at) : "",
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
      user_id: isSet(object.user_id) ? String(object.user_id) : undefined,
      links: Array.isArray(object?.links) ? object.links.map((e: any) => String(e)) : [],
      lat: isSet(object.lat) ? Number(object.lat) : undefined,
      lon: isSet(object.lon) ? Number(object.lon) : undefined,
      refs: Array.isArray(object?.refs) ? object.refs.map((e: any) => Struct.fromJSON(e)) : [],
      attachments: Array.isArray(object?.attachments) ? object.attachments.map((e: any) => Struct.fromJSON(e)) : [],
      tags: isSet(object.tags) ? Struct.fromJSON(object.tags) : undefined,
    };
  },

  toJSON(message: Observation): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = base64FromBytes(message.id !== undefined ? message.id : new Uint8Array()));
    message.created_at !== undefined && (obj.created_at = message.created_at);
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    message.user_id !== undefined && (obj.user_id = message.user_id);
    if (message.links) {
      obj.links = message.links.map((e) => e);
    } else {
      obj.links = [];
    }
    message.lat !== undefined && (obj.lat = message.lat);
    message.lon !== undefined && (obj.lon = message.lon);
    if (message.refs) {
      obj.refs = message.refs.map((e) => e ? Struct.toJSON(e) : undefined);
    } else {
      obj.refs = [];
    }
    if (message.attachments) {
      obj.attachments = message.attachments.map((e) => e ? Struct.toJSON(e) : undefined);
    } else {
      obj.attachments = [];
    }
    message.tags !== undefined && (obj.tags = message.tags ? Struct.toJSON(message.tags) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Observation>, I>>(object: I): Observation {
    const message = createBaseObservation();
    message.id = object.id ?? new Uint8Array();
    message.created_at = object.created_at ?? "";
    message.timestamp = object.timestamp ?? undefined;
    message.user_id = object.user_id ?? undefined;
    message.links = object.links?.map((e) => e) || [];
    message.lat = object.lat ?? undefined;
    message.lon = object.lon ?? undefined;
    message.refs = object.refs?.map((e) => Struct.fromPartial(e)) || [];
    message.attachments = object.attachments?.map((e) => Struct.fromPartial(e)) || [];
    message.tags = (object.tags !== undefined && object.tags !== null) ? Struct.fromPartial(object.tags) : undefined;
    return message;
  },
};

function createBaseObservation_Metadata(): Observation_Metadata {
  return { manual_location: undefined };
}

export const Observation_Metadata = {
  encode(message: Observation_Metadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.manual_location !== undefined) {
      writer.uint32(24).bool(message.manual_location);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Observation_Metadata {
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

  fromJSON(object: any): Observation_Metadata {
    return { manual_location: isSet(object.manual_location) ? Boolean(object.manual_location) : undefined };
  },

  toJSON(message: Observation_Metadata): unknown {
    const obj: any = {};
    message.manual_location !== undefined && (obj.manual_location = message.manual_location);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Observation_Metadata>, I>>(object: I): Observation_Metadata {
    const message = createBaseObservation_Metadata();
    message.manual_location = object.manual_location ?? undefined;
    return message;
  },
};

function createBaseObservation_Metadata_Location(): Observation_Metadata_Location {
  return { precision: undefined, altitude: undefined };
}

export const Observation_Metadata_Location = {
  encode(message: Observation_Metadata_Location, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.precision !== undefined) {
      writer.uint32(13).float(message.precision);
    }
    if (message.altitude !== undefined) {
      writer.uint32(16).int32(message.altitude);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Observation_Metadata_Location {
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

  fromJSON(object: any): Observation_Metadata_Location {
    return {
      precision: isSet(object.precision) ? Number(object.precision) : undefined,
      altitude: isSet(object.altitude) ? Number(object.altitude) : undefined,
    };
  },

  toJSON(message: Observation_Metadata_Location): unknown {
    const obj: any = {};
    message.precision !== undefined && (obj.precision = message.precision);
    message.altitude !== undefined && (obj.altitude = Math.round(message.altitude));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Observation_Metadata_Location>, I>>(
    object: I,
  ): Observation_Metadata_Location {
    const message = createBaseObservation_Metadata_Location();
    message.precision = object.precision ?? undefined;
    message.altitude = object.altitude ?? undefined;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
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

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
