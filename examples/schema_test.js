// import { Observation } from '../types/observation.js';
import { encode, decode } from '../src/index.js'
import Hypercore from 'hypercore';
import ram from 'random-access-memory';
import { randomBytes } from 'node:crypto'

const schema = encode({
  id: randomBytes(32),
  createdAt: new Date(),
  links: [],
  refs: [],
  attachments: [],
});

const core = new Hypercore(ram, { valueEncoding: 'binary' });
core.append(schema);

try {
  const data = await core.get(0);
  console.log(decode(data));
  if (Buffer.compare(data, schema) !== 0) {
    throw new Error(`data doesn't match: ${data} != ${schema}`);
  } else {
    console.log('data matches <3');
  }
} catch (err) {
  console.log(err);
}
