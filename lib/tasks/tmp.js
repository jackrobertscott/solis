'use strict';

var path = require('path');
var del = require('del');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var jshint = require('gulp-jshint');
var coffee = require('gulp-coffee');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var sip = require('../sip');
var helpers = require('../helpers');

sip.task('tmp', 'clean:tmp', function(opts, cb) {
  sip.run([
    'markups',
    'styles',
    'scripts',
    'other:tmp',
    'bower',
  ], opts, cb);
});

sip.task('markups', [
  'jade',
]);

sip.task('styles', [
  'css',
  'sass',
  'less',
]);

sip.task('scripts', [
  'js',
  'coffee',
]);

/**
 * Clean/remove files in serve directory
 *
 * @param {string} opts.tmp - serve directory
 */
sip.task('clean:tmp', function(opts, cb) {
  del([
      opts.tmp,
      '!' + opts.tmp, // don't delete folder itself
    ])
    .then(function(paths) {
      cb(null, paths);
    })
    .catch(function(error) {
      cb(error);
    });
});

/**
 * Inject css and js files into html files were appropriate
 *
 * @param {string} opts.tmp - serve directory
 */
sip.task('inject:tmp', 'tmp', function(opts) {
  var sources = sip.src([
    path.join(opts.tmp, '**/*.js'),
    path.join(opts.tmp, '**/*.css'),
  ], {
    read: false,
  });

  return sip.src(path.join(opts.tmp, '**/*.html'))
    .pipe(inject(sources, {
      relative: true,
    }))
    .pipe(sip.dest(opts.tmp));
});

/**
 * Move bower library files to vendor folder
 *
 * @param {string} opts.bower - whether the project support bower
 * @param {string} opts.tmp - serve directory
 */
sip.task('bower', function(opts, cb) {
  if (opts.bower) {
    return sip.src(mainBowerFiles())
      .pipe(sip.dest(path.join(opts.tmp, 'vendor')));
  } else {
    cb();
  }
});

/**
 * Copy over all files not copied by other tasks
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - serve directory
 */
sip.task('other:tmp', function(opts) {
  return sip.src([
      path.join(opts.src, '**/*'),
      '!' + path.join(opts.src, '**/_*'),
      '!' + path.join(opts.src, '**/*.{jade,css,sass,scss,less,js,coffee}'),
    ])
    .pipe(sip.dest(opts.tmp));
});

/**
 * Comile jade files
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - serve directory
 */
sip.task('jade', function(opts) {
  return sip.src(helpers.removeHidden(opts.src, 'jade'))
    .pipe(plumber(helpers.plumb))
    .pipe(jade({
      locals: helpers.getLocals(opts.src),
      pretty: true,
    }))
    .pipe(sip.dest(opts.tmp));
});

/**
 * Copy and lint js files
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - serve directory
 */
sip.task('js', function(opts) {
  return sip.src(helpers.removeHidden(opts.src, 'js'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(sip.dest(opts.tmp));
});

/**
 * Compile coffee files
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - serve directory
 * @param {boolean} opts.sourcemaps - wether to include sourcemaps
 */
sip.task('coffee', function(opts) {
  return sip.src(helpers.removeHidden(opts.src, 'coffee'))
    .pipe(plumber(helpers.plumb))
    .pipe(gulpif(!!opts.sourcemaps, sourcemaps.init()))
    .pipe(coffee())
    .pipe(gulpif(!!opts.sourcemaps, sourcemaps.write()))
    .pipe(sip.dest(opts.tmp));
});

/**
 * Copy and prefix css files
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.tmp - serve directory
 */
sip.task('css', function(opts) {
  return sip.src(helpers.removeHidden(opts.src, 'css'))
    .pipe(autoprefixer())
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
    .pipe(plumber(helpers.plumb))
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
 * @param {boolean} opts.sourcemaps - wether to include sourcemaps
 */
sip.task('less', function(opts) {
  return sip.src(helpers.removeHidden(opts.src, 'less'))
    .pipe(plumber(helpers.plumb))
    .pipe(gulpif(!!opts.sourcemaps, sourcemaps.init()))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(!!opts.sourcemaps, sourcemaps.write()))
    .pipe(sip.dest(opts.tmp));
});
