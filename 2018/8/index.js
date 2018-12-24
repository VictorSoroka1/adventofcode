const path = require('path');

const { parseFile } = require('../../utils/parseFile');

const licenseData = parseFile(path.join(__dirname, 'data.txt'))[0]
  .split(' ')
  .map(Number);

let totalLicenseSum = 0;
let rootLicenseNodeSum = 0;
let rootNode = null;

const calculateSum = data => data.reduce((a, b) => a + b, 0);

function countTotalLicenseMetadataSum(parent, startIndex = 0) {
  const amountOfNodes = licenseData[startIndex];
  const amountOfMetadata = licenseData[startIndex + 1];

  const node = {
    metadata: [],
    children: [],
  };

  if (parent) {
    parent.children.push(node);
  } else {
    rootNode = node;
  }

  let endIndex = startIndex + 2;

  for (let i = 0; i < amountOfNodes; i++) {
    endIndex = countTotalLicenseMetadataSum(node, endIndex);
  }

  const metadata = licenseData.slice(endIndex, endIndex + amountOfMetadata);

  node.metadata.push(...metadata);
  totalLicenseSum += calculateSum(metadata);

  return endIndex + amountOfMetadata;
}

function countRootLicenseNodeMetadataSum(node) {
  node.metadata.forEach((meta) => {
    const child = node.children[meta - 1];

    if (child) {
      if (!child.children.length) {
        rootLicenseNodeSum += calculateSum(child.metadata);
      } else {
        countRootLicenseNodeMetadataSum(child);
      }
    }
  });
}

countTotalLicenseMetadataSum(rootNode);
countRootLicenseNodeMetadataSum(rootNode);

console.log('Part 1:', totalLicenseSum);
console.log('Part 2:', rootLicenseNodeSum);
