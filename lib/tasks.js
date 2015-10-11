/* jshint node:true */
'use strict';

var util = require('util');
var Orchestrator = require('orchestrator');
var vfs = require('vinyl-fs');
var watch = require('glob-watcher');

function Tasks() {
  Orchestrator.call(this);
}
util.inherits(Tasks, Orchestrator);

/**
 * Add functions from external modules.
 */
Tasks.prototype.src = vfs.src;
Tasks.prototype.dest = vfs.dest;
Tasks.prototype.watch = watch;

module.exports = new Tasks();
