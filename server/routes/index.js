'use strict';

// --------------------------
// Mock API route loader
// --------------------------

const express = require('express');
const router = express.Router();

//
// Route handlers
//
const iotData = require('./iot-data');

//
// Routes
//
router.use('/data/iot-data', iotData);

module.exports = router;
