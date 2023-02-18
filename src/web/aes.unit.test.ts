import * as nodeAes from "../aes";

import * as aes from "./aes";

//#####################################################
// Constants
//#####################################################
const SECRET = "shhh..";

//#####################################################
// Test definitions
//#####################################################
describe("[web] aes test", () => {
  it("should be able to encrypt and decrypt", async () => {
    const msg = "This is a test message";
    const encrypted = aes.encrypt(msg, SECRET).toHex();

    expect(encrypted.length)
      .toBe(114);

    const decrypted = aes.decrypt(encrypted, SECRET);

    expect(decrypted).toBe(msg);
  });

  it("should be able to encrypt and pass over to nodejs", async () => {
    const msg = "This is a test message";
    const encrypted = aes.encrypt(msg, SECRET).toHex();

    expect(encrypted.length)
      .toBe(114);

    const decrypted = nodeAes.decrypt(encrypted, SECRET);

    expect(decrypted).toBe(msg);
  });

  it("should be able to decrypt message coming from nodejs", async () => {
    const msg = "This is a test message";
    const encrypted = nodeAes.encrypt(msg, SECRET).toHex();

    expect(encrypted.length)
      .toBe(114);

    const decrypted = aes.decrypt(encrypted, SECRET);

    expect(decrypted).toBe(msg);
  });
});
