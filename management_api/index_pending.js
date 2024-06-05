import fetch, { Headers } from "node-fetch";
import getBearerToken from "./config/azureAPI.js";
import config from "./config/config.js";

const getPaginatedResponse = async (url, requestOptions, values = []) => {
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  values = [...values, ...data.value];
  if ("nextLink" in data) {
    return getPaginatedResponse(data.nextLink, requestOptions, values);
  }
  return values;
};

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
      if (properties.state === "pending") {
        const year = parseInt(properties.registrationDate.substr(0, 4));
        const month = parseInt(properties.registrationDate.substr(5, 2));
        const day = parseInt(properties.registrationDate.substr(8, 2));
        if(year>=2023 && ((month>=2 && day>=9) || (month>=3))){
          console.log(properties.email, properties.registrationDate)

          if (
            filterUsers.length > 0 &&
            filterUsers.includes(id.split("/").pop())
          ) {
            acc.push(properties.email);
          } else if (filterUsers.length === 0) {
            acc.push(properties.email);
          }
        }
      }
      return acc;
    }, [])
    .join(';');
  console.log(emailList);
} catch (error) {
  console.error(error);
}
