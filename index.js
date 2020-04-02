const crypto = require("./payment/crypto");
const payload = require("./payment/payload");
const util = require("./payment/util");

const csob = ({ merchantId, privateKey, publicKey }) => {
  return {
    echo: async () => {
      const payloadData = payload.echo({ merchantId });
      const signature = util.objectToStringWithOrder({
        obj: payloadData,
        order: ["merchantId", "dttm"],
        optionality: ["signature"],
      });
      const privateKey = fs.readFileSync("./rsa_M1MIPS1446.key", {
        encoding: "utf8",
      });
      payloadData.signature = await crypto.sign(signature, {
        privateKey,
        hashFn: "sha256",
        encoding: "base64",
      });

      const result = await request
        .post(`https://iapi.iplatebnibrana.csob.cz/api/v1.8/echo`)
        .send(payloadData);
    },
  };
};

module.exports = {
  csob,
  crypto,
  payload,
  util,
};
