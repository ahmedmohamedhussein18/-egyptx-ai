const fs = require('fs');
const c = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
const searchStr = 'hidden md:flex';
const idx = c.indexOf(searchStr);
console.log(c.substring(idx - 20, idx + 1000));
