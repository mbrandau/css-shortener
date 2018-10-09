const replaceStream = require('replacestream');
const IdGenerator = require('./idGenerator');

const CLASS_NAME_REGEX = /\/\*[\s\S]*?\*\/|(\.[a-z_-][\w-]*)(?=[^{}]*{)/g; // https://stackoverflow.com/a/48962872/5133130
const HTML_CLASS_REGEX = /class="([\w-\s]*)"/g;

const CssShortener = function(options) {
  if (!options) options = {};
  this._options = options;
  if (!this._options.hasOwnProperty('ignorePrefix'))
    this._options.ignorePrefix = 'ignore-';
  if (!this._options.hasOwnProperty('trimIgnorePrefix'))
    this._options.trimIgnorePrefix = true;
  this._idGenerator = new IdGenerator(this._options.alphabet);
  this._classNameMap = {};

  const t = this;
  const replaceCss = function(match, capturingGroup) {
    if (!capturingGroup) return match;
    const className = capturingGroup.substr(1); // Remove dot infront of class name

    return `.${t.getNewClassName(className)}`;
  };
  const replaceHtml = function(match, capturingGroup) {
    if (!capturingGroup) return match;
    const classes = capturingGroup.trim().split(' ');
    const classCount = classes.length;
    let result = '';
    for (let i = 0; i < classCount; i++) {
      // Check if class is mapped and add it to the result
      result +=
        t._classNameMap[classes[i]] != null
          ? t._classNameMap[classes[i]]
          : classes[i];
      if (i < classCount - 1) result += ' ';
    }
    return `class="${result}"`;
  };

  this.getMap = function() {
    return this._classNameMap;
  };
  this.importMap = function(map, override) {
    for (let orig in map) {
      if (this._classNameMap[orig] != null) {
        // Override mapped class name
        if (override === true) this._classNameMap[orig] = map[orig];
      } else this._classNameMap[orig] = map[orig]; // Import class name
    }
  };

  this.getNewClassName = function(className) {
    // If the ignorePrefix option is set and the current class starts with the prefix, trim the prefix off and ignore the class.
    if (
      t._options.ignorePrefix &&
      className.startsWith(t._options.ignorePrefix)
    )
      return t._options.trimIgnorePrefix
        ? className.substr(t._options.ignorePrefix.length)
        : className;

    // Return the already mapped class name
    if (t._classNameMap[className] != null) return t._classNameMap[className];
    // Generate, map and return the new class name
    else return (t._classNameMap[className] = t._idGenerator());
  };
  this.cssStream = function() {
    return replaceStream(CLASS_NAME_REGEX, replaceCss);
  };
  this.replaceCss = function(css) {
    return css.replace(CLASS_NAME_REGEX, replaceCss);
  };
  this.htmlStream = function() {
    return replaceStream(HTML_CLASS_REGEX, replaceHtml);
  };
  this.replaceHtml = function(html) {
    return html.replace(HTML_CLASS_REGEX, replaceHtml);
  };
};

module.exports = CssShortener;
