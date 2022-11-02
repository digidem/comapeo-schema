/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface Value {
  /** Represents a double value. */
  numberValue:
    | number
    | undefined;
  /** Represents a string value. */
  stringValue:
    | string
    | undefined;
  /** Represents a boolean value. */
  boolValue:
    | boolean
    | undefined;
  /** Represents a structured value. */
  structValue: Struct | undefined;
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
  id: string;
  version: string;
  createdAt: string;
  timestamp?: string | undefined;
  userId?: string | undefined;
  deviceId?:
    | string
    | undefined;
  /** maybe this could be an enum? */
  type: string;
  links: string;
  schemaVersion: number;
  lat?: number | undefined;
  lon?: number | undefined;
  refs: Struct[];
  attachments: Struct[];
  tags?: Struct | undefined;
}

export interface Observation_Metadata {
  manualLocation?: boolean | undefined;
}

export interface Observation_Metadata_Location {
  precision?: number | undefined;
  altitude?: number | undefined;
}

function createBaseValue(): Value {
  return { numberValue: undefined, stringValue: undefined, boolValue: undefined, structValue: undefined };
}

export const Value = {
  encode(message: Value, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Value {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Value {
    return {
      numberValue: isSet(object.numberValue) ? Number(object.numberValue) : undefined,
      stringValue: isSet(object.stringValue) ? String(object.stringValue) : undefined,
      boolValue: isSet(object.boolValue) ? Boolean(object.boolValue) : undefined,
      structValue: isSet(object.structValue) ? Struct.fromJSON(object.structValue) : undefined,
    };
  },

  toJSON(message: Value): unknown {
    const obj: any = {};
    message.numberValue !== undefined && (obj.numberValue = message.numberValue);
    message.stringValue !== undefined && (obj.stringValue = message.stringValue);
    message.boolValue !== undefined && (obj.boolValue = message.boolValue);
    message.structValue !== undefined &&
      (obj.structValue = message.structValue ? Struct.toJSON(message.structValue) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Value>, I>>(object: I): Value {
    const message = createBaseValue();
    message.numberValue = object.numberValue ?? undefined;
    message.stringValue = object.stringValue ?? undefined;
    message.boolValue = object.boolValue ?? undefined;
    message.structValue = (object.structValue !== undefined && object.structValue !== null)
      ? Struct.fromPartial(object.structValue)
      : undefined;
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
    id: "",
    version: "",
    createdAt: "",
    timestamp: undefined,
    userId: undefined,
    deviceId: undefined,
    type: "",
    links: "",
    schemaVersion: 0,
    lat: undefined,
    lon: undefined,
    refs: [],
    attachments: [],
    tags: undefined,
  };
}

export const Observation = {
  encode(message: Observation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    if (message.createdAt !== "") {
      writer.uint32(26).string(message.createdAt);
    }
    if (message.timestamp !== undefined) {
      writer.uint32(34).string(message.timestamp);
    }
    if (message.userId !== undefined) {
      writer.uint32(42).string(message.userId);
    }
    if (message.deviceId !== undefined) {
      writer.uint32(50).string(message.deviceId);
    }
    if (message.type !== "") {
      writer.uint32(58).string(message.type);
    }
    if (message.links !== "") {
      writer.uint32(66).string(message.links);
    }
    if (message.schemaVersion !== 0) {
      writer.uint32(72).int32(message.schemaVersion);
    }
    if (message.lat !== undefined) {
      writer.uint32(85).float(message.lat);
    }
    if (message.lon !== undefined) {
      writer.uint32(93).float(message.lon);
    }
    for (const v of message.refs) {
      Struct.encode(v!, writer.uint32(98).fork()).ldelim();
    }
    for (const v of message.attachments) {
      Struct.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    if (message.tags !== undefined) {
      Struct.encode(message.tags, writer.uint32(114).fork()).ldelim();
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
          message.id = reader.string();
          break;
        case 2:
          message.version = reader.string();
          break;
        case 3:
          message.createdAt = reader.string();
          break;
        case 4:
          message.timestamp = reader.string();
          break;
        case 5:
          message.userId = reader.string();
          break;
        case 6:
          message.deviceId = reader.string();
          break;
        case 7:
          message.type = reader.string();
          break;
        case 8:
          message.links = reader.string();
          break;
        case 9:
          message.schemaVersion = reader.int32();
          break;
        case 10:
          message.lat = reader.float();
          break;
        case 11:
          message.lon = reader.float();
          break;
        case 12:
          message.refs.push(Struct.decode(reader, reader.uint32()));
          break;
        case 13:
          message.attachments.push(Struct.decode(reader, reader.uint32()));
          break;
        case 14:
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
      id: isSet(object.id) ? String(object.id) : "",
      version: isSet(object.version) ? String(object.version) : "",
      createdAt: isSet(object.createdAt) ? String(object.createdAt) : "",
      timestamp: isSet(object.timestamp) ? String(object.timestamp) : undefined,
      userId: isSet(object.userId) ? String(object.userId) : undefined,
      deviceId: isSet(object.deviceId) ? String(object.deviceId) : undefined,
      type: isSet(object.type) ? String(object.type) : "",
      links: isSet(object.links) ? String(object.links) : "",
      schemaVersion: isSet(object.schemaVersion) ? Number(object.schemaVersion) : 0,
      lat: isSet(object.lat) ? Number(object.lat) : undefined,
      lon: isSet(object.lon) ? Number(object.lon) : undefined,
      refs: Array.isArray(object?.refs) ? object.refs.map((e: any) => Struct.fromJSON(e)) : [],
      attachments: Array.isArray(object?.attachments) ? object.attachments.map((e: any) => Struct.fromJSON(e)) : [],
      tags: isSet(object.tags) ? Struct.fromJSON(object.tags) : undefined,
    };
  },

  toJSON(message: Observation): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.version !== undefined && (obj.version = message.version);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt);
    message.timestamp !== undefined && (obj.timestamp = message.timestamp);
    message.userId !== undefined && (obj.userId = message.userId);
    message.deviceId !== undefined && (obj.deviceId = message.deviceId);
    message.type !== undefined && (obj.type = message.type);
    message.links !== undefined && (obj.links = message.links);
    message.schemaVersion !== undefined && (obj.schemaVersion = Math.round(message.schemaVersion));
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
    message.id = object.id ?? "";
    message.version = object.version ?? "";
    message.createdAt = object.createdAt ?? "";
    message.timestamp = object.timestamp ?? undefined;
    message.userId = object.userId ?? undefined;
    message.deviceId = object.deviceId ?? undefined;
    message.type = object.type ?? "";
    message.links = object.links ?? "";
    message.schemaVersion = object.schemaVersion ?? 0;
    message.lat = object.lat ?? undefined;
    message.lon = object.lon ?? undefined;
    message.refs = object.refs?.map((e) => Struct.fromPartial(e)) || [];
    message.attachments = object.attachments?.map((e) => Struct.fromPartial(e)) || [];
    message.tags = (object.tags !== undefined && object.tags !== null) ? Struct.fromPartial(object.tags) : undefined;
    return message;
  },
};

function createBaseObservation_Metadata(): Observation_Metadata {
  return { manualLocation: undefined };
}

export const Observation_Metadata = {
  encode(message: Observation_Metadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.manualLocation !== undefined) {
      writer.uint32(24).bool(message.manualLocation);
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
          message.manualLocation = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Observation_Metadata {
    return { manualLocation: isSet(object.manualLocation) ? Boolean(object.manualLocation) : undefined };
  },

  toJSON(message: Observation_Metadata): unknown {
    const obj: any = {};
    message.manualLocation !== undefined && (obj.manualLocation = message.manualLocation);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Observation_Metadata>, I>>(object: I): Observation_Metadata {
    const message = createBaseObservation_Metadata();
    message.manualLocation = object.manualLocation ?? undefined;
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

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
