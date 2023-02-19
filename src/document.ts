/* eslint-disable import/prefer-default-export */
import { ObjectId } from "bson";
import dayjs from "dayjs";
import _ from "lodash";

import { IBufferLikeInput } from "./buffer";
import * as ecies from "./ecies";
import * as hash from "./hash";
import * as secp from "./secp";

//#####################################################
// Types
//#####################################################
export interface IDocumentContent {
  data?: any;
  subtype: string;
  owner_pub_key: string;
  schema_version?: string;
  title?: string;
  type: string;
}

export interface IDocumentSigner {
  data?: any;
  pub_key: string;
  signature: string;
}

export interface IDocumentMeta {
  certifiers?: IDocumentSigner[];
}

export interface IDocument extends IDocumentContent {
  cipher: string;
  created_at: number;
  id: string;
  meta?: IDocumentMeta;
  search_hash: string;
  signers: IDocumentSigner[];
}

//#####################################################
// Functions
//#####################################################
/**
 * This function is going to build a new
 * document with provided contents.
 *
 * @param content -
 */
export function build(
  content: IDocumentContent,
): IDocument {
  /**
   * @todo - Verify the content schema.
   */

  return {
    cipher: ecies.encrypt(
      content.data,
      content.owner_pub_key,
    ).toHex(),
    created_at: dayjs().unix(),
    id: new ObjectId().toHexString(),
    owner_pub_key: content.owner_pub_key,
    schema_version: "1.0",
    search_hash: hash.sha256(content.data).toHex(),
    signers: [],
    subtype: content.subtype,
    title: content.title,
    type: content.type,
  };
}

/**
 * Function validates a document.
 *
 * @param document -
 */
export async function validate(
  document: IDocument,
) {
  if (!ObjectId.isValid(document.id)) {
    return false;
  }

  /**
   * Verify signers and certifiers.
   */
  const signResults = await Promise.all([
    ...(document.signers ?? []).map(
      (signer) => secp.signVerify(
        signer.signature,
        [
          _.omit(document, ["meta", "signers"]),
          signer.data,
        ].filter(Boolean),
        signer.pub_key,
      ),
    ),
    ...(document.meta?.certifiers ?? []).map(
      (certifier) => secp.signVerify(
        certifier.signature,
        [
          _.omit(document, ["meta"]),
          certifier.data,
        ].filter(Boolean),
        certifier.pub_key,
      ),
    ),
  ].filter(Boolean));

  for (const isResultValid of signResults) {
    if (!isResultValid) {
      return false;
    }
  }

  return true;
}

/**
 * This function is going to sign a document.
 *
 * @param document -
 * @param pvtKey -
 * @param opts -
 * @param opts.data -
 */
export async function sign(
  document: IDocument,
  pvtKey: IBufferLikeInput,
  opts: {
    data?: any;
  } = {},
): Promise<IDocument> {
  const { pubKey } = secp.genKeyPair({
    pvtKey,
  });

  const signer = {
    data: opts.data,
    pub_key: pubKey.toHex(),
    signature: (
      await secp.signData(
        [
          _.omit(document, ["meta", "signers"]),
          opts.data,
        ].filter(Boolean),
        pvtKey,
      )
    ).toHex(),
  };

  return {
    ...document,
    signers: [
      ...document.signers ?? [],
      signer,
    ],
  };
}

/**
 * This function is going to sign a document.
 *
 * @param document -
 * @param pvtKey -
 * @param opts -
 * @param opts.data -
 */
export async function certify(
  document: IDocument,
  pvtKey: IBufferLikeInput,
  opts: {
    data?: any;
  } = {},
): Promise<IDocument> {
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
    signature: (
      await secp.signData(
        [
          _.omit(document, ["meta"]),
          opts.data,
        ].filter(Boolean),
        pvtKey,
      )
    ).toHex(),
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
