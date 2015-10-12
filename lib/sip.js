/* jshint node:true */
'use strict';

var chalk = require('chalk');
var vfs = require('vinyl-fs');
var watcher = require('glob-watcher');
var async = require('async');

function Sip() {
  this.tasks = {};
}

/**
 * Add external library functions.
 */
Sip.prototype.src = vfs.src;
Sip.prototype.dest = vfs.dest;

/**
 * Watch glob and execute function with dependencies on change
 */
Sip.prototype.watch = function watch(glob, opts, tasks, fn) {
  if (typeof glob !== 'string') {
    throw new TypeError(this._formatTypeError('glob', 'string', 'sip.watch'));
  }
  if (typeof opts === 'string' || Array.isArray(opts)) {
    fn = tasks;
    tasks = opts;
    opts = null;
  } else if (typeof opts === 'function') {
    fn = opts;
    tasks = null;
    opts = null;
  } else if (opts && typeof opts !== 'object') {
    throw new TypeError(this._formatTypeError('options', 'object', 'sip.watch'));
  }
  if (typeof tasks === 'function') {
    fn = tasks;
    tasks = null;
  } else if (tasks && typeof tasks !== 'string' && !Array.isArray(tasks)) {
    throw new TypeError(this._formatTypeError('tasks', 'string/array', 'sip.watch'));
  }
  if (fn && typeof fn !== 'function') {
    throw new TypeError(this._formatTypeError('function', 'function', 'sip.watch'));
  }
  if (!tasks && !fn) {
    throw new Error('either tasks or function must be passed to sip.watch()');
  }

  // call glob watcher
  watcher(glob, opts || {}, function() {
    if (tasks && fn) {
      async.series([
        function(cb) {
          this.run.call(this, tasks, cb);
        }.bind(this),
        function(cb) {
          fn();
          cb();
        }
      ]);
    } else if (tasks) {
      this.run.call(this, tasks);
    } else {
      fn();
    }
  }.bind(this));
};

/**
 * Task adder.
 */
Sip.prototype.task = function task(name, deps, fn) {
  if (typeof name !== 'string') {
    throw new TypeError(this._formatTypeError('name', 'string', 'sip.task'));
  }
  if (typeof deps === 'function') {
    fn = deps;
    deps = null;
  } else if (typeof deps === 'string') {
    deps = [deps];
  } else if (deps && !Array.isArray(deps)) {
    throw new TypeError(this._formatTypeError('dependencies', 'array', 'sip.task'));
  }
  if (fn && typeof fn !== 'function') {
    throw new TypeError(this._formatTypeError('function', 'function', 'sip.task'));
  }
  if (!deps && !fn) {
    throw new Error('either dependencies or function must be passed to sip.task()');
  }

  // add the new task
  this.tasks[name] = {
    deps: deps,
    fn: fn,
  };
};

/**
 * Task runner.
 */
Sip.prototype.run = function run(tasks, opts, runCb) {
  if (typeof opts === 'object') {
    this.options = opts;
  } else if (typeof opts === 'function') {
    runCb = opts;
  }
  var tree = {};

  // build tree then run tasks
  async.series([
    function(cb) {
      this._auto.call(this, tasks, tree, cb);
    }.bind(this),
    function(cb) {
      // run tree
      async.auto(tree, cb);
    }
  ], runCb || function() {});
};

/**
 * Build depedency tree.
 */
Sip.prototype._auto = function _auto(tasks, tree, _autoCb) {
  if (typeof tasks === 'string') {
    tasks = [tasks];
  } else if (!Array.isArray(tasks)) {
    throw new Error('(string/array) tasks incorrectly passed to sip._auto()');
  }

  async.parallel(tasks.map(function(name) {
    return function(taskCb) {
      if (!this.tasks.hasOwnProperty(name)) {
        throw new Error('task: ' + name + ' passed to sip._auto() does not exist');
      }

      tree[name] = (this.tasks[name].deps || []).concat([function(cb, res) {
        // TODO check emit 'end' event for cb
        // 'res' contains the callback results from dependent functions
        if (this.tasks[name].fn) {
          this.tasks[name].fn(cb, this.options, res);
        } else {
          cb();
        }
      }.bind(this)]);

      async.each(this.tasks[name].deps, function(dep, eachCb) {
        if (!tree.hasOwnProperty(dep)) {
          this._auto(dep, tree, eachCb);
        }
      }.bind(this), taskCb);
    }.bind(this);
  }.bind(this)), _autoCb);
};

/**
 * Check if task exists.
 */
Sip.prototype.has = function has(name) {
  if (typeof name !== 'string') {
    throw new TypeError(this._formatTypeError('name', 'string', 'sip.has'));
  }

  return this.tasks.hasOwnProperty(name);
};

/**
 * Format type error message.
 */
Sip.prototype._formatTypeError = function _formatTypeError(param, type, fname) {
  return '(' + type + ') ' + param + ' incorrectly passed to ' + fname + '()';
};

/**
 * Export instance of Sip.
 */
module.exports = new Sip();
