"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletService = void 0;
class WalletService {
    constructor(givenAppId, givenAppKey, givenFileOrigin, givenWindow) {
        this.appId = givenAppId || '';
        this.appKey = givenAppKey || '';
        this.fileOrigin = givenFileOrigin || '';
        this.msgIdPromiseHandlersMap = {};
        this.isWalletHandshakeDone = false;
        this.parentWindow = givenWindow;
    }
    init() {
        this.parentWindow.addEventListener('message', this.receiveWalletMsg.bind(this));
    }
    startHandshake() {
        return this.callWalletMethod('handshake', {
            handshakePl: { foo: 'bar' },
        });
    }
    callWalletMethod(methodName, params) {
        // console.log('1 callWalletMethod calling wallet method with params:', methodName, params);
        // Get unique id for this call to ensure that incoming responses are unique for each call
        const msgUniqueKey = this.getMsgUniqueKey();
        const target = this.fileOrigin;
        const msg = {
            appId: this.appId,
            appKey: this.appKey,
            msgUniqueKey,
            message: methodName,
            payload: params,
        };
        const result = new Promise((resolve, reject) => {
            var _a, _b;
            this.msgIdPromiseHandlersMap[msgUniqueKey] = {
                resolve,
                reject,
            };
            (_b = (_a = this.parentWindow) === null || _a === void 0 ? void 0 : _a.top) === null || _b === void 0 ? void 0 : _b.postMessage(msg, target);
        });
        return result;
    }
    receiveWalletMsg(e) {
        const { origin, data } = e;
        // console.log('19 🚀 ~ file: walletService.js ~ line 80 ~ walletService ~ receiveWalletMsg ~ e', e);
        const { appKey: senderAppKey, appId: senderAppId } = data;
        const isValidCreds = senderAppKey === this.appKey && senderAppId === this.appId;
        const isOriginValid = origin === this.fileOrigin;
        // const isOriginValid =
        //   origin === allowedTargetOrigin ||
        //   (isRunningFromElectronApp && origin === fileOrigin);
        // console.log(
        //   '20 🚀 ~ file: walletService.js ~ line 88 ~ walletService ~ receiveWalletMsg ~ isOriginValid',
        //   isOriginValid,
        // );
        if (!isValidCreds || !isOriginValid) {
            // console.log(`20a Got a msg without required credentials: ${JSON.stringify(e)}`);
            // console.log('20b Given data', data);
            return;
        }
        if (!this.msgIdPromiseHandlersMap[data.msgUniqueKey]) {
            return;
        }
        if (data.msgResultType === 'SUCCESS') {
            // console.log(
            //   '21 🚀 ~ file: walletService.js ~ line 110 ~ walletService ~ receiveWalletMsg ~ isValidCreds',
            //   isValidCreds,
            // );
            this.msgIdPromiseHandlersMap[data.msgUniqueKey].resolve(data.payload);
        }
        else {
            console.log('22 ERROR 🚀 ~ file: walletService.js ~ line 113 ~ walletService ~ receiveWalletMsg ~ isValidCreds', isValidCreds);
            this.msgIdPromiseHandlersMap[data.msgUniqueKey].reject(data);
        }
    }
    getMsgUniqueKey() {
        let uniqueKey = Math.random();
        while (this.msgIdPromiseHandlersMap[uniqueKey]) {
            uniqueKey = Math.random();
        }
        return uniqueKey;
    }
}
let walletService;
function getWalletService(appId, appKey, fileOrigin, givenWindow) {
    let instance = walletService;
    if (!walletService) {
        instance = new WalletService(appId, appKey, fileOrigin, givenWindow);
        instance.init();
    }
    return instance;
}
exports.getWalletService = getWalletService;
//# sourceMappingURL=walletService.js.map