// -----------------------------------------------------------------
// Passport strategy for bearer token in authorization header
//
// req.headers {
//    authorization: 'Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
// }
//
// Token scope added to request object in case needed in further processing
//
// req.authInfo {"scope":["xxxxx"]}  <-- From third done argument
// req.isAuthenticated() true
//
// -----------------------------------------------------------------
'use strict';

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

// Access-token lookup
const checkToken = require('./check-token').checkToken;
const checkScope = require('./check-scope').checkScope;

const config = require('../config');
const nodeEnv = process.env.NODE_ENV || 'development';

passport.use(new BearerStrategy(
  {
    // add req object to callback function: callback (req, token, done)
    passReqToCallback: true,
    // For WWW-Authentication response header
    realm: 'user@' + config.oauth2.authHost
  },
  (req, token, done) => {
    // 1) Check access-token
    checkToken(token, (err, data) => {
      if (err) {
        return done(err);
      } else if ((!data) || (!data.active)) {
        return done(null, false, 'Token declined by authorizaton server');
      } else {
        // 2) Check request againt token scope
        if (checkScope(req, data.scope)) {
          return done(null, data, { scope: data.scope });
        } else {
          return done(null, false, 'Token insufficient scope');
        }
      }
    });
  }
));
