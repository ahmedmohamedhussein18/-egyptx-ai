const fs = require('fs');
const ar = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));

function findMissing(source, target, path = '') {
  for (let key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object') {
        console.log(`Missing object: ${path}${key}`);
      } else {
        findMissing(source[key], target[key], path + key + '.');
      }
    } else {
      if (target[key] === undefined) {
        console.log(`Missing key: ${path}${key}`);
      }
    }
  }
}

findMissing(ar, en);
