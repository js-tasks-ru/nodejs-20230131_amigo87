const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const folder = path.join(__dirname, 'files');

  switch (req.method) {
    case 'DELETE':

      // подпапки
      if (path.dirname(path.normalize(filepath)) != folder) {
        res.statusCode = 400;
        res.end('Attempt access to subfolders is denied');
      }
      // файл уже существует
      else if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('Not fount on server');
      }
      else {
        try{
          fs.unlinkSync(filepath)
          res.statusCode = 200;
          res.end('File deleted');
        }
        catch(err){
          res.statusCode = 500;
          res.end('Ooops! Error code: ' + err.code);
        }
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
