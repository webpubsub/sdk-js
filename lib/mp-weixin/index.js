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
Object.defineProperty(exports, "__esModule", { value: true });
var cbor_sync_1 = __importDefault(require("cbor-sync"));
var common_1 = __importDefault(require("../cbor/common"));
var webpubsub_common_1 = __importDefault(require("../core/webpubsub-common"));
var web_1 = __importDefault(require("../crypto/modules/web"));
var networking_1 = __importDefault(require("../networking"));
var mp_weixin_1 = require("../networking/modules/mp-weixin");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(setup) {
        setup.cbor = new common_1.default(cbor_sync_1.default.decode, function (base64String) { return Buffer.from(base64String, 'base64'); });
        setup.networking = new networking_1.default({
            del: mp_weixin_1.del,
            get: mp_weixin_1.get,
            post: mp_weixin_1.post,
            patch: mp_weixin_1.patch,
            getfile: mp_weixin_1.getfile,
            postfile: mp_weixin_1.postfile,
        });
        setup.sdkFamily = 'mp-weixin';
        setup.cryptography = new web_1.default();
        return _super.call(this, setup) || this;
    }
    return default_1;
}(webpubsub_common_1.default));
exports.default = default_1;
;
