/* global describe, beforeEach, afterEach, it, after */
/* eslint no-console: 0 */

import assert from 'assert';
import nock from 'nock';
import Webpubsub from '../../../src/node/index';
import utils from '../../utils';

function publishMessagesToChannel(client        , count        , channel        , completion          ) {
  let publishCompleted = 0;
  let messages = [];

  const publish = (messageIdx) => {
    let payload = { message: { messageIdx: [channel, messageIdx].join(': '), time: Date.now() }, channel };

    if (messageIdx % 2 === 0) {
      payload.meta = { time: payload.message.time };
    }

    client.publish(payload, (status, response) => {
      publishCompleted += 1;

      if (!status.error) {
        messages.push({ message: payload.message, timetoken: response.timetoken });
        messages = messages.sort((left, right) => left.timetoken - right.timetoken);
      } else {
        console.error('Publish did fail:', status);
      }

      if (publishCompleted < count) {
        publish(publishCompleted);
      } else if (publishCompleted === count) {
        completion(messages);
      }
    });
  };

  publish(publishCompleted);
}


describe('history endpoints', () => {
  const subscribeKey = process.env.SUBSCRIBE_KEY || 'demo';
  const publishKey = process.env.PUBLISH_KEY || 'demo';
  let webpubsub;

  after(() => {
    nock.enableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
    webpubsub.removeAllListeners();
    webpubsub.unsubscribeAll();
    webpubsub.stop();
  });

  beforeEach(() => {
    nock.cleanAll();
    webpubsub = new Webpubsub({
      subscribeKey,
      publishKey,
      uuid: 'myUUID',
      useRandomIVs: false
    });
  });

  it('supports payload with timetoken', (done) => {
    nock.disableNetConnect();
    const scope = utils
      .createNock()
      .get(`/v2/history/sub-key/${subscribeKey}/channel/ch1`)
      .query({
        count: '100',
        include_token: 'true',
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        string_message_token: true,
      })
      .reply(
        200,
        '[[{"message":{"text":"hey"},"timetoken":"14648503433058358"},{"message":{"text2":"hey2"},"timetoken":"14648503433058359"}],"14648503433058358","14649346364851578"]'
      );

    webpubsub.history(
      { channel: 'ch1', stringifiedTimeToken: true },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.startTimeToken, '14648503433058358');
        assert.deepEqual(response.endTimeToken, '14649346364851578');
        assert.deepEqual(response.messages, [
          { timetoken: '14648503433058358', entry: { text: 'hey' } },
          { timetoken: '14648503433058359', entry: { text2: 'hey2' } },
        ]);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('supports encrypted payload with timetoken', (done) => {
    nock.disableNetConnect();
    const scope = utils
      .createNock()
      .get(`/v2/history/sub-key/${subscribeKey}/channel/ch1`)
      .query({
        count: '100',
        include_token: 'true',
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        string_message_token: true,
      })
      .reply(
        200,
        '[[{"message":"zFJeF9BVABL80GUiQEBjLg==","timetoken":"14649369736959785"},{"message":"HIq4MTi9nk/KEYlHOKpMCaH78ZXppGynDHrgY9nAd3s=","timetoken":"14649369766426772"}],"14649369736959785","14649369766426772"]'
      );

    webpubsub.setCipherKey('cipherKey');
    webpubsub.history(
      { channel: 'ch1', stringifiedTimeToken: true },
      (status, response) => {
        assert.equal(status.error, false);
        assert.deepEqual(response.startTimeToken, '14649369736959785');
        assert.deepEqual(response.endTimeToken, '14649369766426772');
        assert.deepEqual(response.messages, [
          { timetoken: '14649369736959785', entry: { text: 'hey' } },
          { timetoken: '14649369766426772', entry: { text2: 'hey2' } },
        ]);
        assert.equal(scope.isDone(), true);
        done();
      }
    );
  });

  it('supports metadata', (done) => {
    const channel = Webpubsub.generateUUID();
    const expectedMessagesCount = 10;

    publishMessagesToChannel(webpubsub, expectedMessagesCount, channel, (messages) => {
      webpubsub.history({ channel, includeMeta: true }, (status, response) => {
        assert.deepEqual(response.messages[0].meta, { time: messages[0].message.time });
        assert(!response.messages[1].meta);
        done();
      });
    });
  }).timeout(60000);

  it('should add history API telemetry information', (done) => {
    nock.disableNetConnect();
    let scope = utils.createNock().get(`/v2/history/sub-key/${subscribeKey}/channel/ch1`).query(true);
    const delays = [100, 200, 300, 400];
    const countedDelays = delays.slice(0, delays.length - 1);
    const average = Math.floor(countedDelays.reduce((acc, delay) => acc + delay, 0) / countedDelays.length);
    const leeway = 50;

    utils.runAPIWithResponseDelays(scope,
      200,
      '[[{"message":{"text":"hey"},"timetoken":"14648503433058358"},{"message":{"text2":"hey2"},"timetoken":"14648503433058359"}],"14648503433058358","14649346364851578"]',
      delays,
      (completion) => {
        webpubsub.history(
          { channel: 'ch1', stringifiedTimeToken: true },
          () => { completion(); }
        );
      })
      .then((lastRequest) => {
        utils.verifyRequestTelemetry(lastRequest.path, 'l_hist', average, leeway);
        done();
      });
  }).timeout(60000);
});
