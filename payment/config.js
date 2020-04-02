const fs = require("fs");

const config = {
  csobPublicKey: fs.readFileSync(
    "./paymentgateway/keys/mips_platebnibrana.csob.cz.pub",
    { encoding: "utf8" }
  ),
  uri: "https://api.platebnibrana.csob.cz/api/v1.8",
  hashFn: "sha256",
  encoding: "base64",
  errorPaymentStatuses: [3, 5, 6],
  successPaymentStatuses: [4, 7, 8],
  methods: {
    init: "payment/init",
    process: "payment/process",
    status: "payment/status",
    reversePayment: "payment/reverse",
    oneclick: {
      init: "payment/oneclick/init",
      start: "payment/oneclick/start",
    },
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
      "description",
      "merchantData",
      "customerId",
      "language",
      "ttlSec",
      "logoVersion",
      "colorSchemeVersion",
    ],
    process: ["merchantId", "payId", "dttm", "signature"],
    reversePayment: ["merchantId", "payId", "dttm", "signature"],
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
    reversePayment: ["signature"],
    status: ["signature"],
    echo: ["signature"],
    response: ["paymentStatus", "authCode", "merchantData"],
    oneclick: {
      init: [],
      start: [],
    },
  },
};

const testConfig = {
  csobPublicKey: fs.readFileSync(
    "./paymentgateway/keys/mips_platebnibrana.csob.cz.pub",
    { encoding: "utf8" }
  ),
  uri: "https://iapi.iplatebnibrana.csob.cz/api/v1.8",
};

module.exports = (test = true) => {
  return Object.assign(config, test ? testConfig : {});
};
