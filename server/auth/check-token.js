// ---------------------------------------------------------------
// This module will perform remote lookup of access-token
// by sending the token to the authorization server.
// If token is valid, a user/client/scope object will be returned.
// If token is not found or invalid, response status is 401
// Other errors are returned as an error
//
// Input
//    token = OAuth2 access_token in JWT format (string)
//
// Output
//   callback(err, data) = callback function
//      return null, data     where token was valid (JSON object)
//      return null, false    where token not found or invalid
//      return error          Where error occurred.
//
// The token will be cached in RAM for local use.
// ---------------------------------------------------------------
//
// Example cache object
//
// const element = {
//   token: 'odifjso',
//   introspect: {
//     active: true,
//     exp: 1629236003,
//     iat: 1629232403,
//     scope: [
//       'offline_access',
//       'auth.read',
//       'api.read'
//     ],
//     ..... other data ....
//   },
//   cacheExpires: 2021-08-17T20:47:49.986Z
// };
// ----------------------------------------------------------------
'use strict';

const fetch = require('node-fetch');

const config = require('../config');
// const nodeEnv = process.env.NODE_ENV || 'development';

const tokenCache = [];

const lookupCachedToken = (token) => {
  const found = tokenCache.find((element) => {
    return (
      // Element is found
      (element.token === token) &&
      // Token is "active" state from auth server
      (element.introspect.active) &&
      // Access-token not expired
      (element.introspect.exp > Math.floor(Date.now() / 1000)) &&
      // Cache entry not expired
      (element.cacheExpires > new Date()));
  });
  if (found) {
    // console.log('found');
    return found.introspect;
  } else {
    // console.log('not found');
    return null;
  }
};
const saveTokenToCache = (element) => {
  tokenCache.push(element);
};

const removeExpiredCachedTokens = () => {
  if (tokenCache.length > 0) {
    for (let i = tokenCache.length - 1; i >= 0; i--) {
      if ((tokenCache[i].introspect.exp < Math.floor(Date.now() / 1000)) ||
        (tokenCache[i].cacheExpires < new Date())) {
        // console.log('removeing expired token at ' + i.toString());
        tokenCache.splice(i, 1);
      }
    }
  }
};
setInterval(removeExpiredCachedTokens, config.oauth2.tokenCacheCleanSeconds * 1000);

exports.checkToken = (token, callback) => {
  const cachedData = lookupCachedToken(token);
  if ((cachedData)) {
    callback(null, cachedData);
  } else {
    const fetchOptions = {
      method: 'GET',
      timeout: 5000,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    };
    const authServerUrl = config.oauth2.authURL + '/introspect';
    fetch(authServerUrl, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          if (parseInt(response.status) === 401) {
            // If access-token not found or invalid, authorization server will return status 401
            throw new Error('Unauthorized');
          } else {
            // Else, not 401, so this is a fetch error
            throw new Error('Fetch status ' + response.status + ' ' +
            fetchOptions.method + ' ' + authServerUrl);
          }
        }
      })
      .then((data) => {
        // console.log('data ', data);
        if (!data.active) {
          return callback(null, false);
        } else {
          // To disable cache, set tokenCacheSeconds = 0
          if ((!cachedData) && (config.oauth2.tokenCacheSeconds > 0)) {
            saveTokenToCache({
              token: token,
              introspect: data,
              cacheExpires: new Date(Date.now() + (config.oauth2.tokenCacheSeconds * 1000))
            });
          }
          return callback(null, data);
        }
      })
      .catch((err) => {
        // console.log(err.message);
        if (err.message === 'Unauthorized') {
          return callback(null, false);
        } else {
          return callback(err);
        }
      });
  } // cached data
};
