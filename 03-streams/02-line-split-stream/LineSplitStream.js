const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  _buffer = '';

  constructor(options) {
    super(options);

    const { encoding = 'utf-8' } = options;
    this.encoding = encoding;
  }

  _transform(chunk, encoding, callback) {
    let chunkString = chunk.toString(this.encoding);

    if (this._buffer) {
      chunkString = this._buffer + chunkString;
    }

    const rows = chunkString.split(os.EOL);

    const lines = rows.slice(0, -1);
    this._buffer = rows.slice(-1)[0];

    lines.forEach(l => {
      this.push(l);
    });

    callback();
  }

  _flush(callback) {
    this.push(this._buffer);

    callback();
  }
}

module.exports = LineSplitStream;
