// Leaving 'd' out to avoid generating the word 'ad'
const defaultAlphabet = 'abcefghijklmnopqrstuvwxyz0123456789_-';

export function createIdGenerator(alphabet?: string) {
  var options = {
    alphabet: alphabet || defaultAlphabet,
    length: 1,
    index: 0,
  };

  return function() {
    var res = generateId(options);
    // class names should not start with a number or a dash
    while (/^[0-9-].*$/.test(res)) res = generateId(options);
    return res;
  };
}

var generateId = function(options: {
  length: number;
  alphabet: string;
  index: number;
}) {
  var res = '';

  for (var i = options.length - 1; i >= 0; i--) {
    var x = Math.pow(options.alphabet.length, i);
    var n = Math.floor(options.index / x);
    res += options.alphabet[n % options.alphabet.length];
  }

  options.index++;
  if (options.index > Math.pow(options.alphabet.length, options.length) - 1) {
    options.length++;
    options.index = 0;
  }

  return res;
};
