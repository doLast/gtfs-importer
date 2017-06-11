'use strict';

var path = require('path');
var fs = require('fs');
var Promise = require('promise');
var sqlite3 = require('sqlite3').verbose();
var csv = require('fast-csv');

var GTFS_FILENAMES = ['calendar', 'calendar_dates', 'routes', 'stops', 'trips', 'stop_times', 'shapes'];
var GTFS_FILE_EXTENTION_NAME = 'txt';


var db = new sqlite3.Database(path.join(process.cwd(), '/gtfs.sqlite'));
var migrationSql = fs.readFileSync(path.join(process.cwd(), '/migrations/001-initial-schema.sql'), 'utf-8');
var dbPromise = new Promise(function (resolve, reject) {
  db.exec(migrationSql, function (err) {
    if (err) {
      reject(err);
    }
    resolve(db);
  });
});

exports.importFromGtfsPath = function (gtfsPath) {
  console.log('IMPORTING FROM', gtfsPath);

  return GTFS_FILENAMES.reduce((promise, filename) => {
    return promise.then((db) => {
      console.log(db);
      var csvPath = path.join(gtfsPath, `${filename}.${GTFS_FILE_EXTENTION_NAME}`);
      console.log('IMPORTING CSV', csvPath);
      if (!fs.existsSync(csvPath)) {
        console.log('MISSING', filename);
        return Promise.resolve(db);
      }

      return new Promise(function (resolve, reject) {
        csv
          .fromPath(csvPath, {
            headers: true,
          })
          .on('data', function(data){
             console.log(data);
          })
          .on('end', function(){
             console.log('done');
             resolve(db);
          });
      });
    });
  }, dbPromise).catch((err) => {
    console.log('FAIL', err);
  });
};
