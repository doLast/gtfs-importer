'use strict';

var path = require('path');
var fs = require('fs');
var Promise = require('promise');
var sqlite3 = require('sqlite3').verbose();
var csv = require('fast-csv');
var squel = require('squel');

var GTFS_FILENAMES = ['calendar', 'calendar_dates', 'routes', 'stops', 'trips', 'stop_times', 'shapes'];
var GTFS_FILE_EXTENTION_NAME = 'txt';
var SQLITE_EXTENTION_NAME = 'sqlite';

function getDb(dbName) {
  var db = new sqlite3.Database(path.join(process.cwd(), `/${dbName}.${SQLITE_EXTENTION_NAME}`));
  var migrationSql = fs.readFileSync(path.join(process.cwd(), '/migrations/001-initial-schema.sql'), 'utf-8');
  var dbPromise = new Promise(function (resolve, reject) {
    db.exec(migrationSql, function (err) {
      if (err) {
        reject(err);
      }
      resolve(db);
    });
  });
  return dbPromise;
}

exports.importFromGtfsPath = function (gtfsPath, dbName) {
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
        var rows = [];

        csv
          .fromPath(csvPath, {
            headers: true,
          })
          .on('data', function(data){
            rows.push(data);
          })
          .on('end', function(){
            if (!rows.length) {
              return resolve(db);
            }

            if (filename === 'stop_times') {
              rows.forEach((row) => {
                row.arrival_time = row.arrival_time.replace(/:/g, '');
                row.departure_time = row.departure_time.replace(/:/g, '');
              });
            }

            // stops.txt has entries with `stop_id` is not Int, so insert one by one.
            if (filename !== 'stops') {
              return resolve(new Promise(function (resolve, reject) {
                var queryStr = squel.insert({
                  replaceSingleQuotes: true,
                }).into(filename).setFieldsRows(rows).toString();
                console.log(queryStr);
                db.run(queryStr, function (err) {
                  if (!err) {
                    return resolve(db);
                  }
                  return reject(err);
                });
              }));
            }

            resolve(rows.reduce((promise, row) => {
              return promise.then(() => new Promise(function (resolve, reject) {
                var queryStr = squel.insert({
                  replaceSingleQuotes: true,
                }).into(filename).setFields(row).toString();
                console.log(queryStr);
                db.run(queryStr, function (err) {
                  if (!err) {
                    return resolve(db);
                  }
                  if (err.code === 'SQLITE_MISMATCH') {
                    console.log('SKIP db type mismatch');
                    return resolve(db);
                  }
                  return reject(err);
                });
              }));
            }, Promise.resolve(db)));
          });
      });
    });
  }, getDb(dbName)).catch((err) => {
    console.log('FAIL', err);
  });
};
