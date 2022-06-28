import { expect } from 'chai';
import fetch from 'node-fetch';
import Webpubsub from '../../src/react_native';

global.fetch = fetch;

let webpubsub;

let channelSuffix = new Date().getTime() + (Math.random());

let myChannel1 = `mychannel1${channelSuffix}`;
let myChannel2 = `mychannel2${channelSuffix}`;
// let myChanneGroup1 = `myChannelGroup1${channelSuffix}`;

describe('#distribution test (rkt-native)', function () {
  after(function () {
    webpubsub.destroy();
  });

  beforeEach(() => {
    webpubsub = new Webpubsub({ subscribeKey: 'demo', publishKey: 'demo', uuid: 'myUUID' });
  });

  afterEach(() => {
    webpubsub.removeAllListeners();
    webpubsub.unsubscribeAll();
    webpubsub.stop();
  });

  it('should have to subscribe a channel', (done) => {
    webpubsub.addListener({
      status: (st) => {
        expect(st.operation).to.be.equal('PNSubscribeOperation');
        webpubsub.unsubscribeAll()
        done();
      }
    });
    webpubsub.subscribe({channels: [myChannel1]});
  });

  it('should have to receive message from a channel', (done) => {
    webpubsub.addListener({
      status: (st) => {
        if (st.operation === 'PNSubscribeOperation') {
          webpubsub.publish({ channel: myChannel2, message: { text: 'hello React-Native SDK' }});
        }
      },
      message: (m) => {
        expect(m.channel).to.be.equal(myChannel2);
        expect(m.message.text).to.be.equal('hello React-Native SDK');
        webpubsub.unsubscribeAll()
        done();
      }
    });
    webpubsub.subscribe({channels: [myChannel2]});
  });

  it('should have to set state', (done) => {
    webpubsub.setState({ channels: [myChannel1], state: { hello: 'there' } }, (status, response) => {
      expect(status.error).to.be.equal(false);
      expect(response.state.hello).to.be.equal('there');
      done();
    });
  });

  it('should have to get the time', (done) => {
    webpubsub.time((status) => {
      expect(status.operation).to.be.equal('PNTimeOperation');
      expect(status.statusCode).to.be.equal(200);
      done();
    });
  });

  it('should have to get the last message', (done) => {
    // add delay to ensure publish completes
    setTimeout(function () {
      webpubsub.history({
        channel: myChannel2,
        count: 1,
        reverse: false
      }, function(status, response) {
        expect(response.messages).to.have.length(1);
        done();
      });
    }, 3000);
  });

  // TODO: fix test account for channel groups
  // currently failing since too many channel groups exist

  // it('should have to add a channel group', (done) => {
  //   webpubsub.channelGroups.addChannels(
  //     {
  //       channels: ['ch1', 'ch2'],
  //       channelGroup: myChannelGroup1
  //     },
  //     (status) => {
  //       expect(status.error).to.be.equal(false);
  //       done();
  //     }
  //   );
  // });

  // it('should have to list the channels', (done) => {
  //   webpubsub.channelGroups.listChannels(
  //     {
  //       channelGroup: myChannelGroup1
  //     },
  //     (status, response) => {
  //       expect(status.error).to.be.equal(false);
  //       expect(response.channels).to.have.length(2);
  //       done();
  //     }
  //   );
  // });

  it('should have to change the UUID', function (done) {
    webpubsub.setUUID("CustomUUID");

    expect(webpubsub.getUUID()).to.be.equal("CustomUUID");
    done();
  });

  // TODO: fix test. it shouldn't rely on previous steps outcome.
  it('should have to unsubscribe', function (done) {
    let finished = false;

    webpubsub.addListener({
      status: function (st) {
        if (st.operation === 'PNSubscribeOperation') {
          webpubsub.unsubscribe({channels: [myChannel1]});
        } else {
          expect(st.operation).to.be.equal('PNUnsubscribeOperation');

          if (!finished) {
            // prevent calling done twice
            finished = true;
            webpubsub.unsubscribeAll()
            done();
          }
        }
      }
    });
    webpubsub.subscribe({channels: [myChannel1]});
  });
});
