/* global describe, it */

import Webpubsub from '../../src/node/index';

let assert = require('assert');
let fs = require('fs');
let path = require('path');

let packageJSON = require('../../package.json');

let readMe = fs.readFileSync(path.resolve(__dirname, '../../README.md'), 'UTF-8');

describe('release should be consistent', () => {
  it('with npm valid entry point', () => {
    assert.equal(packageJSON.main, './lib/node/index.js');
  });

  it('with correct version in code', () => {
    assert.equal(packageJSON.version, new Webpubsub({ uuid: 'myUUID' }).getVersion());
  });

  it('with updated readme', () => {
    assert(readMe.indexOf(`https://cdn.webpubsub.com/sdk/javascript/webpubsub.${packageJSON.version}.js`) > 1);
    assert(readMe.indexOf(`https://cdn.webpubsub.com/sdk/javascript/webpubsub.${packageJSON.version}.min.js`) > 1);
  });
});
