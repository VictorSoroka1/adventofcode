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
  const result = checkSums
    .reduce((res, cur) => {
      const parsedCheckSumChunk = parseCheckSumChunk(cur);
      const set = new Set(Object.values(parsedCheckSumChunk));

      return [
        res[0] + (set.has(2) ? 1 : 0),
        res[1] + (set.has(3) ? 1 : 0),
      ];
    }, [0, 0])
    .reduce((res, cur) => res * cur);

  console.log(result);
};

findFirstRepeatedFrequency();
