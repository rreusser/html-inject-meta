#! /usr/bin/env node

'use strict';

var hyperstream = require('hyperstream');
var entities = require('entities').encodeHTML;

module.exports = metadataify;

function metadataify (opts) {
  opts = opts || {};

  var changes = {};

  if (opts.title) {
    changes.title = {_text: opts.title};
  }

  var metaName = opts['meta-name'];
  var metaTagsContent = '';

  if (metaName) {
    if (!Array.isArray(metaName)) {
      metaName = [metaName];
    }

    for (var i = 0; i < metaName.length; i++) {
      var parts = metaName[i].split(/=(.+)?/, 2);
      var name = entities(parts[0]).replace('&colon;', ':');

      metaTagsContent += '<meta name="' + name + '" content="' + entities(parts[1]) + '">\n';

    }

  }

  if (metaTagsContent.length > 0) {
    changes.head = {_appendHtml: metaTagsContent};
  }


  return hyperstream(changes);
}
