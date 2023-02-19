"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certify = exports.sign = exports.validate = exports.build = void 0;
/* eslint-disable import/prefer-default-export */
const bson_1 = require("bson");
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = __importDefault(require("lodash"));
const ecies = __importStar(require("./ecies"));
const hash = __importStar(require("./hash"));
const secp = __importStar(require("./secp"));
//#####################################################
// Functions
//#####################################################
/**
 * This function is going to build a new
 * document with provided contents.
 *
 * @param content -
 */
function build(content) {
    /**
     * @todo - Verify the content schema.
     */
    return {
        cipher: ecies.encrypt(content.data, content.owner_pub_key).toHex(),
        created_at: (0, dayjs_1.default)().unix(),
        id: new bson_1.ObjectId().toHexString(),
        owner_pub_key: content.owner_pub_key,
        schema_version: "1.0",
        search_hash: hash.sha256(content.data).toHex(),
        signers: [],
        subtype: content.subtype,
        title: content.title,
        type: content.type,
    };
}
exports.build = build;
/**
 * Function validates a document.
 *
 * @param document -
 */
async function validate(document) {
    if (!bson_1.ObjectId.isValid(document.id)) {
        return false;
    }
    /**
     * Verify signers and certifiers.
     */
    const signResults = await Promise.all([
        ...(document.signers ?? []).map((signer) => secp.signVerify(signer.signature, [
            lodash_1.default.omit(document, ["meta", "signers"]),
            signer.data,
        ].filter(Boolean), signer.pub_key)),
        ...(document.meta?.certifiers ?? []).map((certifier) => secp.signVerify(certifier.signature, [
            lodash_1.default.omit(document, ["meta"]),
            certifier.data,
        ].filter(Boolean), certifier.pub_key)),
    ].filter(Boolean));
    for (const isResultValid of signResults) {
        if (!isResultValid) {
            return false;
        }
    }
    return true;
}
exports.validate = validate;
/**
 * This function is going to sign a document.
 *
 * @param document -
 * @param pvtKey -
 * @param opts -
 * @param opts.data -
 */
async function sign(document, pvtKey, opts = {}) {
    const { pubKey } = secp.genKeyPair({
        pvtKey,
    });
    const signer = {
        data: opts.data,
        pub_key: pubKey.toHex(),
        signature: (await secp.signData([
            lodash_1.default.omit(document, ["meta", "signers"]),
            opts.data,
        ].filter(Boolean), pvtKey)).toHex(),
    };
    return {
        ...document,
        signers: [
            ...document.signers ?? [],
            signer,
        ],
    };
}
exports.sign = sign;
/**
 * This function is going to sign a document.
 *
 * @param document -
 * @param pvtKey -
 * @param opts -
 * @param opts.data -
 */
async function certify(document, pvtKey, opts = {}) {
    const { pubKey } = secp.genKeyPair({
        pvtKey,
    });
    /**
     * Validate the document first.
     */
    const isValid = await validate(document);
    /**
     * If all signatures are valid we consider the
     * document is valid and therefore we can certify
     * the document.
     */
    if (!isValid) {
        throw new Error("document is invalid");
    }
    const certifier = {
        data: opts.data,
        pub_key: pubKey.toHex(),
        signature: (await secp.signData([
            lodash_1.default.omit(document, ["meta"]),
            opts.data,
        ].filter(Boolean), pvtKey)).toHex(),
    };
    return {
        ...document,
        meta: {
            ...document.meta ?? {},
            certifiers: [
                ...document.meta?.certifiers ?? [],
                certifier,
            ],
        },
    };
}
exports.certify = certify;
//# sourceMappingURL=document.js.map