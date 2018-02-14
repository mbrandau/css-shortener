# css-shortener [![Build Status](https://img.shields.io/travis/mbrandau/css-shortener.svg)](https://travis-ci.org/mbrandau/css-shortener) [![Coverage Status](https://img.shields.io/coveralls/github/mbrandau/css-shortener.svg)](https://coveralls.io/github/mbrandau/css-shortener?branch=master) [![npm](https://img.shields.io/npm/dt/css-shortener.svg)](https://www.npmjs.com/package/css-shortener)

Utility to shorten css class names. **Saves more than 20%** of [Bootstrap](https://getbootstrap.com)!

## Table of contents
1. [Quick Start](#quick-start)
2. [Documentation](#documentation)
3. [Examples](#examples)

## Quick Start

### CLI

Install the tool using `npm install -g css-shortener`

```sh
# Both ways produce the same result

cat input.css | css-shortener shorten --map map.json > output.css

css-shortener shorten -i input.css -o output.css --map map.json
```

### API

Install the package with `npm install --save css-shortener`

```js
const fs = require('fs');
const CssShortener = require('css-shortener');

const cssShortener = new CssShortener();

fs.createReadStream('input.css')
  .pipe(cssShortener.stream())
  .pipe(fs.createWriteStream('output.css'))
  .on('finish', () => {
    fs.writeFile('map.json', JSON.stringify(cssShortener.getMap()), () => {
      console.log('Done!');
    });
  });
```

## Documentation

### Constructor

```js
const options = {
  alphabet: 'abcdef' // Alphabet that is used for class name generation
};
const cssShortener = new CssShortener(options);
```
The `options` parameter can be omitted.

### #importMap(map, override)

Imports mappings into the shortener

```js
cssShortener.importMap({
  "my-extremely-long-class-name": "a"
}, false);
```
If `override` is true, class names that are already mapped will be overridden.  
The `override` parameter can be omitted.

### #getMap()

Returns the mapped class names

```js
var map = cssShortener.getMap();
```
```json
{
  "my-extremely-long-class-name": "a"
}
```

### #stream()
```js
const fs = require('fs');

fs.createReadStream('input.css')
  .pipe(cssShortener.stream())
  .pipe(fs.createWriteStream('output.css'))
  .on('finish', () => {
    fs.writeFile('map.json', JSON.stringify(cssShortener.getMap()), () => {
      console.log('Done!');
    });
  });
```

### #htmlStream()
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
<div class="{{'my-extremely-long-class-name'|css}}"></div>
```
```html
<div class="a"></div>
```
