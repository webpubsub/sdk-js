/* global describe, beforeEach, it, before, afterEach, after */
/* eslint no-console: 0 */

import assert from 'assert';
import nock from 'nock';
import Webpubsub from '../../../src/node/index';
import utils from '../../utils';

describe('subscribe endpoints', () => {
  let webpubsub;
  let webpubsubWithFiltering;

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
      autoNetworkDetection: false,
    });
    webpubsubWithFiltering = new Webpubsub({
      subscribeKey: 'mySubKey',
      publishKey: 'myPublishKey',
      uuid: 'myUUID',
      filterExpression: 'hello!',
      autoNetworkDetection: false,
    });
  });

  afterEach(() => {
    webpubsub.stop();
    webpubsubWithFiltering.stop();
  });

  it('supports addition of multiple channels', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/coolChannel%2CcoolChannel2/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Enter Message Here"},"b":"coolChan-bnel"}]}'
      );

    webpubsub.addListener({
      status(status) {
        if (status.category === 'PNConnectedCategory') {
          assert.equal(scope.isDone(), true);
          assert.deepEqual(webpubsub.getSubscribedChannels(), [
            'coolChannel',
            'coolChannel2',
          ]);
          assert.deepEqual(webpubsub.getSubscribedChannelGroups(), []);
          assert.deepEqual(status.affectedChannels, [
            'coolChannel',
            'coolChannel2',
          ]);
          assert.deepEqual(status.affectedChannelGroups, []);
          done();
        }
      },
    });

    webpubsub.subscribe({ channels: ['coolChannel', 'coolChannel2'] });
  });

  it('supports addition of multiple channels / channel groups', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/coolChannel%2CcoolChannel2/0')
      .query({
        'channel-group': 'cg1,cg2',
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Enter Message Here"},"b":"coolChan-bnel"}]}'
      );

    webpubsub.addListener({
      status(status) {
        if (status.category === 'PNConnectedCategory') {
          assert.equal(scope.isDone(), true);
          assert.deepEqual(webpubsub.getSubscribedChannels(), [
            'coolChannel',
            'coolChannel2',
          ]);
          assert.deepEqual(webpubsub.getSubscribedChannelGroups(), ['cg1', 'cg2']);
          assert.deepEqual(status.affectedChannels, [
            'coolChannel',
            'coolChannel2',
          ]);
          assert.deepEqual(status.affectedChannelGroups, ['cg1', 'cg2']);
          done();
        }
      },
    });

    webpubsub.subscribe({
      channels: ['coolChannel', 'coolChannel2'],
      channelGroups: ['cg1', 'cg2'],
    });
  });

  it('supports just channel group', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/%2C/0')
      .query({
        'channel-group': 'cg1,cg2',
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Enter Message Here"},"b":"coolChan-bnel"}]}'
      );

    webpubsub.addListener({
      status(status) {
        if (status.category === 'PNConnectedCategory') {
          assert.equal(scope.isDone(), true);
          assert.deepEqual(webpubsub.getSubscribedChannels(), []);
          assert.deepEqual(webpubsub.getSubscribedChannelGroups(), ['cg1', 'cg2']);
          assert.deepEqual(status.affectedChannels, []);
          assert.deepEqual(status.affectedChannelGroups, ['cg1', 'cg2']);
          done();
        }
      },
    });

    webpubsub.subscribe({ channelGroups: ['cg1', 'cg2'] });
  });

  it('supports filter expression', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/coolChannel%2CcoolChannel2/0')
      .query({
        'filter-expr': 'hello!',
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Enter Message Here"},"b":"coolChan-bnel"}]}'
      );

    webpubsubWithFiltering.addListener({
      status(status) {
        if (status.category === 'PNConnectedCategory') {
          assert.equal(scope.isDone(), true);
          assert.deepEqual(webpubsubWithFiltering.getSubscribedChannels(), [
            'coolChannel',
            'coolChannel2',
          ]);
          assert.deepEqual(
            webpubsubWithFiltering.getSubscribedChannelGroups(),
            []
          );
          assert.deepEqual(status.affectedChannels, [
            'coolChannel',
            'coolChannel2',
          ]);
          assert.deepEqual(status.affectedChannelGroups, []);
          done();
        }
      },
    });

    webpubsubWithFiltering.subscribe({
      channels: ['coolChannel', 'coolChannel2'],
    });
  });
});
