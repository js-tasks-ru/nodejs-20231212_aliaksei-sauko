const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    const { limit } = options;

    this.limit = limit;
    this.processedLimit = 0;
  }

  _transform(chunk, encoding, callback) {
    if (this.limit < this.processedLimit + chunk.length) {
      callback(new LimitExceededError(), chunk);

      return;
    }

    this.processedLimit += chunk.length;

    this.push(chunk, encoding);
    callback();
  }
}

module.exports = LimitSizeStream;
