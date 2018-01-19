#!/usr/bin/env node

var fs = require('fs');
var ARGS = process.argv.slice(2);

if(ARGS.length) {
  fs.readFile('packages.json', 'utf8', function readFileCallback(error, installedList) {
    if(error) {
      console.log(error);
    } else {
      installedList = JSON.parse(installedList);
      var firstArgument = ARGS[0];
      //if dependency is not on list, install
      if(!installedList[firstArgument]) {
        fs.readFile('dependencies.json', 'utf8', function readFileCallback(error, requirements) {
          if(error) {
            console.log(error);
          } else {
            requirements = JSON.parse(requirements);
            //recursion to check implicit dependencies
            var dependenciesToInstall = [];
            function checkRequirements(dependency) {
              //this prevents an explicit package from changing into an implicit package
              if(!installedList[dependency]) {
                dependenciesToInstall.push(dependency);
                if(requirements[dependency]) {
                  requirements[dependency].forEach(function(x) {
                    checkRequirements(x);
                  })
                }
              } 
              //this adds the requirement dependency if it's an explicit package
              else {
                installedList[dependency].requiredBy[firstArgument] = firstArgument;
              }
            }
            checkRequirements(firstArgument);
            dependenciesToInstall.forEach(function(dependency, i) {
              console.log('Installing ' + dependency);
              if(i === 0) {
                installedList[dependency] = {type:"explicit", requiredBy: {}};
              } else {
                installedList[dependency] = {type:"implicit", requiredBy: {[dependenciesToInstall[0]]: dependenciesToInstall[0]}};
              }
            })
            fs.writeFile('packages.json', JSON.stringify(installedList, null, 4), 'utf8', function(error) {
              if(error) {
                return console.log(error);
              }
            })
          }
        })
      } 
      //if dependency is implicitly installed, don't install, but change status to explicit
      else if(installedList[firstArgument].type === 'implicit') {
        installedList[firstArgument].type = 'explicit';
        console.log('changed ' + firstArgument + ' status to an explicitly installed dependency');
        fs.writeFile('packages.json', JSON.stringify(installedList, null, 2), 'utf8', function(error) {
          if(error) {
            return console.log(error);
          }
        })
      } else {
        console.log(ARGS + ' is already installed.');
      }
    }
  })
} else {
  console.log('invalid command');
}