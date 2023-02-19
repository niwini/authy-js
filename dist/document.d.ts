import { IBufferLikeInput } from "./buffer";
export interface IDocumentContent {
    data?: any;
    subtype: string;
    owner_id: string;
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
    owner_id: string;
    search_hash: string;
    signers: IDocumentSigner[];
}
/**
 * This function is going to build a new
 * document with provided contents.
 *
 * @param args -
 * @param args.content -
 * @param args.pub_key -
 */
export declare function build(args: {
    content: IDocumentContent;
    pub_key: string;
}): IDocument;
/**
 * Function validates a document.
 *
 * @param document -
 */
export declare function validate(document: IDocument): Promise<boolean>;
/**
 * This function is going to sign a document.
 *
 * @param document -
 * @param pvtKey -
 * @param opts -
 * @param opts.data -
 */
export declare function sign(document: IDocument, pvtKey: IBufferLikeInput, opts?: {
    data?: any;
}): Promise<IDocument>;
/**
 * This function is going to sign a document.
 *
 * @param document -
 * @param pvtKey -
 * @param opts -
 * @param opts.data -
 */
export declare function certify(document: IDocument, pvtKey: IBufferLikeInput, opts?: {
    data?: any;
}): Promise<IDocument>;
