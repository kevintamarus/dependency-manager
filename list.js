#!/usr/bin/env node

var fs = require('fs');

fs.readFile('packages.json', 'utf8', function readFileCallback(error, data) {
  if(error) {
    console.log(error);
  } else {
    data = JSON.parse(data);
    console.log('packages installed: ')
    for(var dependency in data) {
      console.log(dependency)
    }
  }
})
