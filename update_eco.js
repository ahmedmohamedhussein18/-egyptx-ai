const fs = require('fs');

const files = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'].map(l => 'messages/' + l + '.json');

const ecosystemKeys = {
  title1: "Expanding the ",
  title2: "Ecosystem",
  subtitle: "EgyptX AI is continuously evolving. Here's what's coming next.",
  comingSoon: "Coming Soon",
  features: {
    vrEgypt: {
      title: "VR Egypt",
      desc: "Immersive 360° virtual tours of ancient wonders"
    },
    kidsMode: {
      title: "Kids Mode",
      desc: "A magical, educational experience for young explorers"
    },
    emergency: {
      title: "Emergency Assistant",
      desc: "24/7 instant multilingual emergency support and location sharing"
    },
    aiMemories: {
      title: "AI Memories",
      desc: "Auto-generated story of your journey with photos and highlights"
    },
    treasureHunt: {
      title: "Treasure Hunt",
      desc: "Gamified exploration challenges with real rewards"
    },
    sustainability: {
      title: "Sustainability Dashboard",
      desc: "Tracking Egypt's environmental impact and progress"
    },
    researchHub: {
      title: "Research Hub",
      desc: "AI-powered access to Egypt's historical and archaeological data"
    }
  }
};

files.forEach(f => {
  let data = JSON.parse(fs.readFileSync(f, 'utf8'));
  data.home = data.home || {};
  data.home.ecosystem = ecosystemKeys;
  fs.writeFileSync(f, JSON.stringify(data, null, 2));
});

let eco = fs.readFileSync('src/components/FutureEcosystemSection.tsx', 'utf8');

if (!eco.includes('useLanguage')) {
  eco = eco.replace(/import React from 'react';/, "import React from 'react';\nimport { useLanguage } from '@/context/LanguageContext';");
}
if (!eco.includes('const { t } = useLanguage()')) {
  eco = eco.replace(/export default function FutureEcosystemSection\(\) \{/, "export default function FutureEcosystemSection() {\n  const { t } = useLanguage();");
}

eco = eco.replace(/const UPCOMING_FEATURES = \[\s*\{[\s\S]*?\}\s*\];/, `const getUpcomingFeatures = (t: any) => [
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

eco = eco.replace(/UPCOMING_FEATURES\.map\(/, "getUpcomingFeatures(t).map(");
eco = eco.replace(/Expanding the /, "{t('home.ecosystem.title1')}");
eco = eco.replace(/Ecosystem<\/span>/, "{t('home.ecosystem.title2')}<\/span>");
eco = eco.replace(/EgyptX AI is continuously evolving\. Here&apos;s what&apos;s coming next\./, "{t('home.ecosystem.subtitle')}");
eco = eco.replace(/Coming Soon\n/, "{t('home.ecosystem.comingSoon')}\n");

fs.writeFileSync('src/components/FutureEcosystemSection.tsx', eco);

console.log('Ecosystem updated.');
