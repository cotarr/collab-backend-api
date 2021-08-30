'use strict';

const path = require('path');

require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';

exports.nodeDebugLog = process.env.NODE_DEBUG_LOG || 0;

exports.site = {
  vhost: process.env.SITE_VHOST || '*',
  // Example: "mailto:security@example.com",
  securityContact: process.env.SITE_SECURITY_CONTACT || '',
  // Example: "Fri, 1 Apr 2022 08:00:00 -0600"
  securityExpires: process.env.SITE_SECURITY_EXPIRES || '',
  ownHost: process.env.SITE_OWN_HOST || 'localhost:4000'
};

exports.server = {
  serverTlsKey: process.env.SERVER_TLS_KEY ||
    path.join(__dirname, './server/certs/privatekey.pem'),
  serverTlsCert: process.env.SERVER_TLS_CERT ||
    path.join(__dirname, './server/certs/certificate.pem'),
  tls: (process.env.SERVER_TLS === 'true') || false,
  port: process.env.SERVER_PORT || 4000,
  pidFilename: process.env.SERVER_PID_FILENAME || ''
};

exports.oauth2 = {
  clientId: process.env.OAUTH2_CLIENT_ID || 'abc123',
  clientSecret: process.env.OAUTH2_CLIENT_SECRET || 'ssh-secret',
  authHost: process.env.OAUTH2_AUTH_HOST || '127.0.0.1:3500',
  authURL: process.env.OAUTH2_AUTH_URL || 'http://127.0.0.1:3500',
  // To disable token cache set tokenCacheSeconds = 0
  tokenCacheSeconds: process.env.OAUTH2_CACHE_SEC || 60,
  tokenCacheCleanSeconds: process.env.OAUTH_CACHE_CLEAN_SEC || 300
};
