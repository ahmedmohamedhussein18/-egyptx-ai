const fs = require('fs');
let hero = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

hero = hero.replace(/>\s*Plan My Journey\s*</, ">{t('home.planBtn')}<");
hero = hero.replace(/>\s*Explore Egypt\s*</g, ">{t('home.exploreBtn')}<");
hero = hero.replace(/>\s*Virtual Egypt\s*</, ">{t('home.virtualEgypt')}<");

fs.writeFileSync('src/components/HeroSection.tsx', hero);
console.log('Fixed HeroSection buttons');
