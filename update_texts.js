const fs = require('fs');

let hero = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
hero = hero.replace(/>\s*Welcome back,\s*</g, ">{t('home.welcomeBack')} <");
hero = hero.replace(/>\s*National Smart Tourism Ecosystem\s*</, ">{t('home.badge')}<");
hero = hero.replace(/>\s*Scroll to explore\s*</, ">{t('home.scroll')}<");

fs.writeFileSync('src/components/HeroSection.tsx', hero);
console.log('Fixed HeroSection');

let dest = fs.readFileSync('src/components/DestinationsSection.tsx', 'utf8');
dest = dest.replace(/const destinations = \[/g, "const getDestinations = (t: any) => [");

dest = dest.replace(/name: 'Giza',/g, "name: t('destinations.giza.name'),");
dest = dest.replace(/tagline: 'The Eternal Wonders',/g, "tagline: t('destinations.giza.tagline'),");
dest = dest.replace(/highlights: 'Great Pyramids • Sphinx • Sound & Light',/g, "highlights: t('destinations.giza.highlights'),");
dest = dest.replace(/description: "Home to the last surviving wonder[^"]*",/g, "description: t('destinations.giza.desc'),");

dest = dest.replace(/name: 'Luxor',/g, "name: t('destinations.luxor.name'),");
dest = dest.replace(/tagline: 'The World\\'s Greatest Open-Air Museum',/g, "tagline: t('destinations.luxor.tagline'),");
dest = dest.replace(/highlights: 'Valley of Kings • Karnak • Luxor Temple',/g, "highlights: t('destinations.luxor.highlights'),");
dest = dest.replace(/description: "Luxor is the world's greatest open-air museum[^"]*",/g, "description: t('destinations.luxor.desc'),");

dest = dest.replace(/name: 'Aswan',/g, "name: t('destinations.aswan.name'),");
dest = dest.replace(/tagline: 'Where the Nile Begins',/g, "tagline: t('destinations.aswan.tagline'),");
dest = dest.replace(/highlights: 'Philae Temple • Nubian Villages • Felucca Rides',/g, "highlights: t('destinations.aswan.highlights'),");
dest = dest.replace(/description: "Where the Nile meets Nubian culture[^"]*",/g, "description: t('destinations.aswan.desc'),");

dest = dest.replace(/name: 'Siwa',/g, "name: t('destinations.siwa.name'),");
dest = dest.replace(/tagline: 'The Desert Oasis',/g, "tagline: t('destinations.siwa.tagline'),");
dest = dest.replace(/highlights: 'Oracle Temple • Salt Lakes • Stargazing',/g, "highlights: t('destinations.siwa.highlights'),");
dest = dest.replace(/description: "Siwa Oasis is Egypt's most remote and magical destination[^"]*",/g, "description: t('destinations.siwa.desc'),");

dest = dest.replace(/name: 'Fayoum',/g, "name: t('destinations.fayoum.name'),");
dest = dest.replace(/tagline: 'Nature\\'s Hidden Gem',/g, "tagline: t('destinations.fayoum.tagline'),");
dest = dest.replace(/highlights: 'Wadi El Rayan • Whale Valley • Lake Qarun',/g, "highlights: t('destinations.fayoum.highlights'),");
dest = dest.replace(/description: "Fayoum is Egypt's best-kept secret[^"]*",/g, "description: t('destinations.fayoum.desc'),");

dest = dest.replace(/name: 'Hurghada',/g, "name: t('destinations.hurghada.name'),");
dest = dest.replace(/tagline: 'Red Sea Paradise',/g, "tagline: t('destinations.hurghada.tagline'),");
dest = dest.replace(/highlights: 'Coral Reefs • Marine Life • Desert Safari',/g, "highlights: t('destinations.hurghada.highlights'),");
dest = dest.replace(/description: "Hurghada transformed from a small fishing village[^"]*",/g, "description: t('destinations.hurghada.desc'),");

dest = dest.replace(/>\s*Explore \&rarr;\s*</g, ">{t('exploreDest')}<");

dest = dest.replace(/useState<typeof destinations\[0\]/g, "useState<any");
dest = dest.replace(/destinations\.map\(/g, "getDestinations(t).map(");

fs.writeFileSync('src/components/DestinationsSection.tsx', dest);
console.log('Fixed DestinationsSection');
