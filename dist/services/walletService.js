"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletService = void 0;
var WalletService = /** @class */ (function () {
    function WalletService(givenAppId, givenAppKey, givenFileOrigin, givenWindow) {
        this.appId = givenAppId || '';
        this.appKey = givenAppKey || '';
        this.fileOrigin = givenFileOrigin || '';
        this.msgIdPromiseHandlersMap = {};
        this.isWalletHandshakeDone = false;
        this.parentWindow = givenWindow;
    }
    WalletService.prototype.init = function () {
        this.parentWindow.addEventListener('message', this.receiveWalletMsg.bind(this));
    };
    WalletService.prototype.startHandshake = function () {
        return this.callWalletMethod('handshake', {
            handshakePl: { foo: 'bar' },
        });
    };
    WalletService.prototype.callWalletMethod = function (methodName, params) {
        var _this = this;
        console.log('1 callWalletMethod calling wallet method with params:', methodName, params);
        // Get unique id for this call to ensure that incoming responses are unique for each call
        var msgUniqueKey = this.getMsgUniqueKey();
        var target = this.fileOrigin;
        var msg = {
            appId: this.appId,
            appKey: this.appKey,
            msgUniqueKey: msgUniqueKey,
            message: methodName,
            payload: params,
        };
        var result = new Promise(function (resolve, reject) {
            var _a, _b;
            _this.msgIdPromiseHandlersMap[msgUniqueKey] = {
                resolve: resolve,
                reject: reject,
            };
            (_b = (_a = _this.parentWindow) === null || _a === void 0 ? void 0 : _a.top) === null || _b === void 0 ? void 0 : _b.postMessage(msg, target);
        });
        return result;
    };
    WalletService.prototype.receiveWalletMsg = function (e) {
        var origin = e.origin, data = e.data;
        console.log('19 🚀 ~ file: walletService.js ~ line 80 ~ walletService ~ receiveWalletMsg ~ e', e);
        var senderAppKey = data.appKey, senderAppId = data.appId;
        var isValidCreds = senderAppKey === this.appKey && senderAppId === this.appId;
        var isOriginValid = origin === this.fileOrigin;
        // const isOriginValid =
        //   origin === allowedTargetOrigin ||
        //   (isRunningFromElectronApp && origin === fileOrigin);
        console.log('20 🚀 ~ file: walletService.js ~ line 88 ~ walletService ~ receiveWalletMsg ~ isOriginValid', isOriginValid);
        if (!isValidCreds || !isOriginValid) {
            console.log("20a Got a msg without required credentials: " + JSON.stringify(e));
            console.log('20b Given data', data);
            return;
        }
        if (!this.msgIdPromiseHandlersMap[data.msgUniqueKey]) {
            return;
        }
        if (data.msgResultType === 'SUCCESS') {
            console.log('21 🚀 ~ file: walletService.js ~ line 110 ~ walletService ~ receiveWalletMsg ~ isValidCreds', isValidCreds);
            this.msgIdPromiseHandlersMap[data.msgUniqueKey].resolve(data.payload);
        }
        else {
            console.log('22 ERROR 🚀 ~ file: walletService.js ~ line 113 ~ walletService ~ receiveWalletMsg ~ isValidCreds', isValidCreds);
            this.msgIdPromiseHandlersMap[data.msgUniqueKey].reject(data);
        }
    };
    WalletService.prototype.getMsgUniqueKey = function () {
        var uniqueKey = Math.random();
        while (this.msgIdPromiseHandlersMap[uniqueKey]) {
            uniqueKey = Math.random();
        }
        return uniqueKey;
    };
    return WalletService;
}());
var walletService;
function getWalletService(appId, appKey, fileOrigin, givenWindow) {
    var instance = walletService;
    if (!walletService) {
        instance = new WalletService(appId, appKey, fileOrigin, givenWindow);
        instance.init();
    }
    return instance;
}
exports.getWalletService = getWalletService;
//# sourceMappingURL=walletService.js.map