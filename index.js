const replaceStream = require('replacestream');
const IdGenerator = require('./idGenerator');

var CssShortener = function(options) {
  if (!options) options = {};
  this._idGenerator = new IdGenerator(options.alphabet);
  this._classNameMap = {};
};
CssShortener.prototype.getMap = function() {
  return this._classNameMap;
}
CssShortener.prototype.importMap = function(map, override) {
  for (var orig in map) {
    if (this._classNameMap[orig] != null) {
      if (override === true) this._classNameMap[orig] = map[orig]; // Override mapped class name
    } else this._classNameMap[orig] = map[orig]; // Import class name
  }
}
CssShortener.prototype.stream = function(callback) {
  const t = this;
  return replaceStream(/\.[a-z][a-z0-9-_]*/g, function(match) {
    var id;
    var orig = match.substr(1); // Remove dot infront of class name

    if (t._classNameMap[orig] != null) id = t._classNameMap[orig]; // Use mapped class name
    else id = t._classNameMap[orig] = t._idGenerator(); // Generate and map new class name

    return '.' + id;
  });
}

module.exports = CssShortener;
