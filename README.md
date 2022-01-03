# collab-backend-api

This is 3 of 4 repositories used on a collaboration project for learning oauth2orize.
The collab-backend-api repository uses an authorization middleware 
[collab-backend-token-auth](https://github.com/cotarr/collab-backend-token-auth)
that was written specifically to work with this repository (collab-backend-api)
It is available as a node module @cotarr/collab-backend-token-auth.
The mock database includes one table to accept POST and GET requests.
In memory RAM variables are used to emulate database storage.
API access is restricted using OAuth2 bearer tokens.
Token validation is performed by sending the tokens to the authorization
server for remote validation.
Individual route authorization may be further restricted based on token scope values that are
associated with the access_token.

|                        Repository                                  |                   Description                         |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| [collab-auth](https://github.com/cotarr/collab-auth)               | Oauth2 Authorization Provider, redirect login, tokens |
| [collab-frontend](https://github.com/cotarr/collab-frontend)       | Mock Web server, reverse proxy, HTML content          |
| [collab-backend-api](https://github.com/cotarr/collab-backend-api) | Mock REST API using tokens to authorize requests      |
| [collab-iot-device](https://github.com/cotarr/collab-iot-device)   | Mock IOT Device with data acquisition saved to DB     |

### Documentation:

https://cotarr.github.io/collab-auth

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

```json
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

```json
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

### Example Environment variables

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

Not supported in .env file

```
# When NODE_ENV=production, console activity log disabled.
NODE_ENV=development
# When NODE_DEBUG_LOG=1, console activity log enabled when in production
NODE_DEBUG_LOG=0
```

### API Implementation example:  /v1/data/iot-data

Middleware to process oauth2 access_token using `@cotarr/collab-backend-token-auth`

```js
const { authInit, requireAccessToken } = require('@cotarr/collab-backend-token-auth');

// Initialize authorization middleware on program load.
authInit({
  authURL: config.oauth2.authURL,
  clientId: config.oauth2.clientId,
  clientSecret: config.oauth2.clientSecret
});

const routes = require('./routes/index');
// Route /v1 require authorization using access token.
app.use('/v1', requireAccessToken(), routes);
```

Router Middleware load route handler in `routes/index.js`

```js
const express = require('express');
const router = express.Router();
const iotData = require('./iot-data');

router.use('/data/iot-data', iotData);
```

Middleware to process oauth2 access token scope restrictions in `routes/iot-data.js`

```js
const express = require('express');
const router = express.Router();
const { requireScopeForApiRoute } = require('@cotarr/collab-backend-token-auth');
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

### Other routes

The collab-frontend includes a second web page at /suggestions.html
that is used to provide an example of some suggested security enhancements.
The example requires a mock database table with one record that can be
read or modified. These routes are not related to the oauth part of the
demonstration. They are only included to support the unrelated security examples.

The mock database table includes only 1 record with a fixed id value.
In order to compare modification of a database record using both the
browser JavaScript fetch API or alternately using a simple html `<form>` submission,
two equivalent routes were created.
The JavaScript example use method PATCH.
The form example uses method POST with "/update/" appended to the route path.
The two routes are otherwise equivalent.
No other methods are supported on this mock API route.

Schema:

```json
{
    "id": "435bf533-7280-4dce-a9d0-2960b43019f9",
    "weather": "Foggy"
}
```

Routes

```
GET /v1/data/manual-data/
GET /v1/data/manual-data/435bf533-7280-4dce-a9d0-2960b43019f9
PATCH /v1/data/manual-data/435bf533-7280-4dce-a9d0-2960b43019f9
POST /v1/data/manual-data/update/435bf533-7280-4dce-a9d0-2960b43019f9
```
