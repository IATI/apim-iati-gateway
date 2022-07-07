const fetch = require("node-fetch");
const { Headers } = require("node-fetch");
const { getBearerToken } = require("./config/azureAPI");
const config = require("./config/config");

const getPaginatedResponse = async (url, requestOptions, values = []) => {
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  values = [...values, ...data.value];
  if ("nextLink" in data) {
    return getPaginatedResponse(data.nextLink, requestOptions, values);
  }
  return values;
};

(async () => {
  // update me to return emails only for these user IDs
  const filterUsers = [];
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

    const values = await getPaginatedResponse(url, requestOptions);

    const emailList = values
      .reduce((acc, { id, properties }) => {
        if (properties.state === "active") {
          if (
            filterUsers.length > 0 &&
            filterUsers.includes(id.split("/").pop())
          ) {
            acc.push(properties.email);
          } else if (filterUsers.length === 0) {
            acc.push(properties.email);
          }
        }
        return acc;
      }, [])
      .join();
    console.log(emailList);
  } catch (error) {
    console.error(error);
  }
})();
