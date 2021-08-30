// -----------------------------------------------------------------
// Passport strategy for bearer token in authorization header
//
// req.headers {
//    authorization: 'Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
// }
//
// Token scope added to req.locals object in case needed in further processing
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
    authorization.lookupToken(accessToken)
      .then((token) => authorization.checkTokenActive(token))
      .then((token) => authorization.addTokenScopeToPassportReq(req, token))
      .then((token) => done(null, token.client))
      .catch(() => done(null, false));
  }
));
