# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
