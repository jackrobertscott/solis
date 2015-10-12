/* jshint node:true */
'use strict';

var sip = require('../sip');
var path = require('path');

sip.task('serve', ['compile'], function(opts) {
  console.log('serve');
  return sip.src('*.example').pipe(sip.dest(opts.output || 'output'));
});
