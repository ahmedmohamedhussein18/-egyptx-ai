const fs = require('fs');

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

nav = nav.replace(/>\s*Command\s*</g, ">{t('nav.command')}<");
nav = nav.replace(/>\s*Profile \& Passport\s*</g, ">{t('nav.touristPassport')}<");
nav = nav.replace(/>\s*Log Out\s*</g, ">{t('nav.logout')}<");
nav = nav.replace(/>\s*Log In\s*</g, ">{t('nav.login')}<");

fs.writeFileSync('src/components/Navbar.tsx', nav);
console.log('Fixed Navbar buttons');
