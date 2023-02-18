"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keccak256 = exports.sha512 = exports.sha256 = exports.sha3_256 = exports.hmac256 = void 0;
/* eslint-disable import/prefer-default-export */
const hmac_sha256_1 = __importDefault(require("crypto-js/hmac-sha256"));
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const sha512_1 = __importDefault(require("crypto-js/sha512"));
const js_sha3_1 = require("js-sha3");
const buffer_1 = __importDefault(require("./buffer"));
/**
 * This function is going to hash a message using
 * sha3 256 bits (= 32 bytes) keccak algorithm.
 *
 * @param msg -
 * @param secret -
 */
function hmac256(msg, secret) {
    return buffer_1.default.from((0, hmac_sha256_1.default)(buffer_1.default.cast(msg).toWordArray(), buffer_1.default.cast(secret).toWordArray()));
}
exports.hmac256 = hmac256;
/**
 * This function hash the provided message using the
 * sha3 algo with 256 bits (= 32 bytes) of size.
 *
 * @param msg -
 */
function sha3_256(// eslint-disable-line @typescript-eslint/naming-convention
msg) {
    return buffer_1.default.from((0, js_sha3_1.sha3_256)(buffer_1.default.cast(msg).toBuffer()));
}
exports.sha3_256 = sha3_256;
/**
 * This function hash the provided message using the
 * sha2 algo with 256 bits (= 32 bytes) of size.
 *
 * @param msg -
 */
function sha256(msg) {
    return buffer_1.default.from((0, sha256_1.default)(buffer_1.default.cast(msg).toWordArray()));
}
exports.sha256 = sha256;
/**
 * This function hash the provided message using the
 * sha2 algo with 512 bits (= 64 bytes) of size.
 *
 * @param msg -
 */
function sha512(msg) {
    return buffer_1.default.from((0, sha512_1.default)(buffer_1.default.cast(msg).toWordArray()));
}
exports.sha512 = sha512;
/**
 * This function is going to hash a message using
 * sha3 256 bits (= 32 bytes) keccak algorithm.
 *
 * @param msg -
 */
function keccak256(msg) {
    return buffer_1.default.from((0, js_sha3_1.keccak256)(buffer_1.default.cast(msg).toBuffer()));
}
exports.keccak256 = keccak256;
//# sourceMappingURL=hash.js.map