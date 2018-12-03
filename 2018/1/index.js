const fs = require('fs');
const path = require('path');

const frequencyData = fs.readFileSync(path.join(__dirname, 'data.txt'))
  .toString()
  .split('\n')
  .slice(0, -1);

const calibrateFrequency = () => {
  const result = frequencyData.reduce((res, cur) => res + Number(cur), 0);

  console.log(result);
};

const findFirstRepeatedFrequency = () => {
  const len = frequencyData.length;
  const results = [0];
  let currentFrequency = 0;
  let i = 0;

  while (true) {
    i = i % len;
    currentFrequency += Number(frequencyData[i++]);

    if (results.includes(currentFrequency)) {
      console.log(currentFrequency);

      return;
    }

    results.push(currentFrequency);
  }
};

calibrateFrequency();
findFirstRepeatedFrequency();
