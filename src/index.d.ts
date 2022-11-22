export function encode(obj: typeof import("../types/schema/observation")): Buffer;
export function decode(buf: Buffer, opts: {
    key: Buffer;
    index: number;
}): typeof import("../types/schema/observation");
