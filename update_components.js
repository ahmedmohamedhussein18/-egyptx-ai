const fs = require('fs');

// ==== 1. FourPillarsSection.tsx ====
let fp = fs.readFileSync('src/components/FourPillarsSection.tsx', 'utf8');

if (!fp.includes('useLanguage')) {
  fp = fp.replace(/import React from 'react';/, "import React from 'react';\nimport { useLanguage } from '@/context/LanguageContext';");
}
if (!fp.includes('const { t } = useLanguage()')) {
  fp = fp.replace(/export default function FourPillarsSection\(\) \{/, "export default function FourPillarsSection() {\n  const { t } = useLanguage();");
}

fp = fp.replace(/const pillars = \[\s*\{[\s\S]*?\}\s*\];/, `const getPillars = (t: any) => [
    {
      icon: <BrainCircuit className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.aiPlanning.title'),
      description: t('home.fourPillars.aiPlanning.desc'),
      action: t('home.fourPillars.aiPlanning.action'),
      link: "/planner"
    },
    {
      icon: <ScanFace className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.smartSites.title'),
      description: t('home.fourPillars.smartSites.desc'),
      action: t('home.fourPillars.smartSites.action'),
      link: "/smart-site"
    },
    {
      icon: <Glasses className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.vrEgypt.title'),
      description: t('home.fourPillars.vrEgypt.desc'),
      action: t('home.fourPillars.vrEgypt.action'),
      link: "/vr-egypt"
    },
    {
      icon: <Image className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.aiMemories.title'),
      description: t('home.fourPillars.aiMemories.desc'),
      action: t('home.fourPillars.aiMemories.action'),
      link: "/memories"
    }
  ];`);

fp = fp.replace(/pillars\.map\(/, "getPillars(t).map(");
fp = fp.replace(/The Four Core Pillars/, "{t('home.fourPillars.title')}");
fp = fp.replace(/A seamless digital experience from planning to memories/, "{t('home.fourPillars.subtitle')}");

fs.writeFileSync('src/components/FourPillarsSection.tsx', fp);


// ==== 2. SmartTourismSection.tsx ====
let st = fs.readFileSync('src/components/SmartTourismSection.tsx', 'utf8');

if (!st.includes('useLanguage')) {
  st = st.replace(/import React from 'react';/, "import React from 'react';\nimport { useLanguage } from '@/context/LanguageContext';");
}
if (!st.includes('const { t } = useLanguage()')) {
  st = st.replace(/export default function SmartTourismSection\(\) \{/, "export default function SmartTourismSection() {\n  const { t } = useLanguage();");
}

st = st.replace(/const cards = \[\s*\{[\s\S]*?\}\s*\];/, `const getCards = (t: any) => [
  {
    title: t('home.smartTourism.aiPowered.title'),
    icon: <BrainIcon />,
    description: t('home.smartTourism.aiPowered.desc'),
    tag: t('home.smartTourism.aiPowered.tag'),
  },
  {
    title: t('home.smartTourism.smartHeritage.title'),
    icon: <TempleIcon />,
    description: t('home.smartTourism.smartHeritage.desc'),
    tag: t('home.smartTourism.smartHeritage.tag'),
  },
  {
    title: t('home.smartTourism.distribution.title'),
    icon: <NetworkIcon />,
    description: t('home.smartTourism.distribution.desc'),
    tag: t('home.smartTourism.distribution.tag'),
  },
];`);

st = st.replace(/cards\.map\(/, "getCards(t).map(");
st = st.replace(/Smart Tourism Overview/, "{t('home.smartTourism.title')}");
st = st.replace(/Revolutionizing how the world experiences Egypt/, "{t('home.smartTourism.subtitle')}");

fs.writeFileSync('src/components/SmartTourismSection.tsx', st);

console.log('Components updated.');
