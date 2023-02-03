function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number'){
    throw new TypeError('Один или оба аргумента не являются числами');
  }
  return a + b;
}

module.exports = sum;
