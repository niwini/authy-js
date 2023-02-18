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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.generate = void 0;
/* eslint-disable import/prefer-default-export */
const bson_1 = require("bson");
const ecies = __importStar(require("./ecies"));
const secp = __importStar(require("./secp"));
//#####################################################
// Functions
//#####################################################
/**
 * This function is going to generate a new
 * document with provided contents.
 *
 * @param content -
 * @param pubKey -
 */
function generate(content, pubKey) {
    return {
        cipher: ecies.encrypt(content.data, pubKey).toHex(),
        id: new bson_1.ObjectId().toHexString(),
        owner_id: content.owner_id,
        subtype: content.subtype,
        title: content.title,
        type: content.type,
    };
}
exports.generate = generate;
/**
 * This function is going to sign a document.
 *
 * @param args -
 * @param args.document -
 * @param args.pvtKey -
 * @param args.type -
 */
async function sign(args) {
    const { pubKey } = secp.genKeyPair({
        pvtKey: args.pvtKey,
    });
    const type = args.type ?? "user";
    const signer = {
        pub_key: pubKey.toHex(),
        signature: (await secp.signData(args.document, args.pvtKey)).toHex(),
        type,
    };
    return {
        ...args.document,
        meta: {
            ...args.document.meta ?? {},
            signers: [
                ...args.document.meta?.signers ?? [],
                signer,
            ],
        },
    };
}
exports.sign = sign;
//# sourceMappingURL=document.js.map