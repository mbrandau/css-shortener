const replaceStream = require('replacestream');
const IdGenerator = require('./idGenerator');

const CLASS_NAME_REGEX = /\/\*[\s\S]*?\*\/|(\.[a-z_-][\w-]*)(?=[^{}]*{)/g; // https://stackoverflow.com/a/48962872/5133130
const HTML_CLASS_REGEX = /class=["|']{1}([\w-\s]*)["|']{1}/g;

/**
 * Provides methods to replaces CSS class names
 * @constructor
 */
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

  /**
   * Returns all mapped CSS class names
   * @returns {object}
   */
  this.getMap = function() {
    return this._classNameMap;
  };

  /**
   * Imports mapped CSS class names
   * @param {object} map Map that should be imported
   * @param {boolean} override If true, existing mappings will be overridden
   */
  this.importMap = function(map, override) {
    for (let classNameToImport in map) {
      if (this._classNameMap[classNameToImport] != null) {
        // Override mapped class name
        if (override === true)
          this._classNameMap[classNameToImport] = map[classNameToImport];
      } else this._classNameMap[classNameToImport] = map[classNameToImport]; // Import class name
    }
  };

  /**
   * Generates and maps a new class name
   * @param className The existing class name that should be replaced
   * @returns {string} The new generated and mapped class name
   */
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

  /**
   * @returns {Transform} A transform stream that replaces class names in the CSS code
   */
  this.cssStream = function() {
    return replaceStream(CLASS_NAME_REGEX, replaceCss);
  };

  /**
   * Replaces class names in the given CSS code.
   * @param css The CSS code in which class names will be replaced
   * @returns {string}
   */
  this.replaceCss = function(css) {
    return css.replace(CLASS_NAME_REGEX, replaceCss);
  };

  /**
   * Class names will only be replaced with the existing mappings. No mappings will be generated.
   * @returns {Transform} A transform stream that replaces class names in the HTML code
   */
  this.htmlStream = function() {
    return replaceStream(HTML_CLASS_REGEX, replaceHtml);
  };

  /**
   * Replaces class names in the given HTML code.
   * Class names will only be replaced with the existing mappings. No mappings will be generated.
   * @param html The HTML code in which class names will be replaced
   * @returns {string}
   */
  this.replaceHtml = function(html) {
    return html.replace(HTML_CLASS_REGEX, replaceHtml);
  };
};

module.exports = CssShortener;
