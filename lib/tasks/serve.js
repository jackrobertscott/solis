'use strict';

var path = require('path');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sip = require('../sip');

sip.task('serve', [
  'tmp',
  'browser-sync',
  'watch',
]);

sip.task('watch', [
  'watch:markups',
  'watch:styles',
]);

/**
 * Initialise Browser Sync
 *
 * @param {string} opts.tmp - serve directory
 */
sip.task('browser-sync', function(opts, cb) {
  browserSync.init({
    server: opts.tmp,
  }, cb);
});

sip.task('watch:markups', function(opts, cb) {
  sip.watch(path.join(opts.src, '**/*.jade'), ['jade'], reload);
  cb();
});

sip.task('watch:styles', function(opts, cb) {
  sip.watch(path.join(opts.src, '**/*.{sass,scss,less}'), ['sass', 'less'], reload);
  cb();
});
