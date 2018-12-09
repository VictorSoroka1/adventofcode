const path = require('path');

const { parseFile } = require('../utils/parseFile');

const claimsData = parseFile(path.join(__dirname, 'data.txt'));

const parseClaimData = (cl) => {
  return cl.match(/(\d+)/g).map(Number);
};

const generateClaimsData = () => {
  return claimsData.reduce((res, claimData) => {
    const [id, x, y, width, height] = parseClaimData(claimData);

    for (let i = x; i < (x + width); i++) {
      for (let j = y; j < (y + height); j++) {
        res[`${i},${j}`] = (res[`${i},${j}`] || []).concat(id);
      }
    }

    return res;
  }, {});
};

const findOverlappedClaims = () => {
  const generatedClaims = generateClaimsData();

  return Object.keys(generatedClaims).reduce((res, key) => {
    return generatedClaims[key].length > 1 ? res + 1 : res;
  }, 0);
};

console.log('Part 1:', findOverlappedClaims());
