'use strict';

var fs = require('fs-extra');
var path = require('path');
var requireDir = require('require-dir');
var sip = require('./lib/sip');
var helpers = require('./lib/helpers');
var solis = module.exports = {};

/**
 * Load the task files.
 */
requireDir(path.join(__dirname, 'lib/tasks'), {
  recurse: true
});

/**
 * Serve files and reload on changes
 *
 * @param {boolean} opts.quiet - do not log output
 * @param {string} opts.root - the root directory of project
 */
solis.serve = function serve(opts) {
  sip.run('serve', helpers.configure(opts));
};

/**
 * Compile files into distribution format
 *
 * @param {boolean} opts.quiet - do not log output
 * @param {string} opts.root - the root directory of project
 * @param {boolean} opts.serve - serve compiled code
 */
solis.build = function build(opts) {
  sip.run('dist', helpers.configure(opts));
};

/**
 * Deploy files to github pages
 *
 * @param {boolean} opts.quiet - do not log output
 * @param {string} opts.root - the root directory of project
 * @param {string} opts.cname - cname for deploy
 * @param {boolean} opts.build - build before deploy
 */
solis.deploy = function deploy(opts) {
  sip.run('deploy', helpers.configure(opts));
};

/**
 * Generate files from templates
 *
 * @param {boolean} opts.quiet - do not log output
 * @param {string} opts.dest - the output directory
 * @param {string} opts.src - the template module directory
 * @param {object} opts.data - data for rendering templates
 */
solis.generate = function generate(opts) {
  sip.run('generate', helpers.configure(opts));
};
