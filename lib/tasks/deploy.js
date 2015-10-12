/* jshint node:true */
'use strict';

var sip = require('../sip');

sip.task('deploy', ['serve'], function(opts, cb) {
  console.log('deploy');
  cb();
});
