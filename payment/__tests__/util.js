const crypto = require("../util");

describe("Payment utils", () => {
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
