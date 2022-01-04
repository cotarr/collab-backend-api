//
// Input validation using express-validator
//

'use strict';

const { body, query, validationResult } = require('express-validator');

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

/**
 * Input Validation for list request
 */
exports.list = [
  // Forbidden query parameters
  query([
    'id',
    'deviceId',
    'timestamp',
    'data1',
    'data2',
    'data3'], 'Query parameters not supported in mock API')
    .not().exists(),
  handleValidationError
];

/**
 * Input Validation for create request
 */
exports.create = [
  // Method = POST, Data in body
  // Schema =
  //   {
  //     deviceId: 'iot-device-12',
  //     timestamp: '2021-09-17T15:33:07.743Z',
  //     data1: 25.486,
  //     data2: 25.946,
  //     data3: 24.609
  //   }

  //
  // Validate Forbidden keys
  //
  body([
    'id',
    'createdAt',
    'updatedAt'], 'server generated values not allowed')
    .not().exists(),
  //
  // Validate Required keys
  //
  body([
    'deviceId',
    'timestamp',
    'data1',
    'data2',
    'data3'], 'Required values')
    .exists(),
  //
  // Validate Input
  //
  body('timestamp', 'Invalid ISO8601 date value')
    .isISO8601(),
  body([
    'data1',
    'data2',
    'data3'], 'Invalid floating point value')
    .isFloat(),
  body('deviceId', 'Invalid string length')
    .isLength({ max: 64 }),
  //
  // Sanitize input
  //
  body('timestamp')
    .toDate(),
  body([
    'userid',
    'typeid'])
    .toInt(),
  body([
    'data1',
    'data2',
    'data3'])
    .toFloat(),
  //
  // On error return status 422 Unprocessable Entity
  //
  handleValidationError
]; // create
