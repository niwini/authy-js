import { IBufferLikeInput } from "./buffer";
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
/**
 * This function is going to generate a new
 * document with provided contents.
 *
 * @param content -
 * @param pubKey -
 */
export declare function generate(content: IDocumentContent, pubKey: string): {
    cipher: string;
    id: string;
    owner_id: string;
    subtype: string;
    title: string;
    type: string;
};
/**
 * This function is going to sign a document.
 *
 * @param args -
 * @param args.document -
 * @param args.pvtKey -
 * @param args.type -
 */
export declare function sign(args: {
    document: IDocument;
    pvtKey: IBufferLikeInput;
    type?: IDocumentSigner["type"];
}): Promise<IDocument>;
