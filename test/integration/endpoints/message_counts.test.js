/* global describe, beforeEach, it, before, after */
/* eslint no-console: 0 */

import assert from 'assert';
import nock from 'nock';
import Webpubsub from '../../../src/node/index';
import utils from '../../utils';

describe('message counts', () => {
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
    });
  });

  it('get history with messages for a channel', (done) => {
    const scope = utils
      .createNock()
      .get('/v3/history/sub-key/mySubKey/message-counts/ch1')
      .query({
        timetoken: 15495750401727535,
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
      })
      .reply(
        200,
        '{"status": 200, "error": false, "error_message": "", "channels": {"ch1":0}}'
      );

    webpubsub.messageCounts(
      { channels: ['ch1'], timetoken: 15495750401727535 },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.channels, { ch1: 0 });
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('get history with messages for multiple channels using timetoken', (done) => {
    const scope = utils
      .createNock()
      .get('/v3/history/sub-key/mySubKey/message-counts/ch1%2Cch2%2Cch3')
      .query({
        timetoken: 15495750401727535,
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
      })
      .reply(
        200,
        '{"status": 200, "error": false, "error_message": "", "channels": {"ch1":0,"ch2":0,"ch3":0}}'
      );

    webpubsub.messageCounts(
      { channels: ['ch1', 'ch2', 'ch3'], timetoken: 15495750401727535 },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.channels, { ch1: 0, ch2: 0, ch3: 0 });
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('get history with messages for a channel using channelTimetokens', (done) => {
    const scope = utils
      .createNock()
      .get('/v3/history/sub-key/mySubKey/message-counts/ch1')
      .query({
        timetoken: '15495750401727535',
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
      })
      .reply(
        200,
        '{"status": 200, "error": false, "error_message": "", "channels": {"ch1":2}}'
      );

    webpubsub.messageCounts(
      { channels: ['ch1'], channelTimetokens: ['15495750401727535'] },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.channels, { ch1: 2 });
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('get history with messages for multiple channels using channelTimetokens', (done) => {
    const scope = utils
      .createNock()
      .get('/v3/history/sub-key/mySubKey/message-counts/ch1%2Cch2%2Cch3')
      .query({
        timetoken: '15495750401727535',
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
      })
      .reply(
        200,
        '{"status": 200, "error": false, "error_message": "", "channels": {"ch1":0,"ch2":3,"ch3":0}}'
      );

    webpubsub.messageCounts(
      {
        channels: ['ch1', 'ch2', 'ch3'],
        channelTimetokens: ['15495750401727535'],
      },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.channels, { ch1: 0, ch2: 3, ch3: 0 });
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('get history with messages for multiple channels using multiple channelTimetokens', (done) => {
    const scope = utils
      .createNock()
      .get('/v3/history/sub-key/mySubKey/message-counts/ch1%2Cch2%2Cch3')
      .query({
        channelsTimetoken:
          '15495750401727535,15495750401727536,15495750401727537',
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
      })
      .reply(
        200,
        '{"status": 200, "error": false, "error_message": "", "channels": {"ch1":0,"ch2":0,"ch3":4}}'
      );

    webpubsub.messageCounts(
      {
        channels: ['ch1', 'ch2', 'ch3'],
        channelTimetokens: [
          '15495750401727535',
          '15495750401727536',
          '15495750401727537',
        ],
      },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.channels, { ch1: 0, ch2: 0, ch3: 4 });
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('should add message count API telemetry information', (done) => {
    let scope = utils.createNock().get('/v3/history/sub-key/mySubKey/message-counts/ch1').query(true);
    const delays = [100, 200, 300, 400];
    const countedDelays = delays.slice(0, delays.length - 1);
    const average = Math.floor(countedDelays.reduce((acc, delay) => acc + delay, 0) / countedDelays.length);
    const leeway = 50;

    utils.runAPIWithResponseDelays(scope,
      200,
      '{"status": 200, "error": false, "error_message": "", "channels": {"ch1":0}}',
      delays,
      (completion) => {
        webpubsub.messageCounts(
          { channels: ['ch1'], timetoken: 15495750401727535 },
          () => { completion(); }
        );
      })
      .then((lastRequest) => {
        utils.verifyRequestTelemetry(lastRequest.path, 'l_hist', average, leeway);
        done();
      });
  }).timeout(60000);
});
