/* jshint node:true */
'use strict';

var chalk = require('chalk');
var vfs = require('vinyl-fs');
var watch = require('glob-watcher');
var async = require('async');

function Sip() {
  this.tasks = {};
}

/**
 * Add external library functions.
 */
Sip.prototype.src = vfs.src;
Sip.prototype.dest = vfs.dest;
Sip.prototype.watch = watch;

/**
 * Task adder.
 */
Sip.prototype.add = function add(name, deps, fn) {
  if (typeof name !== 'string') {
    return error('(string) name not passed to sip.add()');
  }
  if (typeof deps === 'function') {
    fn = deps;
    deps = null;
  } else if (!Array.isArray(deps)) {
    return error('(array) dependencies incorrectly passed to sip.add()');
  }
  if (typeof fn !== 'function') {
    return error('(function) task function incorrectly passed to sip.add()');
  }

  this.tasks[name] = {
    deps: deps,
    fn: fn,
  };
};

/**
 * Task runner.
 */
Sip.prototype.run = function run(name, opts) {
  var tree = {};

  async.series([
    function(cb) {
      this._auto(name, opts, tree, cb);
    }.bind(this),
    function(cb) {
      async.auto(tree, cb);
    }
  ]);
};

/**
 * Build depedency tree.
 */
Sip.prototype._auto = function _auto(name, opts, tree, done) {
  if (!this.tasks.hasOwnProperty(name)) {
    return error('(string) task passed to run() does not exist');
  }

  tree[name] = (this.tasks[name].deps || []).concat([function(cb, res) {
    // TODO check emit 'end' event for cb
    // 'res' contains the callback results from dependent functions
    this.tasks[name].fn(cb, opts, res);
  }.bind(this)]);

  async.each(this.tasks[name].deps, function(dep, cb) {
    if (!tree.hasOwnProperty(dep)) {
      this._auto(dep, opts, tree, cb);
    }
  }.bind(this), done);
};

/**
 * Check if task exists.
 */
Sip.prototype.has = function has(name) {
  return this.tasks.hasOwnProperty(name);
};

/**
 * Export instance of Sip.
 */
module.exports = new Sip();

/**
 * Log error messages.
 */
function error(message) {
  if (typeof message !== 'string') {
    return console.log(chalk.red('error:'), '(string) message must be passed to error()');
  }
  console.log(chalk.red('error:'), message);
}
