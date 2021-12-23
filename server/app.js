// -----------------------------------------------------------------------------
//
//           ExpressJs Web Server
//
// Public Routes:
//    /status
//    /.well-known/security.txt (only if configured)
//
// Secure Routes:
//    /secure
//    /v1/*  (Mock REST API)
// -----------------------------------------------------------------------------

'use strict';

// native node packages
const http = require('http');

// express packages
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const passport = require('passport');
const app = express();

// Routes
const routes = require('./routes/index');

// Custom Modules
const checkVhost = require('./middlewares/check-vhost');
const securityContact = require('./utils/security-contact');

// Configuration
const config = require('./config');
const logConfig = require('./utils/log-config');
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production') {
  if (config.oauth2.clientSecret === 'ssh-secret') {
    console.error('Error, oauth2 client secret must be changed for production');
    process.exit(1);
  }
}

// body parser for accepting JSON
app.use(express.json());
// Submission data from <form> elements can be disabled by removing
// the urlencoded bodyparser (x-www-form-urlencoded not parsed).
app.use(express.urlencoded({ extended: false }));

if (nodeEnv === 'production') {
  app.use(compression());
}

// HTTP access log
app.use(logger(logConfig.format, logConfig.options));

// Initialize passport (note: this does not require express-session)
app.use(passport.initialize());
// Register http-bearer stratecy with passport
require('./auth/passport-config');

//
//   /status    Is the server alive?
//
app.get('/status', (req, res) => res.json({ status: 'ok' }));

// Route for security.txt
app.get('/.well-known/security.txt', securityContact);

// From this point, reject all requests not maching vhost domain name
app.use(checkVhost.rejectNotVhost);

//
//   /secure   Secure route for confirming credentials remotely
//
app.get('/secure',
  passport.authenticate('bearer', { session: false }), (req, res) => res.json({ secure: 'ok' })
);

// ---------------------------
// Routes for mock REST API
// ---------------------------
app.use('/v1', passport.authenticate('bearer', { session: false }), routes);

// ---------------------------------
//       T E S T   E R R O R
// ---------------------------------
// app.get('/error', (req, res, next) => { throw new Error('Test error'); });

// ---------------------------------
//    E R R O R   H A N D L E R S
// ---------------------------------
//
// catch 404 Not Found
//
app.use(function (req, res, next) {
  const err = new Error(http.STATUS_CODES[404]);
  err.status = 404;
  return res.set('Content-Type', 'text/plain').status(err.status).send(err.message);
});
//
// Custom error handler
//
app.use(function (err, req, res, next) {
  // per Node docs, if response in progress, must be returned to default error handler
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  let message = http.STATUS_CODES[status] || 'Unknown Error Occurred';
  if ((err.message) && (message !== err.message)) message += ', ' + err.message;
  message = 'Status: ' + status.toString() + ', ' + message;
  if (nodeEnv === 'production') {
    console.log(message);
    return res.set('Content-Type', 'text/plain').status(status).send(message);
  } else {
    console.log(err);
    return res.set('Content-Type', 'text/plain').status(status).send(message + '\n' + err.stack);
  }
});

module.exports = app;
