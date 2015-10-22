'use strict';

var path = require('path');
var del = require('del');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var minifyHTML = require('gulp-minify-html');
var sip = require('../sip');

sip.task('compile', ['tmp', 'dist:clean'], function(opts, cb) {
  sip.run([
    'dist:compile',
  ], opts, cb);
});

sip.task('dist:compile', [
  'dist:js',
  'dist:js:vendor',
  'dist:css',
  'dist:css:vendor',
  'dist:html',
  'dist:other',
], function(opts, cb) {
  sip.run([
    'dist:inject',
  ], opts, cb);
});

/**
 * Clean/remove files in distribution directory
 *
 * @param {string} opts.dist - distribution directory
 */
sip.task('dist:clean', function(opts, cb) {
  del([
      path.join(opts.dist, '**'),
      '!' + opts.dist, // don't delete folder itself
    ])
    .then(function(paths) {
      cb(null, paths);
    })
    .catch(function(error) {
      cb(error);
    });
});

/**
 * Inject css and js files into html files
 *
 * @param {string} opts.dist - distribution directory
 */
sip.task('dist:inject', function(opts) {
  var sources = sip.src([
    path.join(opts.dist, '**/*.js'),
    '!' + path.join(opts.dist, 'vendor/*.js'),
    path.join(opts.dist, '**/*.css'),
    '!' + path.join(opts.dist, 'vendor/*.css'),
  ], {
    read: false,
  });
  var vendor = sip.src([
    path.join(opts.dist, 'vendor/*.js'),
    path.join(opts.dist, 'vendor/*.css'),
  ], {
    read: false,
  });

  return sip.src(path.join(opts.tmp, '**/*.html'))
    .pipe(inject(sources, {
      relative: true,
    }))
    .pipe(inject(vendor, {
      relative: true,
      name: 'bower',
    }))
    .pipe(sip.dest(opts.tmp));
});

/**
 * Copy and lint js files
 *
 * @param {string} opts.tmp - serve directory
 * @param {string} opts.dist - distribution directory
 */
sip.task('dist:js', function(opts) {
  return sip.src([
      path.join(opts.tmp, '**/*.js'),
      '!' + path.join(opts.tmp, 'vendor/*.js'),
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(sip.dest(opts.dist));
});

/**
 * Copy and lint vendor js files
 *
 * @param {string} opts.tmp - serve directory
 * @param {string} opts.dist - distribution directory
 */
sip.task('dist:js:vendor', function(opts) {
  return sip.src(path.join(opts.tmp, 'vendor/*.js'))
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(sip.dest(path.join(opts.dist, 'vendor')));
});

/**
 * Copy and prefix css files
 *
 * @param {string} opts.tmp - serve directory
 * @param {string} opts.dist - distribution directory
 */
sip.task('dist:css', function(opts) {
  return sip.src([
      path.join(opts.tmp, '**/*.css'),
      '!' + path.join(opts.tmp, 'vendor/*.css'),
    ])
    .pipe(concat('styles.min.css'))
    .pipe(csso())
    .pipe(sip.dest(opts.dist));
});

/**
 * Copy and lint vendor js files
 *
 * @param {string} opts.tmp - serve directory
 * @param {string} opts.dist - distribution directory
 */
sip.task('dist:css:vendor', function(opts) {
  return sip.src(path.join(opts.tmp, 'vendor/*.css'))
    .pipe(concat('vendor.min.css'))
    .pipe(csso())
    .pipe(sip.dest(path.join(opts.dist, 'vendor')));
});

/**
 * Simple copy html files
 *
 * @param {string} opts.tmp - serve directory
 * @param {string} opts.dist - distribution directory
 */
sip.task('dist:html', function(opts) {
  return sip.src(path.join(opts.tmp, '**/*.html'))
    .pipe(minifyHTML({
      comments: true, // don't delete comments (for gulp-inject)
    }))
    .pipe(sip.dest(opts.dist));
});

/**
 * Copy over all files not copied by other tasks
 *
 * @param {string} opts.tmp - serve directory
 * @param {string} opts.dist - distribution directory
 */
sip.task('dist:other', function(opts) {
  return sip.src([
      path.join(opts.tmp, '**/*'),
      '!' + path.join(opts.tmp, '**/*.{js,css,html}'),
    ])
    .pipe(sip.dest(opts.dist));
});
