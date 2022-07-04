"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.patch = exports.post = exports.get = exports.getfile = exports.postfile = void 0;
/*       */
/* global window */
var flyio_1 = __importDefault(require("flyio"));
var wx_1 = __importDefault(require("flyio/dist/npm/wx"));
var request = new wx_1.default();
request.interceptors.request.use(function (request) {
    wx.showNavigationBarLoading();
    return request;
});
request.interceptors.response.use(function (response, promise) {
    wx.hideNavigationBarLoading();
    // if (!(response && response.data && response.data.res === 0)) {
    //   errorPrompt(response)
    // }
    return promise.resolve(response.data);
}, function (err, promise) {
    wx.hideNavigationBarLoading();
    errorPrompt(err);
    return promise.reject(err);
});
function log(url, qs, res) {
    var _pickLogger = function () {
        if (console && console.log)
            return console; // eslint-disable-line no-console
        return console;
    };
    var start = new Date().getTime();
    var timestamp = new Date().toISOString();
    var logger = _pickLogger();
    logger.log('<<<<<'); // eslint-disable-line no-console
    logger.log("[".concat(timestamp, "]"), '\n', url, '\n', qs); // eslint-disable-line no-console
    logger.log('-----'); // eslint-disable-line no-console
    var now = new Date().getTime();
    var elapsed = now - start;
    var timestampDone = new Date().toISOString();
    logger.log('>>>>>>'); // eslint-disable-line no-console
    logger.log("[".concat(timestampDone, " / ").concat(elapsed, "]"), '\n', url, '\n', qs, '\n', res); // eslint-disable-line no-console
    logger.log('-----'); // eslint-disable-line no-console
}
function xdr(method, url, params, body, endpoint, callback) {
    var _this = this;
    var status = {};
    status.operation = endpoint.operation;
    var url = buildUrl(url, params);
    var httpConfig = {
        method: method,
        timeout: endpoint.timeout,
        content: body,
    };
    return flyio_1.default.request(url, httpConfig)
        .then(function (response) {
        status.error = false;
        if (response.statusCode) {
            status.statusCode = response.statusCode;
        }
        return response.content.toJSON();
    })
        .then(function (response) {
        var resp = response;
        if (_this._config.logVerbosity) {
            log(url, params, resp);
        }
        callback(status, resp);
    })
        .catch(function (e) {
        status.error = true;
        status.errorData = e;
        status.category = _this._detectErrorCategory(e);
        callback(status, null);
    });
}
function postfile(url, fields, fileInput) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
exports.postfile = postfile;
function getfile(params, endpoint, callback) {
    var url = this.getStandardOrigin() + endpoint.url;
    return xdr.call(this, 'GET', url, params, '', endpoint, callback);
}
exports.getfile = getfile;
function get(params, endpoint, callback) {
    var url = this.getStandardOrigin() + endpoint.url;
    return xdr.call(this, 'GET', url, params, '', endpoint, callback);
}
exports.get = get;
function post(params, body, endpoint, callback) {
    var url = this.getStandardOrigin() + endpoint.url;
    return xdr.call(this, 'POST', url, params, body, endpoint, callback);
}
exports.post = post;
function patch(params, body, endpoint, callback) {
    var url = this.getStandardOrigin() + endpoint.url;
    return xdr.call(this, 'PATCH', url, params, body, endpoint, callback);
}
exports.patch = patch;
function del(params, endpoint, callback) {
    var url = this.getStandardOrigin() + endpoint.url;
    return xdr.call(this, 'DELETE', url, params, '', endpoint, callback);
}
exports.del = del;
