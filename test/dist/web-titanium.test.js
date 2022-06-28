/* global describe, beforeEach, it, before, afterEach, after, Webpubsub, chai */
/* eslint no-console: 0 */

var expect = chai.expect;
var webpubsub;

var listener = null;

var channelSuffix = new Date().getTime();

var myChannel1 = 'mychannel1' + channelSuffix;
var myChannel2 = 'mychannel2' + channelSuffix;
var myChanneGroup1 = 'myChannelGroup1' + channelSuffix;

describe('#distribution test (titanium)', function () {

  before(function () {
    webpubsub = new Webpubsub({ subscribeKey: 'demo', publishKey: 'demo', uuid: 'myUUID' });
  });

  after(function () {
    webpubsub.destroy();
  });

  it('should have to subscribe a channel', function (done) {
    listener = {
      status: function (st) {
        expect(st.operation).to.be.equal('PNSubscribeOperation');
        done();
      }
    };

    webpubsub.addListener(listener);
    webpubsub.subscribe({channels: [myChannel1]});
  });

  it('should have to receive message from a channel', function (done) {
    webpubsub.disconnect();
    webpubsub.removeListener(listener);
    webpubsub.reconnect();

    listener = webpubsub.addListener({
      message: function (m) {
        expect(m.channel).to.be.equal(myChannel2);
        expect(m.message.text).to.be.equal('hello Titanium SDK');
        done();
      }
    });

    webpubsub.subscribe({channels: [myChannel2]});
    webpubsub.publish({ channel: myChannel2, message: { text: 'hello Titanium SDK' }});
  });

  it('should have to set state', function (done) {
    webpubsub.setState({ channels: [myChannel1], state: { hello: 'there' } }, function (status, response) {
      expect(status.error).to.be.equal(false);
      expect(response.state.hello).to.be.equal('there');
      done();
    });
  });

  it('should have to get the time', function (done) {
    webpubsub.time(function (status) {
      expect(status.operation).to.be.equal('PNTimeOperation');
      expect(status.statusCode).to.be.equal(200);
      done();
    });
  });

  it('should have to get the last message', function (done) {
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

  // it('should have to add a channel group', function (done) {
  //   webpubsub.channelGroups.addChannels(
  //     {
  //       channels: ['ch1', 'ch2'],
  //       channelGroup: myChanneGroup1
  //     },
  //     function(status) {
  //       expect(status.error).to.be.equal(false);
  //       done();
  //     }
  //   );
  // });

  // it('should have to list the channels', function (done) {
  //   webpubsub.channelGroups.listChannels(
  //     {
  //       channelGroup: myChanneGroup1
  //     },
  //     function (status, response) {
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

  it('should have to unsubscribe', function (done) {
    webpubsub.disconnect();
    webpubsub.removeListener(listener);
    webpubsub.reconnect();

    var finished = false;

    webpubsub.addListener({
      status: function (st) {
        expect(st.operation).to.be.equal('PNUnsubscribeOperation');

        if (!finished) {
          // prevent calling done twice
          finished = true;
          done();
        }
      }
    });
    webpubsub.unsubscribe({channels: [myChannel1]});
  });
});