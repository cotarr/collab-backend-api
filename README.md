# collab-backend-api

This is a demo repository.
It is a mock REST API using passport and passport-http-bearer to
restrict API access using OAuth2 bearer tokens. Access decision is
performed by sending the tokens to the oauth2 provider for validation.
Route authorization is restricted based on token scope.

This is one of 4 repositories

|                        Repository                                  |                   Description                         |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| collab-auth                                                        | Oauth2 Authorization Provider, redirect login, tokens |
| [collab-frontend](https://github.com/cotarr/collab-frontend)       | Mock Web server, reverse proxy, HTML content          |
| [collab-backend-api](https://github.com/cotarr/collab-backend-api) | Mock REST API using tokens to authorize requests      |
| [collab-iot-device](https://github.com/cotarr/collab-iot-device)   | Mock IOT Device with data acquisition saved to DB     |


### Mock data routes
```
GET /v1/data/iot-data/     (List all mock records, maximum is 10)
POST /v1/data/iot-data/    (Save mock record with following schema)

  example data = {
    "deviceId": "iot-device-12",
    "timestamp": "2021-09-17T15:33:07.743Z",
    "data1": 25.486,
    "data2": 25.946,
    "data3": 24.609
  }  
```

### Status Routes
```
GET /status (No authentication)
GET /secure (requires access-token)
```

### Install

```bash
git clone git@github.com:cotarr/collab-backend-api.git
cd collab-backend-api

npm install

```
### Example Environment variables (showing defaults)

The `.env` file is supported using dotenv npm package

```
SITE_VHOST=*
SITE_SECURITY_CONTACT=security@example.com
SITE_SECURITY_EXPIRES="Fri, 1 Apr 2022 08:00:00 -0600"
SITE_OWN_HOST=localhost:4000

SERVER_TLS_KEY=./server/certs/privatekey.pem
SERVER_TLS_CERT=./server/certs/certificate.pem
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
