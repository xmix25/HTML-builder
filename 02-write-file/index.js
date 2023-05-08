const path = require('path');
const fs = require('fs');
const { stdin, exit } = process;
const readLine = require('readline');

console.log("Enter your text. To stop enter 'exit'");
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

const rl = readLine.createInterface({ input: stdin, output });
rl.on('line', (line) => {
  if (line === 'exit') {
    exit();
  }
  output.write(`${line}\n`);
});

process.on('exit', () => {
  console.log('Bye');
});
process.on('SIGINT', () => {
  exit();
});
