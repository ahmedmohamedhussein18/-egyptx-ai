const fs = require('fs');

const filesToUpdate = [
  'src/components/DestinationsSection.tsx',
  'src/components/HiddenEgyptContent.tsx',
  'src/components/ExploreContent.tsx',
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace all variations of Siwa
    content = content.replace(/['"]\/images\/Fantasy-Island-egypt-siwaa-oasis\.jpg['"]/g, "'/images/Siwa Oasisss.jpg'");
    content = content.replace(/['"]Fantasy-Island-egypt-siwaa-oasis\.jpg['"]/g, "'Siwa Oasisss.jpg'");
    content = content.replace(/['"]\/images\/siwa\.jpg['"]/g, "'/images/Siwa Oasisss.jpg'");
    
    // Replace all variations of White Desert
    content = content.replace(/['"]https:\/\/images\.unsplash\.com\/photo-1627725920703-e83616238fb0[^'"]*['"]/g, "'/images/White Deserttt.jpg'");
    content = content.replace(/['"]White Desertt\.jpg['"]/g, "'White Deserttt.jpg'");
    content = content.replace(/['"]\/images\/white-desert\.jpg['"]/g, "'/images/White Deserttt.jpg'");
    
    // Replace all variations of Wadi El Hitan
    content = content.replace(/['"]https:\/\/images\.unsplash\.com\/photo-1547849185-3bc6334a1fc2[^'"]*['"]/g, "'/images/Wadi El Hitannn.jpg'");
    content = content.replace(/['"]Wadi El Hitann\.jpg['"]/g, "'Wadi El Hitannn.jpg'");
    
    // Replace all variations of Fayoum
    content = content.replace(/['"]\/images\/fayoum\.jpg['"]/g, "'/images/Fayoum Oasisss.jpg'");

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated images in ${file}`);
  }
}
