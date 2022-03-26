# css-shortener

[![CI](https://github.com/mbrandau/css-shortener/actions/workflows/main.yml/badge.svg)](https://github.com/mbrandau/css-shortener/actions/workflows/main.yml) [![npm](https://img.shields.io/npm/v/css-shortener.svg)](https://www.npmjs.com/package/css-shortener) [![npm](https://img.shields.io/npm/dt/css-shortener.svg)](https://www.npmjs.com/package/css-shortener) [![GitHub issues](https://img.shields.io/github/issues/mbrandau/css-shortener.svg)](https://github.com/mbrandau/css-shortener/issues)

### Preview

```css
/* BEFORE */
p.this-class-is-extremely-long-and-definitely-needs-to-be-shortened,
p.why-is-this-so-long-if-it-just-makes-white-text {
  color: white;
}

/* AFTER */
p.a,
p.b {
  color: white;
}
```

## Table of contents

1. [Quick Start](#quick-start)
2. [API Documentation](#api-documentation)
   1. [Constructor](#constructor)
      - [Options](#options)
   2. [`#importMap(map, override)`](#importmapmap-override)
   3. [`#map`](#map)
3. [Examples](#examples)
   1. [CSS filter for nunjucks and express](#css-filter-for-nunjucks-and-express)

## Quick Start

```js
import { CssShortener } from 'css-shortener';

const shortener = new CssShortener();

console.log(shortener.shortenClassName('long-class'));
// Output: a

console.log(shortener.map);
// Output: {
//   "long-class": "a"
// }
```

## API Documentation

### Constructor

```js
const options = {
  alphabet: 'abcdef',
};
const shortener = new CssShortener(options);
```

The `options` parameter can be omitted.

#### Options

| Option   | Type     | Optionality | Description                                           | Default value                             |
| -------- | -------- | ----------- | ----------------------------------------------------- | ----------------------------------------- |
| alphabet | _string_ | optional    | The alphabet is used to generate the new class names. | `'abcefghijklmnopqrstuvwxyz0123456789_-'` |

Note that there is no `d` in the default alphabet to avoid generation of the combination `ad`.

### `#importMap(map, override)`

Imports mappings into the shortener

```js
cssShortener.importMap(
  {
    'my-extremely-long-class-name': 'a',
  },
  false
);
```

If `override` is true, class names that are already mapped will be overridden.  
The `override` parameter can be omitted.

### `#map`

Returns the mapped class names

```js
var map = cssShortener.getMap();
```

```json
{
  "my-extremely-long-class-name": "a"
}
```

## Examples

### CSS filter for nunjucks and express

```js
const express = require('express');
const nunjucks = require('nunjucks');

const cssMap = JSON.parse(fs.readFileSync('./cssMap.json'));

const app = express();
const env = nunjucks.configure('your-views-folder', { express: app });

env.addFilter('css', function(str) {
  return str
    .split(' ')
    .map(c => (cssMap[c] != null ? cssMap[c] : c))
    .join(' ');
});
```

```html
<!-- BEFORE -->
<div class="{{'my-extremely-long-class-name'|css}}"></div>
<!-- RENDERED -->
<div class="a"></div>
```
