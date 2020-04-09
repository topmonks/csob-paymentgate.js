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

      const body = await request
        .get(`${config.uri}/${config.methods.process}/${pathParam}`)
        .redirects(0)
        .ok((res) => res.status < 400);

      return body.header.location;
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

    status: async (payId) => {
      const payloadData = payload.status({
        merchantId,
        payId,
      });

      const signature = util.objectToStringWithOrder({
        obj: payloadData,
        order: payload.order.status,
        optional: payload.optional.status,
      });

      payloadData.signature = await crypto.sign(signature, privateKey);

      const pathParam = util.objectToStringWithOrder({
        obj: payloadData,
        order: payload.order.process,
        separator: "/",
        URIencode: true,
      });

      const { body } = await request.get(
        `${config.uri}/${config.methods.status}/${pathParam}`
      );

      crypto.verifyResponse(body, true, {
        csobPublicKey: config.csobPublicKey,
        optional: payload.optional.response,
        order: payload.order.response,
      });

      return body;
    },

    oneclick: {
      init: async (data) => {
        const payloadData = payload.oneclick.init({
          merchantId,
          ...data,
        });
        const signature = util.objectToStringWithOrder({
          obj: payloadData,
          order: payload.order.oneclick.init,
          optional: payload.optional.oneclick.init,
        });
        payloadData.signature = await crypto.sign(signature, privateKey);
        const { body } = await request
          .post(`${config.uri}/${config.methods.oneclick.init}`)
          .send(payloadData);

        crypto.verifyResponse(body, true, {
          csobPublicKey: config.csobPublicKey,
          optional: payload.optional.response,
          order: payload.order.response,
        });

        return body;
      },
      start: async (payId) => {
        const payloadData = payload.oneclick.start({
          merchantId,
          payId,
        });

        const signature = util.objectToStringWithOrder({
          obj: payloadData,
          order: payload.order.oneclick.start,
          optional: payload.optional.oneclick.start,
        });

        payloadData.signature = await crypto.sign(signature, privateKey);

        const { body } = await request
          .post(`${config.uri}/${config.methods.oneclick.start}`)
          .send(payloadData);

        crypto.verifyResponse(body, true, {
          csobPublicKey: config.csobPublicKey,
          optional: payload.optional.response,
          order: payload.order.response,
        });

        return body;
      },
      echo: async (payId) => {
        const payloadData = payload.oneclick.echo({
          merchantId,
          origPayId: payId,
        });

        const signature = util.objectToStringWithOrder({
          obj: payloadData,
          order: payload.order.oneclick.echo,
          optional: payload.optional.oneclick.echo,
        });

        payloadData.signature = await crypto.sign(signature, privateKey);

        const { body } = await request
          .post(`${config.uri}/${config.methods.oneclick.echo}`)
          .send(payloadData);

        crypto.verifyResponse(body, true, {
          csobPublicKey: config.csobPublicKey,
          optional: payload.optional.response,
          order: payload.order.response,
        });

        return body;
      },
    },

    verifyCsobRequest: (body) => {
      return crypto.verifyResponse(body, true, {
        csobPublicKey: config.csobPublicKey,
        optional: payload.optional.response,
        order: payload.order.response,
      });
    },
    config,
  };
};

module.exports = {
  csob,
  crypto,
  util,
};
