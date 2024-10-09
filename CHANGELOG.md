# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- Update express@4.21.1 to address npm audit security warning.
- Remove postman collection, scratchpad no longer available
- Update GitHub CodeQL yaml file to upgrade security scan to v3.
- Update express@4.21.0 to address npm audit security warning.
- Update npm package dependencies express-validator@7.2.0, dotenv@16.4.5

## [v1.0.2](https://github.com/cotarr/collab-backend-api/releases/tag/v1.0.2) - 2024-04-03

- Update express to v4.19.2 to address npm audit security warning

## [v1.0.1](https://github.com/cotarr/collab-backend-api/releases/tag/v1.0.1) - 2023-07-11

- Upgrade npm dependency @cotarr/collab-backend-token-auth to v2.0.1

## [v1.0.0](https://github.com/cotarr/collab-backend-api/releases/tag/v1.0.0) - 2023-07-08

BREAKING CHANGE (after v0.0.10) require Node 18 or greater. Increment major version from 0 to 1

- Set minimum version NodeJs to node 18 or greater, added node version check in config/index.js.
- Upgrade @cotarr/collab-backend-token-auth to v2.0.0 which requires Node>=18.
- Added example .env file as "example-.env"
- Removed node-fetch dependency, was not used.
- Remove controllers/manual-data.js, routes/manual-data.js, validations/manual-data.js (not needed, to match collab-frontend).
- Remove Postman tests related to manual-data routes (route removed from API).
- Update README.md to reflect removal of manual-data routes.
- Upgrade express-validator@7.0.1 with edits to fix breaking changes in v7.
- Add Postman tests to challenge data validation.
- Update Postman tests for changed error messages in collab-backend-token-auth.
- Edited error handler in app.js
- Resolved npm audit warning, install eslint@8.44.0, delete and regenerate package-lock.json in v3 format, manually install semver@7.5.3, run audit fix.

## [v0.0.10](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.10) - 2023-01-11

### Changed

The npm security advisory for debug package has been updated to 
to incorporate backport debug@2.6.9 as safe. Manual edit of package-lock.json is 
no longer required.

- Deleted package-lock.json. Ran npm install to create a new package-lock.json.

Other:

- updated package.lock to current versions.
- Updated .eslintrc.js due to upgraded eslint version.

## [v0.0.9](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.9) - 2023-01-11

To fix npm audit warning:

- Deleted package-lock.json, re-installed eslint and dependencies.
- package-lock.json - Manually upgrade all instances of debug<=3.1.0 to debug@4.3.4

## [v0.0.8](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.8) - 2022-11-15

### Chanaged

- package-lock.json - Bumped minimatach v3.0.4 to v3.1.2, npm audit fix to address github dependabot alert.
- package.json - Bumped @cotarr/collab-backend-token-auth v1.0.6 which contains minimatch version upgrade

## [v0.0.7](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.7) - 2022-07-12

### Changed

- package.json - Update express 4.17.3 to 4.18.1, express-validator 6.14.0 to 6.14.2, 
- package.json - Update dotenv 16.0.0 to 16.0.1, @cotarr/collab-backend-token-auth 1.0.4 to 1.0.5
## [v0.0.6](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.6) - 2022-03-30

### Changed

- package.json - Update @cotarr/collab-backend-token-auth@1.0.4, dotenv@16.0.0, express@4.17.3

## [v0.0.5](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.5) - 2022-03-30

### Changed

- npm audit fix - bump mimimist 1.2.5 to 1.2.6 to address github dependabot security advisory for prototype pollution.

## [v0.0.4](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.4) - 2022-01-22

### Changed

* Update node-fetch v2.6.7 to address github advisory (2022-01-22)
* Update collab-backend-token-auth to v1.0.2
* README.md (2022-01-06)
* package.json - Update dependency version (2022-01-06)

## [v0.0.3](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.3) - 2022-01-04

### Changed

* Update comments in javascript files (no code changes)

## [v0.0.2](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.2) - 2022-01-03

### Added

- Added authorization middleware @cotarr/collab-backend-token-auth

[collab-backend-token-auth](https://github.com/cotarr/collab-backend-token-auth)
is a custom npm module that was written specifically to be used with this 
this mock API (collab-backend-api). 
It includes middleware to provide access restrictions using a
collab-auth generated Oauth 2.0 access tokens. It also allows route specific
scope restrictions. In terms of the collab-backend-api functionality,
it should be functionally equivalent to the previous version using passport-http-bearer.

### Removed

- Removed npm dependency passport-http-bearer middleware.
- Deleted server/auth/authorization.js
- Deleted server/auth/passport-config.js

### Changed

- Update packages: express, express-validator

## [v0.0.1](https://github.com/cotarr/collab-backend-api/releases/tag/v0.0.1) - 2021-12-26

### Changed

- Set tag v0.0.1
- Changed github repository visibility to public

## 2021-08-26

### Changed

Rebase repository to latest commit

## 2021-08-03

### New Repository

 Create repository to be mock API
