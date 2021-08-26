//
// Miscellaneous utilites to help debugging, moved here to clean up app.js
// -----------------------------------------------------------------------
'use strict';

const express = require('express');
const router = express.Router();
// const config = require('../config');

// --------------------------------------------------------------------
// Generic console log to debug various nodejs req object properties
// --------------------------------------------------------------------
router.use((req, res, next) => {
  // console.log(req.method + ' ' + req.url);
  // console.log('req.headers' + JSON.stringify(req.headers, null, 2));
  // console.log('req.headers.authorization ' + req.headers.authorization);
  // console.log('req.query ' + JSON.stringify(req.query, null, 2));
  // console.log('req.rawHeaders ' + req.rawHeaders);
  // console.log('req.body' + JSON.stringify(req.body, null, 2));
  next();
});

module.exports = router;
