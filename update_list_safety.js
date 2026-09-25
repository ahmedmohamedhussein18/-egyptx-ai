const fs = require('fs');
let t = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');

const replacement = `const strictOrder = [
  "great pyramid of giza",
  "egyptian museum cairo",
  "karnak temple",
  "luxor temple",
  "valley of the kings",
  "abu simbel temples",
  "philae temple",
  "siwa oasis",
  "white desert",
  "grand egyptian museum",
  "saqqara step pyramid",
  "fayoum oasis",
  "red sea coast hurghada",
  "sharm el sheikh",
  "ras mohammed",
  "alexandria library",
  "saint catherine monastery",
  "citadel of saladin",
  "wadi el hitan",
  "egyptian museum (tahrir)",
  "mosque of muhammad ali",
  "sultan hassan mosque",
  "al-rifa'i mosque",
  "khan el-khalili bazaar",
  "al-azhar mosque",
  "hanging church (el muallaqa)",
  "coptic museum",
  "ben ezra synagogue",
  "amr ibn al-as mosque",
  "cairo tower (borg el qahira)",
  "manial palace museum",
  "museum of islamic art (cairo)",
  "bayt al-suhaymi",
  "al-azhar park",
  "qasr el nil bridge",
  "ibn tulun mosque",
  "gayer-anderson museum"
];`;

const start = t.indexOf('const strictOrder = [');
const end = t.indexOf('];', start) + 2;

t = t.substring(0, start) + replacement + t.substring(end);
fs.writeFileSync('src/components/ExploreContent.tsx', t, 'utf8');
console.log('List updated just in case.');
