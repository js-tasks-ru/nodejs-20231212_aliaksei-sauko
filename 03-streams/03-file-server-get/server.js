const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/') || pathname.includes('\\')) {
        res.statusCode = 400;
        res.end();

        return;
      }

      const filepath = path.join(__dirname, 'files', pathname);
      const fileStream = fs.createReadStream(filepath, { flags: 'r' });

      fileStream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
        } else {
          res.statusCode = 500;
        }

        res.end();
      });

      fileStream.on('end', () => {
        res.end();
      });

      fileStream.pipe(res);

      req.on('close', () => {
        if (req.readableEnded) return;
        // req.readableEnded is false for the aborded stream

        fileStream.close();
        res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
