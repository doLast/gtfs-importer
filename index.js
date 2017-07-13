'use strict';

var program = require('commander');
var path = require('path');

var zip = require('./zip');
var gtfs = require('./gtfs');

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

    zip.unpack(file).then(function (err) {
      console.log('UNPACKED', err);
      return gtfs.importFromGtfsPath(path.join(process.cwd(), '/tmp/gtfs'), output);
    }).then(function (err) {
      console.log('IMPORTED: ', output, err);
    });
  })
  .parse(process.argv);
