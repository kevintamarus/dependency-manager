#!/usr/bin/env node

var fs = require('fs');
var ARGS = process.argv.slice(2);

if(ARGS.length) {
  var package = ARGS[0];
  fs.readFile('packages.json', 'utf8', function readFileCallback(error, installedList) {
    if(error) {
      console.log(error);
    } else {
      installedList = JSON.parse(installedList);
      //if not installed, console.log message
      if(!installedList[package]) {
        console.log(package + ' is not installed');
      } 
      //if it's an implicitly installed package, leave it alone
      else if(installedList[package].type === 'implicit') {
        console.log(package + ' is still needed as a dependency for other installed packages');
      }
      //checks requirements, if required by another dependency, leave it alone
      else if(Object.getOwnPropertyNames(installedList[package].requiredBy).length > 1 || (Object.getOwnPropertyNames(installedList[package].requiredBy).length > 1 && !installedList[package].requiredBy[initial])) {
        console.log(package + ' is still needed as a dependency for other installed packages');
      }
      //uninstall package and dependencies
      else {
        fs.readFile('dependencies.json', 'utf8', function readFileCallback(error, requirements) {
          if(error) {
            console.log(error);
          } else {
            requirements = JSON.parse(requirements);
            var dependenciesToRemove = [package];
            //recursion to check dependencies
            function checkRequirements(dependency) {
              if(installedList[dependency]) {
                if(installedList[dependency].type === 'implicit' && Object.getOwnPropertyNames(installedList[dependency].requiredBy).length <= 1) {
                  dependenciesToRemove.push(dependency);
                }
                if(requirements[dependency]) {
                  requirements[dependency].forEach(function(x) {
                    checkRequirements(x);
                  })
                }
              }
            }
            checkRequirements(package);
            dependenciesToRemove.forEach(function(dependency) {
              console.log('Removing ' + dependency);
              delete installedList[dependency];
            })
            fs.writeFile('packages.json', JSON.stringify(installedList, null, 2), 'utf8', function(error) {
              if(error) {
                return console.log(error);
              }
            })
          }
        })
      }
    }
  })
} else {
  console.log('invalid command');
}