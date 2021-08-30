'use strict';

const fetch = require('node-fetch');

const config = require('../config');
const nodeEnv = process.env.NODE_ENV || 'development';

exports.checkTokenActive = (token) => {
  if ((!(token == null)) && (token.active) && (token.client)) {
    return token;
  } else {
    throw new Error('Invalid token');
  }
};

exports.addTokenScopeToPassportReq = (req, token) => {
  if (!req.locals) req.locals = {};
  req.locals.tokenScope = token.scope || [];
  return token;
};

exports.lookupToken = (token) => {
  const clientAuth = Buffer.from(config.oauth2.clientId + ':' +
    config.oauth2.clientSecret).toString('base64');
  const body = {
    access_token: token
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
};

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
      (Array.isArray(req.locals.tokenScope) &&
      (req.locals.tokenScope.length > 0))) {
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
