/**       */

import nock from 'nock';
import Webpubsub from '../../../../src/node/index';

// import {} from './fixtures';

describe('objects membership', () => {
  const SUBSCRIBE_KEY = 'mySubKey';
  const PUBLISH_KEY = 'myPublishKey';
  const UUID = 'myUUID';
  const AUTH_KEY = 'myAuthKey';

  let webpubsub        ;
  let PNSDK        ;

  before(() => {
    nock.disableNetConnect();
  });

  after(() => {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
    webpubsub = new Webpubsub({
      subscribeKey: SUBSCRIBE_KEY,
      publishKey: PUBLISH_KEY,
      uuid: UUID,
      authKey: AUTH_KEY,
    });
    PNSDK = `Webpubsub-JS-Nodejs/${webpubsub.getVersion()}`;
  });
});
