'use strict';

var path = require('path');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sip = require('../sip');

sip.task('serve', 'browser-sync', function(opts, cb) {
  sip.run([
    'watch:markups',
    'watch:styles',
    'watch:scripts',
  ], opts, cb);
});

/**
 * Initialise Browser Sync
 *
 * @param {string} opts.tmp - serve directory
 */
sip.task('browser-sync', 'tmp', function(opts, cb) {
  browserSync.init({
    server: opts.tmp,
  }, cb);
});

sip.task('watch:markups', function(opts, cb) {
  sip.watch(path.join(opts.src, '**/*.jade'), ['jade'], reload);
  cb();
});

sip.task('watch:styles', function(opts, cb) {
  sip.watch(path.join(opts.src, '**/*.{css,sass,scss,less}'), ['css', 'sass', 'less'], reload);
  cb();
});

sip.task('watch:scripts', function(opts, cb) {
  sip.watch(path.join(opts.src, '**/*.{js,coffee}'), ['js', 'coffee'], reload);
  cb();
});
