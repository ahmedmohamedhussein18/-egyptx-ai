const fs = require('fs');
const p = 'src/data/egypt-news.ts';
let content = fs.readFileSync(p, 'utf8');

content = content.replace(/\/news\/siwa\.jpg/gi, '/images/Fantasy-Island-egypt-siwaa-oasis.jpg');
content = content.replace(/\/news\/white-desert\.jpg/gi, '/images/White Desertt.jpg');

fs.writeFileSync(p, content, 'utf8');
console.log('Updated egypt-news.ts');
