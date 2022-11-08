// import { Observation } from '../types/observation.js';
import { encode, decode } from '../src/index.js'
import Hypercore from 'hypercore';
import ram from 'random-access-memory';
import { randomBytes } from 'node:crypto'

const record = encode({
  id: randomBytes(32),
  createdAt: new Date('2022-04-01'),
  timestamp: new Date(),
  links: [],
  refs: [],
  attachments: [],
});

const core = new Hypercore(ram, { valueEncoding: 'binary' });
core.append(record);

try {
  const data = await core.get(0);
  console.log(decode(data));
  if (Buffer.compare(data, record) !== 0) {
    throw new Error(`data doesn't match: ${data} != ${record}`);
  } else {
    console.log('data matches <3');
  }
} catch (err) {
  console.log(err);
}
