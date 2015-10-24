'use strict';

var path = require('path');
var template = require('gulp-template');
var rename = require('gulp-rename');
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
      '!' + path.join(opts.src, '**/*.tpl*'),
    ])
    .pipe(sip.dest(opts.dest));
});

/**
 * Copy and template files from source to destination
 * Template files are recognised by having '.tpl' any where in file name
 *
 * @param {string} opts.src - source directory
 * @param {string} opts.dest - destination directory
 * @param {object} opts.data - templating data/locals
 */
sip.task('gen:template', function(opts) {
  return sip.src([
      path.join(opts.src, '**/*.tpl*'),
    ])
    .pipe(template(opts.data))
    .pipe(rename(function(file) {
      if (file.extname === '.tpl') {
        file.extname = '';
      }
      file.basename = file.basename.replace('.tpl', '');

      return file;
    }))
    .pipe(sip.dest(opts.dest));
});
