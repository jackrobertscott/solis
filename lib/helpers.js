/* jshint node:true */
'use strict';

var path = require('path');
var wrench = require('wrench');
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
      var nodes = path.relative(src, file).split(path.sep);
      var base = nodes.pop().split('.')[0];
      return nodes.reduce(function(pre, cur, i, a) {
        pre[cur] = {};
        if (i === a.length - 1) {
          try {
            pre[cur][base] = require(file);
          } catch (e) {
            // data not loaded...
          }
          return data;
        }
        return pre[cur];
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
    '!' + path.join(src, '**/_*.' + ext),
  ];

  return globs;
};
