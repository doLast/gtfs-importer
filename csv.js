'use strict';

var Promise = require('promise');
var path = require('path');
var fs = require('fs');
var csv = require("fast-csv");

exports.parseCsv = function (csvPath) {
  console.log('parsing', csvPath);
  return csv
    .fromPath(csvPath, {
      headers: true,
    });
};
