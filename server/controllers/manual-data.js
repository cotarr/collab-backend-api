'use strict';

// ----------------------------------------
//  Create mock database with one record
// ----------------------------------------
const dataArray = [
  {
    id: '435bf533-7280-4dce-a9d0-2960b43019f9',
    weather: 'Partly Cloudy',
    createdAt: '2021-12-18T20:26:25.989Z',
    updatedAt: '2021-12-18T20:26:25.989Z'
  }
];

/**
 * Retrieve by ID
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (id === dataArray[0].id) {
    return res.json(dataArray[0]);
  } else {
    return res.status(404).json({ code: 404, message: 'Not found' });
  }
}; // getById

/**
 * List Controller (return all records)
 *
 * A query filter is not supported in demo
 * List controller simply returns the entire array
 */
exports.list = function (req, res, next) {
  res.json(dataArray);
};

// ----------------------------------------------
// Modify record by id
//
// (all values optional in PATCH method)
// --------------------------------------------

exports.update = function (req, res) {
  const id = req.params.id;

  const changes = {};
  // the "id" is not included, because it can not be changed.
  if ('weather' in req.body) changes.weather = req.body.weather;

  if (id === dataArray[0].id) {
    // if weather property, then update the mock database
    if ('weather' in changes) dataArray[0].weather = changes.weather;
    const now = new Date();
    dataArray[0].updatedAt = now.toISOString();

    // Success! Return status 204 without content
    res.status(204).end();
  } else {
    return res.status(404).json({ code: 404, message: 'Not found' });
  }
}; // update
