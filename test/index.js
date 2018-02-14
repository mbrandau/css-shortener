const should = require('should');
const CssShortener = require('../index');
const IdGenerator = require('../idGenerator');
const str = require('string-to-stream');
const toString = require('stream-to-string');

describe('CssShortener', function() {
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
  describe('#stream()', function() {
    // TODO
  });
  describe('#htmlStream()', function() {
    it('should replace mapped css classes', function() {
      var c = new CssShortener();
      var map = {
        'test-class': 'a'
      };
      c.importMap(map);
      const stream = str('<div class="abc test-class 15a"></div>').pipe(c.htmlStream());
      toString(stream).then(function(msg) {
        msg.should.equal('<div class="abc a 15a"></div>');
      });
    });
  });
});

describe('IdGenerator (default alphabet)', function() {
  var gen = new IdGenerator();
  it('should not with a number or a hyphen', function() {
    for (var i = 0; i < 1000; i++) {
      gen().should.not.match(/^[0-9-].*$/);
    }
  });
});
