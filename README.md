# css-shortener [![Build Status](https://img.shields.io/travis/mbrandau/css-shortener.svg)](https://travis-ci.org/mbrandau/css-shortener) [![Coverage Status](https://img.shields.io/coveralls/github/mbrandau/css-shortener.svg)](https://coveralls.io/github/mbrandau/css-shortener?branch=master) [![npm](https://img.shields.io/npm/dt/css-shortener.svg)](https://www.npmjs.com/package/css-shortener)

Utility to shorten css class names. **Saves more than 20%** of [Bootstrap](https://getbootstrap.com)! It also **works with minified code**.

### Preview
```css
/* BEFORE */
p.this-class-is-extremely-long-and-definitely-needs-to-be-shortened,
p.why-is-this-so-long-if-it-just-makes-white-text {
  color: white;
}

/* 'ignore-' prefix gets trimmed off and the class will not be changed */
.ignore-stay-like-this { color: pink; }
/* AFTER */
p.a,
p.b {
  color: white;
}
.stay-like-this { color: pink; }
```

## Table of contents
1. [Quick Start](#quick-start)
    1. [API](#api)
    2. [CLI](#cli)
2. [Documentation](#documentation)
    1. [Constructor](#constructor)
3. [Examples](#examples)
    1. [CSS filter for nunjucks and express](#css-filter-for-nunjucks-and-express)

## Quick Start

### API

Install the package with `npm install --save css-shortener`

```js
const fs = require('fs');
const CssShortener = require('css-shortener');

const cs = new CssShortener();

fs.createReadStream('input.css')
  .pipe(cs.cssStream())
  .pipe(fs.createWriteStream('output.css'))
  .on('finish', () => {
    fs.writeFile('map.json', JSON.stringify(cs.getMap()), () => {
      console.log('Done!');
    });
  });
```

### CLI

Install the tool using `npm install -g css-shortener`

```sh
# Both ways produce the same result

cat input.css | css-shortener shorten --map map.json > output.css

css-shortener shorten -i input.css -o output.css --map map.json
```

## Documentation

### Constructor

```js
const options = {
  alphabet: 'abcdef', // Alphabet that is used for class name generation
  ignorePrefix: 'ignore-me-', // If specified, classes starting with this prefix will be omited from replacing (Default: 'ignore-')
  trimIgnorePrefix: false // If true, the prefix will be trimmed off of the classes (Default: true)
};
const cs = new CssShortener(options);
```
The default alphabet is `abcefghijklmnopqrstuvwxyz0123456789_-`. Note that there is no `d` to avoid generation of the combination `ad`.
The `options` parameter can be omitted.

### `#importMap(map, override)`

Imports mappings into the shortener

```js
cssShortener.importMap({
  "my-extremely-long-class-name": "a"
}, false);
```
If `override` is true, class names that are already mapped will be overridden.  
The `override` parameter can be omitted.

### `#getMap()`

Returns the mapped class names

```js
var map = cssShortener.getMap();
```
```json
{
  "my-extremely-long-class-name": "a"
}
```

### `#cssStream()`
Previously was called `#stream()`. `#stream()` is now deprecated.
```js
const fs = require('fs');

fs.createReadStream('input.css')
  .pipe(cssShortener.cssStream())
  .pipe(fs.createWriteStream('output.css'))
  .on('finish', () => {
    fs.writeFile('map.json', JSON.stringify(cssShortener.getMap()), () => {
      console.log('Done!');
    });
  });
```

### `#htmlStream()`
Replace mapped class names in HTML code.
```js
const fs = require('fs');

cssShortener.importMap({'long-class':'a'}); // Import mappings
fs.createReadStream('index.html')
  .pipe(cssShortener.htmlStream())
  .pipe(fs.createWriteStream('index.output.html'));
```
```html
<!-- index.html -->
<div class="long-class otherclass"></div>

<!-- index.output.html -->
<div class="a otherclass"></div>
```
`otherclass` wasn't touched since it is not a mapped class name.

## Examples

### CSS filter for nunjucks and express

```js
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

const env = nunjucks.configure('your-views-folder', {express: app});

env.addFilter('css', function(str) {
  const classes = str.split(' ');
  let res = '';
  for (let c of classes) res += getShortenedCssClass(c) + ' ';
  return res.trim();
});

var map = JSON.parse(fs.readFileSync('./map.json'));

function getClassName(original) {
  let res = original;
  if (map[original] != null) res = map[original];
  return res;
}
```

```html
<!-- BEFORE -->
<div class="{{'my-extremely-long-class-name'|css}}"></div>
<!-- RENDERED -->
<div class="a"></div>
```
