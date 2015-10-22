'use strict';

var vfs = require('vinyl-fs');
var watcher = require('glob-watcher');
var gutil = require('gulp-util');
var pretty = require('pretty-time');
var async = require('async');

/**
 * Sip constructor.
 */
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
Sip.prototype.watch = function watch(glob, opts, deps, fn) {
  var _this = this;

  if (typeof glob !== 'string') {
    throw new TypeError(_this._formatTypeError('glob', 'string', 'sip.watch'));
  }
  if (typeof opts === 'string' || Array.isArray(opts)) {
    return _this.watch(glob, null, opts, deps);
  } else if (typeof opts === 'function') {
    return _this.watch(glob, null, null, opts);
  } else if (opts && typeof opts !== 'object') {
    throw new TypeError(_this._formatTypeError('options', 'object', 'sip.watch'));
  }
  if (typeof deps === 'function') {
    return _this.watch(glob, opts, null, deps);
  } else if (deps && typeof deps !== 'string' && !Array.isArray(deps)) {
    throw new TypeError(_this._formatTypeError('dependencies', 'string/array', 'sip.watch'));
  }
  if (fn && typeof fn !== 'function') {
    throw new TypeError(_this._formatTypeError('function', 'function', 'sip.watch'));
  }
  if (!deps && !fn) {
    throw new Error('either dependencies or function must be passed to sip.watch()');
  }

  // call glob watcher
  return watcher(glob, opts || {}, function() {
    if (deps && fn) {
      async.series([
        function(cb) {
          _this.run.call(_this, deps, cb);
        },
        function(cb) {
          fn();
          cb();
        }
      ]);
    } else if (deps) {
      _this.run.call(_this, deps);
    } else {
      fn();
    }
  });
};

/**
 * Task adder.
 */
Sip.prototype.task = function task(name, deps, fn) {
  var _this = this;

  if (typeof name !== 'string') {
    throw new TypeError(_this._formatTypeError('name', 'string', 'sip.task'));
  }
  if (typeof deps === 'function') {
    return _this.task(name, null, deps);
  } else if (typeof deps === 'string') {
    deps = [deps];
  } else if (deps && !Array.isArray(deps)) {
    throw new TypeError(_this._formatTypeError('dependencies', 'array', 'sip.task'));
  }
  if (fn && typeof fn !== 'function') {
    throw new TypeError(_this._formatTypeError('function', 'function', 'sip.task'));
  }
  if (!deps && !fn) {
    throw new Error('either dependencies or function must be passed to sip.task()');
  }

  // add the new task
  _this.tasks[name] = {
    deps: deps,
    fn: fn,
  };
};

/**
 * Task runner.
 */
Sip.prototype.run = function run(tasks, opts, runCb) {
  var _this = this;

  if (typeof tasks === 'string') {
    tasks = [tasks];
  } else if (!Array.isArray(tasks)) {
    throw new TypeError(_this._formatTypeError('tasks', 'string/array', 'sip.run'));
  }
  if (typeof opts === 'function') {
    return _this.run(tasks, null, opts);
  } else if (typeof opts === 'object' && opts === null) {
    _this.options = opts;
  } else if (opts) {
    throw new TypeError(_this._formatTypeError('options', 'object', 'sip.run'));
  }
  if (runCb && typeof runCb !== 'function') {
    throw new TypeError(_this._formatTypeError('callback', 'function', 'sip.run'));
  }
  var tree = {};

  // build tree then run tasks
  async.series([
    function(cb) {
      _this._auto.call(_this, tasks, tree, cb);
    },
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
  var _this = this;

  if (typeof tasks === 'string') {
    tasks = [tasks];
  } else if (!Array.isArray(tasks)) {
    throw new TypeError(_this._formatTypeError('tasks', 'string/array', 'sip._auto'));
  }

  async.parallel(tasks.map(function(name) {
    return function(taskCb) {
      if (!_this.tasks.hasOwnProperty(name)) {
        throw new Error('task: ' + name + ' passed to sip._auto() does not exist');
      }

      tree[name] = (_this.tasks[name].deps || []).concat([function(treeCb) {
        var start = process.hrtime();
        if (!_this.options.quiet) {
          gutil.log('Starting', '\'' + gutil.colors.cyan(name) + '\'...');
        }
        var cb = function() {
          var time = process.hrtime(start);
          if (!_this.options.quiet) {
            gutil.log('Finished', '\'' + gutil.colors.cyan(name) + '\' after', gutil.colors.magenta(pretty(time)));
          }
          treeCb();
        };
        if (_this.tasks[name].fn) {
          var stream = _this.tasks[name].fn(_this.options, cb);
          if (stream && typeof stream.pipe === 'function') {
            stream.on('finish', cb);
          }
        } else {
          cb();
        }
      }]);

      async.each(_this.tasks[name].deps, function(dep, eachCb) {
        if (!tree.hasOwnProperty(dep)) {
          _this._auto(dep, tree, eachCb);
        }
      }, taskCb);
    };
  }), _autoCb);
};

/**
 * Check if task exists.
 */
Sip.prototype.has = function has(name) {
  var _this = this;

  if (typeof name !== 'string') {
    throw new TypeError(_this._formatTypeError('name', 'string', 'sip.has'));
  }

  return _this.tasks.hasOwnProperty(name);
};

/**
 * Format type error message.
 */
Sip.prototype._formatTypeError = function _formatTypeError(param, type, fname) {
  var _this = this;

  if (typeof param !== 'string') {
    throw new TypeError(_this._formatTypeError('param', 'string', 'sip._formatTypeError'));
  }
  type = (typeof type === 'string') ? type : 'unknown';
  fname = (typeof fname === 'string') ? fname + '()' : '[no function passed]';

  return '(' + type + ') ' + param + ' incorrectly passed to ' + fname;
};

/**
 * Provide access to class itself.
 */
Sip.prototype.Sip = Sip;

/**
 * Export instance of Sip.
 */
module.exports = new Sip();
