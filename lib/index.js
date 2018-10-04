"use strict";

var replaceStream = require('replacestream');

var IdGenerator = require('./idGenerator');

var CLASS_NAME_REGEX = /\/\*[\s\S]*?\*\/|(\.[a-z_-][\w-]*)(?=[^{}]*{)/g; // https://stackoverflow.com/a/48962872/5133130

var HTML_CLASS_REGEX = /class="([\w-\s]*)"/g;

var CssShortener = function CssShortener(options) {
  if (!options) options = {};
  this._options = options;
  if (!this._options.hasOwnProperty('ignorePrefix')) this._options.ignorePrefix = 'ignore-';
  if (!this._options.hasOwnProperty('trimIgnorePrefix')) this._options.trimIgnorePrefix = true;
  this._idGenerator = new IdGenerator(this._options.alphabet);
  this._classNameMap = {};
  var t = this;

  var replaceCss = function replaceCss(match, capturingGroup) {
    if (!capturingGroup) return match;
    var id,
        orig = capturingGroup.substr(1); // Remove dot infront of class name
    // If the ignorePrefix option is set and the current class starts with the prefix, trim the prefix off and ignore the class.

    if (t._options.ignorePrefix && orig.startsWith(t._options.ignorePrefix)) return t._options.trimIgnorePrefix ? ".".concat(orig.substr(t._options.ignorePrefix.length)) : ".".concat(orig);
    if (t._classNameMap[orig] != null) id = t._classNameMap[orig]; // Use mapped class name
    else id = t._classNameMap[orig] = t._idGenerator(); // Generate and map new class name

    return ".".concat(id);
  };

  var replaceHtml = function replaceHtml(match, capturingGroup) {
    if (!capturingGroup) return match;
    var classes = capturingGroup.trim().split(' ');
    var classCount = classes.length;
    var result = '';

    for (var i = 0; i < classCount; i++) {
      // Check if class is mapped and add it to the result
      result += t._classNameMap[classes[i]] != null ? t._classNameMap[classes[i]] : classes[i];
      if (i < classCount - 1) result += ' ';
    }

    return "class=\"".concat(result, "\"");
  };

  this.getMap = function () {
    return this._classNameMap;
  };

  this.importMap = function (map, override) {
    for (var orig in map) {
      if (this._classNameMap[orig] != null) {
        if (override === true) this._classNameMap[orig] = map[orig]; // Override mapped class name
      } else this._classNameMap[orig] = map[orig]; // Import class name

    }
  };

  this.cssStream = function () {
    return replaceStream(CLASS_NAME_REGEX, replaceCss);
  };

  this.replaceCss = function (css) {
    return css.replace(CLASS_NAME_REGEX, replaceCss);
  };

  this.htmlStream = function () {
    return replaceStream(HTML_CLASS_REGEX, replaceHtml);
  };

  this.replaceHtml = function (html) {
    return html.replace(HTML_CLASS_REGEX, replaceHtml);
  };
};

module.exports = CssShortener;