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
const manualData = require('./manual-data');

//
// Routes
//
router.use('/data/iot-data', iotData);
router.use('/data/manual-data', manualData);

module.exports = router;
