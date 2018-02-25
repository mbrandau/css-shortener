const should = require('should');
const CssShortener = require('../index');
const IdGenerator = require('../idGenerator');
const str = require('string-to-stream');
const toString = require('stream-to-string');

describe('CssShortener', function() {
  it('should use custom alphabet', function(done) {
    var c = new CssShortener({alphabet:['a']});
    const stream = str('.class1{}.class2{}.class3{}').pipe(c.cssStream());
    toString(stream).then(function(msg) {
      msg.should.equal('.a{}.aa{}.aaa{}');
      c.getMap().should.deepEqual({
        'class1': 'a',
        'class2': 'aa',
        'class3': 'aaa'
      });
      done();
    });
  });
  describe('#importMap()', function() {
    it('should import mappings from a map object', function() {
      var c = new CssShortener();
      var map = {
        'test-class': 'a'
      };
      c.importMap(map);
      c.getMap().should.deepEqual(map);
    });
    it('should not override existing mappings', function() {
      var c = new CssShortener();
      var prevMap = {
        'test-class': 'a'
      };
      var importMap = {
        'test-class': 'b'
      };
      c.importMap(prevMap);
      c.importMap(importMap)
      c.getMap().should.deepEqual(prevMap);
    });
    it('should override existing mappings', function() {
      var c = new CssShortener();
      var prevMap = {
        'test-class': 'a'
      };
      var importMap = {
        'test-class': 'b'
      };
      c.importMap(prevMap);
      c.importMap(importMap, true);
      c.getMap().should.deepEqual(importMap);
    });
  });
  describe('#getMap()', function() {
    it('should return a map with original class names and shortened versions', function() {
      var c = new CssShortener();
      var map = {
        'test-class': 'a'
      };
      c.importMap(map);
      c.getMap().should.deepEqual(map);
    });
  });
  describe('#cssStream() / #stream()', function() {
    it('should replace css classes with new IDs', function(done) {
      var c = new CssShortener();
      const stream = str('p.myclass{}.testclass{}').pipe(c.cssStream());
      toString(stream).then(function(msg) {
        msg.should.equal('p.a{}.b{}');
        c.getMap().should.deepEqual({
          'myclass': 'a',
          'testclass': 'b'
        });
        done();
      });
    });
    it('should replace css classes with already mapped IDs', function(done) {
      var c = new CssShortener();
      c.importMap({
        'myclass': 'zx'
      });
      const stream = str('p.myclass{}.testclass{}').pipe(c.cssStream());
      toString(stream).then(function(msg) {
        msg.should.equal('p.zx{}.a{}');
        c.getMap().should.deepEqual({
          'myclass': 'zx',
          'testclass': 'a'
        });
        done();
      });
    });
    it('should ignore css classes in comments', function(done) {
      var c = new CssShortener();
      const stream = str(`/* p.myclass{}.testclass{} */
/* file.css
.class
.test/*`).pipe(c.cssStream());
      toString(stream).then(function(msg) {
        msg.should.equal(`/* p.myclass{}.testclass{} */
/* file.css
.class
.test/*`);
        c.getMap().should.deepEqual({});
        done();
      });
    });
    it('should replace css classes in long selectors', function(done) {
      var c = new CssShortener();
      const stream = str('p.class0,.class1,html,td.class2,tr{}.testclass{}').pipe(c.cssStream());
      toString(stream).then(function(msg) {
        msg.should.equal('p.a,.b,html,td.c,tr{}.e{}');
        c.getMap().should.deepEqual({
          'class0': 'a',
          'class1': 'b',
          'class2': 'c',
          'testclass': 'e'
        });
        done();
      });
    });
    it('should ignore css classes with specified prefix', function(done) {
      var c = new CssShortener({ignorePrefix:'ignoreme-'});
      const stream = str('p.class0,.ignoreme-testclass{},.class1,html,td.class2,tr{}.testclass{}').pipe(c.cssStream());
      toString(stream).then(function(msg) {
        msg.should.equal('p.a,.testclass{},.b,html,td.c,tr{}.e{}');
        c.getMap().should.deepEqual({
          'class0': 'a',
          'class1': 'b',
          'class2': 'c',
          'testclass': 'e'
        });
        done();
      });
    });
  });
  describe('#htmlStream()', function() {
    it('should replace mapped css classes', function(done) {
      var c = new CssShortener();
      var map = {
        'test-class': 'a'
      };
      c.importMap(map);
      const stream = str('<div class="abc test-class 15a"></div>').pipe(c.htmlStream());
      toString(stream).then(function(msg) {
        msg.should.equal('<div class="abc a 15a"></div>');
        done();
      });
    });
  });
});

describe('IdGenerator (default alphabet)', function() {
  var gen = new IdGenerator();
  it('should not start with a number or a hyphen', function() {
    for (var i = 0; i < 100; i++) {
      gen().should.not.match(/^[0-9-].*$/);
    }
  });
});
