/* jshint node:true */
'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var tasks = require('./lib/tasks');
var tdir = path.join(__dirname, 'lib/tasks');

fs.readdirSync(tdir)
  .forEach(function(file) {
    require(path.join(tdir, file));
  });

module.exports = {
  log: log,
  has: has,
  run: run,
};

/**
 * Log task information as they run.
 */
function log() {
  tasks.on('task_start', function(e) {
    console.log(chalk.cyan('started:'), e.task);
  });
  tasks.on('task_start', function(e) {
    console.log(chalk.cyan('finised:'), e.task);
  });
}

/**
 * Check if a task exists.
 */
function has(name) {
  return tasks.hasTask(name);
}

/**
 * Run a task.
 */
function run(name) {
  tasks.start(name);
}
