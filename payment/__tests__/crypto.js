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
    const signature = sign(test, privateKey, "sha256", "base64");
    expect(verify(test, signature, publicKey, "sha256", "base64")).toEqual(
      true
    );
  });

  test("sign and dont verify", () => {
    const { publicKey, privateKey } = generateKeys(512);
    const test = "foobar";
    const fake = "foobar2";
    const signature = sign(test, privateKey, "sha256", "base64");
    expect(verify(fake, signature, publicKey, "sha256", "base64")).toEqual(
      false
    );
  });
});
