const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  /* const pathname = req.headers.filename

  if (pathname == undefined){
    res.statusCode = 400;
    res.end('You need specify filename prop in headers');
  } */

  const filepath = path.join(__dirname, 'files', pathname);
  const folder = path.join(__dirname, 'files');

  switch (req.method) {
    case 'POST':

      // подпапки
      if (path.dirname(path.normalize(filepath)) != folder) {
        res.statusCode = 400;
        res.end('Attempt access to subfolders is denied');
      }
      // файл уже существует
      else if (fs.existsSync(filepath)){
        res.statusCode = 409;
        res.end('File is alredy on server');
      }
      // если пустой файл
      else if (req.headers['content-length'] == 0){
        res.statusCode = 500;
        res.end('File has empty body');
      }else {

        const limitedStream = new LimitSizeStream({ limit: 1024 * 1024, readableObjectMode: false });
        const outputStream = fs.createWriteStream(filepath);

        req.pipe(limitedStream).pipe(outputStream);

        // всё ок!
        outputStream.on('finish', () => {
          res.statusCode = 201;
          res.end('File uploaded');
        });

        // ошибки на потоке transform
        limitedStream.on('error', (err) => {
          fs.unlinkSync(filepath)

          limitedStream.destroy();
          outputStream.destroy();
          
          let msg = ''
          
          if (err.code == 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            msg = 'Sory, file size too big'
          } else {
            res.statusCode = 500;
            msg = 'Fatality x500 in limitedStream handler: [' + err.code + ']'
          }

          res.end(msg);
        });

        // ошибка при записи файла
        outputStream.on('error', (err) => {
          fs.unlinkSync(filepath)

          limitedStream.destroy();
          outputStream.destroy();

          let msg;

          if (err.code == 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            msg = 'Sory, file size too big'
          } else {
            res.statusCode = 500;
            msg = 'Fatality x500 in writeStream handler: [' + err.code + ']'
          }

          res.end(msg);
        });

        // Клиент оборвал соединение
        req.on('aborted', () => {
          fs.unlinkSync(filepath);

          limitedStream.destroy();
          outputStream.destroy();
        });

        // hooks
        /* outputStream.on('open', () => {console.log('outputStream open')});
        outputStream.on('close', () => {console.log('outputStream close')});
        
        limitedStream.on('open', () => { console.log('limitedStream open')});
        limitedStream.on('close', () => { console.log('limitedStream close')}); */

      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
