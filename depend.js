#!/usr/bin/env node

var fs = require('fs');
var ARGS = process.argv.slice(2);

if(ARGS.length > 1) {
  fs.readFile('dependencies.json', 'utf8', function readFileCallback(error, data) {
    if(error) {
      console.log(error);
    } else {
      data = JSON.parse(data);
      data[ARGS[0]] = ARGS.slice(1);
      fs.writeFileSync('dependencies.json', JSON.stringify(data, null, 4), 'utf8', function(error) {
        if(error) {
          return console.log(error);
        }
      })
    }
    console.log('DEPEND ' + process.argv.slice(2).join(' '));
  })
} else {
  console.log('invalid command')
}