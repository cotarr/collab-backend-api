//
// Input validation using express-validator
//

'use strict';

const handleValidationError = require('./validation-error').handleError;
const checkExtraneousKeys = require('./validation-error').checkExtraneousKeys;
const { body, query } = require('express-validator');

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
    'data3'])
    .not().exists()
    .withMessage('Query parameters not supported in mock API'),
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
  // validate extraneous keys
  //
  function (req, res, next) {
    checkExtraneousKeys(req, [
      'deviceId',
      'timestamp',
      'data1',
      'data2',
      'data3'
    ], ['body', 'noquery']);
    next();
  },

  //
  // Validate Forbidden keys
  //
  body([
    'id',
    'createdAt',
    'updatedAt'])
    .not().exists()
    .withMessage('server generated values not allowed'),
  //
  // Validate Required keys
  //
  body([
    'deviceId',
    'timestamp',
    'data1',
    'data2',
    'data3'])
    .exists()
    .withMessage('Required values'),
  //
  // Validate Input
  //
  body('timestamp')
    .isISO8601()
    .withMessage('Invalid ISO8601 date value'),
  body([
    'data1',
    'data2',
    'data3'])
    .isFloat()
    .withMessage('Invalid floating point value'),
  body('deviceId')
    .isLength({ max: 64 })
    .withMessage('Invalid string length'),
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
