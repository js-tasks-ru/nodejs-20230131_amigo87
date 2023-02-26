const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs')

const server = new http.Server();

let stream = undefined;

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  
  const filepath = path.join(__dirname, 'files', pathname);
  const folder = path.join(__dirname, 'files');
  
  switch (req.method) {
    case 'GET':
      // обработка ошибок...
      if (path.dirname(path.normalize(filepath)) != folder){
        res.statusCode = 400;
        res.end('Attempt access to subfolders is denied');
      }

      stream = fs.createReadStream(filepath);
      stream.pipe(res);

      stream.on('error', (err) => {
        let msg = ''
        if (err.code == 'ENOENT'){
          res.statusCode = 404;
          msg = 'No such file on server...'
        }else{
          res.statusCode = 500;
          msg = 'Fatality x 500!'
        }
        stream.destroy();        
        res.end(msg);
      });

      req.on('aborted', () => {
        stream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
