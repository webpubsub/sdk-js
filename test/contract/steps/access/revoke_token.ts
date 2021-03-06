import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('a token', function() {
  this.token = `this_represents_valid_token`;
});

When('I revoke a token', async function() {
  const webpubsub = await this.getWebpubsub({
    publishKey: this.keyset.publishKey,
    subscribeKey: this.keyset.subscribeKey,
    secretKey: this.keyset.secretKey
  });

  try {
    this.revokeTokenResult = await webpubsub.revokeToken(this.token);   
  } catch (e: any) {
    this.expectedError = e?.status?.errorData;
  }
});

Then('I get confirmation that token has been revoked', function() {
  expect(this.revokeTokenResult.status).to.equal(200);
  expect(this.revokeTokenResult.data.message).to.equal("Success");
});

Given('the token string {string}', function (token) {
  this.token = token;
});