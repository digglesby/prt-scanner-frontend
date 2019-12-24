const compat = require("next-aws-lambda");

module.exports = page => {
  const handler = (event, context) => {

    process.env.static_override = "https://cdn.prtscanner.com";

    const responsePromise = compat(page)(event, context);

    return responsePromise;
  };
  return handler;
};
