/* eslint-disable import/prefer-default-export */
import { ObjectId } from "bson";

import { IBufferLikeInput } from "./buffer";
import * as ecies from "./ecies";
import * as secp from "./secp";

//#####################################################
// Types
//#####################################################
export interface IDocumentContent {
  data?: any;
  subtype: string;
  owner_id: string;
  title?: string;
  type: string;
}

export interface IDocumentSigner {
  data?: any;
  pub_key: string;
  signature: string;
  type: "owner" | "user" | "certifier";
}

export interface IDocumentMeta {
  signers?: IDocumentSigner[];
}

export interface IDocument extends IDocumentContent {
  cipher: string;
  created_at: number;
  id: string;
  meta?: IDocumentMeta;
  owner_id: string;
  search_hash: string;
}

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
export function generate(
  content: IDocumentContent,
  pubKey: string,
) {
  return {
    cipher: ecies.encrypt(content.data, pubKey).toHex(),
    id: new ObjectId().toHexString(),
    owner_id: content.owner_id,
    subtype: content.subtype,
    title: content.title,
    type: content.type,
  };
}

/**
 * This function is going to sign a document.
 *
 * @param args -
 * @param args.document -
 * @param args.pvtKey -
 * @param args.type -
 */
export async function sign(
  args: {
    document: IDocument;
    pvtKey: IBufferLikeInput;
    type?: IDocumentSigner["type"];
  },
): Promise<IDocument> {
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
