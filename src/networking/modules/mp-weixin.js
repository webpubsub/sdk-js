/*       */
/* global window */
import Fly from 'flyio/dist/npm/wx';
import { buildUrl } from '../utils';

const fly = new Fly()
fly.interceptors.request.use((request) => {
  // wx.showNavigationBarLoading()
  return request
})

fly.interceptors.response.use((response, promise) => {
  // wx.hideNavigationBarLoading()
  return promise.resolve(response)
}, (err, promise) => {
    // wx.hideNavigationBarLoading()
    return promise.reject(err)
});

function log(url, qs, res) {
  const _pickLogger = () => {
    if (console && console.log) return console; // eslint-disable-line no-console
    return console;
  };

  const start = new Date().getTime();
  const timestamp = new Date().toISOString();
  const logger = _pickLogger();
  logger.log('<<<<<'); // eslint-disable-line no-console
  logger.log(`[${timestamp}]`, '\n', url, '\n', qs); // eslint-disable-line no-console
  logger.log('-----'); // eslint-disable-line no-console

  const now = new Date().getTime();
  const elapsed = now - start;
  const timestampDone = new Date().toISOString();

  logger.log('>>>>>>'); // eslint-disable-line no-console
  logger.log(`[${timestampDone} / ${elapsed}]`, '\n', url, '\n', qs, '\n', res); // eslint-disable-line no-console
  logger.log('-----'); // eslint-disable-line no-console
}

function xdr(method, url, params, body, endpoint, callback) {
    const status = {};
    status.operation = endpoint.operation;

    const url = buildUrl(url, params)

    const httpConfig = {
        method,
        timeout: endpoint.timeout,
    };

    return fly.request(url, body, httpConfig)
        .then((response) => {
            status.error = false;

            if (response.status) {
                status.statusCode = response.status;
            }

            return response.data;
        })
        .then((response) => {
            const resp = response;

            if (this._config.logVerbosity) {
                log(url, params, resp);
            }

            callback(status, resp);
        })
        .catch((e) => {
            status.error = true;
            status.errorData = e;
            status.category = this._detectErrorCategory(e);
            callback(status, null);
        });
}

export async function postfile(url, fields, fileInput) {
  /* TODO
  fields.forEach(({ key, value }) => {
    agent = agent.field(key, value);
  });

  agent.attach('file', fileInput, { contentType: 'application/octet-stream' });
  return result;
  */
}

export function getfile(params, endpoint, callback) {
  const url = this.getStandardOrigin() + endpoint.url;
  return xdr.call(this, 'get', url, params, '', endpoint, callback);
}

export function get(params, endpoint, callback) {
  const url = this.getStandardOrigin() + endpoint.url;
  return xdr.call(this, 'get', url, params, '', endpoint, callback);
}

export function post(params, body, endpoint, callback) {
  const url = this.getStandardOrigin() + endpoint.url;
  return xdr.call(this, 'post', url, params, body, endpoint, callback);
}

export function patch(params, body, endpoint, callback) {
  const url = this.getStandardOrigin() + endpoint.url;
  return xdr.call(this, 'patch', url, params, body, endpoint, callback);
}

export function del(params, endpoint, callback) {
  const url = this.getStandardOrigin() + endpoint.url;
  return xdr.call(this, 'delete', url, params, '', endpoint, callback);
}
