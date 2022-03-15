require("dotenv").config();
const { version } = require("../package.json");

module.exports = {
  AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
  AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
  AZURE_SUBSCRIPTION_ID: process.env.AZURE_SUBSCRIPTION_ID,
  APIM_SERVICE_NAME: process.env.APIM_SERVICE_NAME,
  RESOURCE_GROUP: process.env.RESOURCE_GROUP,
};
