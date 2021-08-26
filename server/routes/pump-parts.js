'use strict';

// --------------------------------
//    Route for /v1/data/pumpparts
// --------------------------------

const express = require('express');
const router = express.Router();

const dummyData = {
  id: 227,
  name: '82.7 mm rotary seal',
  pumpManuf: 'Atlas Pump',
  pumpManufId: 1804,
  currentStock: 9,
  orderPoint: 6,
  orderTime: '6 weeks',
  createdAt: '2019-06-12T02:39:16.828Z',
  updatedAt: '2019-06-12T02:39:16.828Z'
};

const methodNotAllowed = (req, res, next) => {
  res.status(405).json({ code: 405, message: 'Method Not Allowed' });
};
const queryNotFound = (req, res) => {
  res.status(404).json({ code: 404, message: 'Query not found' });
};

// Get all records as array
router.get('/',
  (req, res, next) => {
    // this is array of all records (1 for now)
    res.json([dummyData]);
  }
);
// Get one record by ID
router.get('/227',
  (req, res, next) => {
    res.json(dummyData);
  }
);

// All other pumpData GET queries not found
router.get('/*', queryNotFound);

// Other REST methods not supported
router.post('/*', methodNotAllowed);
router.put('/*', methodNotAllowed);
router.patch('/*', methodNotAllowed);
router.delete('/*', methodNotAllowed);

module.exports = router;
