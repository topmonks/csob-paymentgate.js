const crypto = require("../util");
const config = require("../config")();

describe("utils", () => {
  it("converts request object to a string separated by |", () => {
    const reqObj = {
      foo: "bar",
      baz: "bar2",
    };
    expect(crypto.objectToString(reqObj)).toEqual("bar|bar2");
  });

  it("converts request object to a string separated by | based on order array", () => {
    const obj = {
      foo: "bar",
      baz: "bar2",
      bar: { baz: "bar3" },
      arrayBar: [
        {
          foo: "barArray1",
        },
        {
          foo: "barArray2",
        },
      ],
      stringArray: ["stringFoo", "stringBar"],
    };
    const order = ["baz", "bar.baz", "arrayBar[].foo", "foo", "stringArray[]"];
    expect(
      crypto.objectToStringWithOrder({
        obj,
        order,
      })
    ).toEqual("bar2|bar3|barArray1|barArray2|bar|stringFoo|stringBar");
  });

  describe("examples https://github.com/csob/paymentgateway/wiki/Podpis-po%C5%BEadavku-a-ov%C4%9B%C5%99en%C3%AD-podpisu-odpov%C4%9Bdi", () => {
    it("1", () => {
      const obj = {
        merchantId: "012345",
        orderNo: "5547",
        dttm: "20140425131559",
        payOperation: "payment",
        payMethod: "card",
        totalAmount: 1789600,
        currency: "CZK",
        closePayment: true,
        cart: [
          {
            name: "Nákup: vasobchod.cz",
            quantity: 1,
            amount: 1789600,
            description: "Lenovo ThinkPad Edge E540",
          },
          {
            name: "Poštovné",
            quantity: 1,
            amount: 0,
            description: "Doprava PPL",
          },
        ],
        description:
          "Nákup na vasobchod.cz (Lenovo ThinkPad Edge E540, Doprava PPL)",
        merchantData: "some-base64-encoded-merchant-data",
        language: "CZ",
        returnUrl: "https://vasobchod.cz/gateway-return",
        returnMethod: "POST",
      };
      const order = config.order.init;
      const optionality = config.optional.init;
      expect(
        crypto.objectToStringWithOrder({
          obj,
          order,
          optionality,
        })
      ).toEqual(
        "012345|5547|20140425131559|payment|card|1789600|CZK|true|https://vasobchod.cz/gateway-return|POST|Nákup: vasobchod.cz|1|1789600|Lenovo ThinkPad Edge E540|Poštovné|1|0|Doprava PPL|Nákup na vasobchod.cz (Lenovo ThinkPad Edge E540, Doprava PPL)|some-base64-encoded-merchant-data|CZ"
      );
    });

    it("2", () => {
      const obj = {
        payId: "d165e3c4b624fBD",
        dttm: "20140425131559",
        resultCode: 0,
        resultMessage: "OK",
        paymentStatus: 7,
        authCode: "qwFDF32",
        merchantData: "base64-encoded-merchant-data",
      };
      const order = config.order.response;
      const optionality = config.optional.response;
      expect(
        crypto.objectToStringWithOrder({
          obj,
          order,
          optionality,
        })
      ).toEqual(
        "d165e3c4b624fBD|20140425131559|0|OK|7|qwFDF32|base64-encoded-merchant-data"
      );
    });
  });

  it("converts request object to a string separated by @@ based on order array", () => {
    const obj = {
      foo: "bar",
      baz: "bar2",
      bar: {
        baz: "bar3",
      },
      arrayBar: [
        {
          foo: "baz",
        },
      ],
    };
    const order = ["baz", "bar.baz", "arrayBar[].foo", "foo"];
    expect(
      crypto.objectToStringWithOrder({
        obj,
        order,
        separator: "@@",
      })
    ).toEqual("bar2@@bar3@@baz@@bar");
  });

  it("throws error if object does not contain required attribute", () => {
    const obj = {
      foo: {
        baz: "bar3",
      },
    };
    const order = ["foo.bar"];
    expect(() =>
      crypto.objectToStringWithOrder({
        obj,
        order,
      })
    ).toThrow(Error);
  });

  it("throws error if object does not contain required attribute but has optionality", () => {
    const obj = {
      foo: {
        baz: "bar3",
      },
    };
    const order = ["foo.bar"];
    const optionality = ["foo.bar"];
    expect(() =>
      crypto.objectToStringWithOrder({
        obj,
        order,
        optionality,
      })
    ).not.toThrow(Error);
  });
});
