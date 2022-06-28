/* global describe, beforeEach, it, before, after */
/* eslint no-console: 0 */

import assert from 'assert';
import nock from 'nock';
import Webpubsub from '../../../src/node/index';
import utils from '../../utils';

describe('publish endpoints', () => {
  let webpubsub;

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
      authKey: 'myAuthKey',
      useRandomIVs: false
    });
  });

  describe('##validation', () => {
    it('fails if channel is missing', (done) => {
      const scope = utils
        .createNock()
        .get('/publish/*')
        .reply(200, '[1,"Sent","14647523059145592"]');

      webpubsub.publish({ message: { such: 'object' } }).catch((err) => {
        assert.equal(scope.isDone(), false);
        assert.equal(err.status.message, 'Missing Channel');
        done();
      });
    });
  });

  it('publishes a complex object via GET', (done) => {
    const scope = utils
      .createNock()
      .get(
        '/publish/myPublishKey/mySubKey/0/ch1/0/%7B%22such%22%3A%22object%22%7D'
      )
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        auth: 'myAuthKey',
      })
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.publish(
      { message: { such: 'object' }, channel: 'ch1' },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.timetoken, 14647523059145592);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('publishes without replication via GET', (done) => {
    const scope = utils
      .createNock()
      .get(
        '/publish/myPublishKey/mySubKey/0/ch1/0/%7B%22such%22%3A%22object%22%7D'
      )
      .query({
        norep: true,
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        auth: 'myAuthKey',
      })
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.publish(
      { message: { such: 'object' }, channel: 'ch1', replicate: false },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.timetoken, 14647523059145592);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('publishes a complex object via GET with encryption', (done) => {
    const scope = utils
      .createNock()
      .get(
        '/publish/myPublishKey/mySubKey/0/ch1/0/%22toDEeIZkmIyoiLpSojGu7n3%2B2t1rn7%2FDsrEZ1r8JKR4%3D%22'
      )
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        auth: 'myAuthKey',
      })
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.setCipherKey('myCipherKey');

    webpubsub.publish(
      { message: { such: 'object' }, channel: 'ch1' },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.timetoken, 14647523059145592);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('supports ttl param', (done) => {
    const scope = utils
      .createNock()
      .get(
        '/publish/myPublishKey/mySubKey/0/ch1/0/%22toDEeIZkmIyoiLpSojGu7n3%2B2t1rn7%2FDsrEZ1r8JKR4%3D%22'
      )
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        auth: 'myAuthKey',
        ttl: '10',
      })
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.setCipherKey('myCipherKey');
    webpubsub.publish(
      { message: { such: 'object' }, channel: 'ch1', ttl: 10 },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.timetoken, 14647523059145592);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('supports storeInHistory=0', (done) => {
    const scope = utils
      .createNock()
      .get(
        '/publish/myPublishKey/mySubKey/0/ch1/0/%22toDEeIZkmIyoiLpSojGu7n3%2B2t1rn7%2FDsrEZ1r8JKR4%3D%22'
      )
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        auth: 'myAuthKey',
        store: '0',
      })
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.setCipherKey('myCipherKey');

    webpubsub.publish(
      { message: { such: 'object' }, channel: 'ch1', storeInHistory: false },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.timetoken, 14647523059145592);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('supports storeInHistory=1', (done) => {
    const scope = utils
      .createNock()
      .get(
        '/publish/myPublishKey/mySubKey/0/ch1/0/%22toDEeIZkmIyoiLpSojGu7n3%2B2t1rn7%2FDsrEZ1r8JKR4%3D%22'
      )
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        auth: 'myAuthKey',
        store: '1',
      })
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.setCipherKey('myCipherKey');

    webpubsub.publish(
      { message: { such: 'object' }, channel: 'ch1', storeInHistory: true },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.timetoken, 14647523059145592);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('publishes a complex object via POST', (done) => {
    const scope = utils
      .createNock()
      .post('/publish/myPublishKey/mySubKey/0/ch1/0', '{"such":"object"}')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        auth: 'myAuthKey',
      })
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.publish(
      { message: { such: 'object' }, channel: 'ch1', sendByPost: true },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.timetoken, 14647523059145592);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('publishes a complex object via POST with encryption', (done) => {
    const scope = utils
      .createNock()
      .post(
        '/publish/myPublishKey/mySubKey/0/ch1/0',
        '"toDEeIZkmIyoiLpSojGu7n3+2t1rn7/DsrEZ1r8JKR4="'
      )
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        auth: 'myAuthKey',
      })
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.setCipherKey('myCipherKey');

    webpubsub.publish(
      { message: { such: 'object' }, channel: 'ch1', sendByPost: true },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.timetoken, 14647523059145592);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('should add publish API telemetry information', (done) => {
    let scope = utils.createNock().get('/publish/myPublishKey/mySubKey/0/ch1/0/%7B%22such%22%3A%22object%22%7D').query(true);
    const delays = [100, 200, 300, 400];
    const countedDelays = delays.slice(0, delays.length - 1);
    const average = Math.floor(countedDelays.reduce((acc, delay) => acc + delay, 0) / countedDelays.length);
    const leeway = 50;

    utils.runAPIWithResponseDelays(scope,
      200,
      '[1,"Sent","14647523059145592"]',
      delays,
      (completion) => {
        webpubsub.publish(
          { message: { such: 'object' }, channel: 'ch1' },
          () => { completion(); }
        );
      })
      .then((lastRequest) => {
        utils.verifyRequestTelemetry(lastRequest.path, 'l_pub', average, leeway);
        done();
      });
  }).timeout(60000);

  describe('#fire', () => {
    it('publishes a complex object via GET', (done) => {
      const scope = utils
        .createNock()
        .get(
          '/publish/myPublishKey/mySubKey/0/ch1/0/%7B%22such%22%3A%22object%22%7D'
        )
        .query({
          norep: true,
          store: 0,
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          auth: 'myAuthKey',
        })
        .reply(200, '[1,"Sent","14647523059145592"]');

      webpubsub.fire(
        { message: { such: 'object' }, channel: 'ch1' },
        (status, response) => {
          assert.equal(status.error, false);
          assert.deepEqual(response.timetoken, 14647523059145592);
          assert.equal(scope.isDone(), true);
          done();
        }
      );
    });
  });
});
