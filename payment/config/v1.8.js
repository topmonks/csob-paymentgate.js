const fs = require("fs");
const path = require("path");

const config = {
  csobPublicKey: fs.readFileSync(
    path.resolve(
      __dirname,
      "../../paymentgateway/keys/mips_platebnibrana.csob.cz.pub"
    ),
    { encoding: "utf8" }
  ),
  uri: "https://api.platebnibrana.csob.cz/api/v1.8",
  hashFn: "sha256",
  encoding: "base64",
  errorPaymentStatuses: ["3", "5", "6"],
  successPaymentStatuses: ["4", "7", "8"],
  methods: {
    echo: "echo",
    init: "payment/init",
    process: "payment/process",
    status: "payment/status",
    reverse: "payment/reverse",
    oneclick: {
      echo: "oneclick/echo",
      init: "oneclick/init",
      start: "oneclick/start",
    },
  },
};

const testConfig = {
  csobPublicKey: fs.readFileSync(
    path.resolve(
      __dirname,
      "../../paymentgateway/keys/mips_platebnibrana.csob.cz.pub"
    ),
    { encoding: "utf8" }
  ),
  uri: "https://iapi.iplatebnibrana.csob.cz/api/v1.8",
};

module.exports = (test = true) => {
  return { ...config, ...(test ? testConfig : {}) };
};
