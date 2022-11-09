import { Observation } from '../types/observation.js';

const schemaVersion = "1";
const schemaTypesMap = {
  observation: {magicByte: "1", schema: Observation }
};

export const encode = (obj) => {
  // obj is validated against the protobuf and has the necessary fields
  // returns a buf ready to be sended to a core
  // this bufs has the protobuf data prepended with 2 magic bytes 
  // informing record type and schema version respectively
  const schema = schemaTypesMap[obj.type].schema;
  const buf = schema.encode(obj).finish();
  const type = Buffer.from(schemaTypesMap[obj.type].magicByte);
  const version = Buffer.from(schemaVersion);
  const bufs = [type, version, buf];
  return Buffer.concat(bufs);
};

const findSchema = (type) => (acc,val) => {
  if(schemaTypesMap[val].magicByte === type){
    return val;
  }
  return acc;
};

export const decode = (buf) => {
  // receives a Buffer and turns it into an object validated against the schema
  const type = buf.slice(0, 1).toString();
  const version = buf.slice(1, 2);
  const key = Object.keys(schemaTypesMap).reduce(findSchema(type), null)
  const schema = schemaTypesMap[key].schema;
  console.log("record of type", type);
  console.log("schema version", version.toString());
  return schema.decode(buf.slice(2, buf.length));
};
