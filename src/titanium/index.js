import CborReader from 'cbor-sync';
import Cbor from '../cbor/common';
import WebPubSubCore from '../core/webpubsub-common';
import Networking from '../networking';
import { del, get, patch, post } from '../networking/modules/titanium';

class Webpubsub extends WebPubSubCore {
  constructor(setup) {
    setup.cbor = new Cbor(CborReader.decode, (base64String) => Buffer.from(base64String, 'base64'));
    setup.sdkFamily = 'TitaniumSDK';
    setup.networking = new Networking({
      del,
      get,
      post,
      patch,
    });

    super(setup);
  }
}

export { Webpubsub as default };
