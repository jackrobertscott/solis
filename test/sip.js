var assert = require('chai').assert;
var sip = require('../lib/sip');

describe('sip', function() {
  describe('#task()', function() {
    var sipInst;
    var taskFunction = function(opts, cb) {
      cb();
    };

    beforeEach(function() {
      sipInst = new sip.Sip();
    });
    it('should throw a type error when task name not present', function() {
      assert.throw(sipInst.task.bind(sipInst, null), TypeError);
    });
    it('should throw a type error when task dependencies and function not present', function() {
      assert.throw(sipInst.task.bind(sipInst, 'example', null, null), Error);
    });
    it('should throw a type error when wrong param types present', function() {
      assert.throw(sipInst.task.bind(sipInst, 'example', {}, null), TypeError);
      assert.throw(sipInst.task.bind(sipInst, 'example', null, {}), TypeError);
      assert.throw(sipInst.task.bind(sipInst, 'example', {}, {}), TypeError);
    });
    it('should not throw a type error when task function present', function() {
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', taskFunction));
    });
    it('should not throw a type error when task dependencies present', function() {
      sipInst.task('depedency', taskFunction);
      // test string
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', 'depedency'));
      // test array
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', ['depedency']));
    });
    it('should not throw a type error when task dependencies and function present', function() {
      sipInst.task('depedency', taskFunction);
      // test string
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', 'depedency', taskFunction));
      // test array
      assert.doesNotThrow(sipInst.task.bind(sipInst, 'example', ['depedency'], taskFunction));
    });
  });
});
