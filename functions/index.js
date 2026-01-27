const serverlesshtpp = require("serverless-http");
const app = require("../mainEntryPonit/app");
module.exports.handler = serverlesshtpp(app);
