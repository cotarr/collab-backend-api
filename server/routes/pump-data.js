'use strict';

// --------------------------------
//    Route for /v1/data/waterpumps
// --------------------------------

const express = require('express');
const router = express.Router();
const { requireScopeForApiRoute } = require('../auth/authorization');

const dummyData = {
  id: 23432,
  pumpId: 'FA0221',
  status: 'running',
  pumpRpm: 1802,
  suctionPsi: 8.1,
  dischargePsi: 84.1,
  flowGpm: 81.2,
  motorAmps: 27.4,
  motorTempF: 57.4,
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
router.get('/', requireScopeForApiRoute(['api.read', 'api.write']),
  (req, res, next) => {
    // this is array of all records ( for now)
    const multiData = [];
    multiData.push(dummyData);
    multiData.push(dummyData);
    multiData.push(dummyData);
    res.json(multiData);
  }
);
// Get one record by ID
router.get('/23432', requireScopeForApiRoute(['api.read', 'api.write']),
  (req, res, next) => {
    res.json(dummyData);
  }
);

// All other pumpData GET queries not found
router.get('/*', queryNotFound);

// Other REST methods not supported
router.post('/*', requireScopeForApiRoute('api.write'), methodNotAllowed);
router.put('/*', methodNotAllowed);
router.patch('/*', methodNotAllowed);
router.delete('/*', methodNotAllowed);

module.exports = router;
