const path = require('path');

const { parseFile } = require('../utils/parseFile');

const frequencyData = parseFile(path.join(__dirname, 'data.txt'));

const calibrateFrequency = () => frequencyData.reduce((res, cur) => res + Number(cur), 0);

const findFirstRepeatedFrequency = () => {
  const len = frequencyData.length;
  const results = [0];
  let currentFrequency = 0;
  let i = 0;

  while (true) {
    i = i % len;
    currentFrequency += Number(frequencyData[i++]);

    if (results.includes(currentFrequency)) {
      return currentFrequency;
    }

    results.push(currentFrequency);
  }
};

console.log('Part 1:', calibrateFrequency());
console.log('Part 2:', findFirstRepeatedFrequency());
