const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('../01-limit-size-stream/LimitSizeStream');
const LimitExceededError = require('../01-limit-size-stream/LimitExceededError');

const MB = 1024 * 1024;

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();

        return;
      }

      const limitStream = new LimitSizeStream({ limit: 1 * MB });
      const fileStream = fs.createWriteStream(filepath, { flags: 'wx' });

      limitStream.on('error', (error) => {
        fileStream.destroy(error);
      });

      req.on('close', () => {
        if (req.readableEnded) return;
        // req.readableEnded is false for the aborded stream

        fileStream.end();

        fs.unlink(filepath, () => {});
      });

      fileStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
        } else if (error instanceof LimitExceededError) {
          fs.unlink(filepath, () => {});

          res.statusCode = 413;
        } else {
          res.statusCode = 500;
        }
        
        res.end();
      });

      fileStream.on('finish', () => {
        res.statusCode = 201;
        res.end();
      });

      req.pipe(limitStream).pipe(fileStream);

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
