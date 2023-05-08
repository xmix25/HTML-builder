const fs = require('fs');
const path = require('path');
const { stdout } = process;

const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
input.on('data', (chunk) => {
  stdout.write(chunk);
});
