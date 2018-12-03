const fs = require('fs');
const path = require('path');
const readline = require('readline');
const outStream = new (require('stream'))();

function processFile(inputFile, onLine, onClose) {
  const inputStream = fs.createReadStream(path.join(__dirname, inputFile));
  const rl = readline.createInterface(inputStream, outStream);

  rl.on('line', (line) => onLine(line));
  rl.on('close', () => onClose());
}

const frequencyData = [];

const calibrateFrequency = () => {
  const result = frequencyData.reduce((res, cur) => res + Number(cur), 0);

  console.log(result);
};

processFile('data.txt', (el) => {
  frequencyData.push(el);
}, calibrateFrequency);
