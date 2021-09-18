'use strict';

// --------------------
//  create new record
// --------------------

let id = 0;
const dataArray = [];

/**
 * List Controller (return all records)
 *
 * A query filter is not supported in demo
 * List controller simply returns the entire array
 */
exports.list = function (req, res, next) {
  res.json(dataArray);
};

/**
 * List Controller (Creates a new record)
 */
exports.create = function (req, res, next) {
  const now = new Date().toISOString();
  id++;
  const newRecord = {
    id: id,
    deviceId: req.body.deviceId,
    timestamp: req.body.timestamp,
    data1: parseFloat(req.body.data1),
    data2: parseFloat(req.body.data2),
    data3: parseFloat(req.body.data3),
    updatedAt: now,
    createdAt: now
  };
  //
  // save to memory variable Array to emulate database
  //
  if (dataArray.length > 10) {
    // This is demo, limit array to 10 records
    dataArray.splice(0, 1);
  }
  dataArray.push(newRecord);

  //
  // HTTP response
  //
  // REST API specification to return location header (Full URL?)
  res.set('Location', '/v1/data/iot-data');
  // return the created record
  res.status(201).json(newRecord);
};
