/* jshint node:true */
'use strict';

var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var sip = require('./lib/sip');
var solis = module.exports = {};

/**
 * Load the task files.
 */
var tdir = path.join(__dirname, 'lib/tasks');
fs.readdirSync(tdir)
  .forEach(function(file) {
    require(path.join(tdir, file));
  });

/**
 * Serve files and reload on changes
 */
solis.serve = function serve(opts) {
  sip.run('serve', _.defaults(opts, {
    src: path.join(process.cwd(), 'src'),
    tmp: path.join(process.cwd(), '.tmp'),
    quiet: false,
    sourcemaps: false,
  }));
};

/**
 * Generate files from templates
 */
solis.generate = function generate(opts) {
  sip.run('generate', _.defaults(opts, {
    quiet: false,
  }));
};
