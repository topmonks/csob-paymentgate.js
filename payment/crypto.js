const crypto = require("crypto");
const moment = require("moment");
const util = require("./util");

const sign = async (text, { privateKey, hashFn, encoding }) => {
  const signer = crypto.createSign(hashFn);
  signer.update(text);

  return signer.sign(privateKey, encoding);
};

const verify = async (text, signature, { publicKey, hashFn, encoding }) => {
  const verifier = crypto.createVerify(hashFn);
  verifier.update(text);

  return verifier.verify(publicKey, signature, encoding);
};

const verifyResponse = async (
  response,
  echo = false,
  { attrOrder, optional, csobPublicKey }
) => {
  const text = util.objectToStringWithOrder({
    obj: response,
    order: attrOrder.response,
    optionality: [...optional.response, echo ? "payId" : undefined],
  });

  return verify(text, response.signature, csobPublicKey);
};

const dttm = () => moment().format("YYYYMMDDHHmmss");

module.exports = {
  sign,
  verify,
  dttm,
  verifyResponse,
};
