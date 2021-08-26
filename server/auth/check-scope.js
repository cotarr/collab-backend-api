'use strict';
//
// Simplified check of token scope
//
// Method GET:  requires scope api.read or api.write
// Method POST: requires scope api.write
// Other methods rejected
// -----------------------------------------

exports.checkScope = (req, scope) => {
  //
  // GET method accept scope api.read or api.write
  //
  if ((req.method.toUpperCase() === 'GET') &&
    ((scope.indexOf('api.read') >= 0) || (scope.indexOf('api.write') >= 0))) {
    return true;
  //
  // POST method accept scope api.write
  //
  } else if ((req.method.toUpperCase() === 'POST') &&
    (scope.indexOf('api.write') >= 0)) {
    return true;
  //
  // Else deny request, token is valid, but insufficient scope
  //
  } else {
    return false;
  }
};
