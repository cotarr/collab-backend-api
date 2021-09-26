# collab-backend-api

This is 3 of 4 repositories used on a collaboration project for learning oauth2orize and passport.
This repository is a mock REST API using passport with strategy passport-http-bearer.
One table has be setup to use POST and GET requests to temporarily store or retrieve mock data in RAM variables.
API access is restricted using OAuth2 bearer tokens. Access decision is
performed by sending the tokens to the oauth2 server for validation.
Route authorization is restricted based on token scope.

|                        Repository                                  |                   Description                         |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| collab-auth                                                        | Oauth2 Authorization Provider, redirect login, tokens |
| [collab-frontend](https://github.com/cotarr/collab-frontend)       | Mock Web server, reverse proxy, HTML content          |
| [collab-backend-api](https://github.com/cotarr/collab-backend-api) | Mock REST API using tokens to authorize requests      |
| [collab-iot-device](https://github.com/cotarr/collab-iot-device)   | Mock IOT Device with data acquisition saved to DB     |



### Install

```bash
git clone git@github.com:cotarr/collab-backend-api.git
cd collab-backend-api

npm install

```

### To start the program

In the development environment with NODE_ENV=development or NODE_ENV not specified,
the application should run as-is. No configuration is necessary in development mode.
Alternately, environment variables can be configured as listed at the end of this README,
In the default configuration the server will listen on port 4000 at http://localhost:4000.

```bash
npm start
```

### Mock data routes
```
GET /v1/data/iot-data/     (List all mock records, maximum is 10)
POST /v1/data/iot-data/    (Save mock record with following schema)
```

To submit data to the iot-data table in the database, the HTTP request should
use the POST method to the "/v1/data/iot-data". An "Authorization" header be added to the HTTP request
containing "Bearer xxxxxxxx" where xxxxxxx should be a string containing the access token.
The data to be submitted should be encoded in JSON format and included
in the body of the POST request as follows:

```
{
  "deviceId": "iot-device-12",
  "timestamp": "2021-09-17T15:33:07.743Z",
  "data1": 25.486,
  "data2": 25.946,
  "data3": 24.609
}  
```

A successful request should return status 201 (Created). If the access token is missing,
expired, or otherwise invalid, the API return 401 Unauthorized. If the request does not
have sufficient scope to access the database table, the API will return 403 Forbidden.
In this case scope "api.write" is needed.

To retrieve data from the iot-data table in the database, the HTTP request should
use the GET method. An "Authorization" header be added to the HTTP request
containing "Bearer xxxxxxxx" where xxxxxxx should be a string containing the access token.
The access token should have possible scope of "api.read" or "api.write", either scope will be accepted.
The mock API will append a record id using UUID.v4 format.
A createdAt and updatedAt timestamp will also be appended to the record.
The API will return an array of objects in JSON format.
The array is limited to a maximum of 10 elements, and the most recent 10
timestamped data points from the mock IOT device should be available in the array.

```
[
  {
    "id": 1277,
    "deviceId": "iot-device-12",
    "timestamp": "2021-09-17T15:32:08.417Z",
    "data1": 24.831,
    "data2": 27.241,
    "data3": 22.307
    "updatedAt": "2021-09-17T15:33:07.797Z",
    "createdAt": "2021-09-17T15:33:07.797Z"
  }
]
```

### Using Postman to exercise the API.

See: [postman/README.md](postman/README.md)

### Status Routes

The mock API can be monitored using the following status routes.

```
GET /status (No authentication)
GET /secure (requires access-token)
```

### Example Environment variables (showing defaults)

The `.env` file is supported using dotenv npm package

```
SITE_VHOST=*
SITE_SECURITY_CONTACT=security@example.com
SITE_SECURITY_EXPIRES="Fri, 1 Apr 2022 08:00:00 -0600"
SITE_OWN_HOST=localhost:4000

SERVER_TLS_KEY=
SERVER_TLS_CERT=
SERVER_TLS=false
SERVER_PORT=4000
SERVER_PID_FILENAME=

OAUTH2_CLIENT_ID=abc123
OAUTH2_CLIENT_SECRET=ssh-secret
OAUTH2_AUTH_HOST=127.0.0.1:3500
OAUTH2_AUTH_URL=http://127.0.0.1:3500
OAUTH2_TOKEN_CACHE_SEC=60
OAUTH2_TOKEN_CACHE_CLEAN_SEC=300
```

To start the program
```bash
npm start
```
### API Implementation example:  /v1/data/pumpdata/23432

Middleware to process oauth2 access_token using passport strategy in app.js

```js
// ---------------------------
// Routes for mock REST API
// ---------------------------
app.use('/v1', passport.authenticate('bearer', { session: false }), routes);
```

Router Middleware to direct request to proper route handler

```js
const express = require('express');
const router = express.Router();
const iotData = require('./iot-data');

router.use('/data/iot-data', iotData);
```

Middleware to process oauth2 access token scope restrictions in each route handler.

```js
const express = require('express');
const router = express.Router();
const { requireScopeForApiRoute } = require('../auth/authorization');
const controller = require('../controllers/iot-data');
const validations = require('../validations/iot-data');

// ------------------
// list All Records
// ------------------
router.get('/',
  requireScopeForApiRoute(['api.read', 'api.write']),
  validations.list,
  controller.list);

// --------------------
//  create new record
// --------------------
router.post('/',
  requireScopeForApiRoute(['api.write']),
  validations.create,
  controller.create);
```
