import CborReader from 'cbor-sync';
import Cbor from '../cbor/common';
import WebPubSubCore from '../core/webpubsub-common';
import NodeCryptography from '../crypto/modules/node';
import WebPubSubFile from '../file/modules/node';
import Networking from '../networking';
import { keepAlive, proxy } from '../networking/modules/node';
import { del, get, getfile, patch, post, postfile } from '../networking/modules/web-node';


export = class extends WebPubSubCore {
  constructor(setup: any) {
    setup.cbor = new Cbor(CborReader.decode, (base64String: string) => Buffer.from(base64String, 'base64'));
    setup.networking = new Networking({
      keepAlive,
      del,
      get,
      post,
      patch,
      proxy,
      getfile,
      postfile,
    });
    setup.sdkFamily = 'Nodejs';

    setup.WebPubSubFile = WebPubSubFile;
    setup.cryptography = new NodeCryptography();

    if (!('ssl' in setup)) {
      setup.ssl = true;
    }

    super(setup);
  }
};
