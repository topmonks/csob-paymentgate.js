const request = require("superagent");
const crypto = require("./payment/crypto");
const payloadVersions = require("./payment/payload");
const util = require("./payment/util");
const getConfig = require("./payment/config");

const csob = ({
  merchantId,
  privateKey,
  publicKey,
  test = false,
  version = "1.8",
}) => {
  const payload = payloadVersions[version];
  const config = getConfig(test);
  return {
    init: async (data) => {
      const payloadData = payload.init({
        merchantId,
        ...data,
      });
      const signature = util.objectToStringWithOrder({
        obj: payloadData,
        order: payload.order.init,
        optional: payload.optional.init,
      });
      payloadData.signature = await crypto.sign(signature, privateKey);
      const { body } = await request
        .post(`${config.uri}/${config.methods.init}`)
        .send(payloadData);

      crypto.verifyResponse(body, true, {
        csobPublicKey: config.csobPublicKey,
        optional: payload.optional.response,
        order: payload.order.response,
      });

      return body;
    },
    process: async (payId) => {
      const payloadData = payload.process({
        merchantId,
        payId,
      });

      const signature = util.objectToStringWithOrder({
        obj: payloadData,
        order: payload.order.process,
        optional: payload.optional.process,
      });

      payloadData.signature = await crypto.sign(signature, privateKey);

      const pathParam = util.objectToStringWithOrder({
        obj: payloadData,
        order: payload.order.process,
        separator: "/",
        URIencode: true,
      });

      const body = await request.get(
        `${config.uri}/${config.methods.process}/${pathParam}`
      );

      return body.redirects[0];
    },
    echo: async () => {
      const payloadData = payload.echo({ merchantId });
      const signature = util.objectToStringWithOrder({
        obj: payloadData,
        order: payload.order.echo,
        optional: payload.optional.echo,
      });
      payloadData.signature = await crypto.sign(signature, privateKey);

      const { body } = await request
        .post(`${config.uri}/${config.methods.echo}`)
        .send(payloadData);

      crypto.verifyResponse(body, true, {
        csobPublicKey: config.csobPublicKey,
        optional: payload.optional.response,
        order: payload.order.response,
      });

      return body;
    },
  };
};

module.exports = {
  csob,
  crypto,
  util,
};
