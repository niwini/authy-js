import _ from "lodash";

import * as nodeSecp from "../secp";

import BufferLike from "./buffer";
import * as secp from "./secp";

//#####################################################
// Test definitions
//#####################################################
describe("[web] secp test", () => {
  it("should correctly generate a shared secret", async () => {
    const targetKeys = secp.genKeyPair();
    const ephKeys = secp.genKeyPair();

    const secretA = secp.sharedSecret(ephKeys.pvtKey, targetKeys.pubKey);
    const secretB = secp.sharedSecret(targetKeys.pvtKey, ephKeys.pubKey);

    expect(secretB.toHex()).toBe(secretA.toHex());
  });

  it("should correctly sign and verify data", async () => {
    const data = "This is a test";
    const keys = secp.genKeyPair();

    const signature = await secp.signData(data, keys.pvtKey);

    expect(signature).toBeTruthy();

    const isValid = await secp.signVerify(signature, data, keys.pubKey);

    expect(isValid).toBe(true);
  });

  it("should error on signature tempering", async () => {
    const data = "This is a test";
    const keys = secp.genKeyPair();

    const signature = await secp.signData(data, keys.pvtKey);

    expect(signature).toBeTruthy();

    // Modify one random byte of signature.
    const signatureBuff = signature.toBuffer();
    const sub1 = signatureBuff.subarray(0, 3);
    const sub2 = signatureBuff.subarray(3);

    const sub1Shuffled = Buffer.from(_.shuffle(sub1));
    const tempered = BufferLike.from(Buffer.concat([sub1Shuffled, sub2]));

    const isValidExpected = signature.toHex() === tempered.toHex();
    const isValid = await secp.signVerify(tempered, data, keys.pubKey);

    expect(isValid).toBe(isValidExpected);
  });

  it("should be able to verify data in nodejs", async () => {
    const data = "This is a test";
    const keys = secp.genKeyPair();

    const signature = await secp.signData(data, keys.pvtKey);

    expect(signature).toBeTruthy();

    const isValid = await nodeSecp.signVerify(
      signature.toHex(),
      data,
      keys.pubKey.toHex(),
    );

    expect(isValid).toBe(true);
  });
});
