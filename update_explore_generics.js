const fs = require('fs');

let text = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');

const replacement = `const genericPool = [
  "4548.jpg", 
  "411867.jpg", 
  "images (1).jpeg", 
  "images.jpeg", 
  "caption.jpg", 
  "photo0jpg.jpg", 
  "photo_67adbe792ee7e.jpeg", 
  "IMG_20220524_184237.jpg", 
  "shutterstock_1304499067-1-788x537.webp", 
  "shutterstock_2154847113-1024x683.jpg",
  "771460fe-274f-439f-b278-a628d7b64790.jpg"
];

function getAttractionImage(name_en: string, category: string) {
  const name = name_en.toLowerCase();
  let matchedImage = "";

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
  
  // NEW ADDITIONS
  else if (name.includes('ibn tulun')) matchedImage = "mezquita-ibn-tulun-m.avif";
  else if (name.includes('sultan hassan') || name.includes('sultan hasan')) matchedImage = "mezquita-sultan-hasan-m.avif";
  else if (name.includes('khan el-khalili') || name.includes('khan el khalili')) matchedImage = "khan-el-khalili-m.avif";
  else if (name.includes('qasr el nil') || name.includes('kasr')) matchedImage = "Kasr_Al_Nile_Bridge.jpeg";
  else if (name.includes('suhaymi')) matchedImage = "Islamic_Spiritual_Place__House_of_Suhaymi_Darb_al-Asfar_Al-Gamaliyya_CairoEgypt-1024x678.jpg";
  else if (name.includes('islamic art')) matchedImage = "Museum-of-Islamic-Art-Building-in-Cairo-Egypt.webp";
  else if (name.includes('sharm el sheikh')) matchedImage = "V-SSH_-Swimming-Pool-12-1.webp";
  else if (name.includes('coptic')) matchedImage = "IMG_0378_Egypt_Cairo_Coptic_Museum_Tower_Tahir_Square_010.jpg";

  if (!matchedImage) {
    // Generate deterministic index based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    const idx = Math.abs(hash) % genericPool.length;
    matchedImage = genericPool[idx];
  }

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

const startMatch = text.indexOf('function getAttractionImage');
const endMatchStr = '  );\n}';
let endMatch = text.indexOf(endMatchStr, startMatch);

if (startMatch !== -1 && endMatch !== -1) {
  text = text.substring(0, startMatch) + replacement + text.substring(endMatch + endMatchStr.length);
  fs.writeFileSync('src/components/ExploreContent.tsx', text, 'utf8');
  console.log('Fixed properly with generics');
} else {
  console.log('Could not find bounds');
}
