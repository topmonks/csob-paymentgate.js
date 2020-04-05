const { dttm } = require("../crypto");

module.exports = {
  init: (_opts) => {
    const defaultValues = {
      payMethod: "card",
      currency: "CZK",
      closePayment: true,
      cart: [],
      language: "CZ",
    };

    const {
      merchantId,
      orderNo,
      payOperation,
      payMethod,
      totalAmount,
      currency,
      closePayment,
      returnUrl,
      returnMethod,
      cart,
      customerId,
      language,
    } = Object.assign(defaultValues, _opts);

    return {
      merchantId,
      orderNo,
      dttm: dttm(),
      payOperation,
      payMethod,
      totalAmount,
      currency,
      closePayment,
      returnUrl,
      returnMethod,
      cart,
      customerId,
      language,
    };
  },
  process: ({ payId, merchantId }) => ({
    merchantId,
    payId,
    dttm: dttm(),
  }),
  reverse: ({ payId, merchantId }) => ({
    merchantId,
    payId,
    dttm: dttm(),
  }),
  status: ({ payId, merchantId }) => ({
    merchantId,
    payId,
    dttm: dttm(),
  }),
  echo: ({ merchantId }) => ({
    merchantId,
    dttm: dttm(),
  }),
  oneclick: {
    echo: (_opts) => {
      const { merchantId, origPayId } = _opts;

      return {
        merchantId,
        origPayId,
        dttm: dttm(),
      };
    },
    init: (_opts) => {
      const defaultValues = {
        currency: "CZK",
      };

      const {
        merchantId,
        orderNo,
        totalAmount,
        currency,
        description,
        origPayId,
      } = Object.assign(defaultValues, _opts);

      return {
        merchantId,
        origPayId,
        orderNo,
        dttm: dttm(),
        totalAmount,
        currency,
        description,
      };
    },
    start: ({ payId, merchantId }) => ({
      merchantId,
      payId,
      dttm: dttm(),
    }),
  },
  order: {
    init: [
      "merchantId",
      "orderNo",
      "dttm",
      "payOperation",
      "payMethod",
      "totalAmount",
      "currency",
      "closePayment",
      "returnUrl",
      "returnMethod",
      "cart[].{name, quantity, amount, description}",
      "merchantData",
      "customerId",
      "language",
      "ttlSec",
      "logoVersion",
      "colorSchemeVersion",
    ],
    process: ["merchantId", "payId", "dttm", "signature"],
    reverse: ["merchantId", "payId", "dttm", "signature"],
    status: ["merchantId", "payId", "dttm", "signature"],
    echo: ["merchantId", "dttm", "signature"],
    response: [
      "payId",
      "dttm",
      "resultCode",
      "resultMessage",
      "paymentStatus",
      "authCode",
      "merchantData",
    ],
    oneclick: {
      init: [
        "merchantId",
        "origPayId",
        "orderNo",
        "dttm",
        "totalAmount",
        "currency",
        "description",
      ],
      start: ["merchantId", "payId", "dttm"],
    },
  },
  optional: {
    init: [
      "cart[].description",
      "merchantData",
      "customerId",
      "ttlSec",
      "logoVersion",
      "colorSchemeVersion",
    ],
    process: ["signature"],
    reverse: ["signature"],
    status: ["signature"],
    echo: ["signature"],
    response: ["paymentStatus", "authCode", "merchantData"],
    oneclick: {
      init: [],
      start: [],
    },
  },
};