# collab-backend-api

This is a demo repository.
It is a mock REST API using passport and passport-http-bearer to
restrict API access using OAuth2 bearer tokens. Access decision is
performed by sending the tokens to the oauth2 provider for validation.

This is one of 3 repositories.

- collab-auth (Oauth2 Authorization Provider, redirect login, tokens)
- collab-frontend (Web server, reverse proxy, html content)
- collab-backend-api (Mock REST API using tokens to authorize requests)


### Mock data routes
```
/v1/data/pumpdata/23432
/v1/data/pumpparts/227
```

### Status Routes
```
/status (No authentication)
/secure (requires access-token)
```

### Install

```bash
git clone git@github.com:cotarr/collab-backend-api.git
cd collab-backend-api

npm install

```
### Example Environment variables (showing defaults)

The `.env` file is supported.

```
SITE_VHOST=*
SITE_SECURITY_CONTACT=security@example.com
SITE_SECURITY_EXPIRES="Fri, 1 Apr 2022 08:00:00 -0600"

SERVER_TLS_KEY=./server/certs/privatekey.pem
SERVER_TLS_CERT=./server/certs/certificate.pem
SERVER_TLS=false
SERVER_PORT=4000
SERVER_PID_FILENAME=

OAUTH2_AUTH_HOST=127.0.0.1:3500
OAUTH2_AUTH_URL=http://127.0.0.1:3500
OAUTH2_CACHE_SEC=900
OAUTH2_CACHE_CLEAN_SEC=3600
```

To start the program
```bash
npm start
```