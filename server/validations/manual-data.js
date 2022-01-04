//
// Input validation using express-validator
//

'use strict';

const { body, query, param, validationResult } = require('express-validator');

/**
 * Middleware error handler (web Interface)
 */
const handleValidationError = (req, res, next) => {
  const allErrors = [];

  // First, errors from express-validator
  const validatorErrors = validationResult(req).array();
  for (const err of validatorErrors) {
    //
    // This is an authorization server, so the value
    // property is deleted to prevent logging or returning credentials
    delete err.value;
    allErrors.push(err);
  }
  // Second add custom errors from req.locals.errors
  if (!req.locals) req.locals = {};
  if (!req.locals.errors) req.locals.errors = [];
  const customErrors = req.locals.errors;

  for (const err of customErrors) {
    allErrors.push(err);
  }
  //
  // For now, errors are handled as an API would be.
  // This means web user will see the error.
  // TODO handle errors with user friendly web page
  //
  // return the error
  if (allErrors.length > 0) {
    return res.status(422).json({
      status: 422,
      message: 'Unprocessable Entity',
      errors: allErrors
    });
  } else {
    next();
  }
};

const allowedChars =
  'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

/**
 * Input Validation for list request
 */
exports.list = [
  // Forbidden query parameters
  query([
    'id',
    'weather',
    'createdAt',
    'updatedAt'], 'Query parameters not supported in mock API')
    .not().exists(),
  handleValidationError
];

/**
 * Input validation for Find by ID request
 */
exports.findById = [
  //
  // Validate Forbidden keys
  //
  query([
    'id',
    'weather',
    'createdAt',
    'updatedAt'], 'server generated values not allowed')
    .not().exists(),
  //
  // validate required keys
  //
  param('id', 'Required value')
    .exists(),
  //
  // Validate Input
  //
  param('id', 'Invalid UUID.v4')
    .isUUID(4),
  //
  // On error return status 422 Unprocessable Entity
  //
  handleValidationError
]; // findById

/**
 * Input validation for update requests
 */
exports.update = [
  // Method = POST, Data in body (route append /update/)
  // Schema =
  //  {
  //    id: '435bf533-7280-4dce-a9d0-2960b43019f9',
  //    weather: 'Partly Cloudy',
  //    createdAt: '2021-12-18T20:26:25.989Z',
  //    updatedAt: '2021-12-18T20:26:25.989Z'
  //  }

  //
  // Validate Forbidden keys
  //
  body([
    'createdAt',
    'updatedAt'], 'server generated values not allowed')
    .not().exists(),
  //
  // Validate Required keys
  //
  param('id', 'Required value')
    .exists(),
  body('id', 'Required values')
    .exists(),
  //
  // Validate Input
  //
  param('id', 'Invalid UUID.v4')
    .isUUID(4),
  body('id', 'Invalid UUID.v4')
    .isUUID(4),
  body(['weather'], 'Invalid string length')
    .isLength({ min: 1, max: 30 }),
  body('weather', 'Invalid characters in string')
    .isWhitelisted(allowedChars),

  //
  // On error return status 422 Unprocessable Entity
  //
  handleValidationError
]; // update

/**
 * Input Validation for patch requests
 */
exports.patch = [
  // Method = PATCH, Data in body
  // Schema =
  //  {
  //    id: '435bf533-7280-4dce-a9d0-2960b43019f9',
  //    weather: 'Partly Cloudy',
  //    createdAt: '2021-12-18T20:26:25.989Z',
  //    updatedAt: '2021-12-18T20:26:25.989Z'
  //  }

  //
  // Validate Forbidden keys
  //
  body([
    'createdAt',
    'updatedAt'], 'server generated values not allowed')
    .not().exists(),
  //
  // Validate Required keys
  //
  body('id', 'Required values')
    .exists(),
  param('id', 'Required value')
    .exists(),
  //
  // Validate Input
  //
  param('id', 'Invalid UUID.v4')
    .isUUID(4),
  body('id', 'Invalid UUID.v4')
    .isUUID(4),
  body(['weather'], 'Invalid string length')
    .isLength({ min: 1, max: 30 }),
  body('weather', 'Invalid characters in string')
    .isWhitelisted(allowedChars),
  //
  // On error return status 422 Unprocessable Entity
  //
  handleValidationError
]; // patch
