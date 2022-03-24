# css-shortener
[![Build Status](https://img.shields.io/travis/mbrandau/css-shortener.svg)](https://travis-ci.org/mbrandau/css-shortener) [![Coverage Status](https://img.shields.io/coveralls/github/mbrandau/css-shortener.svg)](https://coveralls.io/github/mbrandau/css-shortener?branch=master) [![npm](https://img.shields.io/npm/v/css-shortener.svg)](https://www.npmjs.com/package/css-shortener) [![npm](https://img.shields.io/npm/dt/css-shortener.svg)](https://www.npmjs.com/package/css-shortener) [![GitHub issues](https://img.shields.io/github/issues/mbrandau/css-shortener.svg)](https://github.com/mbrandau/css-shortener/issues)

Utility to shorten css class names. **Saves more than 20%** of [Bootstrap](https://getbootstrap.com)! It also **works with minified code**.

# **Work in progress:** this readme is not updated to v3 yet

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
2. [API Documentation](#api-documentation)
    1. [Constructor](#constructor)
        - [Options](#options)
    2. [`#importMap(map, override)`](#importmapmap-override)
    3. [`#getMap()`](#getmap)
    4. [`#replaceCss()`](#replacecss)
    5. [`#replaceHtml()`](#replacehtml)
    6. [`#cssStream()`](#cssstream)
    7. [`#htmlStream()`](#htmlstream)
3. [CLI Documentation](#cli-documentation)
4. [Examples](#examples)
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

## API Documentation

### Constructor

```js
const options = {
  alphabet: 'abcdef',
  ignorePrefix: 'ignore-me-',
  trimIgnorePrefix: false
};
const cs = new CssShortener(options);
```
The `options` parameter can be omitted.

#### Options

| Option | Type | Optionality | Description | Default value |
| ------ | ---- | ----------- | ----------- | ------------- |
| alphabet | *string* | optional | The alphabet is used to generate the new class names. | `'abcefghijklmnopqrstuvwxyz0123456789_-'` |
| ignorePrefix | *string* | optional | Classes starting with this prefix will be omited from replacing. Set to `undefined` to disable. | `'ignore-'` |
| trimIgnorePrefix | *boolean* | optional | If true, the prefix will be trimmed off of the matched classes. | `true` |

Note that there is no `d` in the default alphabet to avoid generation of the combination `ad`.

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

### `#replaceCss()`
```js
console.log(cssShortener.replaceCss('.my-extremely-long-class-name{color:black;}'));

// => '.a{color:black;}'
```

### `#replaceHtml()`
```js
console.log(cssShortener.replaceHtml('<div class="font-bold my-extremely-long-class-name">Test</div>'));

// => '<div class="font-bold a">Test</div>'
```

### `#cssStream()`
Shortens the CSS class names.
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

## CLI Documentation

### Command `shorten`

Documentation coming soon. Meanwhile, see `css-shortener --help`.

### Command `html`

Documentation coming soon. Meanwhile, see `css-shortener --help`.

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

# TSDX User Guide

Congrats! You just saved yourself hours of work by bootstrapping this project with TSDX. Let’s get you oriented with what’s here and how to use it.

> This TSDX setup is meant for developing libraries (not apps!) that can be published to NPM. If you’re looking to build a Node app, you could use `ts-node-dev`, plain `ts-node`, or simple `tsc`.

> If you’re new to TypeScript, checkout [this handy cheatsheet](https://devhints.io/typescript)

## Commands

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).
