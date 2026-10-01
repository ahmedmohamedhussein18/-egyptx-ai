const fs = require('fs');

// =============================================
// 1. Add translation keys to all 8 JSON files
// =============================================
const langs = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'];

const newKeys = {
  ecosystem: {
    tourists: 'Tourists',
    businesses: 'Businesses',
    data: 'Data',
    heritage: 'Heritage',
    stats: {
      systems: '7 Integrated Systems',
      realTime: 'Real-Time Data Flow',
      insights: 'AI-Driven Insights',
      coverage: 'Nationwide Coverage',
    }
  },
  mobility: {
    title: 'Smart Mobility',
    subtitle: 'Connected transport ecosystem',
    comingSoon: 'Coming Soon',
    integration: 'Integration in Progress',
    notifyPlaceholder: 'Enter email to get notified',
    notifyBtn: 'Notify Me',
    added: 'Added to list!',
    airport: {
      title: 'Airport Transfers',
      desc: 'Seamless transfers from Cairo, Sphinx, and Luxor international airports.',
    },
    city: {
      title: 'City Transport',
      desc: 'On-demand smart vehicles for safe and verified inner-city travel.',
    },
    buses: {
      title: 'Tourist Buses',
      desc: 'Intercity eco-friendly buses connecting major governorates and attractions.',
    },
    nile: {
      title: 'Nile Cruises',
      desc: 'Integrated booking for authenticated smart cruises along the Nile.',
    },
  }
};

langs.forEach(lang => {
  const f = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(f, 'utf8'));
  data.home = data.home || {};
  data.home.ecosystem = newKeys.ecosystem;
  data.home.mobility = newKeys.mobility;
  fs.writeFileSync(f, JSON.stringify(data, null, 2));
});

console.log('JSON files updated.');


// =============================================
// 2. Fix EcosystemSection.tsx
// =============================================
let eco = fs.readFileSync('src/components/EcosystemSection.tsx', 'utf8');

// Add useLanguage import if missing
if (!eco.includes("useLanguage")) {
  eco = eco.replace(
    /import \{ useEffect, useState \} from 'react';/,
    "import { useEffect, useState } from 'react';\nimport { useLanguage } from '@/context/LanguageContext';"
  );
}

// Replace the nodes array with a getter fn
const nodesOld = `const nodes = [
  { id: 'Tourists', label: 'Tourists', icon: Icons.Tourists },
  { id: 'Businesses', label: 'Businesses', icon: Icons.Businesses },
  { id: 'Data', label: 'Data', icon: Icons.Data },
  { id: 'Heritage', label: 'Heritage', icon: Icons.Heritage },
];`;

const nodesNew = `const getNodes = (t: (k: string) => string) => [
  { id: 'Tourists', label: t('home.ecosystem.tourists'), icon: Icons.Tourists },
  { id: 'Businesses', label: t('home.ecosystem.businesses'), icon: Icons.Businesses },
  { id: 'Data', label: t('home.ecosystem.data'), icon: Icons.Data },
  { id: 'Heritage', label: t('home.ecosystem.heritage'), icon: Icons.Heritage },
];`;

eco = eco.replace(nodesOld, nodesNew);

