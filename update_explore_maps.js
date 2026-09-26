const fs = require('fs');
const p = 'src/components/ExploreContent.tsx';
let content = fs.readFileSync(p, 'utf8');

content = content.replace(/"Siwa Oasis": "Siwa Oasis\.jpg"/g, '"Siwa Oasis": "Fantasy-Island-egypt-siwaa-oasis.jpg"');
content = content.replace(/"White Desert": "White Desert\.jpg"/g, '"White Desert": "White Desertt.jpg"');
content = content.replace(/"Fayoum Oasis": "Fayoum Oasis\.jpg"/g, '"Fayoum Oasis": "Wadi El Hitann.jpg"');
content = content.replace(/"Wadi El Hitan": "Wadi El Hitan\.jpeg"/g, '"Wadi El Hitan": "Wadi El Hitann.jpg"');
content = content.replace(/"Wadi El Hitan": "Wadi El Hitan\.jpg"/g, '"Wadi El Hitan": "Wadi El Hitann.jpg"');

fs.writeFileSync(p, content, 'utf8');
console.log('Updated ExploreContent.tsx');
