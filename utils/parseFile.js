const fs = require('fs');

module.exports.parseFile = function (path) {
  return fs.readFileSync(path)
    .toString()
    .split('\n');
};
