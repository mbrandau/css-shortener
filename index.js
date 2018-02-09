const replaceStream = require('replacestream');
const IdGenerator = require('./idGenerator');

var CssShortener = function() {
  this._idGenerator = new IdGenerator();
  this._classNameMap = {};
};
CssShortener.prototype.getMap = function() {
  return this._classNameMap;
}
CssShortener.prototype.stream = function(callback) {
  const t = this;
  return replaceStream(/\.[a-z][a-z0-9-_]*/g, function(match){
    var id = '';
    var orig = match.substr(1);
    if (t._classNameMap[orig] != null) {
      id = t._classNameMap[orig];
    } else {
      id = t._idGenerator();
      t._classNameMap[orig] = id;
    }
    return '.'+id;
  });
}

module.exports = CssShortener;
