'use strict';

const fetch = require('node-fetch');

const config = require('../config');
// const nodeEnv = process.env.NODE_ENV || 'development';

// -------------------------------
// Part 1 - Token Memory Cache
// -------------------------------

if ((config.oauth2.tokenCacheSeconds) && (config.oauth2.tokenCacheSeconds > 0)) {
  console.log('Token cache enabled, lifetime: ' + config.oauth2.tokenCacheSeconds + ' seconds.');
} else {
  console.log('Token cache disabled.');
}

// token store, full access_token string is lookup key
const tokenCache = [];

/**
 * Lookup cached access_token from memory cache
 *
 * @param   {String} accessToken - JWT OAuth2 access_token
 * @returns {Promise} Promise resolving to cached introspect metadata, false if not found
 */
exports.findCachedToken = (accessToken) => {
  // If not cache disabled (seconds = 0), lookup the token
  if ((config.oauth2.tokenCacheSeconds) && (config.oauth2.tokenCacheSeconds > 0)) {
    const found = tokenCache.find((storedToken) => {
      return (
        // storedToken is found
        (storedToken.token === accessToken) &&
        // Token is "active" state from auth server
        (storedToken.introspect.active) &&
        // Access-token not expired
        (storedToken.introspect.exp > Math.floor(Date.now() / 1000)) &&
        // Cache entry not expired
        (storedToken.cacheExpires > new Date())
      );
    });
    if (found) {
      // console.log('Access token found in cache');
      // found, return authorization metadata
      return Promise.resolve(found.introspect);
    } else {
      // console.log('Access token not found, returning false');
      // not found in cache, return false
      return Promise.resolve(false);
    }
  } else {
    // cache disabled, return false
    return Promise.resolve(false);
  }
};

/**
 * Save access_token validated metadata to memory cache
 *
 * @param   {String} accessToken - JWT OAuth2 access_token
 * @param   {Object} introspect - Validated token metadata (=false if not cached)
 * @returns {Promise} Promise passing through input metadata unmodified
 */
exports.saveTokenToCache = (accessToken, introspect) => {
  // If cache enabled (second != 0), and token not previously cached.
  if ((config.oauth2.tokenCacheSeconds) && (config.oauth2.tokenCacheSeconds > 0) &&
    (!introspect.cached)) {
    introspect.cached = true;
    tokenCache.push({
      token: accessToken,
      introspect: introspect,
      cacheExpires: new Date(Date.now() + (config.oauth2.tokenCacheSeconds * 1000))
    });
  }
  return Promise.resolve(introspect);
};

/**
 * Removed expired cached tokens (internal timer handler)
 * @param {Number} Time interval in seconds
 */
const _removeExpiredCachedTokens = () => {
  if (tokenCache.length > 0) {
    for (let i = tokenCache.length - 1; i >= 0; i--) {
      if ((tokenCache[i].introspect.exp < Math.floor(Date.now() / 1000)) ||
        (tokenCache[i].cacheExpires < new Date())) {
        // console.log('Removeing expired token at ' + i.toString());
        tokenCache.splice(i, 1);
      }
    }
  }
};
setInterval(_removeExpiredCachedTokens, config.oauth2.tokenCacheCleanSeconds * 1000);

// --------------------------------------------
// Part 2 - Passport Access Token Middlewares
// --------------------------------------------

/**
 * Returns token metadata from authorization server validation
 *
 * If cached metadata from memory cache, return cached value
 * Else, send access_token to authorization, return validation result metadata
 *
 * @param   {String} accessToken - JWT OAuth2 access_token
 * @param   {Object} cachedIntrospect - Cached validated token metadata (=false if not cached)
 * @returns {Promise} Promise resolving to validated token metadata
 */
exports.validateToken = (accessToken, cachedIntrospect) => {
  // Check for cached token, if valid token from cache, return it.
  if ((cachedIntrospect) && (cachedIntrospect.cached) && (cachedIntrospect.active)) {
    return Promise.resolve(cachedIntrospect);
  } else {
    // Else, not cached, send access token to authorization server for validation
    const clientAuth = Buffer.from(config.oauth2.clientId + ':' +
      config.oauth2.clientSecret).toString('base64');
    const body = {
      access_token: accessToken
    };
    const fetchOptions = {
      method: 'POST',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Basic ' + clientAuth
      },
      body: JSON.stringify(body)
    };
    const authServerUrl = config.oauth2.authURL + '/oauth/introspect';
    // Return the Promise
    return fetch(authServerUrl, fetchOptions)
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
      });
  }
};

/**
 * Throw error if token not active
 *
 * @param   {Object} introspect - Validated token metadata (=false if not cached)
 * @returns {Object} Passes through introspect metadata unmodified
 */
