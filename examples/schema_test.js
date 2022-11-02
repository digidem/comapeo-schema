const { Observation } = require('../build/observation');
const Hypercore = require('hypercore');
const ram = require('random-access-memory');

const schema = Observation.encode({
  id: 'test-id',
  version: '1',
  createdAt: new Date(),
  type: 'Observation',
  links: '',
  refs: [],
  attachments: [],
  schemaVersion: 1
}).finish();

const core = new Hypercore(ram, { valueEncoding: 'binary' });
core.append(schema);

(async () => {
  try {
    const data = await core.get(0);
    if (Buffer.compare(data, schema) !== 0) {
      throw new Error(`data doesn't match: ${data} != ${schema}`);
    } else {
      console.log('data matches <3');
    }
  } catch (err) {
    console.log(err);
  }
})()

