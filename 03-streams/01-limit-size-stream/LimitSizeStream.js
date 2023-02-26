const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.transfered = 0
    this.limit = options.limit
    this.encoding = options.encoding
  }

  _transform(chunk, encoding, callback) {
    let buffer = Buffer.from(chunk, this.encoding)
    let len = Buffer.byteLength(buffer, this.encoding);

    if ((this.transfered + len) > this.limit) {
      // если есть ещё пространство для манёвра, считаем сколько может ещё поместиться
      let tail_len = this.limit - this.transfered;
      tail_len = Math.min(tail_len, len);
      const buffer_tail = Buffer.alloc(tail_len);
      
      buffer.copy(buffer_tail, 0, 0, tail_len);
      this.push(buffer_tail);

      // только потом выкидываем ошибку
      //throw new LimitExceededError();
      callback(new LimitExceededError());
    } else {
      this.transfered += len;
      //this.push(chunk);
      callback(null, chunk);
    }
    
  }

}

module.exports = LimitSizeStream;