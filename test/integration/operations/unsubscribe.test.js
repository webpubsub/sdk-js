/* global describe, beforeEach, it, before, afterEach, after */
/* eslint no-console: 0 */

import assert from 'assert';
import nock from 'nock';
import Webpubsub from '../../../src/node/index';
import utils from '../../utils';

describe('unsubscribe', () => {
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
      subscribeKey: 'mySubscribeKey',
      publishKey: 'myPublishKey',
      uuid: 'myUUID',
    });
    webpubsub.setHeartbeatInterval(0);
  });

  afterEach(() => {
    webpubsub.removeAllListeners();
    webpubsub.stop();
  });

  describe('#unsubscribe', () => {
    it('supports leaving for one channel', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/subscribe/mySubscribeKey/ch1/0')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          heartbeat: 300,
        })
        .reply(
          200,
          '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Enter Message Here"},"b":"coolChan-bnel"}]}'
        )
        .get('/v2/presence/sub-key/mySubscribeKey/channel/ch1/leave')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
        })
        .reply(200, '{ "status": 200, "message": "OK", "service": "Presence"}');

      webpubsub.addListener({
        status(status) {
          if (status.category !== 'PNConnectedCategory') {
            console.log('status', JSON.stringify(status ))
            assert.equal(status.error, false);
            assert.equal(scope.isDone(), true);
            assert.deepEqual(status.affectedChannels, ['ch1']);
            assert.deepEqual(status.affectedChannelGroups, []);
            done();
          }
        },
      });

      webpubsub.subscribe({ channels: ['ch1'] });
      webpubsub.unsubscribe({ channels: ['ch1'] });
    });

    it('supports leaving for multiple channels', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/subscribe/mySubscribeKey/ch1%2Cch2/0')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          heartbeat: 300,
        })
        .reply(
          200,
          '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Enter Message Here"},"b":"coolChan-bnel"}]}'
        )
        .get('/v2/presence/sub-key/mySubscribeKey/channel/ch1%2Cch2/leave')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
        })
        .reply(200, '{ "status": 200, "message": "OK", "service": "Presence"}');

      webpubsub.addListener({
        status(status) {
          if (status.category !== 'PNConnectedCategory') {
            assert.equal(status.error, false);
            assert.equal(scope.isDone(), true);
            assert.deepEqual(status.affectedChannels, ['ch1', 'ch2']);
            assert.deepEqual(status.affectedChannelGroups, []);
            done();
          }
        },
      });

      webpubsub.subscribe({ channels: ['ch1', 'ch2'] });
      webpubsub.unsubscribe({ channels: ['ch1', 'ch2'] });
    });

    it('supports leaving for one channel group', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/subscribe/mySubscribeKey/%2C/0')
        .query({
          'channel-group': 'cg1',
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          heartbeat: 300,
        })
        .reply(
          200,
          '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Enter Message Here"},"b":"coolChan-bnel"}]}'
        )
        .get('/v2/presence/sub-key/mySubscribeKey/channel/%2C/leave')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          'channel-group': 'cg1',
        })
        .reply(200, '{ "status": 200, "message": "OK", "service": "Presence"}');

      webpubsub.addListener({
        status(status) {
          if (status.category !== 'PNConnectedCategory') {
            assert.equal(status.error, false);
            assert.equal(scope.isDone(), true);
            assert.deepEqual(status.affectedChannels, []);
            assert.deepEqual(status.affectedChannelGroups, ['cg1']);
            done();
          }
        },
      });

      webpubsub.subscribe({ channelGroups: ['cg1'] });
      webpubsub.unsubscribe({ channelGroups: ['cg1'] });
    });

    it('supports leaving for multiple channel group', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/subscribe/mySubscribeKey/%2C/0')
        .query({
          'channel-group': 'cg1,cg2',
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          heartbeat: 300,
        })
        .reply(
          200,
          '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Enter Message Here"},"b":"coolChan-bnel"}]}'
        )
        .get('/v2/presence/sub-key/mySubscribeKey/channel/%2C/leave')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          'channel-group': 'cg1,cg2',
        })
        .reply(200, '{ "status": 200, "message": "OK", "service": "Presence"}');

      webpubsub.addListener({
        status(status) {
          if (status.category !== 'PNConnectedCategory') {
            assert.equal(status.error, false);
            assert.equal(scope.isDone(), true);
            assert.deepEqual(status.affectedChannels, []);
            assert.deepEqual(status.affectedChannelGroups, ['cg1', 'cg2']);
            done();
          }
        },
      });

      webpubsub.subscribe({ channelGroups: ['cg1', 'cg2'] });
      webpubsub.unsubscribe({ channelGroups: ['cg1', 'cg2'] });
    });

    it('supports partial leaving for channels', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/presence/sub-key/mySubscribeKey/channel/ch1/leave')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
        })
        .reply(200, '{ "status": 200, "message": "OK", "service": "Presence"}');

      webpubsub.addListener({
        status(status) {
          if (status.operation !== 'PNUnsubscribeOperation') return;
          assert.equal(status.error, false);
          assert.equal(scope.isDone(), true);
          assert.deepEqual(status.affectedChannels, ['ch1']);
          assert.deepEqual(status.affectedChannelGroups, []);
          done();
        },
      });

      webpubsub.subscribe({ channels: ['ch1', 'ch2'] });
      webpubsub.unsubscribe({ channels: ['ch1', 'ch3'] });
    });

    it('supports partial leaving for channel groups', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/presence/sub-key/mySubscribeKey/channel/%2C/leave')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          'channel-group': 'cg1',
        })
        .reply(200, '{ "status": 200, "message": "OK", "service": "Presence"}');

      webpubsub.addListener({
        status(status) {
          if (status.operation !== 'PNUnsubscribeOperation') return;
          assert.equal(status.error, false);
          assert.equal(scope.isDone(), true);
          assert.deepEqual(status.affectedChannels, []);
          assert.deepEqual(status.affectedChannelGroups, ['cg1']);
          done();
        },
      });

      webpubsub.subscribe({ channelGroups: ['cg1', 'cg2'] });
      webpubsub.unsubscribe({ channelGroups: ['cg1', 'cg3'] });
    });
  });

  describe('#unsubscribeAll', () => {
    it('supports leaving channels / channel groups', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/presence/sub-key/mySubscribeKey/channel/ch1%2Cch2/leave')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          'channel-group': 'cg1,cg2',
        })
        .reply(200, '{ "status": 200, "message": "OK", "service": "Presence"}');

      webpubsub.addListener({
        status(status) {
          if (status.operation !== 'PNUnsubscribeOperation') return;
          assert.equal(status.error, false);
          assert.equal(scope.isDone(), true);
          assert.deepEqual(status.affectedChannels, ['ch1', 'ch2']);
          assert.deepEqual(status.affectedChannelGroups, ['cg1', 'cg2']);
          done();
        },
      });

      webpubsub.subscribe({
        channels: ['ch1', 'ch2'],
        channelGroups: ['cg1', 'cg2'],
      });
      webpubsub.unsubscribeAll();
    });
  });
});
