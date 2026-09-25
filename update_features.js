const fs = require('fs');

const path = 'src/components/FutureEcosystemSection.tsx';
let text = fs.readFileSync(path, 'utf8');

const newArray = `const UPCOMING_FEATURES = [
  {
    id: 1,
    title: 'VR Egypt',
    desc: 'Immersive 360° virtual tours of ancient wonders',
    icon: Globe,
    href: '/vr-egypt',
  },
  {
    id: 2,
    title: 'Kids Mode',
    desc: 'A magical, educational experience for young explorers',
    icon: Smile,
    href: '/kids',
  },
  {
    id: 3,
    title: 'Emergency Assistant',
    desc: '24/7 instant multilingual emergency support and location sharing',
    icon: Siren,
    href: '/emergency',
  },
  {
    id: 4,
    title: 'AI Memories',
    desc: 'Auto-generated story of your journey with photos and highlights',
    icon: Camera,
    href: '/memories',
  },
  {
    id: 5,
    title: 'Treasure Hunt',
    desc: 'Gamified exploration challenges with real rewards',
    icon: Map,
  },
  {
    id: 6,
    title: 'Sustainability Dashboard',
    desc: 'Tracking Egypt\\'s environmental impact and progress',
    icon: Leaf,
  },
  {
    id: 7,
    title: 'Research Hub',
    desc: 'AI-powered access to Egypt\\'s historical and archaeological data',
    icon: Search,
  },
];`;

const start = text.indexOf('const UPCOMING_FEATURES = [');
const end = text.indexOf('];', start) + 2;

text = text.substring(0, start) + newArray + text.substring(end);
fs.writeFileSync(path, text, 'utf8');
console.log('Fixed UPCOMING_FEATURES array');
