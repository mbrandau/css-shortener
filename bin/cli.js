#!/usr/bin/env node

const CssShortener = require('../index');
const fs = require('fs');

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('shorten', 'Shorten css class names from a file', yargs => {
    return yargs.option('input', {
      alias: 'i',
      describe: 'input file',
      type: 'string'
    }).option('output', {
      alias: 'o',
      describe: 'output file for shortened css',
      type: 'string'
    }).option('map', {
      describe: 'output file for the class name map (JSON)',
      type: 'string'
    });
  }, argv => {
    const csss = new CssShortener();
    var inputStream = argv.input ? fs.createReadStream(argv.input) : process.stdin;
    var outputStream = argv.output ? fs.createWriteStream(argv.output) : process.stdout;
    inputStream
      .on('end', () => {
        if (argv.map) {
          fs.writeFileSync(argv.map, JSON.stringify(csss.getMap()));
        }
      })
      .pipe(csss.stream())
      .pipe(outputStream);
  })
  .example('$0 shorten -i input.css -o output.css -mo map.json', 'Shorten class names from input.css and output the file to output.css; the map is saved in map.json')
  .demandCommand()
  .help()
  .argv
