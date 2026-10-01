const fs = require('fs');

// ==== 1. FourPillarsSection.tsx ====
let fp = fs.readFileSync('src/components/FourPillarsSection.tsx', 'utf8');

fp = fp.replace(/const getPillars = \(t: any\) => \[\s*\{[\s\S]*?\}\s*\];/m, `const getPillars = (t: any) => [
    {
      icon: <Compass className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.aiPlanning.title'),
      description: t('home.fourPillars.aiPlanning.desc'),
      action: t('home.fourPillars.aiPlanning.action'),
      link: "/planner"
    },
    {
      icon: <Map className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.smartSites.title'),
      description: t('home.fourPillars.smartSites.desc'),
      action: t('home.fourPillars.smartSites.action'),
      link: "/smart-site"
    },
    {
      icon: <Headphones className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.vrEgypt.title'),
      description: t('home.fourPillars.vrEgypt.desc'),
      action: t('home.fourPillars.vrEgypt.action'),
      link: "/vr-egypt"
    },
    {
      icon: <Camera className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.aiMemories.title'),
      description: t('home.fourPillars.aiMemories.desc'),
      action: t('home.fourPillars.aiMemories.action'),
      link: "/memories"
    }
  ];`);

fs.writeFileSync('src/components/FourPillarsSection.tsx', fp);

// ==== 2. FutureEcosystemSection.tsx ====
let eco = fs.readFileSync('src/components/FutureEcosystemSection.tsx', 'utf8');

// Replace UPCOMING_FEATURES completely
eco = eco.replace(/const UPCOMING_FEATURES = \[\s*\{[\s\S]*?\}\s*\];/m, `const getUpcomingFeatures = (t: any) => [
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
];`);

// Fix type errors
eco = eco.replace(/getUpcomingFeatures\(t\)\.map\(\(feature, idx\)/, "getUpcomingFeatures(t).map((feature: any, idx: number)");

fs.writeFileSync('src/components/FutureEcosystemSection.tsx', eco);


// ==== 3. SmartTourismSection.tsx ====
let st = fs.readFileSync('src/components/SmartTourismSection.tsx', 'utf8');

st = st.replace(/getCards\(t\)\.map\(\(card, index\)/, "getCards(t).map((card: any, index: number)");

fs.writeFileSync('src/components/SmartTourismSection.tsx', st);

console.log('Fixed syntax and type errors.');
