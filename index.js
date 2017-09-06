'use strict';

var program = require('commander');
var path = require('path');

var Promise = require('promise');
var rimraf = Promise.denodeify(require('rimraf'));

var zip = require('./zip');
var gtfs = require('./gtfs');

const GTFS_TEMP_DIR = path.join(process.cwd(), '/tmp/gtfs');

program
  .version('1.0.0')
  .arguments('<file>')
  .option('-o, --output <output>', 'The output sqlite db filename')
  .action(function (file) {
    let output = program.output;
    if (!output) {
      output = path.basename(file, path.extname(file));
    }

    console.log('INPUT:', file);
    console.log('OUTPUT:', output);
    console.log('TEMP:', GTFS_TEMP_DIR);

    rimraf(GTFS_TEMP_DIR).then(() => {
      return zip.unpack(file);
    }).then(function (err) {
      console.log('UNPACKED', err);
      return gtfs.importFromGtfsPath(GTFS_TEMP_DIR, output);
    }).then(function (err) {
      console.log('IMPORTED: ', output, err);
    });
  })
  .parse(process.argv);
