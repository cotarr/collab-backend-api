# Instruction to use postman

- Import this collection from repository
- Set local variables

## Local variables

Note: redirect must be different from auth_host

- auth_host      (http://localhost:3000)
- frontend_host  (http://localhost:3003)
- backend_host   (http://localhost:4000)
- redirect       (http://127.0.0.1:3000/login/callback)
- user_username  (bob)
- user_password  (secret)
- client_id      (abc123)
- client_secret  (ssh-secret)
- client_base64  (YWJjMTIzOnNzaC1zZWNyZXQ=)
- scope          (api.read)

## Getting a token from auth server

- Select Collection, then select collection Authorization tab
- The following arguments are populated from local variables
 - Callback URL: {{auth_host}}/dialog/authorize
 - Auth URL: {{auth_host}}/dialog/authorize
 - Access Token URL: {{auth_host}}/oauth/token
 - Client Id: {{client_id}}
 - Client Secret: {{client_secret}}
 - Scope: api.read
- Press: Get New Access Token
- When prompted enter username and password
- When window opens, select: Use Token
- The postman test can now inherit this token from parent collection.

## Tests can be selected to debug the mock API
