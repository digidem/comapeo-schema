import _m0 from "protobufjs/minimal.js";
import { NullValue } from "./google/protobuf/struct.js";
export declare const protobufPackage = "observation";
export interface Value {
    /** Represents a null value. */
    null_value: NullValue | undefined;
    /** Represents a double value. */
    number_value: number | undefined;
    /** Represents a string value. */
    string_value: string | undefined;
    /** Represents a boolean value. */
    bool_value: boolean | undefined;
    /** Represents a structured value. */
    struct_value: Struct | undefined;
    /** Represents a repeated `Value`. */
    list_value: Array<any> | undefined;
}
export interface Struct {
    /** Unordered map of dynamically typed values */
    fields: {
        [key: string]: Value;
    };
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
    metadata?: Observation_Metadata | undefined;
}
export interface Observation_Metadata {
    location?: Observation_Metadata_Location | undefined;
    manual_location?: boolean | undefined;
}
export interface Observation_Metadata_Location {
    precision?: number | undefined;
    altitude?: number | undefined;
}
export declare const Value: {
    encode(message: Value, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Value;
    fromJSON(object: any): Value;
    toJSON(message: Value): unknown;
    fromPartial<I extends {
        null_value?: NullValue | undefined;
        number_value?: number | undefined;
        string_value?: string | undefined;
        bool_value?: boolean | undefined;
        struct_value?: {
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        } | undefined;
        list_value?: any[] | undefined;
    } & {
        null_value?: NullValue | undefined;
        number_value?: number | undefined;
        string_value?: string | undefined;
        bool_value?: boolean | undefined;
        struct_value?: ({
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        } & {
            fields?: ({
                [x: string]: any | undefined;
            } & {
                [x: string]: ({
                    null_value?: NullValue | undefined;
                    number_value?: number | undefined;
                    string_value?: string | undefined;
                    bool_value?: boolean | undefined;
                    struct_value?: {
                        fields?: {
                            [x: string]: any | undefined;
                        } | undefined;
                    } | undefined;
                    list_value?: any[] | undefined;
                } & {
                    null_value?: NullValue | undefined;
                    number_value?: number | undefined;
                    string_value?: string | undefined;
                    bool_value?: boolean | undefined;
                    struct_value?: ({
                        fields?: {
                            [x: string]: any | undefined;
                        } | undefined;
                    } & {
                        fields?: ({
                            [x: string]: any | undefined;
                        } & {
                            [x: string]: ({
                                null_value?: NullValue | undefined;
                                number_value?: number | undefined;
                                string_value?: string | undefined;
                                bool_value?: boolean | undefined;
                                struct_value?: {
                                    fields?: {
                                        [x: string]: any | undefined;
                                    } | undefined;
                                } | undefined;
                                list_value?: any[] | undefined;
                            } & {
                                null_value?: NullValue | undefined;
                                number_value?: number | undefined;
                                string_value?: string | undefined;
                                bool_value?: boolean | undefined;
                                struct_value?: ({
                                    fields?: {
                                        [x: string]: any | undefined;
                                    } | undefined;
                                } & {
                                    fields?: ({
                                        [x: string]: any | undefined;
                                    } & {
                                        [x: string]: ({
                                            null_value?: NullValue | undefined;
                                            number_value?: number | undefined;
                                            string_value?: string | undefined;
                                            bool_value?: boolean | undefined;
                                            struct_value?: {
                                                fields?: {
                                                    [x: string]: any | undefined;
                                                } | undefined;
                                            } | undefined;
                                            list_value?: any[] | undefined;
                                        } & {
                                            null_value?: NullValue | undefined;
                                            number_value?: number | undefined;
                                            string_value?: string | undefined;
                                            bool_value?: boolean | undefined;
                                            struct_value?: ({
                                                fields?: {
                                                    [x: string]: any | undefined;
                                                } | undefined;
                                            } & {
                                                fields?: ({
                                                    [x: string]: any | undefined;
                                                } & any & { [K in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                            } & { [K_1 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                            list_value?: (any[] & any[] & { [K_2 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                                        } & { [K_3 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                                    } & { [K_4 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                } & { [K_5 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                list_value?: (any[] & any[] & { [K_6 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                            } & { [K_7 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                        } & { [K_8 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                    } & { [K_9 in Exclude<keyof I["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                    list_value?: (any[] & any[] & { [K_10 in Exclude<keyof I["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                } & { [K_11 in Exclude<keyof I["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
            } & { [K_12 in Exclude<keyof I["struct_value"]["fields"], string | number>]: never; }) | undefined;
        } & { [K_13 in Exclude<keyof I["struct_value"], "fields">]: never; }) | undefined;
        list_value?: (any[] & any[] & { [K_14 in Exclude<keyof I["list_value"], keyof any[]>]: never; }) | undefined;
    } & { [K_15 in Exclude<keyof I, keyof Value>]: never; }>(object: I): Value;
};
export declare const Struct: {
    encode(message: Struct, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Struct;
    fromJSON(object: any): Struct;
    toJSON(message: Struct): unknown;
    fromPartial<I extends {
        fields?: {
            [x: string]: any | undefined;
        } | undefined;
    } & {
        fields?: ({
            [x: string]: any | undefined;
        } & {
            [x: string]: ({
                null_value?: NullValue | undefined;
                number_value?: number | undefined;
                string_value?: string | undefined;
                bool_value?: boolean | undefined;
                struct_value?: {
                    fields?: {
                        [x: string]: any | undefined;
                    } | undefined;
                } | undefined;
                list_value?: any[] | undefined;
            } & {
                null_value?: NullValue | undefined;
                number_value?: number | undefined;
                string_value?: string | undefined;
                bool_value?: boolean | undefined;
                struct_value?: ({
                    fields?: {
                        [x: string]: any | undefined;
                    } | undefined;
                } & {
                    fields?: ({
                        [x: string]: any | undefined;
                    } & {
                        [x: string]: ({
                            null_value?: NullValue | undefined;
                            number_value?: number | undefined;
                            string_value?: string | undefined;
                            bool_value?: boolean | undefined;
                            struct_value?: {
                                fields?: {
                                    [x: string]: any | undefined;
                                } | undefined;
                            } | undefined;
                            list_value?: any[] | undefined;
                        } & {
                            null_value?: NullValue | undefined;
                            number_value?: number | undefined;
                            string_value?: string | undefined;
                            bool_value?: boolean | undefined;
                            struct_value?: ({
                                fields?: {
                                    [x: string]: any | undefined;
                                } | undefined;
                            } & {
                                fields?: ({
                                    [x: string]: any | undefined;
                                } & {
                                    [x: string]: ({
                                        null_value?: NullValue | undefined;
                                        number_value?: number | undefined;
                                        string_value?: string | undefined;
                                        bool_value?: boolean | undefined;
                                        struct_value?: {
                                            fields?: {
                                                [x: string]: any | undefined;
                                            } | undefined;
                                        } | undefined;
                                        list_value?: any[] | undefined;
                                    } & {
                                        null_value?: NullValue | undefined;
                                        number_value?: number | undefined;
                                        string_value?: string | undefined;
                                        bool_value?: boolean | undefined;
                                        struct_value?: ({
                                            fields?: {
                                                [x: string]: any | undefined;
                                            } | undefined;
                                        } & {
                                            fields?: ({
                                                [x: string]: any | undefined;
                                            } & {
                                                [x: string]: ({
                                                    null_value?: NullValue | undefined;
                                                    number_value?: number | undefined;
                                                    string_value?: string | undefined;
                                                    bool_value?: boolean | undefined;
                                                    struct_value?: {
                                                        fields?: {
                                                            [x: string]: any | undefined;
                                                        } | undefined;
                                                    } | undefined;
                                                    list_value?: any[] | undefined;
                                                } & any & { [K in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                                            } & { [K_1 in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                        } & { [K_2 in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                        list_value?: (any[] & any[] & { [K_3 in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                                    } & { [K_4 in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                                } & { [K_5 in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                            } & { [K_6 in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                            list_value?: (any[] & any[] & { [K_7 in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                        } & { [K_8 in Exclude<keyof I["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                    } & { [K_9 in Exclude<keyof I["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                } & { [K_10 in Exclude<keyof I["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                list_value?: (any[] & any[] & { [K_11 in Exclude<keyof I["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
            } & { [K_12 in Exclude<keyof I["fields"][string], keyof Value>]: never; }) | undefined;
        } & { [K_13 in Exclude<keyof I["fields"], string | number>]: never; }) | undefined;
    } & { [K_14 in Exclude<keyof I, "fields">]: never; }>(object: I): Struct;
};
export declare const Struct_FieldsEntry: {
    encode(message: Struct_FieldsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Struct_FieldsEntry;
    fromJSON(object: any): Struct_FieldsEntry;
    toJSON(message: Struct_FieldsEntry): unknown;
    fromPartial<I extends {
        key?: string | undefined;
        value?: {
            null_value?: NullValue | undefined;
            number_value?: number | undefined;
            string_value?: string | undefined;
            bool_value?: boolean | undefined;
            struct_value?: {
                fields?: {
                    [x: string]: any | undefined;
                } | undefined;
            } | undefined;
            list_value?: any[] | undefined;
        } | undefined;
    } & {
        key?: string | undefined;
        value?: ({
            null_value?: NullValue | undefined;
            number_value?: number | undefined;
            string_value?: string | undefined;
            bool_value?: boolean | undefined;
            struct_value?: {
                fields?: {
                    [x: string]: any | undefined;
                } | undefined;
            } | undefined;
            list_value?: any[] | undefined;
        } & {
            null_value?: NullValue | undefined;
            number_value?: number | undefined;
            string_value?: string | undefined;
            bool_value?: boolean | undefined;
            struct_value?: ({
                fields?: {
                    [x: string]: any | undefined;
                } | undefined;
            } & {
                fields?: ({
                    [x: string]: any | undefined;
                } & {
                    [x: string]: ({
                        null_value?: NullValue | undefined;
                        number_value?: number | undefined;
                        string_value?: string | undefined;
                        bool_value?: boolean | undefined;
                        struct_value?: {
                            fields?: {
                                [x: string]: any | undefined;
                            } | undefined;
                        } | undefined;
                        list_value?: any[] | undefined;
                    } & {
                        null_value?: NullValue | undefined;
                        number_value?: number | undefined;
                        string_value?: string | undefined;
                        bool_value?: boolean | undefined;
                        struct_value?: ({
                            fields?: {
                                [x: string]: any | undefined;
                            } | undefined;
                        } & {
                            fields?: ({
                                [x: string]: any | undefined;
                            } & {
                                [x: string]: ({
                                    null_value?: NullValue | undefined;
                                    number_value?: number | undefined;
                                    string_value?: string | undefined;
                                    bool_value?: boolean | undefined;
                                    struct_value?: {
                                        fields?: {
                                            [x: string]: any | undefined;
                                        } | undefined;
                                    } | undefined;
                                    list_value?: any[] | undefined;
                                } & {
                                    null_value?: NullValue | undefined;
                                    number_value?: number | undefined;
                                    string_value?: string | undefined;
                                    bool_value?: boolean | undefined;
                                    struct_value?: ({
                                        fields?: {
                                            [x: string]: any | undefined;
                                        } | undefined;
                                    } & {
                                        fields?: ({
                                            [x: string]: any | undefined;
                                        } & {
                                            [x: string]: ({
                                                null_value?: NullValue | undefined;
                                                number_value?: number | undefined;
                                                string_value?: string | undefined;
                                                bool_value?: boolean | undefined;
                                                struct_value?: {
                                                    fields?: {
                                                        [x: string]: any | undefined;
                                                    } | undefined;
                                                } | undefined;
                                                list_value?: any[] | undefined;
                                            } & {
                                                null_value?: NullValue | undefined;
                                                number_value?: number | undefined;
                                                string_value?: string | undefined;
                                                bool_value?: boolean | undefined;
                                                struct_value?: ({
                                                    fields?: {
                                                        [x: string]: any | undefined;
                                                    } | undefined;
                                                } & any & { [K in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                                list_value?: (any[] & any[] & { [K_1 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                                            } & { [K_2 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                                        } & { [K_3 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                    } & { [K_4 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                    list_value?: (any[] & any[] & { [K_5 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                                } & { [K_6 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                            } & { [K_7 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                        } & { [K_8 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                        list_value?: (any[] & any[] & { [K_9 in Exclude<keyof I["value"]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                    } & { [K_10 in Exclude<keyof I["value"]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                } & { [K_11 in Exclude<keyof I["value"]["struct_value"]["fields"], string | number>]: never; }) | undefined;
            } & { [K_12 in Exclude<keyof I["value"]["struct_value"], "fields">]: never; }) | undefined;
            list_value?: (any[] & any[] & { [K_13 in Exclude<keyof I["value"]["list_value"], keyof any[]>]: never; }) | undefined;
        } & { [K_14 in Exclude<keyof I["value"], keyof Value>]: never; }) | undefined;
    } & { [K_15 in Exclude<keyof I, keyof Struct_FieldsEntry>]: never; }>(object: I): Struct_FieldsEntry;
};
export declare const Observation: {
    encode(message: Observation, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Observation;
    fromJSON(object: any): Observation;
    toJSON(message: Observation): unknown;
    fromPartial<I extends {
        id?: Uint8Array | undefined;
        created_at?: string | undefined;
        timestamp?: Date | undefined;
        user_id?: string | undefined;
        links?: string[] | undefined;
        lat?: number | undefined;
        lon?: number | undefined;
        refs?: {
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        }[] | undefined;
        attachments?: {
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        }[] | undefined;
        tags?: {
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        } | undefined;
        metadata?: {
            location?: {
                precision?: number | undefined;
                altitude?: number | undefined;
            } | undefined;
            manual_location?: boolean | undefined;
        } | undefined;
    } & {
        id?: Uint8Array | undefined;
        created_at?: string | undefined;
        timestamp?: Date | undefined;
        user_id?: string | undefined;
        links?: (string[] & string[] & { [K in Exclude<keyof I["links"], keyof string[]>]: never; }) | undefined;
        lat?: number | undefined;
        lon?: number | undefined;
        refs?: ({
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        }[] & ({
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        } & {
            fields?: ({
                [x: string]: any | undefined;
            } & {
                [x: string]: ({
                    null_value?: NullValue | undefined;
                    number_value?: number | undefined;
                    string_value?: string | undefined;
                    bool_value?: boolean | undefined;
                    struct_value?: {
                        fields?: {
                            [x: string]: any | undefined;
                        } | undefined;
                    } | undefined;
                    list_value?: any[] | undefined;
                } & {
                    null_value?: NullValue | undefined;
                    number_value?: number | undefined;
                    string_value?: string | undefined;
                    bool_value?: boolean | undefined;
                    struct_value?: ({
                        fields?: {
                            [x: string]: any | undefined;
                        } | undefined;
                    } & {
                        fields?: ({
                            [x: string]: any | undefined;
                        } & {
                            [x: string]: ({
                                null_value?: NullValue | undefined;
                                number_value?: number | undefined;
                                string_value?: string | undefined;
                                bool_value?: boolean | undefined;
                                struct_value?: {
                                    fields?: {
                                        [x: string]: any | undefined;
                                    } | undefined;
                                } | undefined;
                                list_value?: any[] | undefined;
                            } & {
                                null_value?: NullValue | undefined;
                                number_value?: number | undefined;
                                string_value?: string | undefined;
                                bool_value?: boolean | undefined;
                                struct_value?: ({
                                    fields?: {
                                        [x: string]: any | undefined;
                                    } | undefined;
                                } & {
                                    fields?: ({
                                        [x: string]: any | undefined;
                                    } & {
                                        [x: string]: ({
                                            null_value?: NullValue | undefined;
                                            number_value?: number | undefined;
                                            string_value?: string | undefined;
                                            bool_value?: boolean | undefined;
                                            struct_value?: {
                                                fields?: {
                                                    [x: string]: any | undefined;
                                                } | undefined;
                                            } | undefined;
                                            list_value?: any[] | undefined;
                                        } & {
                                            null_value?: NullValue | undefined;
                                            number_value?: number | undefined;
                                            string_value?: string | undefined;
                                            bool_value?: boolean | undefined;
                                            struct_value?: ({
                                                fields?: {
                                                    [x: string]: any | undefined;
                                                } | undefined;
                                            } & {
                                                fields?: ({
                                                    [x: string]: any | undefined;
                                                } & any & { [K_1 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                            } & { [K_2 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                            list_value?: (any[] & any[] & { [K_3 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                                        } & { [K_4 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                                    } & { [K_5 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                } & { [K_6 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                list_value?: (any[] & any[] & { [K_7 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                            } & { [K_8 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                        } & { [K_9 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                    } & { [K_10 in Exclude<keyof I["refs"][number]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                    list_value?: (any[] & any[] & { [K_11 in Exclude<keyof I["refs"][number]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                } & { [K_12 in Exclude<keyof I["refs"][number]["fields"][string], keyof Value>]: never; }) | undefined;
            } & { [K_13 in Exclude<keyof I["refs"][number]["fields"], string | number>]: never; }) | undefined;
        } & { [K_14 in Exclude<keyof I["refs"][number], "fields">]: never; })[] & { [K_15 in Exclude<keyof I["refs"], keyof {
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
        attachments?: ({
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        }[] & ({
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        } & {
            fields?: ({
                [x: string]: any | undefined;
            } & {
                [x: string]: ({
                    null_value?: NullValue | undefined;
                    number_value?: number | undefined;
                    string_value?: string | undefined;
                    bool_value?: boolean | undefined;
                    struct_value?: {
                        fields?: {
                            [x: string]: any | undefined;
                        } | undefined;
                    } | undefined;
                    list_value?: any[] | undefined;
                } & {
                    null_value?: NullValue | undefined;
                    number_value?: number | undefined;
                    string_value?: string | undefined;
                    bool_value?: boolean | undefined;
                    struct_value?: ({
                        fields?: {
                            [x: string]: any | undefined;
                        } | undefined;
                    } & {
                        fields?: ({
                            [x: string]: any | undefined;
                        } & {
                            [x: string]: ({
                                null_value?: NullValue | undefined;
                                number_value?: number | undefined;
                                string_value?: string | undefined;
                                bool_value?: boolean | undefined;
                                struct_value?: {
                                    fields?: {
                                        [x: string]: any | undefined;
                                    } | undefined;
                                } | undefined;
                                list_value?: any[] | undefined;
                            } & {
                                null_value?: NullValue | undefined;
                                number_value?: number | undefined;
                                string_value?: string | undefined;
                                bool_value?: boolean | undefined;
                                struct_value?: ({
                                    fields?: {
                                        [x: string]: any | undefined;
                                    } | undefined;
                                } & {
                                    fields?: ({
                                        [x: string]: any | undefined;
                                    } & {
                                        [x: string]: ({
                                            null_value?: NullValue | undefined;
                                            number_value?: number | undefined;
                                            string_value?: string | undefined;
                                            bool_value?: boolean | undefined;
                                            struct_value?: {
                                                fields?: {
                                                    [x: string]: any | undefined;
                                                } | undefined;
                                            } | undefined;
                                            list_value?: any[] | undefined;
                                        } & {
                                            null_value?: NullValue | undefined;
                                            number_value?: number | undefined;
                                            string_value?: string | undefined;
                                            bool_value?: boolean | undefined;
                                            struct_value?: ({
                                                fields?: {
                                                    [x: string]: any | undefined;
                                                } | undefined;
                                            } & {
                                                fields?: ({
                                                    [x: string]: any | undefined;
                                                } & any & { [K_16 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                            } & { [K_17 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                            list_value?: (any[] & any[] & { [K_18 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                                        } & { [K_19 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                                    } & { [K_20 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                } & { [K_21 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                list_value?: (any[] & any[] & { [K_22 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                            } & { [K_23 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                        } & { [K_24 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                    } & { [K_25 in Exclude<keyof I["attachments"][number]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                    list_value?: (any[] & any[] & { [K_26 in Exclude<keyof I["attachments"][number]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                } & { [K_27 in Exclude<keyof I["attachments"][number]["fields"][string], keyof Value>]: never; }) | undefined;
            } & { [K_28 in Exclude<keyof I["attachments"][number]["fields"], string | number>]: never; }) | undefined;
        } & { [K_29 in Exclude<keyof I["attachments"][number], "fields">]: never; })[] & { [K_30 in Exclude<keyof I["attachments"], keyof {
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
        tags?: ({
            fields?: {
                [x: string]: any | undefined;
            } | undefined;
        } & {
            fields?: ({
                [x: string]: any | undefined;
            } & {
                [x: string]: ({
                    null_value?: NullValue | undefined;
                    number_value?: number | undefined;
                    string_value?: string | undefined;
                    bool_value?: boolean | undefined;
                    struct_value?: {
                        fields?: {
                            [x: string]: any | undefined;
                        } | undefined;
                    } | undefined;
                    list_value?: any[] | undefined;
                } & {
                    null_value?: NullValue | undefined;
                    number_value?: number | undefined;
                    string_value?: string | undefined;
                    bool_value?: boolean | undefined;
                    struct_value?: ({
                        fields?: {
                            [x: string]: any | undefined;
                        } | undefined;
                    } & {
                        fields?: ({
                            [x: string]: any | undefined;
                        } & {
                            [x: string]: ({
                                null_value?: NullValue | undefined;
                                number_value?: number | undefined;
                                string_value?: string | undefined;
                                bool_value?: boolean | undefined;
                                struct_value?: {
                                    fields?: {
                                        [x: string]: any | undefined;
                                    } | undefined;
                                } | undefined;
                                list_value?: any[] | undefined;
                            } & {
                                null_value?: NullValue | undefined;
                                number_value?: number | undefined;
                                string_value?: string | undefined;
                                bool_value?: boolean | undefined;
                                struct_value?: ({
                                    fields?: {
                                        [x: string]: any | undefined;
                                    } | undefined;
                                } & {
                                    fields?: ({
                                        [x: string]: any | undefined;
                                    } & {
                                        [x: string]: ({
                                            null_value?: NullValue | undefined;
                                            number_value?: number | undefined;
                                            string_value?: string | undefined;
                                            bool_value?: boolean | undefined;
                                            struct_value?: {
                                                fields?: {
                                                    [x: string]: any | undefined;
                                                } | undefined;
                                            } | undefined;
                                            list_value?: any[] | undefined;
                                        } & {
                                            null_value?: NullValue | undefined;
                                            number_value?: number | undefined;
                                            string_value?: string | undefined;
                                            bool_value?: boolean | undefined;
                                            struct_value?: ({
                                                fields?: {
                                                    [x: string]: any | undefined;
                                                } | undefined;
                                            } & {
                                                fields?: ({
                                                    [x: string]: any | undefined;
                                                } & any & { [K_31 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                            } & { [K_32 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                            list_value?: (any[] & any[] & { [K_33 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                                        } & { [K_34 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                                    } & { [K_35 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                                } & { [K_36 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                                list_value?: (any[] & any[] & { [K_37 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                            } & { [K_38 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"][string], keyof Value>]: never; }) | undefined;
                        } & { [K_39 in Exclude<keyof I["tags"]["fields"][string]["struct_value"]["fields"], string | number>]: never; }) | undefined;
                    } & { [K_40 in Exclude<keyof I["tags"]["fields"][string]["struct_value"], "fields">]: never; }) | undefined;
                    list_value?: (any[] & any[] & { [K_41 in Exclude<keyof I["tags"]["fields"][string]["list_value"], keyof any[]>]: never; }) | undefined;
                } & { [K_42 in Exclude<keyof I["tags"]["fields"][string], keyof Value>]: never; }) | undefined;
            } & { [K_43 in Exclude<keyof I["tags"]["fields"], string | number>]: never; }) | undefined;
        } & { [K_44 in Exclude<keyof I["tags"], "fields">]: never; }) | undefined;
        metadata?: ({
            location?: {
                precision?: number | undefined;
                altitude?: number | undefined;
            } | undefined;
            manual_location?: boolean | undefined;
        } & {
            location?: ({
                precision?: number | undefined;
                altitude?: number | undefined;
            } & {
                precision?: number | undefined;
                altitude?: number | undefined;
            } & { [K_45 in Exclude<keyof I["metadata"]["location"], keyof Observation_Metadata_Location>]: never; }) | undefined;
            manual_location?: boolean | undefined;
        } & { [K_46 in Exclude<keyof I["metadata"], keyof Observation_Metadata>]: never; }) | undefined;
    } & { [K_47 in Exclude<keyof I, keyof Observation>]: never; }>(object: I): Observation;
};
export declare const Observation_Metadata: {
    encode(message: Observation_Metadata, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Observation_Metadata;
    fromJSON(object: any): Observation_Metadata;
    toJSON(message: Observation_Metadata): unknown;
    fromPartial<I extends {
        location?: {
            precision?: number | undefined;
            altitude?: number | undefined;
        } | undefined;
        manual_location?: boolean | undefined;
    } & {
        location?: ({
            precision?: number | undefined;
            altitude?: number | undefined;
        } & {
            precision?: number | undefined;
            altitude?: number | undefined;
        } & { [K in Exclude<keyof I["location"], keyof Observation_Metadata_Location>]: never; }) | undefined;
        manual_location?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I, keyof Observation_Metadata>]: never; }>(object: I): Observation_Metadata;
};
export declare const Observation_Metadata_Location: {
    encode(message: Observation_Metadata_Location, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Observation_Metadata_Location;
    fromJSON(object: any): Observation_Metadata_Location;
    toJSON(message: Observation_Metadata_Location): unknown;
    fromPartial<I extends {
        precision?: number | undefined;
        altitude?: number | undefined;
    } & {
        precision?: number | undefined;
        altitude?: number | undefined;
    } & { [K in Exclude<keyof I, keyof Observation_Metadata_Location>]: never; }>(object: I): Observation_Metadata_Location;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
