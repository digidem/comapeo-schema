import Schema from '../src';
import Hypercore from 'hypercore';
import ram from 'random-access-memory';

const schema = new Schema({
  id: 'test-id',
  version: '0',
  schemaVersion: 1,
  createdAt: (new Date()).toString(),
  type: 'Animal',
});

const core = new Hypercore(ram, { valueEncoding: 'binary' });
core.append(schema.encode());

(async () => {
  try {
    const data = await core.get(0);
    if (!Schema.equals(Schema.decode(data), schema)) {
      throw new Error(`data doesn't match: ${data} != ${schema}`);
    } else {
      console.log('data matches');
    }
  } catch (err) {
    console.log(err);
  }
})()

