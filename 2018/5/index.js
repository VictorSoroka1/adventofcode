const path = require('path');

const { parseFile } = require('../../utils/parseFile');

const polymerData = parseFile(path.join(__dirname, 'data.txt'))[0];

const findRemainPolymerUnits = (data) => {
  data = data.split('');

  for (let i = 1; i < data.length - 1; i++) {
    const firstLetter = data[i - 1];
    const nextLetter  = data[i];

    if (!i) continue;

    if (firstLetter.toLowerCase() === nextLetter.toLowerCase()) {
      const firstLetterUppercase = firstLetter === firstLetter.toUpperCase();
      const nextLetterUppercase = nextLetter === nextLetter.toUpperCase();

      if (firstLetterUppercase && !nextLetterUppercase || !firstLetterUppercase && nextLetterUppercase) {
        data.splice(i - 1, 2);
        i -= 2;
      }
    }
  }

  return data.length;
};

const findMinUnit = (data) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  return [...alphabet].reduce((min, ch) => {
    const str = polymerData.replace(new RegExp(`${ch}`, 'ig'), '');
    const res = findRemainPolymerUnits(str);

    return res < min ? res : min;
  }, data.length);
};

console.log('Part 1:', findRemainPolymerUnits(polymerData));
console.log('Part 2:', findMinUnit(polymerData));
