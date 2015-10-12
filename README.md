# solis

Static site server and generator with built-in preprocessing

## Sip API

Sip is very similar to gulp but provides some extra functionality.

### sip.src(glob[, options])

Returns a vinyl file stream.

* `(string/array) glob`: the glob(s) to read.
* `(object) options`: options for reading.

@see https://github.com/gulpjs/vinyl-fs

### sip.dest(folder[, options])

Pastes a vinyl stream to the given folder.

* `(string/function) folder`: the folder path to output to.
* `(object) options`: options for writing.

@see https://github.com/gulpjs/vinyl-fs

### sip.task(name[, dependencies][, function])

Register a task.

* `(string) name`: the name of the task.
* `(string/array) dependencies`: the task dependencies.
* `(function) function`: the function to execute.

Note: either the dependencies or function must be included. Both may not be omitted in the same instance.

### sip.run(tasks[, options][, callback])

Run a task or set of tasks.

* `(string/array) tasks`: tasks to run.
* `(object) options`: options for passing to task functions.
* `(function) callback`: the function to execute on callback.

### sip.watch(glob[, options][, tasks][, function])

Watch a set of files and executes tasks or a function on changes.

* `(string/array) glob`: the glob(s) to watch.
* `(object) options`: options for watching.
* `(string/array) tasks`: the task(s) to execute on change.
* `(function) function`: the function to execute.

@see https://github.com/gulpjs/glob-watcher

### sip.has(name)

Check if a task has been registered.

* `(string) name`: the task name to check.
