#! /usr/bin/env node

'use strict';

var minimist = require('minimist');
var metadataify = require('./metadataify');

if(process.stdin.isTTY) {
  process.exit(1)
}

var opts = minimist(process.argv.slice(2));

process.stdin
  .pipe(metadataify(opts))
  .pipe(process.stdout)
