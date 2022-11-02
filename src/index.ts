import { JsonValue } from '@bufbuild/protobuf';
import { Observation } from './gen/observation_pb';

class Schema extends Observation {
  constructor(obj: Object) {
    super(obj);
  }

  static decode(data: Uint8Array) {
    return Schema.fromBinary(data);
  }

  encode() {
    return this.toBinary();
  }

  validate() {
  }
};

export default Schema;
