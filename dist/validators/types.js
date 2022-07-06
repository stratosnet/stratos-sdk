"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedValidatorsStatusMap = exports.ValidatorsStatusMap = exports.ValidatorStatus = exports.ValidatorsNetworkStatus = void 0;
var ValidatorsNetworkStatus;
(function (ValidatorsNetworkStatus) {
    ValidatorsNetworkStatus["Unbonded"] = "BOND_STATUS_UNBONDED";
    ValidatorsNetworkStatus["Unbonding"] = "BOND_STATUS_UNBONDING";
    ValidatorsNetworkStatus["Bonded"] = "BOND_STATUS_BONDED";
    ValidatorsNetworkStatus["All"] = "BOND_STATUS_UNSPECIFIED";
})(ValidatorsNetworkStatus = exports.ValidatorsNetworkStatus || (exports.ValidatorsNetworkStatus = {}));
var ValidatorStatus;
(function (ValidatorStatus) {
    ValidatorStatus[ValidatorStatus["Unbonded"] = 0] = "Unbonded";
    ValidatorStatus[ValidatorStatus["Unbonding"] = 1] = "Unbonding";
    ValidatorStatus[ValidatorStatus["Bonded"] = 2] = "Bonded";
    ValidatorStatus[ValidatorStatus["All"] = 3] = "All";
})(ValidatorStatus = exports.ValidatorStatus || (exports.ValidatorStatus = {}));
exports.ValidatorsStatusMap = new Map([
    [ValidatorStatus.Bonded, ValidatorsNetworkStatus.Bonded],
    [ValidatorStatus.Unbonded, ValidatorsNetworkStatus.Unbonded],
    [ValidatorStatus.Unbonding, ValidatorsNetworkStatus.Unbonding],
]);
exports.ParsedValidatorsStatusMap = new Map([
    [ValidatorStatus.Bonded, ValidatorStatus.Bonded],
    [ValidatorStatus.Unbonded, ValidatorStatus.Unbonded],
    [ValidatorStatus.Unbonding, ValidatorStatus.Unbonding],
]);
//# sourceMappingURL=types.js.map