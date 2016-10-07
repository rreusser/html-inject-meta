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

function applyOverrides(data, opts) {
  data.metadataify = data.metadataify || {};

  if (typeof opts.description === 'string') {
    data.metadataify.description = opts.description;
  }
  if (typeof opts.title === 'string') {
    data.metadataify.name = opts.title;
  }
  if (typeof opts.author === 'string') {
    data.metadataify.author = opts.author;
  }
  if (typeof opts.url === 'string') {
    data.metadataify.url = opts.url;
  }

  return data;
}

if (opts.input) {
  fs.readFile(opts.input, function(err, data) {
    if (err) {
      throw new Error(err);
    }

    var data = applyOverrides(JSON.parse(data), opts);

    execute(data);
  });
} else {
  pkgUp().then(function(filepath) {
    if (filepath) {
      fs.readFile(filepath, function(err, data) {
        if (err) {
          throw new Error(err);
        }

        var pkg = applyOverrides(JSON.parse(data), opts);

        execute(pkg);
      });
    }
  });
}
