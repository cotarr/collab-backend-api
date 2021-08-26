'use strict';

// --------------------------
// Mock API route loader
// --------------------------

const express = require('express');
const router = express.Router();

//
// Route handlers
//
const pumpData = require('./pump-data');
const pumpParts = require('./pump-parts');

//
// Routes
//
router.use('/data/pumpdata', pumpData);
router.use('/data/pumpparts', pumpParts);

module.exports = router;
