/*       */

import WebPubSubCore from '../core/webpubsub-common';
// import Database from '../db/common';
import Networking from '../networking';
import { del, get, patch, post } from '../networking/modules/nativescript';

export default class extends WebPubSubCore {
  constructor(setup: any) {
    // setup.db = new Database();
    setup.networking = new Networking({
      del,
      get,
      post,
      patch,
    });
    setup.sdkFamily = 'NativeScript';
    super(setup);
  }
}
