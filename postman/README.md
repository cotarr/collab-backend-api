# Instruction to use postman

## API description

The collab-backend-api is set to emulate a REST API with one data table "iot-data".

The only one table exists in the emulated database and it supports POST requests
to enter new records. It also accepts GET requests to list all records in the table.
The current maximum is 10 records. To retrieve the records the token must have
scope "api.read" or "api.write". The create new records, the token must
have scope "api.write".

## Import postman collections

- Import "postman/collab-backend-api.postman_collection.json" collection from repository
- Import "postman/"collab-backend-api.postman_environment.json" enviornment from repository

## Local variables

Note: auth_host URL must be a different hostname from other URL for cookies to operate properly

The development version listed below can be imported directly into postman from "collab-backend-api.postman_environment.json"

- auth_host      (http://127.0.0.1:3500)
  frontend_host  (http://localhost:3000)
- backend_host   (http://localhost:4000)
- redirect_uri   (http://localhost:3000/login/callback)
- user_username  (bob)
- user_password  (bobssecret)
- client_id      (abc123)
- client_secret  (ssh-secret)
- client_base64  (YWJjMTIzOnNzaC1zZWNyZXQ=)

## Required Servers

The following servers must be running in the development environment
for these test.

- collab-auth - authorization server
- collab-backend-api - mock API server

## Getting an access_token from auth server

The authorization method should have been preset after importing the collection.

- Select Collection, then select collection Authorization tab
- The following arguments are populated from local variables
 - Grant Type: Authorization Code
 - Callback URL: {{redirect_uri}}
 - Authorize using browser NOT checked.
 - Auth URL: {{auth_host}}/dialog/authorize
 - Access Token URL: {{auth_host}}/oauth/token
 - Client Id: {{client_id}}
 - Client Secret: {{client_secret}}
 - Scope: api.read api.write
 - State:
 - Client Authentication: Send as basic auth header

To get a token

- Select Collection, then select collection Authorization tab
- Press: Get New Access Token
- When prompted enter username (bob) and password (bobssecret)
- When window opens, select: Use Token
- The postman test can now inherit this token from parent collection.

# Operation

After obtaining a valid access_token as shown above, the tests can be run
individually or as Run Collection.
