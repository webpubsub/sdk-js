# Webpubsub JavaScript SDK (V4)

[![Build Status](https://travis-ci.com/webpubsub/javascript.svg?branch=master)](https://travis-ci.com/webpubsub/javascript)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2859917905c549b8bfa27630ff276fce)](https://www.codacy.com/app/Webpubsub/javascript?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=webpubsub/javascript&amp;utm_campaign=Badge_Grade)
[![npm](https://img.shields.io/npm/v/webpubsub.svg)]()
[![Bower](https://img.shields.io/bower/v/webpubsub.svg)]()
[![Known Vulnerabilities](https://snyk.io/test/npm/webpubsub/badge.svg)](https://snyk.io/test/npm/webpubsub)

This is the official Webpubsub JavaScript SDK repository.

Webpubsub takes care of the infrastructure and APIs needed for the realtime communication layer of your application. Work on your app's logic and let Webpubsub handle sending and receiving data across the world in less than 100ms.

## Get keys

You will need the publish and subscribe keys to authenticate your app. Get your keys from the [Admin Portal](https://dashboard.webpubsub.com/login).

## Configure Webpubsub

1. Integrate the JavaScript SDK into your project:
   * use `npm`:
     ```
     npm install webpubsub
     ```
   * or download one of our builds from our CDN: 
     * https://cdn.webpubsub.com/sdk/javascript/webpubsub.7.0.1.js
     * https://cdn.webpubsub.com/sdk/javascript/webpubsub.7.0.1.min.js

2. Configure your keys:

  ```javascript
  webpubsub = new Webpubsub({
    publishKey : "myPublishKey",
    subscribeKey : "mySubscribeKey",
    uuid: "myUniqueUUID"
  })
  ```

## Add event listeners

```javascript
webpubsub.addListener({
  message: function (m) {
    // handle messages
  },
  presence: function (p) {
    // handle presence  
  },
  signal: function (s) {
    // handle signals
  },
  objects: (objectEvent) => {
    // handle objects
  },
  messageAction: function (ma) {
    // handle message actions
  },
  file: function (event) {
    // handle files  
  },
  status: function (s) {
  // handle status  
  },
});
```

## Publish/subscribe

```javascript
var publishPayload = {
    channel : "hello_world",
    message: {
        title: "greeting",
        description: "This is my first message!"
    }
}

webpubsub.publish(publishPayload, function(status, response) {
    console.log(status, response);
})

webpubsub.subscribe({
    channels: ["hello_world"]
});
```

## Documentation

* [Build your first realtime JS app with Webpubsub](https://www.webpubsub.com/docs/platform/quickstarts/javascript)
* [API reference for JavaScript (web)](https://www.webpubsub.com/docs/web-javascript/webpubsub-javascript-sdk)
* [API reference for JavaScript (Node.js)](https://www.webpubsub.com/docs/nodejs-javascript/webpubsub-javascript-sdk)

## Support

If you **need help** or have a **general question**, contact <support@webpubsub.com>.
