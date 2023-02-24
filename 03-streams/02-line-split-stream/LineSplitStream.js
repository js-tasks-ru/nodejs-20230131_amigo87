const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding
    this.str = ''
  }

  _transform(chunk, encoding, callback) {
    this.str += Buffer.from(chunk, this.encoding);
    
    if (this.str.indexOf(os.EOL) !== -1){

      let parts = this.str.split(os.EOL);
      this.str = parts.pop();
      
      if (parts.length){
        for (const line of parts) {
          this.push(line);
        }
      }
      
    } 

    callback();
  }
  
  _flush(callback) {
    this.push(this.str);
    callback();
  }

}

module.exports = LineSplitStream;
