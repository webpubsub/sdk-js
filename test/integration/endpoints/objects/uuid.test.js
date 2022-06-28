/**       */

import nock from 'nock';
import Webpubsub from '../../../../src/node/index';
import utils from '../../../utils';
import { allUsers, asResponse, user1 } from './fixtures';


describe('objects UUID', () => {
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

  describe('getAllUUIDMetadata', () => {
    it('should resolve to a list of UUID metadata', async () => {
      const scope = utils
        .createNock()
        .get(`/v2/objects/${SUBSCRIBE_KEY}/uuids`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
          limit: 100
        })
        .reply(200, {
          status: 200,
          data: allUsers.map(asResponse),
        });

      const resultP = webpubsub.objects.getAllUUIDMetadata();

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: allUsers.map(asResponse),
        prev: undefined,
        next: undefined,
        totalCount: undefined
      });
    });

    it('should reject if status is not 200', async () => {
      const scope = utils
        .createNock()
        .get(`/v2/objects/${SUBSCRIBE_KEY}/uuids`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
          limit: 100
        })
        .reply(403, {
          status: 403,
          error: {},
        });

      const resultP = webpubsub.objects.getAllUUIDMetadata();

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.be.rejected;
    });
  });

  describe('getUUIDMetadata', () => {
    it('should resolve to UUID metadata without UUID passed in', async () => {
      const scope = utils
        .createNock()
        .get(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${UUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
          include: 'custom'
        })
        .reply(200, {
          status: 200,
          data: asResponse(user1),
        });

      const resultP = webpubsub.objects.getUUIDMetadata();

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: asResponse(user1),
      });
    });

    it('should resolve to UUID metadata with UUID passed in', async () => {
      const otherUUID = 'otherUUID';

      const scope = utils
        .createNock()
        .get(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${otherUUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
          include: 'custom',
        })
        .reply(200, {
          status: 200,
          data: asResponse(user1),
        });

      const resultP = webpubsub.objects.getUUIDMetadata({
        uuid: otherUUID,
        include: { customFields: true },
      });

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: asResponse(user1),
      });
    });

    it('should resolve to encoded UUID metadata with UUID passed in', async () => {
      const otherUUID = 'otherUUID#1';
      const encodedOtherUUID = 'otherUUID%231';

      const scope = utils
        .createNock()
        .get(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${encodedOtherUUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
          include: 'custom',
        })
        .reply(200, {
          status: 200,
          data: asResponse(user1),
        });

      const resultP = webpubsub.objects.getUUIDMetadata({
        uuid: otherUUID,
        include: { customFields: true },
      });

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: asResponse(user1),
      });
    });
  });

  describe('setUUIDMetadata', () => {
    it('should resolve to updated UUID metadata without UUID passed in', async () => {
      const scope = utils
        .createNock()
        .patch(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${UUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
          include: 'custom'
        })
        .reply(200, {
          status: 200,
          data: asResponse(user1),
        });

      const resultP = webpubsub.objects.setUUIDMetadata({ data: user1.data });

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: asResponse(user1),
      });
    });

    it('should resolve to updated UUID metadata with UUID passed in', async () => {
      const scope = utils
        .createNock()
        .patch(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${UUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
          include: 'custom'
        })
        .reply(200, {
          status: 200,
          data: asResponse(user1),
        });

      const resultP = webpubsub.objects.setUUIDMetadata({ data: user1.data });

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: asResponse(user1),
      });
    });

    it('should resolve to updated encoded UUID metadata with UUID passed in', async () => {
      const otherUUID = 'otherUUID#1';
      const encodedOtherUUID = 'otherUUID%231';

      const scope = utils
        .createNock()
        .patch(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${encodedOtherUUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
          include: 'custom'
        })
        .reply(200, {
          status: 200,
          data: asResponse(user1),
        });

      const resultP = webpubsub.objects.setUUIDMetadata({
        uuid: otherUUID,
        data: user1.data
      });

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: asResponse(user1),
      });
    });

    it('should reject if data is missing', async () => {
      // $FlowFixMe This is intentional to suppress Flow error
      const resultP = webpubsub.objects.setUUIDMetadata();

      await expect(resultP).to.be.rejected;
    });
  });

  describe('removeUUIDMetadata', () => {
    it('should resolve to UUID without UUID passed in', async () => {
      const scope = utils
        .createNock()
        .delete(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${UUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
        })
        .reply(200, { status: 200, data: {} });

      const resultP = webpubsub.objects.removeUUIDMetadata();

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: {},
      });
    });

    it('should resolve to UUID with UUID passed in', async () => {
      const otherUUID = 'otherUUID';

      const scope = utils
        .createNock()
        .delete(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${otherUUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
        })
        .reply(200, { status: 200, data: {} });

      const resultP = webpubsub.objects.removeUUIDMetadata({ uuid: otherUUID });

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: {},
      });
    });

    it('should resolve to encoded UUID with UUID passed in', async () => {
      const otherUUID = 'otherUUID#1';
      const encodedOtherUUID = 'otherUUID%231';

      const scope = utils
        .createNock()
        .delete(`/v2/objects/${SUBSCRIBE_KEY}/uuids/${encodedOtherUUID}`)
        .query({
          auth: AUTH_KEY,
          uuid: UUID,
          pnsdk: PNSDK,
        })
        .reply(200, { status: 200, data: {} });

      const resultP = webpubsub.objects.removeUUIDMetadata({ uuid: otherUUID });

      await expect(scope).to.have.been.requested;
      await expect(resultP).to.eventually.deep.equal({
        status: 200,
        data: {},
      });
    });

    it('should reject if uuid is missing', async () => {
      // $FlowFixMe This is intentional to suppress Flow error
      const resultP = webpubsub.objects.removeUUIDMetadata();

      await expect(resultP).to.be.rejected;
    });
  });
});
