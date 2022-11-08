import { Observation } from '../types/observation.js';

export const encode = (obj) => {
  // obj is validated against the protobuf and has the necessary fields
  // returns a buf ready to be sended to a core
  // this bufs has the protobuf data prepended with 2 magic bytes 
  // informing record type and schema version respectively
  const buf = Observation.encode(obj).finish();
  const type = Buffer.from([49]);
  const version = Buffer.from([49]);
  const bufs = [type, version, buf];
  return Buffer.concat(bufs);
};

export const decode = (buf) => {
  // receives a Buffer and turns it into an object validated against the schema
  const type = buf.slice(0, 1);
  const version = buf.slice(1, 2);
  console.log("record of type", type.toString());
  console.log("schema version", version.toString());
  return Observation.decode(buf.slice(2, buf.length));
};
