const fs = require('fs');
let text = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');

const b64 = (str) => Buffer.from(str, 'base64').toString('utf8');

const replacement = `function getAttractionImage(name_en: string, category: string) {
  const name = name_en.toLowerCase();
  let matchedImage = "INSERT_IMAGE_HERE";

  // STRICT MAPPING
  if (name.includes('giza') && !name.includes('museum')) matchedImage = "great-pyramids-giza-aerial-scaled.jpg";
  else if (name.includes('alexandria library') || name.includes('bibliotheca')) matchedImage = "Alexandria-Library-Egypt-Tours-Portal.webp";
  else if (name.includes('azhar park')) matchedImage = "Al-Azhar-Park-Egypt-Tours-Portal.webp";
  else if (name.includes('rifai')) matchedImage = "AlRifaiMosque_Website05-033c8d40-7b35-4567-b0b4-d33411564bf4.jpg";
  else if (name.includes('grand egyptian museum') || name.includes('gem')) matchedImage = "cairo-grand-egyptian-museum-and-pyramids-of-giza-guided-tour-1305923.webp";
  else if (name.includes('catherine')) matchedImage = "Church-in-Saint-Catherine-Monastery-2.jpg";
  else if (name.includes('citadel') || name.includes('saladin')) matchedImage = "The-Citadel-of-Saladin-A-Fortress-of-History-1.jpg";
  else if (name.includes('hurghada')) matchedImage = "Hurghada-Beaches-Egypt-Tours-Portal.webp";
  else if (name.includes('ras mohammed') || name.includes('ras muhammad')) matchedImage = "Ras-Muhammad-National-Park.jpg";
  else if (name.includes('wadi al hitan') || name.includes('whales') || name.includes('hitan')) matchedImage = "wadi-al-hitan-valley-of-whales-day-trip-from-cairo-25355.webp";
  else if (name.includes('white desert')) matchedImage = "White-Desert-National-Park-mushroom-shaped-limestone.jpg";
  else if (name.includes('luxor temple')) matchedImage = "wide-view-luxor-temple-entrance-night-1770797641ZjPDW.jpg";
  else if (name.includes('amr ibn')) matchedImage = Buffer.from('2KzYp9mF2Llf2LnZhdix2Yhf2KjZhl/Yp9mE2LnYp9i1LmpwZw==', 'base64').toString('utf8');
  else if (name.includes('azhar mosque')) matchedImage = Buffer.from('2KzYp9mF2Lkt2KfZhNij2LLZh9ixMy5qcGc=', 'base64').toString('utf8');
  else if (name.includes('fayoum') || name.includes('faiyum')) matchedImage = "Facts-About-Faiyum-City-Egypt-Tours-Portal.webp";

  const src = matchedImage === "INSERT_IMAGE_HERE" ? "INSERT_IMAGE_HERE" : \`/images/\${matchedImage}\`;

  return (
    <img 
      src={src} 
      alt={name_en}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={(e) => {
        if (src !== "INSERT_IMAGE_HERE") {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000&auto=format&fit=crop';
        }
      }}
    />
  );
}`;

// We will replace from '// Smart Image Mapping logic' to the end of getAttractionImage function.
// Let's just find where it starts and ends
const startMatch = text.indexOf('// Smart Image Mapping logic');
const endMatchStr = '  );\n}';
let endMatch = text.indexOf(endMatchStr, startMatch);

if (startMatch !== -1 && endMatch !== -1) {
  text = text.substring(0, startMatch) + replacement + text.substring(endMatch + endMatchStr.length);
  fs.writeFileSync('src/components/ExploreContent.tsx', text, 'utf8');
  console.log('Fixed strictly');
} else {
  console.log('Could not find bounds', startMatch, endMatch);
}
