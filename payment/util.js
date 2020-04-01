const objectToString = (obj, separator = "|") =>
  Object.values(obj).join(separator);

const objectToStringWithOrder = ({
  obj,
  order = [],
  separator = "|",
  optionality = [],
  URIencode = false,
}) => {
  const traverse = (key, child, originalKey) => {
    const [attrName, ...restAttrs] = key.split(".");
    const restAttrName = restAttrs.join(".");
    if (attrName.slice(-2) === "[]") {
      const attr = attrName.slice(0, -2);

      return child[attr]
        .map((objInArray) => traverse(restAttrName, objInArray, originalKey))
        .join(separator);
    }
    if (typeof child[attrName] === "object") {
      return traverse(restAttrName, child[attrName], originalKey);
    }
    const result = key ? child[key] : child;
    if (result == null && !optionality.includes(originalKey)) {
      throw new Error(`Missing required attribute ${originalKey}`);
    }

    return URIencode ? encodeURIComponent(result) : result;
  };

  return order
    .map((key) => {
      return traverse(key, obj, key);
    })
    .join(separator);
};

module.exports = {
  objectToString,
  objectToStringWithOrder,
};
