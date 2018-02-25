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
      alias: 'm',
      describe: 'output file for the class name map (JSON)',
      type: 'string'
    }).option('import-map', {
      alias: 'im',
      describe: '.json file to import an existing map from',
      type: 'string'
    });
  }, argv => {
    const cs = new CssShortener();
    if (argv['import-map']) cs.importMap(JSON.parse(fs.readFileSync(argv['import-map'])));
    var inputStream = argv.input ? fs.createReadStream(argv.input) : process.stdin;
    var outputStream = argv.output ? fs.createWriteStream(argv.output) : process.stdout;
    inputStream
      .on('end', () => {
        if (argv.map) {
          fs.writeFileSync(argv.map, JSON.stringify(cs.getMap()));
        }
      })
      .pipe(cs.cssStream())
      .pipe(outputStream);
  })
  .command('html', 'Replace css class names in an html file', yargs => {
    return yargs.option('input', {
      alias: 'i',
      describe: 'input file',
      type: 'string'
    }).option('output', {
      alias: 'o',
      describe: 'output file',
      type: 'string'
    }).option('map', {
      alias: 'm',
      describe: 'input file for the class name map (JSON)',
      type: 'string'
    }).demandOption('map');
  }, argv => {
    const cs = new CssShortener();
    cs.importMap(JSON.parse(fs.readFileSync(argv['map'])));
    var inputStream = argv.input ? fs.createReadStream(argv.input) : process.stdin;
    var outputStream = argv.output ? fs.createWriteStream(argv.output) : process.stdout;
    inputStream
      .pipe(cs.htmlStream())
      .pipe(outputStream);
  })
  .demandCommand()
  .help()
  .argv
