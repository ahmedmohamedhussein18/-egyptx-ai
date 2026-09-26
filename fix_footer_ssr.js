const fs = require('fs');
let c = fs.readFileSync('src/components/Footer.tsx', 'utf8');
if (!c.includes('use client')) {
  fs.writeFileSync('src/components/Footer.tsx', "'use client';\n" + c);
}