// Add t hook inside the component function (after const [mounted...])
eco = eco.replace(
  /export default function EcosystemSection\(\) \{/,
  `export default function EcosystemSection() {
  const { t } = useLanguage();`
);

// Add nodes = getNodes(t) inside component, after mounted check is done
// The nodePositions uses 'nodes' which is now a fn — we need to compute inside the component
// Insert nodes const after the hook declarations
eco = eco.replace(
  /if \(!mounted\) return null;/,
  `const nodes = getNodes(t);
  if (!mounted) return null;`
);

// Replace the inline stats array
eco = eco.replace(
  `{ label: '7 Integrated Systems', icon: Icons.Systems },
            { label: 'Real-Time Data Flow', icon: Icons.RealTime },
            { label: 'AI-Driven Insights', icon: Icons.Insights },
            { label: 'Nationwide Coverage', icon: Icons.Coverage },`,
  `{ label: t('home.ecosystem.stats.systems'), icon: Icons.Systems },
            { label: t('home.ecosystem.stats.realTime'), icon: Icons.RealTime },
            { label: t('home.ecosystem.stats.insights'), icon: Icons.Insights },
            { label: t('home.ecosystem.stats.coverage'), icon: Icons.Coverage },`
);

// Remove old nodePositions (it used nodes at module level)
const oldNodePos = `// Pre-compute node positions so they're consistent between server and client
const DIAGRAM_CENTER = 300;
const RADIUS = 220;
const nodePositions = nodes.map((_, index) => {
  const angle = (index * (360 / nodes.length) - 90) * (Math.PI / 180); // Start from top (-90°)
  return {
    x: DIAGRAM_CENTER + RADIUS * Math.cos(angle),
    y: DIAGRAM_CENTER + RADIUS * Math.sin(angle),
  };
});`;

const newNodePos = `// Pre-compute node positions so they're consistent between server and client
const DIAGRAM_CENTER = 300;
const RADIUS = 220;`;

eco = eco.replace(oldNodePos, newNodePos);

// Now nodePositions must be computed inside the component — add after nodes const
eco = eco.replace(
  `const nodes = getNodes(t);
  if (!mounted) return null;`,
  `const nodes = getNodes(t);
  const nodePositions = nodes.map((_, index) => {
    const angle = (index * (360 / nodes.length) - 90) * (Math.PI / 180);
    return {
      x: DIAGRAM_CENTER + RADIUS * Math.cos(angle),
      y: DIAGRAM_CENTER + RADIUS * Math.sin(angle),
    };
  });
  if (!mounted) return null;`
);

fs.writeFileSync('src/components/EcosystemSection.tsx', eco);
console.log('EcosystemSection.tsx updated.');


// =============================================
// 3. Fix SmartMobilitySection.tsx
// =============================================
let mob = fs.readFileSync('src/components/SmartMobilitySection.tsx', 'utf8');

// Add useLanguage import
if (!mob.includes("useLanguage")) {
  mob = mob.replace(
    /import React, \{ useState \} from 'react';/,
    "import React, { useState } from 'react';\nimport { useLanguage } from '@/context/LanguageContext';"
  );
}

// Replace static array with getter fn
const servicesOld = `const MOBILITY_SERVICES = [
  {
    id: 'airport',
    title: 'Airport Transfers',
    description: 'Seamless transfers from Cairo, Sphinx, and Luxor international airports.',
    icon: <Plane className="w-8 h-8 text-[#C9A84C]" />
  },
  {
    id: 'city',
    title: 'City Transport',
    description: 'On-demand smart vehicles for safe and verified inner-city travel.',
    icon: <Car className="w-8 h-8 text-[#4CC9F0]" />
  },
  {
    id: 'buses',
    title: 'Tourist Buses',
    description: 'Intercity eco-friendly buses connecting major governorates and attractions.',
    icon: <Bus className="w-8 h-8 text-purple-400" />
  },
  {
    id: 'nile',
    title: 'Nile Cruises',
    description: 'Integrated booking for authenticated smart cruises along the Nile.',
    icon: <Ship className="w-8 h-8 text-green-400" />
  }
];`;

const servicesNew = `const getMobilityServices = (t: (k: string) => string) => [
  {
    id: 'airport',
    title: t('home.mobility.airport.title'),
    description: t('home.mobility.airport.desc'),
    icon: <Plane className="w-8 h-8 text-[#C9A84C]" />
  },
  {
    id: 'city',
    title: t('home.mobility.city.title'),
    description: t('home.mobility.city.desc'),
    icon: <Car className="w-8 h-8 text-[#4CC9F0]" />
  },
  {
    id: 'buses',
    title: t('home.mobility.buses.title'),
    description: t('home.mobility.buses.desc'),
    icon: <Bus className="w-8 h-8 text-purple-400" />
  },
  {
    id: 'nile',
    title: t('home.mobility.nile.title'),
    description: t('home.mobility.nile.desc'),
    icon: <Ship className="w-8 h-8 text-green-400" />
  }
];`;

mob = mob.replace(servicesOld, servicesNew);

// Add t hook inside component
mob = mob.replace(
  /export default function SmartMobilitySection\(\) \{/,
  `export default function SmartMobilitySection() {
  const { t } = useLanguage();`
);

// Add const inside component body after hooks
mob = mob.replace(
  /const \[email, setEmail\] = useState\(''\);/,
  `const MOBILITY_SERVICES = getMobilityServices(t);
  const [email, setEmail] = useState('');`
);

// Replace hardcoded strings in JSX
mob = mob.replace(/Smart Mobility/, "{t('home.mobility.title')}");
mob = mob.replace(/Connected transport ecosystem/, "{t('home.mobility.subtitle')}");
mob = mob.replace(/>Coming Soon</, ">{t('home.mobility.comingSoon')}<");
mob = mob.replace(/>Integration in Progress</, ">{t('home.mobility.integration')}<");
mob = mob.replace(/placeholder="Enter email to get notified"/, "placeholder={t('home.mobility.notifyPlaceholder')}");
mob = mob.replace(/'Notify Me'/, "t('home.mobility.notifyBtn')");
mob = mob.replace(/>Added to list!</, ">{t('home.mobility.added')}<");

fs.writeFileSync('src/components/SmartMobilitySection.tsx', mob);
console.log('SmartMobilitySection.tsx updated.');
