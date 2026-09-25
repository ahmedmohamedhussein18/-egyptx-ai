const fs = require('fs');
let text = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');

const replacement = `// Smart Image Mapping logic
const allImages = [
  "411867.jpg",
  "4548.jpg",
  "771460fe-274f-439f-b278-a628d7b64790.jpg",
  "Al-Azhar-Park-Egypt-Tours-Portal.webp",
  "Alexandria-Library-Egypt-Tours-Portal.webp",
  "AlRifaiMosque_Website05-033c8d40-7b35-4567-b0b4-d33411564bf4.jpg",
  "aswan.jpg",
  "cairo-grand-egyptian-museum-and-pyramids-of-giza-guided-tour-1305923.webp",
  "caption.jpg",
  "Church-in-Saint-Catherine-Monastery-2.jpg",
  "citadel-in-Cairo-Tours-in-Egypt.jpg",
  "Facts-About-Faiyum-City-Egypt-Tours-Portal.webp",
  "fayoum.jpg",
  "GettyImages-145167188-5b0fd1563418c60038dca8a8.jpg",
  "giza.jpg",
  "great-pyramids-giza-aerial-scaled.jpg",
  "Hurghada-Beaches-Egypt-Tours-Portal.webp",
  "hurghada.jpg",
  "images (1).jpeg",
  "images.jpeg",
  "IMG_0378_Egypt_Cairo_Coptic_Museum_Tower_Tahir_Square_010.jpg",
  "IMG_20220524_184237.jpg",
  "Islamic_Spiritual_Place__House_of_Suhaymi_Darb_al-Asfar_Al-Gamaliyya_CairoEgypt-1024x678.jpg",
  "Kasr_Al_Nile_Bridge.jpeg",
  "khan-el-khalili-m.avif",
  "luxor.jpg",
  "mezquita-ibn-tulun-m.avif",
  "mezquita-sultan-hasan-m.avif",
  "Museum-of-Islamic-Art-Building-in-Cairo-Egypt.webp",
  "photo0jpg.jpg",
  "photo_67adbe792ee7e.jpeg",
  "ras-mohammed.jpg",
  "Ras-Muhammad-National-Park.jpg",
  "shutterstock_1304499067-1-788x537.webp",
  "shutterstock_2154847113-1024x683.jpg",
  "siwa.jpg",
  "The-Ben-Ezra-Synagogue-A-Jewish-Heritage-Site-1024x732.jpeg",
  "The-Citadel-of-Saladin-A-Fortress-of-History-1.jpg",
  "V-SSH_-Swimming-Pool-12-1.webp",
  "wadi-al-hitan-valley-of-whales-day-trip-from-cairo-25355.webp",
  "White-Desert-National-Park-mushroom-shaped-limestone.jpg",
  "white-desert.jpg",
  "wide-view-luxor-temple-entrance-night-1770797641ZjPDW.jpg",
  "جامع-الأزهر3.jpg",
  "جامع_عمرو_بن_العاص.jpg"
];

let genericIndex = 0;
const genericImages = allImages.filter(img => 
  /^[0-9a-f-]+\\.jpg$|^images.*?\\.jpeg$|^photo.*|^caption\\.jpg$|^IMG_20220524_184237\\.jpg$|^shutterstock.*/i.test(img)
);

function getAttractionImage(name_en: string, category: string) {
  const name = name_en.toLowerCase();
  let matchedImage = "";

  if (name.includes('azhar park')) matchedImage = "Al-Azhar-Park-Egypt-Tours-Portal.webp";
  else if (name.includes('azhar mosque')) matchedImage = "جامع-الأزهر3.jpg";
  else if (name.includes('amr ibn')) matchedImage = "جامع_عمرو_بن_العاص.jpg";
  else if (name.includes('rifai')) matchedImage = "AlRifaiMosque_Website05-033c8d40-7b35-4567-b0b4-d33411564bf4.jpg";
  else if (name.includes('alexandria library') || name.includes('bibliotheca')) matchedImage = "Alexandria-Library-Egypt-Tours-Portal.webp";
  else if (name.includes('catherine')) matchedImage = "Church-in-Saint-Catherine-Monastery-2.jpg";
  else if (name.includes('citadel') || name.includes('saladin')) matchedImage = "citadel-in-Cairo-Tours-in-Egypt.jpg";
  else if (name.includes('fayoum') || name.includes('faiyum')) matchedImage = "fayoum.jpg";
  else if (name.includes('wadi al hitan') || name.includes('whales')) matchedImage = "wadi-al-hitan-valley-of-whales-day-trip-from-cairo-25355.webp";
  else if (name.includes('giza') || name.includes('pyramid')) matchedImage = "great-pyramids-giza-aerial-scaled.jpg";
  else if (name.includes('grand egyptian museum') || name.includes('gem')) matchedImage = "cairo-grand-egyptian-museum-and-pyramids-of-giza-guided-tour-1305923.webp";
  else if (name.includes('hurghada')) matchedImage = "hurghada.jpg";
  else if (name.includes('coptic') || name.includes('hanging')) matchedImage = "IMG_0378_Egypt_Cairo_Coptic_Museum_Tower_Tahir_Square_010.jpg";
  else if (name.includes('suhaymi') || name.includes('bayt')) matchedImage = "Islamic_Spiritual_Place__House_of_Suhaymi_Darb_al-Asfar_Al-Gamaliyya_CairoEgypt-1024x678.jpg";
  else if (name.includes('kasr al nile') || name.includes('qasr')) matchedImage = "Kasr_Al_Nile_Bridge.jpeg";
  else if (name.includes('khan el khalili') || name.includes('bazaar')) matchedImage = "khan-el-khalili-m.avif";
  else if (name.includes('luxor') || name.includes('karnak') || name.includes('valley of the kings')) matchedImage = "luxor.jpg";
  else if (name.includes('ibn tulun')) matchedImage = "mezquita-ibn-tulun-m.avif";
  else if (name.includes('sultan hasan')) matchedImage = "mezquita-sultan-hasan-m.avif";
  else if (name.includes('islamic art')) matchedImage = "Museum-of-Islamic-Art-Building-in-Cairo-Egypt.webp";
  else if (name.includes('ras mohammed') || name.includes('ras muhammad')) matchedImage = "Ras-Muhammad-National-Park.jpg";
  else if (name.includes('siwa')) matchedImage = "siwa.jpg";
  else if (name.includes('ben ezra')) matchedImage = "The-Ben-Ezra-Synagogue-A-Jewish-Heritage-Site-1024x732.jpeg";
  else if (name.includes('white desert')) matchedImage = "White-Desert-National-Park-mushroom-shaped-limestone.jpg";
  else if (name.includes('aswan') || name.includes('philae') || name.includes('abu simbel')) matchedImage = "aswan.jpg";
  else if (category === 'beach' || category === 'nature') matchedImage = "V-SSH_-Swimming-Pool-12-1.webp";

  if (!matchedImage) {
    matchedImage = genericImages[genericIndex % genericImages.length];
    genericIndex++;
  }

  return (
    <img 
      src={\`/images/\${matchedImage}\`} 
      alt={name_en}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000&auto=format&fit=crop';
      }}
    />
  );
}`;

text = text.replace(/function getAttractionSvg[\s\S]*?function WeatherBadge/, replacement + '\n\n// Weather Badge component to fetch weather for each card individually\nfunction WeatherBadge');
text = text.replace('{getAttractionSvg(dest.name_en, dest.category)}', '{getAttractionImage(dest.name_en, dest.category)}');

fs.writeFileSync('src/components/ExploreContent.tsx', text, 'utf8');
console.log('Fixed ExploreContent successfully.');