exports.checkTokenActive = (introspect) => {
  if ((!(introspect == null)) && (introspect.active) && (introspect.client)) {
    return introspect;
  } else {
    throw new Error('Invalid token');
  }
};

/**
 * Extract scope from validated token metadata and save to req object
 *
 * @param   {Object} introspect - Validated token metadata (=false if not cached)
 * @returns {Object} Passes through introspect metadata unmodified
 */
exports.addTokenScopeToPassportReq = (req, introspect) => {
  if (!req.locals) req.locals = {};
  req.locals.tokenScope = introspect.scope || [];
  return introspect;
};

/**
 * Extract user ID number from validated token metadata and save to req object
 *
 * @param   {Object} introspect - Validated token metadata (=false if not cached)
 * @returns {Object} Passes through introspect metadata unmodified
 */
exports.addUserIdNumberToPassportReq = (req, introspect) => {
  if (!req.locals) req.locals = {};
  req.locals.userid = parseInt(introspect.user.number) || 0;
  return introspect;
};

// ----------------------------------------------
// Part 3 - Passport Token Scope Extraction
// ----------------------------------------------

/**
 * Middleware function restrict access based on list of allowed scopes
 * Insufficient scope will reject as 403 forbidden
 *
 * Example:
 *
 * In app.js, the passport stratecy will
 *   1) validate token
 *   2) add scope to request object
 *
 *     app.use('/v1',
 *       passport.authenticate('bearer', { session: false }),
 *       routes);
 *
 * In route handler, scope is checked by this middleware
 *
 *     router.get('/',
 *       requireScopeForApiRoute(['api.read', 'api.write', 'api.admin']),
 *       validations.list,
 *       controller.list);
 *
 * @param   {Array or String} requiredScope Array of stings or a single string
 * @returns {Function} return next() or else return HTTP error 403
 */
exports.requireScopeForApiRoute = (requiredScope) => {
  if ((requiredScope == null) ||
    ((typeof requiredScope !== 'string') &&
    (!Array.isArray(requiredScope)))) {
    throw new Error('requireScopeForWebPanel requires string or array');
  }
  if (typeof requiredScope === 'string') {
    requiredScope = [requiredScope];
  }
  return (req, res, next) => {
    let scopeFound = false;
    if ((req.locals) && (req.locals.tokenScope) &&
      (Array.isArray(req.locals.tokenScope))) {
      requiredScope.forEach((scopeString) => {
        if (req.locals.tokenScope.indexOf(scopeString) >= 0) scopeFound = true;
      });
      if (scopeFound) {
        return next();
      } else {
        // Case where bearer token fail /introspect due to denied client allowedScope
        // WWW-Authenticate Response Header rfc2617 Section-3.2.1
        const wwwError = 'Bearer realm=user@' + config.site.ownHost +
        ' error="Forbidden", error_description="Access token insufficient scope"';
        return res.set('WWW-Authenticate', wwwError)
          .status(403)
          .send('Status 403, Forbidden, Access token insufficient scope');
      }
    } else {
      throw new Error('Error, Scope not found in request object');
    }
  };
};

/**
 * Function to match scope in token based on list of allowed scopes
 * Sufficient scope returns true, else insufficent scope returns false
 * The Boolean value can be used in data validation for permission specific params
 *
 * Example:
 *
 * In app.js, the passport stratecy will
 *   1) validate token
 *   2) add scope to request object
 *
 *     app.use('/v1',
 *       passport.authenticate('bearer', { session: false }),
 *       routes);
 *
 * In express-validator, scope is matched by this function
 *
 *     body('userid').optional()
 *       .custom(function (value, { req }) {
 *       // if not admin, then body userid must match JWT token userid
 *       if ((!matchScope(req, 'health.admin')) &&
 *       (parseInt(value) !== parseInt(req.locals.userid))) {
 *       throw new Error('Token userid not match body userid');
 *     }
 *     return true;
 *   }),
 *
 * @param   {Array or String} requiredScope Array of strings or a single string
 * @returns {Boolean} return true if scope in list, otherwise return false
 */

exports.matchScope = (req, requiredScope) => {
  if ((requiredScope == null) ||
    ((typeof requiredScope !== 'string') &&
    (!Array.isArray(requiredScope)))) {
    throw new Error('matchScope requires string or array');
  }
  if (typeof requiredScope === 'string') {
    requiredScope = [requiredScope];
  }
  let scopeFound = false;
  if ((req.locals) && (req.locals.tokenScope) &&
    (Array.isArray(req.locals.tokenScope))) {
    requiredScope.forEach((scopeString) => {
      if (req.locals.tokenScope.indexOf(scopeString) >= 0) scopeFound = true;
    });
  } else {
    throw new Error('Error, Scope not found in request object');
  }
  // return result as boolean
  return scopeFound;
};
