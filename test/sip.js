var assert = require('chai').assert;
var sip = require('../lib/sip');

function taskFn(opts, cb) {
  cb();
}

function cbFn(cb) {
  cb();
}

describe('sip', function() {
  describe('#task()', function() {
    // seperate sipInst variable to prevent access by different describes
    var sipInst;
    beforeEach(function() {
      sipInst = new sip.Sip();
    });
    it('should throw a type error when task name not present', function() {
      assert.throw(sipInst.task.bind(sipInst, null), TypeError);
    });
    it('should throw a type error when task name of wrong type', function() {
      assert.throw(sipInst.task.bind(sipInst, {}), TypeError);
    });
    it('should throw a error when task dependencies and function not present', function() {
      assert.throw(sipInst.task.bind(sipInst, 'example', null, null), Error);
    });
    it('should throw a type error when wrong param types present', function() {
      assert.throw(sipInst.task.bind(sipInst, 'example', {}, {}), TypeError);
      assert.throw(sipInst.task.bind(sipInst, 'example', {}, null), TypeError);
      assert.throw(sipInst.task.bind(sipInst, 'example', null, {}), TypeError);
    });
    it('should not throw an error when task function present', function() {
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', taskFn));
    });
    it('should not throw an error when task dependencies present', function() {
      sipInst.task('depedency', taskFn);
      // test string
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', 'depedency'));
      // test array
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', ['depedency']));
    });
    it('should not throw an error when task dependencies and function present', function() {
      sipInst.task('depedency', taskFn);
      // test string
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', 'depedency', taskFn));
      // test array
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', ['depedency'], taskFn));
    });
  });

  describe('#has()', function() {
    // seperate sipInst variable to prevent access by different describes
    var sipInst;
    before(function() {
      sipInst = new sip.Sip();
      sipInst.task('task', taskFn);
    });
    it('should throw a type error when task name not present', function() {
      assert.throw(sipInst.has.bind(sipInst, null), TypeError);
    });
    it('should throw a type error when task name of wrong type', function() {
      assert.throw(sipInst.has.bind(sipInst, {}), TypeError);
      assert.throw(sipInst.has.bind(sipInst, 10), TypeError);
      assert.throw(sipInst.has.bind(sipInst, function() {}), TypeError);
    });
    it('should be true when check tasks that exists', function() {
      assert.ok(sipInst.has('task'));
    });
    it('should be false when check tasks that does not exists', function() {
      assert.notOk(sipInst.has('random'));
    });
  });

  describe('#run()', function() {
    // seperate sipInst variable to prevent access by different describes
    var sipInst;
    before(function() {
      sipInst = new sip.Sip();
      sipInst.task('task', taskFn);
    });
    it('should throw a type error when tasks not present', function() {
      assert.throw(sipInst.run.bind(sipInst, null), TypeError);
    });
    it('should throw a type error when tasks of wrong type', function() {
      assert.throw(sipInst.run.bind(sipInst, {}), TypeError);
      assert.throw(sipInst.run.bind(sipInst, 10), TypeError);
    });
    it('should not throw an error when tasks present', function() {
      // test string
      assert.doesNotThrow(sipInst.run.bind(sipInst, 'task'));
      // test array
      assert.doesNotThrow(sipInst.run.bind(sipInst, ['task']));
    });
    it('should throw a type error when options of wrong type', function() {
      // should an array be a recognised object?
      assert.throw(sipInst.run.bind(sipInst, 'task', 10), TypeError);
    });
    it('should not throw an error when options present', function() {
      assert.doesNotThrow(sipInst.run.bind(sipInst, 'task', {}));
    });
    it('should throw a type error when callback of wrong type', function() {
      assert.throw(sipInst.run.bind(sipInst, 'task', null, {}), TypeError);
      assert.throw(sipInst.run.bind(sipInst, 'task', null, 10), TypeError);
    });
    it('should not throw an error when callback present', function() {
      assert.doesNotThrow(sipInst.run.bind(sipInst, 'task', null, cbFn));
      assert.doesNotThrow(sipInst.run.bind(sipInst, 'task', cbFn));
    });
  });

  describe('#watch()', function() {
    // seperate sipInst variable to prevent access by different describes
    var sipInst;
    beforeEach(function() {
      sipInst = new sip.Sip();
      sipInst.task('task', taskFn);
    });
    it('should throw a type error when glob not present', function() {
      assert.throw(sipInst.watch.bind(sipInst, null), TypeError);
    });
    it('should throw a type error when glob of wrong type', function() {
      assert.throw(sipInst.watch.bind(sipInst, {}), TypeError);
    });
    it('should throw an error when only options are present', function() {
      assert.throw(sipInst.watch.bind(sipInst, './glob', {}), Error);
    });
    it('should not throw error when options present', function() {
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', {}, cbFn));
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', {}, ['task']));
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', {}, ['task'], cbFn));
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', {}, null, cbFn));
    });
    it('should not throw error when function present', function() {
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', cbFn));
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', null, cbFn));
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', null, null, cbFn));
    });
    it('should not throw error when dependencies present', function() {
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', ['task']));
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', null, ['task']));
    });
    it('should not throw error when dependencies and function present', function() {
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', ['task'], cbFn));
      assert.doesNotThrow(sipInst.watch.bind(sipInst, './glob', null, ['task'], cbFn));
    });
    it('should throw a type error when functions or dependencies of wrong type', function() {
      assert.throw(sipInst.watch.bind(sipInst, './glob', 10), TypeError);
      assert.throw(sipInst.watch.bind(sipInst, './glob', 10, 10), TypeError);
      assert.throw(sipInst.watch.bind(sipInst, './glob', null, 10), TypeError);
      assert.throw(sipInst.watch.bind(sipInst, './glob', null, 10, 10), TypeError);
      assert.throw(sipInst.watch.bind(sipInst, './glob', null, null, 10), TypeError);
    });
  });
});
