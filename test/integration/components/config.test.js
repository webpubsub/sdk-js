/* global describe, it */
/* eslint no-console: 0, object-shorthand: 0 */

import assert from 'assert';
import Webpubsub from '../../../src/node/index';

describe('components/config', () => {
  describe('AuthKey parameter', () => {
    it('get/set', () => {
    let webpubsub = new Webpubsub({
      subscribeKey: 'mySubKey',
      publishKey: 'myPublishKey',
      authKey: 'authKey1',
      uuid: 'myUUID'
    });
    assert.equal(webpubsub.getAuthKey(), 'authKey1');
    webpubsub.setAuthKey('authKey2');
    assert.equal(webpubsub.getAuthKey(), 'authKey2');
    });
  });

  describe('uuid Parameter', () => {
    it('throws when not provided value', () => {
      let config = {
        subscribeKey: 'mySubKey',
        publishKey: 'myPublishKey',
        authKey: 'authKey1'
      };
      assert.throws(() => {
        new Webpubsub(config);
      });
    });

    it('get/set', () => {
      let webpubsub = new Webpubsub({
        subscribeKey: 'mySubKey',
        publishKey: 'myPublishKey',
        uuid: 'uuid1'
      });
      assert.equal(webpubsub.getUUID(), 'uuid1');
      webpubsub.setUUID('uuid2');
      assert.equal(webpubsub.getUUID(), 'uuid2');
    });

    it('throws when invalid value provided', () => {
      let config = {
        subscribeKey: 'mySubKey',
        publishKey: 'myPublishKey',
        uuid: ' '
      };
      assert.throws(() => {
        new Webpubsub(config);
      });
    });

    it('setUUID throws while trying to set invalid uuid', () => {
      let webpubsub = new Webpubsub({
        subscribeKey: 'mySubKey',
        publishKey: 'myPublishKey',
        uuid: 'myUUID'
      });
      assert.throws(() => {
        webpubsub.setUUID(' ');
      });
    });
  });
});
