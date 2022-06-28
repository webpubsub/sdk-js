import { Buffer } from 'buffer';
import CborReader from 'cbor-sync';
import Cbor from '../cbor/common';
import WebPubSubCore from '../core/webpubsub-common';
import WebPubSubFile from '../file/modules/react-native';
import Networking from '../networking';
import { getfile, postfile } from '../networking/modules/react_native';
import { del, get, patch, post } from '../networking/modules/web-node';


global.Buffer = global.Buffer || Buffer;

export default class extends WebPubSubCore {
  constructor(setup) {
    setup.cbor = new Cbor(CborReader.decode, (base64String) => Buffer.from(base64String, 'base64'));

    setup.WebPubSubFile = WebPubSubFile;

    setup.networking = new Networking({
      del,
      get,
      post,
      patch,
      getfile,
      postfile,
    });
    setup.sdkFamily = 'ReactNative';
    setup.ssl = true;

    super(setup);
  }
}
