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
 * @param {string} opts.cname - will create CNAME file with cname if exists
 */
sip.task('deploy', 'dist', function(opts) {
  return sip.src(path.join(opts.dist, '**/*'))
    .pipe(gulpif(!!opts.cname, file.bind(null, 'CNAME', opts.cname)))
    .pipe(ghPages());
});
