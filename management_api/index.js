const fetch = require("node-fetch");
const { Headers } = require("node-fetch");
const { getBearerToken } = require("./config/azureAPI");
const config = require("./config/config");

(async () => {
  try {
    const token = await getBearerToken();

    const myHeaders = new Headers();
    // auth
    myHeaders.append("Authorization", `Bearer ${token.access_token}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let url = new URL(
      `https://management.azure.com/subscriptions/${config.AZURE_SUBSCRIPTION_ID}/resourceGroups/${config.RESOURCE_GROUP}/providers/Microsoft.ApiManagement/service/${config.APIM_SERVICE_NAME}/users?api-version=2021-08-01`
    );

    const response = await fetch(url, requestOptions);

    const data = await response.json();

    const emailList = data.value
      .reduce((acc, { properties }) => {
        if (properties.state == "active") {
          acc.push(properties.email);
        }
        return acc;
      }, [])
      .join();
    console.log(emailList);
  } catch (error) {
    console.error(error);
  }
})();
