const request = require("superagent");
const crypto = require("./payment/crypto");
const payload = require("./payment/payload");
const util = require("./payment/util");
const getConfig = require("./payment/config");

const csob = ({ merchantId, privateKey, publicKey, test = false }) => {
  const config = getConfig(test);
  return {
    echo: async () => {
      const payloadData = payload.echo({ merchantId });
      const signature = util.objectToStringWithOrder({
        obj: payloadData,
        order: config.order.echo,
        optionality: config.optional.echo,
      });
      payloadData.signature = await crypto.sign(signature, privateKey);

      const { body } = await request
        .post(`${config.uri}/${config.methods.echo}`)
        .send(payloadData);

      crypto.verifyResponse(body, true, {
        csobPublicKey: config.csobPublicKey,
        optional: config.optional,
        order: config.order,
      });

      return body;
    },
  };
};

module.exports = {
  csob,
  crypto,
  payload,
  util,
};
