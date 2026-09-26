const fs = require('fs');
const p = 'src/components/ExploreContent.tsx';
let t = fs.readFileSync(p, 'utf8');

// Replace White Desert and Wadi El Hitan in exactImageMap
t = t.replace(
  /"White Desert": "White Desertt.jpg",/g,
  `"White Desert": "https://images.unsplash.com/photo-1627725920703-e83616238fb0?q=80&w=2000&auto=format&fit=crop",`
);

t = t.replace(
  /"Wadi El Hitan": "Wadi El Hitann.jpg",/g,
  `"Wadi El Hitan": "https://images.unsplash.com/photo-1547849185-3bc6334a1fc2?q=80&w=2000&auto=format&fit=crop",`
);

// We need to also change the Fayoum Oasis mapping if it points to Wadi El Hitan
t = t.replace(
  /"Fayoum Oasis": "Wadi El Hitann.jpg",/g,
  `"Fayoum Oasis": "https://images.unsplash.com/photo-1547849185-3bc6334a1fc2?q=80&w=2000&auto=format&fit=crop",`
);

// Update getAttractionImage signature and logic
const getAttractionImageOld = `function getAttractionImage(name_en: string, category: string) {
  // Direct lookup from the exact map
  const matchedImage = exactImageMap[name_en] || "placeholder.jpg";
  const src = \`/images/\${matchedImage}\`;

  return (
    <img 
      src={src} 
      alt={name_en}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000&auto=format&fit=crop';
      }}
    />
  );
}`;

const getAttractionImageNew = `function getAttractionImage(name_en: string, name_ar: string, category: string) {
  // Direct lookup from the exact map
  const matchedImage = exactImageMap[name_en] || "placeholder.jpg";
  const src = matchedImage.startsWith('http') ? matchedImage : \`/images/\${matchedImage}\`;

  return (
    <img 
      src={src} 
      alt={\`\${name_en} / \${name_ar}\`}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000&auto=format&fit=crop';
      }}
    />
  );
}`;

t = t.replace(getAttractionImageOld, getAttractionImageNew);

// Update the call site in ExploreContent
t = t.replace(
  /\{getAttractionImage\(dest\.name_en, dest\.category\)\}/g,
  `{getAttractionImage(dest.name_en, dest.name_ar, dest.category)}`
);

fs.writeFileSync(p, t);
console.log('Updated ExploreContent.tsx');
