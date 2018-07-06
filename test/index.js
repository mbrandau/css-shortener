const should = require('should');
const CssShortener = require('../index');
const IdGenerator = require('../idGenerator');
const str = require('string-to-stream');
const toString = require('stream-to-string');

describe('CssShortener', function () {
    it('should use custom alphabet', function (done) {
        const c = new CssShortener({
                alphabet: ['a']
            }),
            stream = str('.class1{}.class2{}.class3{}').pipe(c.cssStream());
        toString(stream).then(function (msg) {
            msg.should.equal('.a{}.aa{}.aaa{}');
            c.getMap().should.deepEqual({
                'class1': 'a',
                'class2': 'aa',
                'class3': 'aaa'
            });
            done();
        });
    });
    it('should use default ignorePrefix and default trimIgnorePrefix options', function (done) {
        const c = new CssShortener(),
            stream = str('.class1{}.ignore-class2{}.class3{}').pipe(c.cssStream());
        toString(stream).then(function (msg) {
            msg.should.equal('.a{}.class2{}.b{}');
            c.getMap().should.deepEqual({
                'class1': 'a',
                'class3': 'b'
            });
            done();
        });
    });
    describe('#importMap()', function () {
        it('should import mappings from a map object', function () {
            const c = new CssShortener(),
                map = {
                    'test-class': 'a'
                };
            c.importMap(map);
            c.getMap().should.deepEqual(map);
        });
        it('should not override existing mappings', function () {
            const c = new CssShortener(),
                prevMap = {
                    'test-class': 'a'
                },
                importMap = {
                    'test-class': 'b'
                };
            c.importMap(prevMap);
            c.importMap(importMap)
            c.getMap().should.deepEqual(prevMap);
        });
        it('should override existing mappings', function () {
            const c = new CssShortener(),
                prevMap = {
                    'test-class': 'a'
                },
                importMap = {
                    'test-class': 'b'
                };
            c.importMap(prevMap);
            c.importMap(importMap, true);
            c.getMap().should.deepEqual(importMap);
        });
    });
    describe('#getMap()', function () {
        it('should return a map with original class names and shortened versions', function () {
            const c = new CssShortener(),
                map = {
                    'test-class': 'a'
                };
            c.importMap(map);
            c.getMap().should.deepEqual(map);
        });
    });
    describe('#cssStream() / #stream()', function () {
        it('should replace css classes with new IDs', function (done) {
            const c = new CssShortener(),
                stream = str('p.myclass{}.testclass{}').pipe(c.cssStream());
            toString(stream).then(function (msg) {
                msg.should.equal('p.a{}.b{}');
                c.getMap().should.deepEqual({
                    'myclass': 'a',
                    'testclass': 'b'
                });
                done();
            });
        });
        it('should replace css classes with already mapped IDs', function (done) {
            const c = new CssShortener();
            c.importMap({
                'myclass': 'zx'
            });
            const stream = str('p.myclass{}.testclass{}').pipe(c.cssStream());
            toString(stream).then(function (msg) {
                msg.should.equal('p.zx{}.a{}');
                c.getMap().should.deepEqual({
                    'myclass': 'zx',
                    'testclass': 'a'
                });
                done();
            });
        });
        it('should ignore css classes in comments', function (done) {
            const c = new CssShortener(),
                stream = str(`/* p.myclass{}.testclass{} */
/* file.css
.class
.test/*`).pipe(c.cssStream());
            toString(stream).then(function (msg) {
                msg.should.equal(`/* p.myclass{}.testclass{} */
/* file.css
.class
.test/*`);
                c.getMap().should.deepEqual({});
                done();
            });
        });
        it('should replace css classes in long selectors', function (done) {
            const c = new CssShortener(),
                stream = str('p.class0,.class1,html,td.class2,tr{}.testclass{}').pipe(c.cssStream());
            toString(stream).then(function (msg) {
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
        it('should ignore css classes with specified prefix', function (done) {
            const c = new CssShortener({
                    ignorePrefix: 'ignoreme-'
                }),
                stream = str('p.class0,.ignoreme-testclass{},.class1,html,td.class2,tr{}.testclass{}').pipe(c.cssStream());
            toString(stream).then(function (msg) {
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
        it('should not trim ignorePrefix if trimIgnorePrefix is false', function (done) {
            const c = new CssShortener({
                    trimIgnorePrefix: false
                }),
                stream = str('p.class0,.ignore-testclass{},.class1,html,td.class2,tr{}.testclass{}').pipe(c.cssStream());
            toString(stream).then(function (msg) {
                msg.should.equal('p.a,.ignore-testclass{},.b,html,td.c,tr{}.e{}');
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
    describe('#htmlStream()', function () {
        it('should replace mapped css classes', function (done) {
            const c = new CssShortener(),
                map = {
                    'test-class': 'a'
                };
            c.importMap(map);

            const stream = str('<div class="abc test-class 15a"></div>').pipe(c.htmlStream());
            toString(stream).then(function (msg) {
                msg.should.equal('<div class="abc a 15a"></div>');
                const stream = str('<div class="test-class"></div>').pipe(c.htmlStream());
                toString(stream).then(function (msg) {
                    msg.should.equal('<div class="a"></div>');
                    const stream = str('<div class="myclass"></div>').pipe(c.htmlStream());
                    toString(stream).then(function (msg) {
                        msg.should.equal('<div class="myclass"></div>');
                        done();
                    });
                });
            });
        });
    });
    describe('#replaceHtml()', function () {
        it('should replace mapped css classes', function () {
            const c = new CssShortener(),
                map = {
                    'test-class': 'a'
                };
            c.importMap(map);

            const html = '<div class="abc test-class 15a"></div>';
            const replaced = c.replaceHtml(html);
            replaced.should.equal('<div class="abc a 15a"></div>');

            c.replaceHtml('<div class="test-class"></div>').should.equal('<div class="a"></div>');

            c.replaceHtml('<div class="myclass"></div>').should.equal('<div class="myclass"></div>');
        });
    });
});

describe('IdGenerator (default alphabet)', function () {
    const gen = new IdGenerator();
    it('should not start with a number or a hyphen', function () {
        for (let i = 0; i < 100; i++) {
            gen().should.not.match(/^[0-9-].*$/);
        }
    });
});
