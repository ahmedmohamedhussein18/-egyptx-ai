const fs = require('fs');

let c = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Change nav.crafts to Shop
c = c.replace(
  "{ name: t('nav.crafts'), href: '/crafts' },",
  "{ name: 'Shop', href: '/crafts' },"
);

fs.writeFileSync('src/components/Navbar.tsx', c);
console.log('Crafts renamed to Shop!');
