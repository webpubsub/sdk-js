import CborReader from 'cbor-sync';
import Cbor from '../cbor/common';
import WebPubSubCore from '../core/webpubsub-common';
import NodeCryptography from '../crypto/modules/node';
import WebPubSubFile from '../file/modules/node';
import Networking from '../networking';
import { del, get, getfile, patch, post, postfile } from '../networking/modules/mp-weixin';


export default class extends WebPubSubCore {
  constructor(setup) {
    setup.cbor = new Cbor(CborReader.decode, (base64String) => Buffer.from(base64String, 'base64'));
    setup.networking = new Networking({
      del,
      get,
      post,
      patch,
      getfile,
      postfile,
    });
    setup.sdkFamily = 'mp-weixin';

    setup.WebPubSubFile = WebPubSubFile;
    setup.cryptography = new NodeCryptography();

    super(setup);
  }
};
