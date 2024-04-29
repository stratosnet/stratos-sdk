"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmTransactionFields = void 0;
exports.evmTransactionFields = [
    { name: 'chainId', maxLength: 32 },
    { name: 'nonce', maxLength: 32 },
    { name: 'gasTipCap', maxLength: 32 },
    { name: 'gasFeeCap', maxLength: 32 },
    { name: 'gas', maxLength: 32 },
    { name: 'to', length: 20 },
    { name: 'value', maxLength: 32 },
    { name: 'data' },
    { name: 'accesses', asStruct: true },
];
//# sourceMappingURL=validations.js.map