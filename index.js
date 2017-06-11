'use strict';

var program = require('commander');
var path = require('path');

var zip = require('./zip');
var gtfs = require('./gtfs');

program
  .version('1.0.0')
  .arguments('<file>')
  .option('-o, --output <output>', 'The output sqlite db file name')
  .action(function (file) {
    console.log(file);
    console.log(program.output);

    zip.unpack(file).then(function (err) {
      console.log('unpacked', err);
      return gtfs.importFromGtfsPath(path.join(process.cwd(), '/tmp/gtfs'));
    });
  })
  .parse(process.argv);
