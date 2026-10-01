const fs = require('fs');
const en = JSON.parse(fs.readFileSync('messages/en.json','utf8'));
const ar = JSON.parse(fs.readFileSync('messages/ar.json','utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json','utf8'));

const required = [
  'home.ecosystem.title1',
  'home.ecosystem.title2',
  'home.ecosystem.subtitle',
  'home.ecosystem.comingSoon',
  'home.ecosystem.features.vrEgypt.title',
  'home.ecosystem.features.vrEgypt.desc',
  'home.ecosystem.features.kidsMode.title',
  'home.ecosystem.features.aiMemories.title',
  'home.ecosystem.features.treasureHunt.title',
  'home.ecosystem.features.sustainability.title',
  'home.ecosystem.features.researchHub.title',
];

function get(obj, path) {
  return path.split('.').reduce((o, k) => o && o[k], obj);
}

let allGood = true;
required.forEach(key => {
  const enVal = get(en, key);
  const arVal = get(ar, key);
  const frVal = get(fr, key);
  if (!enVal || !arVal || !frVal) {
    console.log('MISSING: ' + key);
    allGood = false;
  } else {
    console.log('OK: ' + key);
  }
});

if (allGood) console.log('\nAll required keys present in en/ar/fr!');
