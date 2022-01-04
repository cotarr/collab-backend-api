'use strict';

const express = require('express');
const router = express.Router();

const { requireScopeForApiRoute } = require('@cotarr/collab-backend-token-auth');

const controller = require('../controllers/iot-data');
const validations = require('../validations/iot-data');

/**
 * Middleware to generate status 405 error.
 */
const methodNotAllowed = (req, res, next) => {
  res.status(405).json({ code: 405, message: 'Method Not Allowed' });
};

// ------------------
// list All Records
// ------------------
router.get('/',
  requireScopeForApiRoute(['api.read', 'api.write']),
  validations.list,
  controller.list);

// --------------------
//  create new record
// --------------------
router.post('/',
  requireScopeForApiRoute(['api.write']),
  validations.create,
  controller.create);

// ------------------------
// Replace a record by id
// ------------------------
router.put('/*',
  requireScopeForApiRoute(['debug.no-scope-will-match']),
  methodNotAllowed);

// ------------------------
// Modify a record by id
// ------------------------
router.patch('/*', methodNotAllowed);

// ------------------
// Delete a record
// ------------------
router.delete('/*', methodNotAllowed);

module.exports = router;
