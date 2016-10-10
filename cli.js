#! /usr/bin/env node

'use strict';

var metadataify = require('./metadataify');
var minimist = require('minimist');
var pkgUp = require('pkg-up');
var fs = require('fs');

if (process.stdin.isTTY) {
  printUsageAndExit();
}

var opts = minimist(process.argv.slice(2));

function printUsageAndExit () {
  console.error('USAGE: browserify client.js |indexhtmlify | metadataify > index.html');
  process.exit(1);
}

function execute (data) {
  process.stdin
    .pipe(metadataify(data))
    .pipe(process.stdout);
}

function applyOverrides (data, opts) {
  data.metadataify = data.metadataify || {};

  function setField (inField, outField) {
    if (!outField) {
      outField = inField;
    }

    var value = opts[inField];

    if (typeof value !== 'string') {
      return;
    }

    data.metadataify[outField] = value;
  }

  setField('description');
  setField('title', 'name');
  setField('author');
  setField('url');

  return data;
}

function processFile (err, data) {
  var parsedData;

  if (err) {
    console.error(err);
    printUsageAndExit();
  }

  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    console.error(e);
    printUsageAndExit();
  }

  execute(applyOverrides(parsedData, opts));
}

if (opts.input) {
  // input is specified:
  fs.readFile(opts.input, processFile);
} else if (opts.input === false) {
  // --no-input flag was deliberately passed:
  execute(applyOverrides({}, opts));
} else {
  // input is not specified:
  pkgUp().then(function (filepath) {
    if (!filepath) {
      printUsageAndExit();
    }

    fs.readFile(filepath, processFile);
  });
}
