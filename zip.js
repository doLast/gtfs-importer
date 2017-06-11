'use strict';

var Promise = require('promise');
var path = require('path')
var extract = Promise.denodeify(require('extract-zip'));

exports.unpack = function (zipPath) {
  console.log('unzipping', zipPath);
  return extract(zipPath, {
    dir: path.join(process.cwd(), '/tmp/gtfs'),
  });
};
