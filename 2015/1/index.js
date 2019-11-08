const path = require('path');

const { parseFile } = require('../../utils/parseFile');

const floorsData = parseFile(path.join(__dirname, 'data.txt'))[0];

const findFloor = floors => {
  let floor = 0;

  for (let i = 0; i < floors.length; i++) {
    floor += (floors[i] === '(') ? 1 : -1;
  }

  return floor;
};

const findBasementFloorPosition = floors => {
  let floor = 0;

  for (let i = 0; i < floors.length; i++) {
    floor += (floors[i] === '(') ? 1 : -1;

    if (floor === -1) {
      return i + 1;
    }
  }

  return floor;
};

console.log('Part 1:', findFloor(floorsData));
console.log('Part 2:', findBasementFloorPosition(floorsData));
