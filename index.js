/* jshint node:true */
'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var sip = require('./lib/sip');

/**
 * Load the task files.
 */
var tdir = path.join(__dirname, 'lib/tasks');
fs.readdirSync(tdir)
  .forEach(function(file) {
    require(path.join(tdir, file));
  });

module.exports = sip;
