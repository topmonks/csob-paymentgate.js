const crypto = require("crypto");
const moment = require("moment");
const util = require("./util");

const sign = (text, privateKey, hashFn, encoding) => {
  const signer = crypto.createSign(hashFn);
  signer.update(text);

  return signer.sign(privateKey, encoding);
};

class VERIFICATION_ERROR extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.status = 400;
  }

  statusCode() {
    return this.status;
  }
}

const verify = (text, signature, publicKey, hashFn, encoding) => {
  const verifier = crypto.createVerify(hashFn);
  verifier.update(text);

  return verifier.verify(publicKey, signature, encoding);
};

const verifyResponse = (
  response,
  noPayId = false,
  { order, optional, csobPublicKey },
  hashFn,
  encoding
) => {
  const text = util.objectToStringWithOrder({
    obj: response,
    order,
    optional: [...optional, noPayId ? "payId" : undefined],
  });

  const verification = verify(
    text,
    response.signature,
    csobPublicKey,
    hashFn,
    encoding
  );

  if (!verification) {
    throw new VERIFICATION_ERROR(
      "CSOB response signature verification failed."
    );
  }

  return verification;
};

const dttm = () => moment().format("YYYYMMDDHHmmss");

module.exports = {
  sign,
  verify,
  dttm,
  verifyResponse,
};
