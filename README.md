# metadataify

> Stream meta tags into html

[![experimental][stability-experimental]][stability-url]
[![Build Status][travis-image]][travis-url]
[![npm version][npm-image]][npm-url]
[![Dependency Status][david-dm-image]][david-dm-url]
[![Semistandard Style][semistandard-image]][semistandard-url]

## Introduction

Add metadata tags to a stream of html so that it looks all pretty when you share a demo or a simple web example on social media. See: [indexhtmlify#5](https://github.com/dominictarr/indexhtmlify/issues/5).

## Installation

```
$ npm i -g metadataify 
```

## Usage

`metadataify` is designed to just work without much configuration, but allows overrides when necessary. The input _must_ be valid html containing `head` and `title` tags. Insertion of the `meta` tags is _not_ idempotent. Used without any arguments, the command line version looks for the nearest `package.json`. For example:

```bash
$ metadataify < input.html
```

Given `package.json`:

```json
{
  "name": "metadataify",
  "description": "Stream meta tags into html",
  "author": "Ricky Reusser"
}
```

and given a minimal html input, it produces the output:

```html
<!doctype html>
<html>
  <head>
    <title>metadataify</title>
    <meta name="application-name" content="metadataify">
    <meta name="subject" content="Stream meta tags into html">
    <meta name="abstract" content="Stream meta tags into html">
    <meta name="twitter:title" content="metadataify">
    <meta name="description" content="Stream meta tags into html">
    <meta name="twitter:description" content="Stream meta tags into html">
    <meta name="author" content="Ricky Reusser">
    <meta name="twitter:creator" content="Ricky Reusser">
    <meta itemprop="title" content="metadataify">
    <meta itemprop="description" content="Stream meta tags into html">
    <meta property="og:title" content="metadataify">
    <meta property="og:description" content="Stream meta tags into html">
    <meta property="article:author" content="Ricky Reusser">
  </head>
  <body>
  </body>
</html>
```

Even better, use it with [indexhtmlify](https://github.com/dominictarr/indexhtmlify):

```bash
$ browserify index.js | indexhtmlify | metadataify > index.html
```

To override the nearest `package.json` with your own input JSON:

```bash
$ metadataify --input=mydata.json < input.html
```

You can disable json input with `--no-input` and instead specify fields on the command line:

```bash
$ metadataify --no-input --title="My page!" --description="A description..." --author="My Name" < input.html
```

## API

#### `require('metadataify')([data])`

Returns a transform stream that applies to a stream of html the changes specified in `data`. The format of `data` identically matches the format of `package.json` that is read by the command line version, including the optional `metadataify` field.

## See also

This module is heaviliy inspired by and works great with [indexhtmlify](https://github.com/dominictarr/indexhtmlify).

## License

&copy; 2016 Ricky Reusser. MIT License.

<!-- BADGES -->

[travis-image]: https://travis-ci.org/rreusser/metadataify.svg?branch=master
[travis-url]: https://travis-ci.org//metadataify

[npm-image]: https://badge.fury.io/js/metadataify.svg
[npm-url]: https://npmjs.org/package/metadataify

[david-dm-image]: https://david-dm.org/rreusser/metadataify.svg?theme=shields.io
[david-dm-url]: https://david-dm.org/rreusser/metadataify

[semistandard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[semistandard-url]: https://github.com/Flet/semistandard

<!-- see stability badges at: https://github.com/badges/stability-badges -->
[stability-url]: https://github.com/badges/stability-badges
[stability-deprecated]: http://badges.github.io/stability-badges/dist/deprecated.svg
[stability-experimental]: http://badges.github.io/stability-badges/dist/experimental.svg
[stability-unstable]: http://badges.github.io/stability-badges/dist/unstable.svg
[stability-stable]: http://badges.github.io/stability-badges/dist/stable.svg
[stability-frozen]: http://badges.github.io/stability-badges/dist/frozen.svg
[stability-locked]: http://badges.github.io/stability-badges/dist/locked.svg
