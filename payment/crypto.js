const crypto = require("crypto");
const moment = require("moment");
const util = require("./util");
const config = require("./config")();

const sign = (text, privateKey) => {
  const signer = crypto.createSign(config.hashFn);
  signer.update(text);

  return signer.sign(privateKey, config.encoding);
};

const verify = (text, signature, publicKey) => {
  const verifier = crypto.createVerify(config.hashFn);
  verifier.update(text);

  return verifier.verify(publicKey, signature, config.encoding);
};

const verifyResponse = (
  response,
  noPayId = false,
  { order, optional, csobPublicKey }
) => {
  const text = util.objectToStringWithOrder({
    obj: response,
    order: order.response,
    optional: [...optional.response, noPayId ? "payId" : undefined],
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
