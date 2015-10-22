'use strict';

var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var sip = require('../sip');
var helpers = require('../helpers');

sip.task('tmp', [
  'jade',
  'sass',
  'less',
]);

/**
 * Comile jade files
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - serve directory
 */
sip.task('jade', function(opts) {
  return sip.src(helpers.removeHidden(opts.src, 'jade'))
    .pipe(jade({
      locals: helpers.getLocals(opts.src),
      pretty: true,
    }))
    .pipe(sip.dest(opts.tmp));
});

/**
 * Compile sass files
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - serve directory
 * @param {boolean} opts.sourcemaps - wether to include sourcemaps
 */
sip.task('sass', function(opts) {
  return sip.src(helpers.removeHidden(opts.src, '{sass,scss}'))
    .pipe(plumber(function(error) {
      gutil.beep();
      gutil.log(error);
      this.emit('end'); // need this
    }))
    .pipe(gulpif(!!opts.sourcemaps, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpif(!!opts.sourcemaps, sourcemaps.write()))
    .pipe(sip.dest(opts.tmp));
});

/**
 * Compile less files
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - serve directory
 */
sip.task('less', function(opts) {
  return sip.src(helpers.removeHidden(opts.src, 'less'))
    .pipe(plumber(function(error) {
      gutil.beep();
      gutil.log(error);
      this.emit('end'); // need this
    }))
    .pipe(gulpif(!!opts.sourcemaps, sourcemaps.init()))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(!!opts.sourcemaps, sourcemaps.write()))
    .pipe(sip.dest(opts.tmp));
});
