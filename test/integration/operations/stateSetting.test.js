/* global describe, beforeEach, it, before, after */
/* eslint no-console: 0 */

import assert from 'assert';
import nock from 'nock';
import Webpubsub from '../../../src/node/index';
import utils from '../../utils';

describe('setting state operation', () => {
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
  });

  describe('#setState', () => {
    it('fails if no channels are provided', (done) => {
      webpubsub.setState({ state: { hello: 'there' } }, (status) => {
        assert.equal(status.error, true);
        assert.equal(
          status.message,
          'Please provide a list of channels and/or channel-groups'
        );
        done();
      });
    });

    it('supports updating for one channel', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/presence/sub-key/mySubscribeKey/channel/ch1/uuid/myUUID/data')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          state: '{"hello":"there"}',
        })
        .reply(
          200,
          '{ "status": 200, "message": "OK", "payload": { "age" : 20, "status" : "online" }, "service": "Presence"}'
        );

      webpubsub.setState(
        { channels: ['ch1'], state: { hello: 'there' } },
        (status, response) => {
          assert.equal(status.error, false);
          assert.deepEqual(response.state, { age: 20, status: 'online' });
          assert.equal(scope.isDone(), true);
          done();
        }
      );
    });

    it('supports updating for multiple channels', (done) => {
      const scope = utils
        .createNock()
        .get(
          '/v2/presence/sub-key/mySubscribeKey/channel/ch1%2Cch2/uuid/myUUID/data'
        )
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          state: '{"hello":"there"}',
        })
        .reply(
          200,
          '{ "status": 200, "message": "OK", "payload": { "age" : 20, "status" : "online" }, "service": "Presence"}'
        );

      webpubsub.setState(
        { channels: ['ch1', 'ch2'], state: { hello: 'there' } },
        (status, response) => {
          assert.equal(status.error, false);
          assert.deepEqual(response.state, { age: 20, status: 'online' });
          assert.equal(scope.isDone(), true);
          done();
        }
      );
    });

    it('supports updating for one channel group', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/presence/sub-key/mySubscribeKey/channel/%2C/uuid/myUUID/data')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          state: '{"hello":"there"}',
          'channel-group': 'cg1',
        })
        .reply(
          200,
          '{ "status": 200, "message": "OK", "payload": { "age" : 20, "status" : "online" }, "service": "Presence"}'
        );

      webpubsub.setState(
        { channelGroups: ['cg1'], state: { hello: 'there' } },
        (status, response) => {
          assert.equal(status.error, false);
          assert.deepEqual(response.state, { age: 20, status: 'online' });
          assert.equal(scope.isDone(), true);
          done();
        }
      );
    });

    it('supports updating for multiple channel group', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/presence/sub-key/mySubscribeKey/channel/%2C/uuid/myUUID/data')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          state: '{"hello":"there"}',
          'channel-group': 'cg1,cg2',
        })
        .reply(
          200,
          '{ "status": 200, "message": "OK", "payload": { "age" : 20, "status" : "online" }, "service": "Presence"}'
        );

      webpubsub.setState(
        { channelGroups: ['cg1', 'cg2'], state: { hello: 'there' } },
        (status, response) => {
          assert.equal(status.error, false);
          assert.deepEqual(response.state, { age: 20, status: 'online' });
          assert.equal(scope.isDone(), true);
          done();
        }
      );
    });

    it('supports promises', (done) => {
      const scope = utils
        .createNock()
        .get('/v2/presence/sub-key/mySubscribeKey/channel/ch1/uuid/myUUID/data')
        .query({
          pnsdk: `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`,
          uuid: 'myUUID',
          state: '{"hello":"there"}',
        })
        .reply(
          200,
          '{ "status": 200, "message": "OK", "payload": { "age" : 20, "status" : "online" }, "service": "Presence"}'
        );

      let promise = webpubsub.setState({
        channels: ['ch1'],
        state: { hello: 'there' },
      });
      assert.ok(promise);
      assert(typeof promise.then === 'function');
      promise
        .then((response) => {
          assert.deepEqual(response.state, { age: 20, status: 'online' });
          assert.equal(scope.isDone(), true);
          done();
        })
        .catch(done);
    });
  });
});
