import {
  setDefaultTimeout, setWorldConstructor, World
} from '@cucumber/cucumber';
import * as http from 'http';
import Webpubsub from '../../lib/node/index.js';

interface State {
  webpubsub: Webpubsub;
}

const state: State = {
  webpubsub: undefined,
};

setDefaultTimeout(20 * 1000);
class WebPubSubWorld extends World{
  settings = {
    checkContractExpectations: true,
    contractServer: 'localhost:8090',
  };

  fixtures = {
    // bronze config
    // defaultConfig: {
    //   origin: 'balancer-bronze1.aws-pdx-1.ps.pn',
    //   ssl: false,
    //   suppressLeaveEvents: true,
    //   logVerbosity: true
    // },
    // local contract server config
    defaultConfig: {
      origin: 'localhost:8090',
      ssl: false,
      suppressLeaveEvents: true,
      logVerbosity: false,
      uuid: 'myUUID'
    },
    demoKeyset: {
      publishKey : 'demo',
      subscribeKey : 'demo',
    },
    accessManagerKeyset: {
      publishKey : process.env.PUBLISH_KEY_ACCESS || 'pub-key',
      subscribeKey : process.env.SUBSCRIBE_KEY_ACCESS || 'sub-key',
      secretKey: process.env.SECRET_KEY_ACCESS || 'secret-key'
    },
    accessManagerWithoutSecretKeyKeyset: {
      publishKey : process.env.PUBLISH_KEY_ACCESS || 'pub-key',
      subscribeKey : process.env.SUBSCRIBE_KEY_ACCESS || 'sub-key',
    },
    tokenWithKnownAuthorizedUUID: 'qEF2AkF0GmEI03xDdHRsGDxDcmVzpURjaGFuoWljaGFubmVsLTEY70NncnChb2NoYW5uZWxfZ3JvdXAtMQVDdXNyoENzcGOgRHV1aWShZnV1aWQtMRhoQ3BhdKVEY2hhbqFtXmNoYW5uZWwtXFMqJBjvQ2dycKF0XjpjaGFubmVsX2dyb3VwLVxTKiQFQ3VzcqBDc3BjoER1dWlkoWpedXVpZC1cUyokGGhEbWV0YaBEdXVpZHR0ZXN0LWF1dGhvcml6ZWQtdXVpZENzaWdYIPpU-vCe9rkpYs87YUrFNWkyNq8CVvmKwEjVinnDrJJc',
    tokenWithUUIDResourcePermissions: 'qEF2AkF0GmEI03xDdHRsGDxDcmVzpURjaGFuoWljaGFubmVsLTEY70NncnChb2NoYW5uZWxfZ3JvdXAtMQVDdXNyoENzcGOgRHV1aWShZnV1aWQtMRhoQ3BhdKVEY2hhbqFtXmNoYW5uZWwtXFMqJBjvQ2dycKF0XjpjaGFubmVsX2dyb3VwLVxTKiQFQ3VzcqBDc3BjoER1dWlkoWpedXVpZC1cUyokGGhEbWV0YaBEdXVpZHR0ZXN0LWF1dGhvcml6ZWQtdXVpZENzaWdYIPpU-vCe9rkpYs87YUrFNWkyNq8CVvmKwEjVinnDrJJc',
    tokenWithUUIDPatternPermissions: 'qEF2AkF0GmEI03xDdHRsGDxDcmVzpURjaGFuoWljaGFubmVsLTEY70NncnChb2NoYW5uZWxfZ3JvdXAtMQVDdXNyoENzcGOgRHV1aWShZnV1aWQtMRhoQ3BhdKVEY2hhbqFtXmNoYW5uZWwtXFMqJBjvQ2dycKF0XjpjaGFubmVsX2dyb3VwLVxTKiQFQ3VzcqBDc3BjoER1dWlkoWpedXVpZC1cUyokGGhEbWV0YaBEdXVpZHR0ZXN0LWF1dGhvcml6ZWQtdXVpZENzaWdYIPpU-vCe9rkpYs87YUrFNWkyNq8CVvmKwEjVinnDrJJc',
  };

  constructor(options) {
    super(options);
  }

  stopWebpubsub() {
    state?.webpubsub?.stop();
    state.webpubsub = undefined;
  }

  getWebpubsub(config = undefined) {
    if (config) {
      // initialize instance of webpubsub if config is passed
      // otherwise assume it is already initialied
      this.stopWebpubsub();
      state.webpubsub = new Webpubsub(Object.assign({}, this.fixtures.defaultConfig, config));
    }

    return state.webpubsub;
  }

  async checkContract() {
    return new Promise<boolean>((resolve) => {
      http.get(`http://${this.settings.contractServer}/expect`, (response) => {

        let data: any = '';
  
        response.on('data', (chunk) => {
          data += chunk;
        });
    
        response.on('end', () => {
          let result;
          
          try {
            result = JSON.parse(data);
          } catch (e) {
            console.log("error fetching expect results", e);
            console.log(data);
          }
          resolve(result);
        });
        
      });
    });
  }

  /**
   * Disconnect webpubsub subscribe loop
   * 
   * TODO: fix JS SDK so that we can choose when to end the loop explicitly
   * or atleast get a promise to tell us when it is complete.
   */
  async cleanup(delayInMilliseconds) {

    if (!delayInMilliseconds) {
      this.getWebpubsub().unsubscribeAll();
    } else {
      return new Promise<void>((resolve) => {
        // allow a specified delay for subscribe loop before disconnecting
        setTimeout(() => {
          this.stopWebpubsub();
          resolve();
        }, delayInMilliseconds);
      });
    }
  }

  async delayCleanup() {
    return this.cleanup(300);
  }

}

setWorldConstructor(WebPubSubWorld);