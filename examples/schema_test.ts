import Schema from "../src";

const schema = new Schema({
  id: 'test-id',
  version: '1',
  createdAt: (new Date()).toString(),
  type: 'Animal', // maybe this should be an enum??
  links: 'hi',
  schemaVersion: 10,
  refs: [{ test: true }]
});

console.log(schema);
console.log(Schema.decode({ id: 'hola', createdAt: (new Date()).toString() }));

