const { generateKeyPairSync } = require("crypto");
const { sign, verify } = require("../crypto");

const generateKeys = (modulusLength) => {
  return generateKeyPairSync("rsa", {
    modulusLength,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
};

describe("crypto", () => {
  test("sign and verify", () => {
    const { publicKey, privateKey } = generateKeys(512);
    const test = "foobar";
    const signature = sign(test, privateKey);
    expect(verify(test, signature, publicKey)).toEqual(true);
  });

  test("sign and dont verify", () => {
    const { publicKey, privateKey } = generateKeys(512);
    const test = "foobar";
    const fake = "foobar2";
    const signature = sign(test, privateKey);
    expect(verify(fake, signature, publicKey)).toEqual(false);
  });
});
