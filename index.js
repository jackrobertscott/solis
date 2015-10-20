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
 *
 * @param {boolean} opts.quiet - do not log output
 * @param {string} opts.root - the root directory of project
 */
solis.serve = function serve(opts) {
  var file = path.join(opts.root || '.', 'solis.json');
  var config = (fs.statSync(file).isFile()) ? fs.readJsonSync(file) : {};
  sip.run('serve', _.defaults(opts, config, {
    quiet: false,
    root: './',
    src: './src',
    tmp: './.tmp',
    sourcemaps: false,
  }));
};

/**
 * Generate files from templates
 *
 * @param {boolean} opts.quiet - do not log output
 * @param {string} opts.dest - the output directory
 * @param {string} opts.src - the template module directory
 * @param {string} opts.module - the name of the module
 * @param {object} opts.data - data for rendering templates
 */
solis.generate = function generate(opts) {
  sip.run('generate', _.defaults(opts, {
    quiet: false,
    dest: './',
    data: {},
  }));
};
