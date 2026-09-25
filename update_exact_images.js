const fs = require('fs');

let text = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');

const replacement = `const exactImageMap: Record<string, string> = {
  "Great Pyramid of Giza": "Great Pyramid of Giza.jpg",
  "Egyptian Museum Cairo": "Egyptian Museum Cairo.webp",
  "Karnak Temple": "Karnak Temple.jpeg",
  "Luxor Temple": "Luxor Temple.jpg",
  "Valley of the Kings": "Valley of the Kings.jpg",
  "Abu Simbel Temples": "Abu Simbel Temples.jpg",
  "Philae Temple": "Philae Temple.jpeg",
  "Siwa Oasis": "Siwa Oasis.jpg",
  "White Desert": "White Desert.jpg",
  "Grand Egyptian Museum": "Grand Egyptian Museum.jpg",
  "Saqqara Step Pyramid": "Saqqara Step Pyramid.jpg",
  "Fayoum Oasis": "Fayoum Oasis.jpg",
  "Red Sea Coast Hurghada": "Red Sea Coast Hurghada.jpg",
  "Sharm El Sheikh": "Sharm El Sheikh.jpg",
  "Ras Mohammed": "Ras Mohammed.jpg",
  "Alexandria Library": "Alexandria Library.webp",
  "Saint Catherine Monastery": "Saint Catherine Monastery.jpg",
  "Citadel of Saladin": "Citadel of Saladin.jpg",
  "Wadi El Hitan": "Wadi El Hitan.jpeg",
  "Egyptian Museum (Tahrir)": "Egyptian Museum (Tahrir).jpg",
  "Mosque of Muhammad Ali": "Mosque of Muhammad Ali.jpg",
  "Sultan Hassan Mosque": "Sultan Hassan Mosque.webp",
  "Al-Rifa'i Mosque": "Al-Rifa'i Mosque.jpg",
  "Khan el-Khalili Bazaar": "Khan el-Khalili Bazaar.jpg",
  "Al-Azhar Mosque": "Al-Azhar Mosque.webp",
  "Hanging Church (El Muallaqa)": "Hanging Church (El Muallaqa).jpeg",
  "Coptic Museum": "Coptic Museum.jpg",
  "Ben Ezra Synagogue": "Ben Ezra Synagogue.jpeg",
  "Amr ibn al-As Mosque": "Amr ibn al-As Mosque.jpg",
  "Cairo Tower (Borg El Qahira)": "Cairo Tower (Borg El Qahira).jpg",
  "Manial Palace Museum": "Manial Palace Museum.jpg",
  "Museum of Islamic Art (Cairo)": "Museum of Islamic Art (Cairo).jpg",
  "Bayt Al-Suhaymi": "Bayt Al-Suhaymi.webp",
  "Al-Azhar Park": "Al-Azhar Park.webp",
  "Qasr El Nil Bridge": "Qasr El Nil Bridge.jpg",
  "Ibn Tulun Mosque": "Ibn Tulun Mosque.webp",
  "Gayer-Anderson Museum": "Gayer-Anderson Museum.jpg"
};

function getAttractionImage(name_en: string, category: string) {
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
}

`;

const startMatch = text.indexOf('const genericPool');
const endMatch = text.indexOf('function WeatherBadge');

if (startMatch !== -1 && endMatch !== -1) {
  text = text.substring(0, startMatch) + replacement + text.substring(endMatch);
  fs.writeFileSync('src/components/ExploreContent.tsx', text, 'utf8');
  console.log('Fixed ExploreContent successfully.');
} else {
  console.log('Could not find bounds', startMatch, endMatch);
}
