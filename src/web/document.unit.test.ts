import { ObjectId } from "bson";

import * as document from "./document";
import * as secp from "./secp";

//#####################################################
// Constants
//#####################################################
const keys = secp.genKeyPair();
const ownerId = new ObjectId().toHexString();

let doc: document.IDocument;

//#####################################################
// Test definitions
//#####################################################
describe("[web] document test", () => {
  beforeEach(() => {
    doc = document.build({
      content: {
        data: "test@email.com",
        owner_id: ownerId,
        subtype: "email",
        title: "My Email",
        type: "attribute",
      },
      pub_key: keys.pubKey.toHex(),
    });
  });


  it("should correctly build a document", async () => {
    expect(doc.cipher).toBeDefined();
    expect(doc.created_at).toBeDefined();
  });

  it("should correctly sign a document", async () => {
    const signedDoc = await document.sign(doc, keys.pvtKey);

    expect(signedDoc.signers).toBeDefined();
    expect(signedDoc.signers.length).toBe(1);
  });

  it("should correctly certify a document", async () => {
    const signedDoc = await document.sign(doc, keys.pvtKey, {
      data: "hello world",
    });
    const certifiedDoc = await document.certify(signedDoc, keys.pvtKey);

    expect(certifiedDoc.meta).toBeDefined();
    expect(certifiedDoc.meta?.certifiers).toBeDefined();
    expect(certifiedDoc.meta?.certifiers?.length).toBe(1);
  });
});
