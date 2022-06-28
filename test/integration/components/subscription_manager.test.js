/* global describe, beforeEach, it, before, afterEach, after */
/* eslint no-console: 0 */

import assert from 'assert';
import nock from 'nock';
import _ from 'underscore';
import Webpubsub from '../../../src/node/index';
import utils from '../../utils';


describe('#components/subscription_manager', () => {
  let webpubsub;
  let webpubsubWithPassingHeartbeats;
  let webpubsubWithLimitedQueue;

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
      heartbeatInterval: 149,
    });
    webpubsubWithPassingHeartbeats = new Webpubsub({
      subscribeKey: 'mySubKey',
      publishKey: 'myPublishKey',
      uuid: 'myUUID',
      announceSuccessfulHeartbeats: true,
      autoNetworkDetection: false,
      heartbeatInterval: 149,
    });
    webpubsubWithLimitedQueue = new Webpubsub({
      subscribeKey: 'mySubKey',
      publishKey: 'myPublishKey',
      uuid: 'myUUID',
      requestMessageCountThreshold: 1,
      autoNetworkDetection: false,
      heartbeatInterval: 149,
    });
  });

  afterEach(() => {
    webpubsub.stop();
    webpubsubWithPassingHeartbeats.stop();
    webpubsubWithLimitedQueue.stop();
  });

  it('passes the correct message information', (done) => {
    const scope1 = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"3","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1}, "i": "client1", "k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message"},"b":"coolChan-bnel"}]}'
      );

    const scope2 = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        tt: 3,
        tr: 1,
      })
      .reply(
        200,
        '{"t":{"t":"10","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"i": "client2", "k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message3"},"b":"coolChan-bnel"}]}'
      );

    const scope3 = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        tt: 10,
        tr: 1,
      })
      .reply(
        200,
        '{"t":{"t":"20","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1},"i": "client3", "k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message10"},"b":"coolChan-bnel", "u": {"cool": "meta"}}]}'
      );

    let incomingPayloads = [];

    webpubsub.addListener({
      message(messagePayload) {
        incomingPayloads.push(messagePayload);

        if (incomingPayloads.length === 3) {
          assert.equal(scope1.isDone(), true);
          assert.equal(scope2.isDone(), true);
          assert.equal(scope3.isDone(), true);
          assert.deepEqual(incomingPayloads, [
            {
              actualChannel: 'coolChannel',
              message: {
                text: 'Message',
              },
              subscribedChannel: 'coolChan-bnel',
              channel: 'coolChannel',
              subscription: 'coolChan-bnel',
              timetoken: '14607577960925503',
              publisher: 'client1',
            },
            {
              actualChannel: 'coolChannel',
              message: {
                text: 'Message3',
              },
              subscribedChannel: 'coolChan-bnel',
              channel: 'coolChannel',
              subscription: 'coolChan-bnel',
              timetoken: '14607577960925503',
              publisher: 'client2',
            },
            {
              actualChannel: 'coolChannel',
              message: {
                text: 'Message10',
              },
              userMetadata: {
                cool: 'meta',
              },
              subscribedChannel: 'coolChan-bnel',
              channel: 'coolChannel',
              subscription: 'coolChan-bnel',
              timetoken: '14607577960925503',
              publisher: 'client3',
            },
          ]);
          done();
        }
      },
    });

    webpubsub.subscribe({ channels: ['ch1', 'ch2'], withPresence: true });
  });

  it('passes the correct presence information', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"14614512228786519","r":1},"m":[{"a":"4","f":0,"p":{"t":"14614512228418349","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel-pnpres","d":{"action": "join", "timestamp": 1461451222, "uuid": "4a6d5df7-e301-4e73-a7b7-6af9ab484eb0", "occupancy": 1},"b":"coolChannel-pnpres"}]}'
      );

    webpubsub.addListener({
      presence(presencePayload) {
        assert.equal(scope.isDone(), true);
        assert.deepEqual(
          {
            channel: 'coolChannel',
            subscription: null,
            actualChannel: null,
            occupancy: 1,
            subscribedChannel: 'coolChannel-pnpres',
            timestamp: 1461451222,
            timetoken: '14614512228418349',
            uuid: '4a6d5df7-e301-4e73-a7b7-6af9ab484eb0',
            action: 'join',
            state: undefined,
          },
          presencePayload
        );
        done();
      },
    });

    webpubsub.subscribe({ channels: ['ch1', 'ch2'], withPresence: true });
  });

  it('Unknown category status returned when user trigger TypeError in subscription handler', (done) => {
    const scope1 = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch1-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"3","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1}, "i": "client1", "k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"ch1","d":{"text":"Message"},"b":"ch1"}]}'
      );
    const scope2 = utils
      .createNock()
      .get(/heartbeat$/)
      .query(true)
      .reply(200, '{"status": 200,"message":"OK","service":"Presence"}');
    const scope3 = utils
      .createNock()
      .get(/leave$/)
      .query(true)
      .reply(200, '{"status": 200,"message":"OK","action":"leave","service":"Presence"}');
    const scope4 = utils
      .createNock()
      .get('/publish/myPublishKey/mySubKey/0/ch1/0/%7B%22such%22%3A%22object%22%7D')
      .query(true)
      .reply(200, '[1,"Sent","14647523059145592"]');

    webpubsub.addListener({
      message(message) {
        null.test;
      },
      status(status) {
        if (status.category === "PNUnknownCategory") {
          assert.equal(status.errorData instanceof Error, true);
          done();
        } else if (status.category === "PNConnectedCategory") {
          webpubsub.publish(
            { message: { such: 'object' }, channel: 'ch1' },
            (status, response) => { }
          );
        }
      }
    });

    webpubsub.subscribe({ channels: ['ch1'], withPresence: true });
  });

  it('passes the correct presence information when state is changed', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"14637536741734954","r":1},"m":[{"a":"4","f":512,"p":{"t":"14637536740940378","r":1},"k":"demo-36","c":"ch10-pnpres","d":{"action": "join", "timestamp": 1463753674, "uuid": "24c9bb19-1fcd-4c40-a6f1-522a8a1329ef", "occupancy": 3},"b":"ch10-pnpres"},{"a":"4","f":512,"p":{"t":"14637536741726901","r":1},"k":"demo-36","c":"ch10-pnpres","d":{"action": "state-change", "timestamp": 1463753674, "data": {"state": "cool"}, "uuid": "24c9bb19-1fcd-4c40-a6f1-522a8a1329ef", "occupancy": 3},"b":"ch10-pnpres"}]}'
      );

    webpubsub.addListener({
      presence(presencePayload) {
        if (presencePayload.action !== 'state-change') return;

        assert.equal(scope.isDone(), true);
        assert.deepEqual(
          {
            channel: 'ch10',
            subscription: null,
            actualChannel: null,
            occupancy: 3,
            subscribedChannel: 'ch10-pnpres',
            timestamp: 1463753674,
            timetoken: '14637536741726901',
            uuid: '24c9bb19-1fcd-4c40-a6f1-522a8a1329ef',
            action: 'state-change',
            state: { state: 'cool' },
          },
          presencePayload
        );
        done();
      },
    });

    webpubsub.subscribe({ channels: ['ch1', 'ch2'], withPresence: true });
  });

  it('reports when heartbeats failed', (done) => {
    webpubsub.addListener({
      status(statusPayload) {
        if (
          statusPayload.operation !== Webpubsub.OPERATIONS.PNHeartbeatOperation
        ) {
          return;
        }
        let statusWithoutError = _.omit(statusPayload, 'errorData');
        assert.deepEqual(
          {
            category: 'PNUnknownCategory',
            error: true,
            operation: 'PNHeartbeatOperation',
          },
          statusWithoutError
        );
        done();
      },
    });

    webpubsub.subscribe({
      channels: ['ch1', 'ch2'],
      withPresence: true,
      withHeartbeats: true,
    });
  });

  it('reports when heartbeats fail with error code', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/presence/sub-key/mySubKey/channel/ch1%2Cch2/heartbeat')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        state: '{}',
      })
      .reply(400, '{"status": 400, "message": "OK", "service": "Presence"}');

    webpubsub.addListener({
      status(statusPayload) {
        if (
          statusPayload.operation !== Webpubsub.OPERATIONS.PNHeartbeatOperation
        ) {
          return;
        }
        let statusWithoutError = _.omit(statusPayload, 'errorData');
        assert.equal(scope.isDone(), true);
        assert.deepEqual(
          {
            category: 'PNBadRequestCategory',
            error: true,
            operation: 'PNHeartbeatOperation',
            statusCode: 400,
          },
          statusWithoutError
        );
        done();
      },
    });

    webpubsub.subscribe({
      channels: ['ch1', 'ch2'],
      withPresence: true,
      withHeartbeats: true,
    });
  });

  it('reports when heartbeats pass', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/presence/sub-key/mySubKey/channel/ch1%2Cch2/heartbeat')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        state: '{}',
      })
      .reply(200, '{"status": 200, "message": "OK", "service": "Presence"}');

    webpubsubWithPassingHeartbeats.addListener({
      status(statusPayload) {
        if (
          statusPayload.operation !== Webpubsub.OPERATIONS.PNHeartbeatOperation
        ) {
          return;
        }

        assert.equal(scope.isDone(), true);
        assert.deepEqual(
          {
            error: false,
            operation: 'PNHeartbeatOperation',
            statusCode: 200,
          },
          statusPayload
        );
        done();
      },
    });

    webpubsubWithPassingHeartbeats.subscribe({
      channels: ['ch1', 'ch2'],
      withPresence: true,
      withHeartbeats: true,
    });
  });

  it('reports when heartbeats pass with heartbeatChannels', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/presence/sub-key/mySubKey/channel/ch1%2Cch2/heartbeat')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        state: '{}',
      })
      .reply(200, '{"status": 200, "message": "OK", "service": "Presence"}');

    webpubsubWithPassingHeartbeats.addListener({
      status(statusPayload) {
        if (
          statusPayload.operation !== Webpubsub.OPERATIONS.PNHeartbeatOperation
        ) {
          return;
        }

        assert.equal(scope.isDone(), true);
        assert.deepEqual(
          {
            error: false,
            operation: 'PNHeartbeatOperation',
            statusCode: 200,
          },
          statusPayload
        );
        done();
      },
    });

    webpubsubWithPassingHeartbeats.presence({
      channels: ['ch1', 'ch2'],
      connected: true,
    });
  });

  it('reports when heartbeats pass with heartbeatChannelGroups', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/presence/sub-key/mySubKey/channel/%2C/heartbeat')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        state: '{}',
        'channel-group': 'cg1',
      })
      .reply(200, '{"status": 200, "message": "OK", "service": "Presence"}');

    webpubsubWithPassingHeartbeats.addListener({
      status(statusPayload) {
        if (
          statusPayload.operation !== Webpubsub.OPERATIONS.PNHeartbeatOperation
        ) {
          return;
        }

        assert.equal(scope.isDone(), true);
        assert.deepEqual(
          {
            error: false,
            operation: 'PNHeartbeatOperation',
            statusCode: 200,
          },
          statusPayload
        );
        done();
      },
    });

    webpubsubWithPassingHeartbeats.presence({
      channelGroups: ['cg1'],
      connected: true,
    });
  });

  it('reports when the queue is beyond set threshold', (done) => {
    const scope = utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"14614512228786519","r":1},"m":[{"a":"4","f":0,"p":{"t":"14614512228418349","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel-pnpres","d":{"action": "join", "timestamp": 1461451222, "uuid": "4a6d5df7-e301-4e73-a7b7-6af9ab484eb0", "occupancy": 1},"b":"coolChannel-pnpres"}]}'
      );

    webpubsubWithLimitedQueue.addListener({
      status(statusPayload) {
        if (
          statusPayload.category !==
          Webpubsub.CATEGORIES.PNRequestMessageCountExceededCategory
        ) {
          return;
        }

        assert.equal(scope.isDone(), true);
        assert.equal(
          statusPayload.category,
          Webpubsub.CATEGORIES.PNRequestMessageCountExceededCategory
        );
        assert.equal(
          statusPayload.operation,
          Webpubsub.OPERATIONS.PNSubscribeOperation
        );
        done();
      },
    });

    webpubsubWithLimitedQueue.subscribe({
      channels: ['ch1', 'ch2'],
      withPresence: true,
    });
  });

  it('supports deduping on duplicates', (done) => {
    webpubsub._config.dedupeOnSubscribe = true;
    let messageCount = 0;

    utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"3","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1}, "i": "client1", "k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message"},"b":"coolChan-bnel"}]}'
      );

    utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        tt: 3,
        tr: 1,
      })
      .reply(
        200,
        '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Publisher-A","p":{"t":"14607577960925503","r":1},"o":{"t":"14737141991877032","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message"},"b":"coolChannel"},{"a":"4","f":0,"i":"Publisher-A","p":{"t":"14607577960925503","r":1},"o":{"t":"14737141991877032","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message"},"b":"coolChannel"}]}'
      );

    webpubsub.addListener({
      message() {
        messageCount += 1;
      },
    });

    webpubsub.subscribe({ channels: ['ch1', 'ch2'], withPresence: true });

    setTimeout(() => {
      if (messageCount === 1) {
        done();
      }
    }, 250);
  });

  it('no deduping on duplicates ', (done) => {
    let messageCount = 0;

    utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"3","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1}, "i": "client1", "k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message"},"b":"coolChan-bnel"}]}'
      );

    utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        tt: 3,
        tr: 1,
      })
      .reply(
        200,
        '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Publisher-A","p":{"t":"14607577960925503","r":1},"o":{"t":"14737141991877032","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message"},"b":"coolChannel"},{"a":"4","f":0,"i":"Publisher-A","p":{"t":"14607577960925503","r":1},"o":{"t":"14737141991877032","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message"},"b":"coolChannel"}]}'
      );

    webpubsub.addListener({
      message() {
        messageCount += 1;
      },
    });

    webpubsub.subscribe({ channels: ['ch1', 'ch2'], withPresence: true });

    setTimeout(() => {
      if (messageCount === 3) {
        done();
      }
    }, 250);
  });

  it('supports deduping on shallow queue', (done) => {
    webpubsub._config.dedupeOnSubscribe = true;
    webpubsub._config.maximumCacheSize = 1;
    let messageCount = 0;

    utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
      })
      .reply(
        200,
        '{"t":{"t":"3","r":1},"m":[{"a":"4","f":0,"i":"Client-g5d4g","p":{"t":"14607577960925503","r":1}, "i": "client1", "k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message"},"b":"coolChan-bnel"}]}'
      );

    utils
      .createNock()
      .get('/v2/subscribe/mySubKey/ch1%2Cch2%2Cch1-pnpres%2Cch2-pnpres/0')
      .query({
        pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
        uuid: 'myUUID',
        heartbeat: 300,
        tt: 3,
        tr: 1,
      })
      .reply(
        200,
        '{"t":{"t":"14607577960932487","r":1},"m":[{"a":"4","f":0,"i":"Publisher-A","p":{"t":"14607577960925503","r":1},"o":{"t":"14737141991877032","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message1"},"b":"coolChannel"},{"a":"4","f":0,"i":"Publisher-A","p":{"t":"14607577960925503","r":1},"o":{"t":"14737141991877032","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message2"},"b":"coolChannel"}, {"a":"4","f":0,"i":"Publisher-A","p":{"t":"14607577960925503","r":1},"o":{"t":"14737141991877032","r":2},"k":"sub-c-4cec9f8e-01fa-11e6-8180-0619f8945a4f","c":"coolChannel","d":{"text":"Message1"},"b":"coolChannel"}]}'
      );

    webpubsub.addListener({
      message() {
        messageCount += 1;
      },
    });

    webpubsub.subscribe({ channels: ['ch1', 'ch2'], withPresence: true });

    setTimeout(() => {
      if (messageCount === 4) {
        done();
      }
    }, 250);
  });
});
