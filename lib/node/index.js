"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var cbor_sync_1 = __importDefault(require("cbor-sync"));
var common_1 = __importDefault(require("../cbor/common"));
var webpubsub_common_1 = __importDefault(require("../core/webpubsub-common"));
var node_1 = __importDefault(require("../crypto/modules/node"));
var node_2 = __importDefault(require("../file/modules/node"));
var networking_1 = __importDefault(require("../networking"));
var node_3 = require("../networking/modules/node");
var web_node_1 = require("../networking/modules/web-node");
module.exports = /** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1(setup) {
        setup.cbor = new common_1.default(cbor_sync_1.default.decode, function (base64String) { return Buffer.from(base64String, 'base64'); });
        setup.networking = new networking_1.default({
            keepAlive: node_3.keepAlive,
            del: web_node_1.del,
            get: web_node_1.get,
            post: web_node_1.post,
            patch: web_node_1.patch,
            proxy: node_3.proxy,
            getfile: web_node_1.getfile,
            postfile: web_node_1.postfile,
        });
        setup.sdkFamily = 'Nodejs';
        setup.WebPubSubFile = node_2.default;
        setup.cryptography = new node_1.default();
        if (!('ssl' in setup)) {
            setup.ssl = true;
        }
        return _super.call(this, setup) || this;
    }
    return class_1;
}(webpubsub_common_1.default));
