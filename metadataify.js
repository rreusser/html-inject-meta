#! /usr/bin/env node

'use strict';

var hyperstream = require('hyperstream');
var entities = require('entities').encodeHTML;

module.exports = metadataify;

function extractInputData (output, data) {
  var description = data.description;
  var title = data.name;
  var author;

  if (data.author) {
    if (typeof data.author === 'string') {
      author = data.author;
    } else if (typeof data.author.name === 'string') {
      author = data.author.name;
    }
  }

  if (title) {
    output.title = title;
    output.name['application-name'] = title;
    output.name.subject = title;
    output.name.abstract = title;
    output.property['og:title'] = title;
    output.name['twitter:title'] = title;
    output.itemprop.title = title;
  }

  if (description) {
    output.name.description = description;
    output.name.subject = description;
    output.name.abstract = description;
    output.property['og:description'] = description;
    output.name['twitter:description'] = description;
    output.itemprop.description = description;
  }

  if (author) {
    output.name.author = author;
    output.property['article:author'] = author;
    output.name['twitter:creator'] = author;
  }
}

function extractMetadataifyData (output, data) {
  if (!data) return;

  var url = data.url;
  var image = data.image;

  if (typeof url === 'string') {
    output.name['url'] = url;
    output.link.relCanonical = url;
    output.property['og:url'] = url;
    output.name['twitter:url'] = url;
  }

  if (typeof image === 'string') {
    output.property['og:image'] = image;
    output.name['twitter:image'] = image;
    output.itemprop['image'] = image;
    output.name['twitter:card'] = 'summary_large_image';
  }

  if (typeof data.twitter === 'object') {
    var twitterFields = ['card', 'site', 'creator', 'title', 'description', 'image'];
    for (var i = 0; i < twitterFields.length; i++) {
      var field = twitterFields[i];

      if (typeof data.twitter[field] === 'string') {
        output.name['twitter:' + field] = data.twitter[field];
      }
    }
  }
}

function fieldsToChanges (fields) {
  var changes = {};

  if (fields.title) {
    changes.title = {_text: entities(fields.title)};
  }

  var metaTagsContent = '';

  var metaprops = ['name', 'itemprop', 'property'];
  for (var i = 0; i < metaprops.length; i++) {
    var metaprop = metaprops[i];
    var props = fields[metaprop];

    var names = Object.keys(props);
    for (var j = 0; j < names.length; j++) {
      var name = entities(names[j]).replace('&colon;', ':');
      var value = entities(props[name]);

      metaTagsContent += '<meta ' + metaprop + '="' + name + '" content="' + value + '">\n';
    }
  }

  if (fields.link && fields.link.relCanonical) {
    metaTagsContent += '<link rel="canonical" href="' + entities(fields.link.relCanonical) + '">\n';
  }

  if (metaTagsContent.length > 0) {
    changes.head = {_appendHtml: metaTagsContent};
  }

  return changes;
}

function metadataify (data) {
  data = data || {};

  var fields = {
    name: {},
    property: {},
    itemprop: {},
    link: {}
  };

  extractInputData(fields, data);
  extractMetadataifyData(fields, data.metadataify)

  return hyperstream(fieldsToChanges(fields));
}
