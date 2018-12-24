const path = require('path');

const { parseFile } = require('../../utils/parseFile');

const parseClaimData = (cl) => {
  return cl.match(/(\d+)/g).map(Number);
};

const claimsData = parseFile(path.join(__dirname, 'data.txt'))
  .map(parseClaimData)
  .reduce((res, [id, x, y, width, height]) => {
    res.set(id, { x, y, width, height });

    return res;
  }, new Map());

const generateClaimsData = () => {
  return Array.from(claimsData.keys()).reduce((res, id) => {
    const { x, y, width, height } = claimsData.get(id);

    for (let i = x; i < (x + width); i++) {
      for (let j = y; j < (y + height); j++) {
        res[`${i},${j}`] = (res[`${i},${j}`] || []).concat(id);
      }
    }

    return res;
  }, {});
};

const generatedClaims = generateClaimsData();

const findOverlappedClaimsCount = () => {
  return Object.keys(generatedClaims).reduce((res, key) => {
    return generatedClaims[key].length > 1 ? res + 1 : res;
  }, 0);
};

const findIntactClaimId = () => {
  const overlappedClaimsIds = Object.keys(generatedClaims).reduce((res, key) => {
    return generatedClaims[key].length > 1
      ? new Set(Array.from(res).concat(generatedClaims[key]))
      : res;
  }, new Set());

  for (let id of claimsData.keys()) {
    if (!overlappedClaimsIds.has(id)) {
      return id;
    }
  }
};

console.log('Part 1:', findOverlappedClaimsCount());
console.log('Part 2:', findIntactClaimId());
