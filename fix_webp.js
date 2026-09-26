const fs = require('fs');
let c = fs.readFileSync('src/components/HiddenEgyptContent.tsx', 'utf8');
c = c.replace(/\/images\/White Deserttt\.jpg/g, '/images/White Deserttt.webp');
c = c.replace(/\/images\/Wadi El Hitannn\.jpg/g, '/images/Wadi El Hitannn.webp');
fs.writeFileSync('src/components/HiddenEgyptContent.tsx', c);
console.log('Fixed WebP images');
