const path = require('path');

const { parseFile } = require('../utils/parseFile');

const checkSums = parseFile(path.join(__dirname, 'data.txt'));

const parseCheckSumChunk = (chunk) => {
  return [...chunk].reduce((res, cur) => {
    return {
      ...res,
      [cur]: (res[cur] || 0) + 1,
    };
  }, {});
};

const findFirstRepeatedFrequency = () => {
  return checkSums
    .reduce((res, cur) => {
      const parsedCheckSumChunk = parseCheckSumChunk(cur);
      const set = new Set(Object.values(parsedCheckSumChunk));

      return [
        res[0] + (set.has(2) ? 1 : 0),
        res[1] + (set.has(3) ? 1 : 0),
      ];
    }, [0, 0])
    .reduce((res, cur) => res * cur);
};

const findCommonLettersIDs = () => {
  const len = checkSums.length;
  const checkSumLen = checkSums[0].length;

  for (let i = 0; i < len; i++) {
    const currentCheckSum = checkSums[i];

    for (let j = i + 1; j < len; j++) {
      const checkSumToCompare = checkSums[j];
      let fails = [];

      for (let z = 0; z < checkSumLen; z++) {
        if (currentCheckSum[z] !== checkSumToCompare[z]) {
          fails.push(z);
        }

        if (fails.length > 1) {
          continue;
        }

        if (z === checkSumLen - 1) {
          return currentCheckSum.slice(0, fails[0]) + currentCheckSum.slice(fails[0] + 1);
        }
      }
    }
  }
};

console.log('Part 1:', findFirstRepeatedFrequency());
console.log('Part 2:', findCommonLettersIDs());
