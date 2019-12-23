const compat = require("serverless-nextjs-plugin/aws-lambda-compat");

module.exports = page => {
  const handler = (event, context, callback) => {

    process.env.static_override = "https://cdn.prtscanner.com";

    compat(page)(event, context, callback);
  };
  return handler;
};
