/* global describe, beforeEach, it, before, after */
/* eslint no-console: 0 */

import assert from 'assert';
import Webpubsub from '../../../src/node/index';

describe('getFileUrl', () => {
  it('constructs proper url with custom origin string', () => {
    const webpubsub = new Webpubsub({
      subscribeKey: 'demo',
      publishKey: 'demo',
      uuid: 'myUUID',
      origin: 'example.com'
    });

    const url = webpubsub.getFileUrl({ channel: 'channel', id: 'id', name: 'name' });
    const pnsdk = `Webpubsub-JS-${webpubsub._config.sdkFamily}%2F${webpubsub._config.getVersion()}`;
    
    assert.equal(url, `https://example.com/v1/files/demo/channels/channel/files/id/name?uuid=myUUID&pnsdk=${pnsdk}`);
  });

  it('constructs proper url with custom origin array', () => {
    const webpubsub = new Webpubsub({
      subscribeKey: 'demo',
      publishKey: 'demo',
      uuid: 'myUUID',
      origin: ['test1.example.com', 'test2.example.com']
    });

    const url = webpubsub.getFileUrl({ channel: 'channel', id: 'id', name: 'name' });
    const pnsdk = `Webpubsub-JS-${webpubsub._config.sdkFamily}%2F${webpubsub._config.getVersion()}`;
    
    assert(url === `https://test1.example.com/v1/files/demo/channels/channel/files/id/name?uuid=myUUID&pnsdk=${pnsdk}`
        || url === `https://test2.example.com/v1/files/demo/channels/channel/files/id/name?uuid=myUUID&pnsdk=${pnsdk}`);
  });
});
