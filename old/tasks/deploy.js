'use strict';

var path = require('path');
var gulpif = require('gulp-if');
var file = require('gulp-file');
var ghPages = require('gulp-gh-pages');
var sip = require('../sip');

/**
 * Deploy code to github pages
 *
 * @param {string} opts.dist - compiled directory
 * @param {boolean} opts.build - build the code before deploy
 * @param {string} opts.cname - will create CNAME file with cname if exists
 */
sip.task('deploy', function(opts, cb) {
  if (opts.build) {
    sip.run('dist', function() {
      sip.run('gh-pages', cb);
    });
  } else {
    sip.run('gh-pages', cb);
  }
});

/**
 * Deploy code to github pages
 *
 * @param {string} opts.dist - compiled directory
 * @param {string} opts.cname - will create CNAME file with cname if exists
 */
sip.task('gh-pages', function(opts) {
  return sip.src(path.join(opts.dist, '**/*'))
    .pipe(gulpif(!!opts.cname, file.bind(null, 'CNAME', opts.cname)))
    .pipe(ghPages());
});