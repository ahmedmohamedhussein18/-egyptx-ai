const fs = require('fs');
let c = fs.readFileSync('src/components/LoginContent.tsx', 'utf8');
c = c.replace(/'Join the \{t\('login\.subtitle'\)\} today\.'/g, "`Join the ${t('login.subtitle')} today.`");
fs.writeFileSync('src/components/LoginContent.tsx', c);
