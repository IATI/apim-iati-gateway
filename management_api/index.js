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
  const filterUsers = [
    "61405e03217d20169008b011",
    "614b503a217d20169008ba81",
    "617c01b00a23230aa047a74b",
    "54c800b332965a0035030000",
    "619650ae217d20157c79ecb0",
    "62a251470a23230cf07b4bae",
    "620da4ed0a232310f40dcde4",
    "6257ed6f217d200f5cc68908",
    "61af7310217d20157c7a066b",
    "624e91580a232313904b5100",
    "62855e71217d2012ec2ee8f1",
  ];
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
