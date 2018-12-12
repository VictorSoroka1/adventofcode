const path = require('path');

const { parseFile } = require('../utils/parseFile');

const licenseData = parseFile(path.join(__dirname, 'data.txt'))[0]
  .split(' ')
  .map(Number);

let totalAmount = 0;
const rootNode = {
  parent: null,
  children: [],
};

function processLicenseMetadata(parent, startIndex = 0) {
  const amountOfNodes = licenseData[startIndex];
  const amountOfMetadata = licenseData[startIndex + 1];

  const node = {
    amountOfNodes,
    metadata: [],
    children: [],
  };

  parent.children.push(node);

  let endIndex = startIndex + 2;

  for (let i = 0; i < amountOfNodes; i++) {
    endIndex = processLicenseMetadata(node, endIndex);
  }

  const metadata = licenseData.slice(endIndex, endIndex + amountOfMetadata);

  node.metadata.push(...metadata);
  totalAmount += metadata.reduce((a, b) => a + b, 0);

  return endIndex + amountOfMetadata;
}

processLicenseMetadata(rootNode);

console.log('Part 1:', totalAmount);
