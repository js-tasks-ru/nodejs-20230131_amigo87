const LineSplitStream = require('./LineSplitStream');
const os = require('os');

const lines = new LineSplitStream({encoding: 'utf-8'});

let i = 0;

function onData(line){
    console.log(++i, line);
}

lines.on('data', onData);

lines.write(`1) `);
lines.write(`Первая строка${os.EOL}Вторая строка${os.EOL}Третья ...`);
lines.write(`aaa${os.EOL}bbb`);

lines.end();