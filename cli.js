#! /usr/bin/env node

'use strict';

var minimist = require('minimist');
var metadataify = require('./metadataify');
var pkgUp = require('pkg-up');
var fs = require('fs');

if(process.stdin.isTTY) {
  process.exit(1)
}

var opts = minimist(process.argv.slice(2));

function execute (data) {
  process.stdin
    .pipe(metadataify(data))
    .pipe(process.stdout)
}

if (opts.input) {
  fs.readFile(opts.input, function(err, data) {
    if (err) {
      throw new Error(err);
    }

    var data = JSON.parse(data);

    execute(data);
  });
} else {
  pkgUp().then(function(filepath) {
    if (filepath) {
      fs.readFile(filepath, function(err, data) {
        if (err) {
          throw new Error(err);
        }

        var pkg = JSON.parse(data);

        execute(pkg);
      });
    }
  });
}
