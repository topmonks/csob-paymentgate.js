const objectToString = (obj, separator = "|") =>
  Object.values(obj).join(separator);

const objectToStringWithOrder = ({
  obj,
  order = [],
  separator = "|",
  optionality = [],
  URIencode = false,
}) => {
  const traverse = (key, child, keyPath) => {
    const [attrName, ...restAttrs] = key.split(".");
    const restAttrName = restAttrs.join(".");
    if (attrName.slice(-2) === "[]") {
      const attr = attrName.slice(0, -2);

      return child[attr]
        .map((objInArray) =>
          traverse(restAttrName, objInArray, `${keyPath}.${attr}[]`)
        )
        .filter((i) => i !== undefined)
        .join(separator);
    }
    if (attrName[0] === "{" && attrName[attrName.length - 1] === "}") {
      return attrName
        .slice(1, -1)
        .split(",")
        .map((singleAttrName) => singleAttrName.trim())
        .map((singleAttrName) =>
          traverse(singleAttrName, child, `${keyPath}.${singleAttrName}`)
        )
        .filter((i) => i !== undefined)
        .join(separator);
    }
    if (typeof child[attrName] === "object") {
      return traverse(restAttrName, child[attrName], `${keyPath}.${attrName}`);
    }
    const result = key ? child[key] : child;

    // eslint-disable-next-line no-param-reassign
    keyPath = `${keyPath}.${attrName}`.slice(1);
    if (result == null && !optionality.includes(keyPath)) {
      throw new Error(`Missing required attribute ${keyPath}`);
    }

    return URIencode ? encodeURIComponent(result) : result;
  };

  return order
    .map((key) => {
      return traverse(key, obj, "");
    })
    .filter((i) => i !== undefined)
    .join(separator);
};

module.exports = {
  objectToString,
  objectToStringWithOrder,
};
