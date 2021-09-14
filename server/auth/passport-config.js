// -----------------------------------------------------------------
// Passport strategy for bearer token in authorization header
//
// req.headers {
//    authorization: 'Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
// }
//
// Token scope added to req.locals object in case needed in further processing
//
// The user id Number is also added from the User database record
// The user id number is optional, and can be commented out
// The number is needed for compatability with a specific legacy database
// However, this give option to use either user number or UUID
//
// -----------------------------------------------------------------
'use strict';

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const authorization = require('./authorization');

const config = require('../config');
// const nodeEnv = process.env.NODE_ENV || 'development';

passport.use(new BearerStrategy(
  {
    // add req object to callback function: callback (req, token, done)
    passReqToCallback: true,
    // For WWW-Authentication response header
    realm: 'user@' + config.site.ownHost
  },
  (req, accessToken, done) => {
    authorization.findCachedToken(accessToken)
      .then((introspect) => authorization.validateToken(accessToken, introspect))
      .then((introspect) => authorization.checkTokenActive(introspect))
      .then((introspect) => authorization.saveTokenToCache(accessToken, introspect))
      .then((introspect) => authorization.addTokenScopeToPassportReq(req, introspect))
      .then((introspect) => authorization.addUserIdNumberToPassportReq(req, introspect))
      .then((introspect) => done(null, introspect.client))
      .catch(() => done(null, false));
  }
));
