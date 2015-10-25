'use strict';

var path = require('path');
var fs = require('fs-extra');
var wrench = require('wrench');
var gutil = require('gulp-util');
var _ = require('lodash');
var helpers = module.exports = {};

/**
 * Generate data object formatted with data from json files
 *
 * @param {string} src - source directory
 * @return {object} locals - locals data object
 */
helpers.getLocals = function getLocals(src) {
  var locals = wrench.readdirSyncRecursive(src)
    .filter(function(file) {
      return /\.json$/i.test(file);
    })
    .reduce(function(data, file) {
      var nodes = file.split(path.sep);
      nodes.push(nodes.pop().split('.')[0]);
      return nodes.reduce(function(pre, cur, i, a) {
        if (i === a.length - 1) {
          try {
            pre[cur] = fs.readJsonSync(path.join(src, file));
          } catch (e) {
            gutil.log('Failed to load', gutil.colors.cyan(path.join(src, file)), ' to locals');
          }
          return data;
        } else {
          pre[cur] = pre[cur] || {};
          return pre[cur];
        }
      }, data);
    }, {});

  return locals;
};

/**
 * Create a array of globs ignoring files prefixed with '_'
 *
 * @param {string} src - source directory
 * @param {string} ext - file extension
 * @return {array} globs - array of globs
 */
helpers.removeHidden = function removeHidden(src, ext) {
  var globs = [
    path.join(src, '**/*.' + ext),
    '!' + path.join(src, '**/_*{/**,}'),
  ];

  return globs;
};

/**
 * Handle gulp-plumber errors
 *
 * @param {error} error - gulp-plumber error
 */
helpers.plumb = function plumb(error) {
  gutil.beep();
  gutil.log(error);
  this.emit('end'); // need this
};

/**
 * Load solis file and set config values
 *
 * @param {boolean} opts.quiet - not log output
 * @param {boolean} opts.sourcemaps - write source maps
 * @param {string} opts.root - root directory of project
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - temporary server directory
 * @param {string} opts.dist - compile directory
 * @param {string} opts.data - data for generator templating
 * @param {string} opts.dest - output directory of generator
 * @param {string} opts.ignore - tasks to ignore
 */
helpers.configure = function configure(opts) {
  var root = opts.root || '.';
  var config;
  try {
    config = fs.readJsonSync(path.join(opts.root || '.', 'solis.json'));
  } catch (e) {
    gutil.log('Failed to load', gutil.colors.cyan(path.join(opts.root || '.', 'solis.json')), ' file');
    config = {};
  }

  return _.defaults(opts, config, {
    // general
    quiet: false,
    sourcemaps: false,

    // serve/compile
    src: path.join(root, 'src'),
    tmp: path.join(root, '.tmp'),
    dist: path.join(root, 'dist'),

    // generating
    data: {},
    dest: root,

    // tasks
    ignore: {},
  });
};
