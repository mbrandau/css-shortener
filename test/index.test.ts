import { CssShortener } from '../src';
import { createIdGenerator } from '../src/idGenerator';

describe('CssShortener', function() {
  it('should use custom alphabet', function() {
    const c = new CssShortener({
      alphabet: 'a',
    });
    expect(c.shortenClassName('class1')).toBe('a');
    expect(c.shortenClassName('class2')).toBe('aa');
    expect(c.shortenClassName('class3')).toBe('aaa');
    expect(c.map).toStrictEqual({
      class1: 'a',
      class2: 'aa',
      class3: 'aaa',
    });
  });
  describe('#importMap()', function() {
    it('should import mappings from a map object', function() {
      const c = new CssShortener(),
        map = {
          'test-class': 'a',
        };
      c.importMap(map);
      expect(c.map).toStrictEqual(map);
    });
    it('should not override existing mappings', function() {
      const c = new CssShortener(),
        prevMap = {
          'test-class': 'a',
        },
        importMap = {
          'test-class': 'b',
        };
      c.importMap(prevMap);
      c.importMap(importMap);
      expect(c.map).toStrictEqual(prevMap);
    });
    it('should override existing mappings', function() {
      const c = new CssShortener(),
        prevMap = {
          'test-class': 'a',
        },
        importMap = {
          'test-class': 'b',
        };
      c.importMap(prevMap);
      c.importMap(importMap, true);
      expect(c.map).toStrictEqual(importMap);
    });
  });
  describe('#map', function() {
    it('should return a map with original class names and shortened versions', function() {
      const c = new CssShortener(),
        map = {
          'test-class': 'a',
        };
      c.importMap(map);
      expect(c.map).toStrictEqual(map);
    });
  });
});

describe('IdGenerator (default alphabet)', function() {
  const gen = createIdGenerator();
  it('should not start with a number or a hyphen', function() {
    for (let i = 0; i < 100; i++) {
      expect(gen()).not.toMatch(/^[0-9-].*$/);
    }
  });
});
