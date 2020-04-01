const { dttm } = require("./crypto");

module.exports = {
  init: (_opts) => {
    const defaultValues = {
      payMethod: "card",
      currency: "CZK",
      closePayment: true,
      cart: [],
      language: "EN",
    };

    const {
      merchantId,
      orderNo,
      oneClickPayment,
      payMethod,
      totalAmount,
      currency,
      closePayment,
      returnUrl,
      returnMethod,
      cart,
      description,
      customerId,
      language,
    } = Object.assign(defaultValues, _opts);

    return {
      merchantId,
      orderNo,
      dttm: dttm(),
      payOperation: oneClickPayment ? "oneclickPayment" : "payment",
      payMethod,
      totalAmount,
      currency,
      closePayment,
      returnUrl,
      returnMethod,
      cart,
      // [
      //   {
      //     name: "Your Bill",
      //     quantity: 1,
      //     amount: _.round(
      //       (occupation.bill.amount - cashbackOnBill) * config.paygateAccuracy
      //     ),
      //   },
      //   {
      //     name: "Your Tip",
      //     quantity: 1,
      //     amount: _.round((args.tip - cashbackOnTip) * config.paygateAccuracy),
      //   },
      // ],
      description,
      customerId,
      language,
    };
  },
  process: ({ payId, merchantId }) => ({
    merchantId,
    payId,
    dttm: dttm(),
  }),
  reversePayment: ({ payId, merchantId }) => ({
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
};
