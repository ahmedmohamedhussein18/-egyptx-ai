const fs = require('fs');

let st = fs.readFileSync('src/components/SmartTourismSection.tsx', 'utf8');

const replacement = `const getCards = (t: any) => [
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
];`;

const startIdx = st.indexOf('const cards = [');
const endIdx = st.indexOf('];', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  st = st.substring(0, startIdx) + replacement + st.substring(endIdx + 2);
}

st = st.replace(/cards\.map\(/g, "getCards(t).map(");
st = st.replace(/getCards\(t\)\.map\(\(card, index\)/g, "getCards(t).map((card: any, index: number)");

fs.writeFileSync('src/components/SmartTourismSection.tsx', st);
console.log('Fixed SmartTourismSection.tsx');
