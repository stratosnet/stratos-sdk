interface PromisesMap {
    [key: number]: any;
}
export interface SimpleObject {
    [key: string]: any;
}
export interface WindowMessage extends EventListenerObject {
    origin: string;
    data: SimpleObject;
}
export interface HandshakeResult {
    authenticatedAppId: string;
    isAuthenticated: boolean;
}
export interface AppWalletService {
    appId: string;
    appKey: string;
    fileOrigin: string;
    msgIdPromiseHandlersMap: PromisesMap;
    isWalletHandshakeDone: boolean;
    parentWindow: Window;
}
declare class WalletService implements AppWalletService {
    appId: string;
    appKey: string;
    fileOrigin: string;
    msgIdPromiseHandlersMap: PromisesMap;
    isWalletHandshakeDone: boolean;
    parentWindow: Window;
    constructor(givenAppId: string, givenAppKey: string, givenFileOrigin: string, givenWindow: Window);
    init(): void;
    startHandshake(): Promise<unknown>;
    callWalletMethod(methodName: string, params?: SimpleObject): Promise<unknown>;
    receiveWalletMsg(e: any): void;
    getMsgUniqueKey(): number;
}
export declare function getWalletService(appId: string, appKey: string, fileOrigin: string, givenWindow: Window): WalletService;
export {};
