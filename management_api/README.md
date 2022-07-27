# Management REST API

## Setup

- `cd management_api`
- `npm i`

## Get User Emails for APIM instance

- `cp .env.example .env`
- Fill out environment variables - see https://github.com/IATI/tech-climate-impact-metrics#azure-rest-api for how to get Azure REST credentials.
- `npm run emails`

## Filter by certain users

Update the `filterUsers` array in `index.js` with a list of User Ids from the APIM instance. Useful if you want to filter using Analytics for active users;

E.g. will return the emails of these 5 users:

```js
const filterUsers = [
  "62bc4b88ba32ea0d1806a64c",
  "614b503a217d20169008ba81",
  "62b0801f07d91912c0dc35ae",
  "54c800b332965a0035030000",
  "613b107301234e10f854bac5",
];
```
