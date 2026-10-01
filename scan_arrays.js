const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src/components');
const suspects = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Look for const/let arrays with title/description/label string properties that look like plain English
  const arrayLiteralWithStrings = /(?:title|description|label|desc|subtitle|text|name|tag|action|heading|caption)\s*:\s*['"][A-Z][^'"]{4,}['"]/;
  if (arrayLiteralWithStrings.test(content)) {
    suspects.push(f);
  }
});

console.log('Files with potential hardcoded arrays:');
suspects.forEach(f => console.log(f));
