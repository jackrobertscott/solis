/* jshint node:true */
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
  'watch:jade',
  'watch:sass',
  'watch:less',
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

sip.task('watch:jade', function(opts, cb) {
  sip.watch(path.join(opts.src, '**', '*.jade'), ['jade'], reload);
  cb();
});

sip.task('watch:sass', function(opts, cb) {
  sip.watch(path.join(opts.src, '**', '*.{sass,scss}'), ['sass'], reload);
  cb();
});

sip.task('watch:less', function(opts, cb) {
  sip.watch(path.join(opts.src, '**', '*.less'), ['less'], reload);
  cb();
});
