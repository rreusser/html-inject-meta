'use strict';

var metadataify = require('../metadataify');
var assert = require('chai').assert;
var toString = require('stream-to-string');
var fs = require('fs');
var path = require('path');

function fixture (name) {
  return fs.createReadStream(path.join(__dirname, 'fixtures', name));
}

function assertStreamsEqual (computedStream, expectedStream) {
  return Promise.all([
    toString(computedStream),
    toString(expectedStream)
  ]).then(function (values) {
    assert.equal(values[0], values[1]);
  });
}

function compare (inFixture, outFixture, changes) {
  return assertStreamsEqual(
    fixture(inFixture).pipe(metadataify(changes)),
    fixture(outFixture)
  );
}

describe('metadataify', function () {
  it('makes no changes when passed undefined', function (done) {
    compare('input/test.html', 'input/test.html', undefined).then(done, done);
  });

  it('makes no changes when passed null', function (done) {
    compare('input/test.html', 'input/test.html', null).then(done, done);
  });

  it('makes no changes when passed {}', function (done) {
    compare('input/test.html', 'input/test.html', {}).then(done, done);
  });

  it('inserts a title', function (done) {
    compare('input/test.html', 'output/insert-title.html', {
      name: 'test title'
    }).then(done, done);
  });

  it('inserts a description', function (done) {
    compare('input/test.html', 'output/insert-description.html', {
      description: 'test description'
    }).then(done, done);
  });

  it('inserts an author', function (done) {
    compare('input/test.html', 'output/insert-author.html', {
      author: 'test author'
    }).then(done, done);
  });

  it('inserts an author with nested npm-style definition', function (done) {
    compare('input/test.html', 'output/insert-author.html', {
      author: {
        name: 'test author'
      }
    }).then(done, done);
  });

  describe('passing data through metadataify field', function () {
    it('inserts a title', function (done) {
      compare('input/test.html', 'output/insert-title.html', {
        metadataify: {
          name: 'test title'
        }
      }).then(done, done);
    });

    it('inserts a description', function (done) {
      compare('input/test.html', 'output/insert-description.html', {
        metadataify: {
          description: 'test description'
        }
      }).then(done, done);
    });

    it('inserts an author', function (done) {
      compare('input/test.html', 'output/insert-author.html', {
        metadataify: {
          author: 'test author'
        }
      }).then(done, done);
    });

    it('inserts an author with nested npm-style definition', function (done) {
      compare('input/test.html', 'output/insert-author.html', {
        metadataify: {
          author: {
            name: 'test author'
          }
        }
      }).then(done, done);
    });

    it('inserts a url', function (done) {
      compare('input/test.html', 'output/insert-url.html', {
        metadataify: {
          url: 'test url'
        }
      }).then(done, done);
    });

    it('inserts an image', function (done) {
      compare('input/test.html', 'output/insert-image.html', {
        metadataify: {
          image: 'test image'
        }
      }).then(done, done);
    });

    it('allows specification of a canonical url', function (done) {
      compare('input/test.html', 'output/insert-canonical.html', {
        metadataify: {canonicalUrl: 'test canonical'}
      }).then(done, done);
    });

    it('accepts twitter fields', function (done) {
      compare('input/test.html', 'output/insert-twitter.html', {
        metadataify: {
          twitter: {
            card: 'twitter-card',
            site: 'twitter-site',
            creator: 'twitter-creator',
            title: 'twitter-title',
            description: 'twitter-description',
            image: 'twitter-image'
          }
        }
      }).then(done, done);
    });
  });
});
