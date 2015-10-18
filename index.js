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

/**
 * Initialise solis object
 */
var solis = module.exports = {};

/**
 * Serve files and reload on changes
 */
solis.serve = function serve(opts) {
  sip.run('serve', opts);
};

/**
 * Generate files from templates
 */
solis.generate = function generate(opts) {
  sip.run('generate', opts);
};
