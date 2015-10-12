/* jshint node:true */
'use strict';

var sip = require('../sip');
var path = require('path');

sip.task('serve', function(cb, opts) {
  console.log(opts);
  // code...
  sip.watch(path.join(__dirname, '../**/*'), ['deploy'], function() {
    console.log('hey');
  });
  cb();
});
