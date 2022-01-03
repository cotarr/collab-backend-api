'use strict';

const express = require('express');
const router = express.Router();

const { requireScopeForApiRoute } = require('@cotarr/collab-backend-token-auth');
const controller = require('../controllers/manual-data');
const validations = require('../validations/manual-data');

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

// -----------------
//  Retrieve by ID
// -----------------

// parsed as req.params.id
router.get('/:id',
  requireScopeForApiRoute(['api.read', 'api.write']),
  validations.findById,
  controller.findById);

// --------------------
//  create new record
// --------------------
router.post('/', methodNotAllowed);

// -------------------------------------------
// Modify a record by ID using /update route
// -------------------------------------------
router.post('/update/:id',
  requireScopeForApiRoute(['api.write']),
  validations.update,
  controller.update);

// ------------------------------------
//  modify a record using PATCH method
// ------------------------------------
router.patch('/:id',
  requireScopeForApiRoute(['api.write']),
  validations.patch,
  controller.update);

// --------------------
//  replace a record
// --------------------
router.put('/*', methodNotAllowed);

// ------------------
// Delete a record
// ------------------
router.delete('/*', methodNotAllowed);

module.exports = router;
