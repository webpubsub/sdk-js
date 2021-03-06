/* global describe, beforeEach, it, before, after */
/* eslint no-console: 0 */

import assert from 'assert';
import nock from 'nock';
import packageJSON from '../../../package.json';
import Webpubsub from '../../../src/node/index';
import utils from '../../utils';

describe('#components/networking', () => {
  let webpubsub;
  let webpubsubPartner;
  let webpubsubSDKName;

  before(() => {
    nock.disableNetConnect();
  });

  after(() => {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
    webpubsub = new Webpubsub({
      subscribeKey: 'mySubKey',
      publishKey: 'myPublishKey',
      uuid: 'myUUID',
    });
    webpubsubPartner = new Webpubsub({
      subscribeKey: 'mySubKey',
      publishKey: 'myPublishKey',
      uuid: 'myUUID',
      partnerId: 'alligator',
    });
    webpubsubSDKName = new Webpubsub({
      subscribeKey: 'mySubKey',
      publishKey: 'myPublishKey',
      uuid: 'myUUID',
      sdkName: 'custom-sdk/1.0.0',
    });
  });

  describe('supports user-agent generation with partner', () => {
    it('returns a correct user-agent object', (done) => {
      utils
        .createNock()
        .get('/time/0')
        .query({
          uuid: 'myUUID',
          pnsdk: `Webpubsub-JS-Nodejs-alligator/${packageJSON.version}`,
        })
        .reply(200, [14570763868573725]);

      webpubsubPartner.time((status) => {
        assert.equal(status.error, false);
        assert.equal(status.statusCode, 200);
        done();
      });
    });
  });

  describe('supports PNSDK generation with custom SDK name', () => {
    it('returns a correct response object', (done) => {
      utils
        .createNock()
        .get('/time/0')
        .query({ uuid: 'myUUID', pnsdk: 'custom-sdk/1.0.0' })
        .reply(200, [14570763868573725]);

      webpubsubSDKName.time((status) => {
        assert.equal(status.error, false);
        assert.equal(status.statusCode, 200);
        done();
      });
    });
  });

  describe('callback handling', () => {
    it('returns a correct status object', (done) => {
      utils
        .createNock()
        .get('/time/0')
        .query(true)
        .reply(200, [14570763868573725]);

      webpubsub.time((status) => {
        assert.equal(status.error, false);
        assert.equal(status.statusCode, 200);
        done();
      });
    });

    it('returns a correct status object on 403', (done) => {
      utils
        .createNock()
        .get('/time/0')
        .query(true)
        .reply(403, [14570763868573725]);

      webpubsub.time((status) => {
        assert.equal(status.error, true);
        assert.equal(status.statusCode, 403);
        assert.equal(status.category, 'PNAccessDeniedCategory');
        done();
      });
    });

    it('returns a correct status object on 400', (done) => {
      utils
        .createNock()
        .get('/time/0')
        .query(true)
        .reply(400, [14570763868573725]);

      webpubsub.time((status) => {
        assert.equal(status.error, true);
        assert.equal(status.statusCode, 400);
        assert.equal(status.category, 'PNBadRequestCategory');
        done();
      });
    });
  });
});
