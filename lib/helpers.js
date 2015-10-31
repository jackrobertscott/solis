'use strict';

var path = require('path');
var fs = require('fs-extra');
var wrench = require('wrench');
var gutil = require('gulp-util');
var _ = require('lodash');
var jade = require('jade');
var marked = require('marked');
var helpers = module.exports = {};

/**
 * Generate data object formatted with data from json files
 *
 * @param {string} src - source directory
 * @return {object} locals - locals data object
 */
helpers.locals = function locals(src) {
  var data = {
    base: this._jsonData(src),
    partial: this._partial(data, src),
  };

  return data;
};

/**
 * Generate data object formatted with data from json files
 *
 * @param {string} src - source directory
 * @return {object} locals - locals data object
 */
helpers._jsonData = function _jsonData(src) {
  return wrench.readdirSyncRecursive(src)
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
};

/**
 * Render partial for markups
 *
 * @param {string} src - source directory
 * @param {object} locals - locals data object
 * @return {string} rendered data
 */
helpers._partial = function _partial(locals, src) {
  return function(filename, options) {
    filename = path.join(src, filename);
    switch (path.extname(filename)) {
      case '.jade':
        options = _.assign(locals, options) || locals;
        return jade.renderFile(filename, options);
      case '.md':
        return marked(fs.readFileSync(filename, 'utf8'));
      default:
        throw new Error('partial file format not supported');
    }
  };
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
 * @param {string} opts.dist - build directory
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

    // serve/build
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
