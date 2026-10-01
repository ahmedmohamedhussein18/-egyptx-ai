const fs = require('fs');

let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
const beforeHero = c;
c = c.replace(/The National Smart Tourism Ecosystem/, "{t('home.subtitle')}");
c = c.replace(/Discover Egypt\. Experience History\. Shape the Future\./, "{t('home.slogan')}");
fs.writeFileSync('src/components/HeroSection.tsx', c);

let c2 = fs.readFileSync('src/components/DestinationsSection.tsx', 'utf8');
const beforeDest = c2;
c2 = c2.replace(/>Featured Destinations</, ">{t('destinations.featured')}<");
c2 = c2.replace(/>From ancient wonders to hidden oases</, ">{t('destinations.subtitle')}<");
fs.writeFileSync('src/components/DestinationsSection.tsx', c2);

console.log("Replaced strings successfully.");
