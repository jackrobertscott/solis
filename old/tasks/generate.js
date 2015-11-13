'use strict';

var path = require('path');
var template = require('gulp-template');
var rename = require('gulp-rename');
var _ = require('lodash');
var sip = require('../sip');

sip.task('generate', [
  'gen:copy',
  'gen:template',
]);

/**
 * Copy non-template files from source to destination
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.dest - destination directory
 */
sip.task('gen:copy', function(opts) {
  return sip.src([
      path.join(opts.src, '**/*'),
      '!' + path.join(opts.src, '**/#*'),
      '!' + path.join(opts.src, 'generate.json'),
    ])
    .pipe(rename(function(file) {
      file.dirname = _.template(file.dirname)(opts.data);
      file.basename = _.template(file.basename)(opts.data);
      file.extname = _.template(file.extname)(opts.data);

      return file;
    }))
    .pipe(sip.dest(opts.dest));
});

/**
 * Copy and template files from source to destination
 * Template files are recognised by having '#' at start of file name
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.dest - destination directory
 * @param {object} opts.data - templating data/locals
 */
sip.task('gen:template', function(opts) {
  return sip.src([
      path.join(opts.src, '**/#*'),
      '!' + path.join(opts.src, 'generate.json'),
    ])
    .pipe(template(opts.data))
    .pipe(rename(function(file) {
      file.dirname = _.template(file.dirname)(opts.data);
      file.basename = _.template(file.basename.slice(1))(opts.data);
      file.extname = _.template(file.extname)(opts.data);

      return file;
    }))
    .pipe(sip.dest(opts.dest));
});
