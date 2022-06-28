/**       */

import Webpubsub from '../../src/web/index';

function urlToFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

describe('test', () => {
  const SUBSCRIBE_KEY = 'demo-36';
  const PUBLISH_KEY = 'demo-36';

  const TEST_PREFIX = 'javascript-fileUploadApiV1-tests';
  const UUID = `${TEST_PREFIX}-main`;
  const UUID_1 = `${TEST_PREFIX}-uuid-1`;

  const CHANNEL_1 = `demo-channel`;

  const FILE_1 = `${TEST_PREFIX}-file-1`;

  let webpubsub        ;

  after(() => {
    webpubsub.unsubscribeAll();
    webpubsub.destroy();
  });

  describe('with encryption', () => {
    webpubsub = new Webpubsub({
      subscribeKey: SUBSCRIBE_KEY,
      publishKey: PUBLISH_KEY,
      uuid: UUID,
      cipherKey: 'abcdef',
    });

    runTests(webpubsub);
  });

  describe('without encryption', () => {
    webpubsub = new Webpubsub({
      subscribeKey: SUBSCRIBE_KEY,
      publishKey: PUBLISH_KEY,
      uuid: UUID,
    });

    runTests(webpubsub);
  });

  function runTests(webpubsub) {
    it('should export File class in Webpubsub instance', async () => {
      expect(webpubsub.File).to.exist;
    });

    it('should handle File interface with text files', async () => {
      const fileContent = 'Hello world!';
      const testFile = new File([fileContent], 'myFile.txt', {
        type: 'text/plain',
      });

      const result = await webpubsub.sendFile({
        channel: CHANNEL_1,
        message: { test: 'message', value: 42 },
        file: testFile,
      });

      expect(result.name).to.equal('myFile.txt');

      const webpubsubFile = await webpubsub.downloadFile({ name: result.name, id: result.id, channel: CHANNEL_1 });
      const file = await webpubsubFile.toFile();

      await new Promise(async (resolve) => {
        const fr = new FileReader();

        fr.addEventListener('load', () => {
          expect(fr.result).to.equal(fileContent);
          resolve();
        });

        fr.readAsBinaryString(file);
      });
    }).timeout(20000);

    it('should handle File interface with images', async () => {
      const contents = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      const inputFile = await urlToFile(`data:image/png;base64,${contents}`, 'myFile.png', 'image/png');

      const result = await webpubsub.sendFile({
        channel: CHANNEL_1,
        file: inputFile,
      });

      expect(result.name).to.equal('myFile.png');

      const webpubsubFile = await webpubsub.downloadFile({
        channel: CHANNEL_1,
        id: result.id,
        name: result.name,
      });

      const outputFile = await webpubsubFile.toFile();

      await new Promise(async (resolve) => {
        const fr = new FileReader();

        fr.addEventListener('load', () => {
          if (webpubsub._config.cipherKey) {
            expect(fr.result).to.equal(`data:application/octet-stream;base64,${contents}`);
          } else {
            expect(fr.result).to.equal(`data:image/png;base64,${contents}`);
          }
          resolve();
        });

        fr.readAsDataURL(outputFile);
      });
    }).timeout(20000);

    let fileId;
    let fileName;

    it('should handle strings', async () => {
      const testContent = `Hello world! ${new Date().toLocaleString()}`;

      const result = await webpubsub.sendFile({
        channel: CHANNEL_1,
        file: { data: testContent, name: 'someFile.txt', mimeType: 'text/plain' },
      });

      expect(result.name).to.equal('someFile.txt');

      const file = await webpubsub.downloadFile({
        channel: CHANNEL_1,
        id: result.id,
        name: result.name,
      });

      fileId = result.id;
      fileName = result.name;

      const output = await file.toString('utf8');

      expect(output).to.equal(testContent);
    }).timeout(10000);

    it('should list all available files on a channel', async () => {
      const result = await webpubsub.listFiles({ channel: CHANNEL_1 });

      expect(result.status).to.equal(200);
      expect(result.data).to.have.length.greaterThan(0);
    });

    it('should handle file delete', async () => {
      const result = await webpubsub.deleteFile({ channel: CHANNEL_1, id: fileId, name: fileName });

      expect(result.status).to.equal(200);
    });
    it('should handle encryption/decryption with explicit cipherKey', async () => {
      const testContent = `Hello world! ${new Date().toLocaleString()}`;

      const result = await webpubsub.sendFile({
        channel: CHANNEL_1,
        file: { data: testContent, name: 'someFile.txt', mimeType: 'text/plain' },
        cipherKey: 'cipherKey'
      });

      expect(result.name).to.equal('someFile.txt');

      const file = await webpubsub.downloadFile({
        channel: CHANNEL_1,
        id: result.id,
        name: result.name,
        cipherKey: 'cipherKey'
      });

      fileId = result.id;
      fileName = result.name;

      const output = await file.toString('utf8');

      expect(output).to.equal(testContent);
    }).timeout(10000);
  }
});
