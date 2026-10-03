const fs = require('fs');
let content = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');
const mockItinerary = `
const MOCK_ITINERARY = [
  { day: 1, city: 'Cairo', activities: [
    { time: '09:00 AM - 12:30 PM', name: 'Great Pyramids of Giza', description: 'Explore the last remaining wonder of the ancient world. Take a camel ride into the desert for panoramic views.', type: 'history', cost: '$$ Moderate', tip: '👟 Wear comfortable walking shoes and bring plenty of water.', fact: 'The Great Pyramid consists of an estimated 2.3 million stone blocks.' },
    { time: '02:00 PM - 05:00 PM', name: 'Egyptian Museum', description: 'Witness the golden mask of Tutankhamun and countless artifacts.', type: 'culture', cost: '$ Budget', tip: '📸 Photography pass requires a small extra fee.', fact: 'It houses over 120,000 items of ancient Egyptian antiquities.' }
  ]},
  { day: 2, city: 'Cairo', activities: [
    { time: '10:00 AM - 02:00 PM', name: 'Khan el-Khalili Bazaar', description: 'Wander through the historic shopping district and grab some souvenirs.', type: 'shopping', cost: 'Free to walk', tip: '🗣️ Be prepared to haggle playfully with shop owners.', fact: 'The bazaar dates back to 1382 and was originally a caravanserai.' },
    { time: '04:00 PM - 06:00 PM', name: 'Nile Felucca Ride', description: 'Relaxing sunset sail on a traditional wooden boat.', type: 'relaxing', cost: '$$ Moderate', tip: '🧥 Bring a light jacket as the river breeze gets cool at sunset.', fact: 'Feluccas have remained the primary mode of transportation on the Nile since antiquity.' }
  ]},
  { day: 3, city: 'Luxor', activities: [
    { time: '07:00 AM - 11:30 AM', name: 'Valley of the Kings', description: 'Descend into the vibrantly painted tombs of mighty pharaohs.', type: 'history', cost: '$$$ Premium', tip: '🧢 Arrive early to beat the intense midday desert heat.', fact: 'Over 60 tombs have been discovered here, including that of King Tut.' },
    { time: '03:00 PM - 05:30 PM', name: 'Karnak Temple', description: 'Walk through the massive hypostyle hall of towering ancient pillars.', type: 'history', cost: '$$ Moderate', tip: '🚶‍♂️ The complex is massive; don’t miss the Sacred Lake.', fact: 'It is the largest religious building ever constructed in the world.' }
  ]}
];
`;
content = content.replace(/(const COUNTRIES = \[)/, mockItinerary + '\n$1');
fs.writeFileSync('src/components/PlannerContent.tsx', content);
