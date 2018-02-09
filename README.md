# css-shortener

Utility to shorten css class names

## Usage

### CLI

Install the tool using `npm install -g css-shortener`

```sh
$ cat input.css | css-shortener shorten --map map.json > output.css
$ css-shortener shorten -i input.css -o output.css --map map.json
# Both produce the same result
```

### API

Install the package with `npm install --save css-shortener`

```javascript
const fs = require('fs');
const CssShortener = require('css-shortener');

const shortener = new CssShortener();

fs.createReadStream('input.css')
  .pipe(shortener.stream())
  .pipe(fs.createWriteStream('output.css'))
  .on('finish', () => {
    fs.writeFile('map.json', JSON.stringify(shortener.getMap()), () => {
      console.log('Done!');
    });
  });
```
