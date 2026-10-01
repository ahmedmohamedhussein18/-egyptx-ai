const fs = require('fs');

let eco = fs.readFileSync('src/components/FutureEcosystemSection.tsx', 'utf8');

const replacement = `const getUpcomingFeatures = (t: any) => [
  {
    id: 1,
    title: t('home.ecosystem.features.vrEgypt.title'),
    desc: t('home.ecosystem.features.vrEgypt.desc'),
    icon: Globe,
    href: '/vr-egypt',
  },
  {
    id: 2,
    title: t('home.ecosystem.features.kidsMode.title'),
    desc: t('home.ecosystem.features.kidsMode.desc'),
    icon: Smile,
    href: '/kids',
  },
  {
    id: 3,
    title: t('home.ecosystem.features.emergency.title'),
    desc: t('home.ecosystem.features.emergency.desc'),
    icon: Siren,
    href: '/emergency',
  },
  {
    id: 4,
    title: t('home.ecosystem.features.aiMemories.title'),
    desc: t('home.ecosystem.features.aiMemories.desc'),
    icon: Camera,
    href: '/memories',
  },
  {
    id: 5,
    title: t('home.ecosystem.features.treasureHunt.title'),
    desc: t('home.ecosystem.features.treasureHunt.desc'),
    icon: Map,
  },
  {
    id: 6,
    title: t('home.ecosystem.features.sustainability.title'),
    desc: t('home.ecosystem.features.sustainability.desc'),
    icon: Leaf,
  },
  {
    id: 7,
    title: t('home.ecosystem.features.researchHub.title'),
    desc: t('home.ecosystem.features.researchHub.desc'),
    icon: Search,
  },
];`;

const startIdx = eco.indexOf('const UPCOMING_FEATURES = [');
const endIdx = eco.indexOf('];', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
  eco = eco.substring(0, startIdx) + replacement + eco.substring(endIdx + 2);
}

// In case it still says UPCOMING_FEATURES.map
eco = eco.replace(/UPCOMING_FEATURES\.map\(/g, "getUpcomingFeatures(t).map(");
eco = eco.replace(/getUpcomingFeatures\(t\)\.map\(\(feature, idx\)/g, "getUpcomingFeatures(t).map((feature: any, idx: number)");

fs.writeFileSync('src/components/FutureEcosystemSection.tsx', eco);
console.log('Fixed FutureEcosystemSection.tsx');
