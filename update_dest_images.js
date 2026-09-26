const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const files = walkSync('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace Siwa Oasis
  content = content.replace(/'\/images\/Siwa-Oasis-at-golden-hour\.png'/g, "'/images/Fantasy-Island-egypt-siwaa-oasis.jpg'");
  content = content.replace(/"\/images\/Siwa-Oasis-at-golden-hour\.png"/g, '"/images/Fantasy-Island-egypt-siwaa-oasis.jpg"');
  content = content.replace(/'\/images\/siwa\.jpg'/g, "'/images/Fantasy-Island-egypt-siwaa-oasis.jpg'");
  content = content.replace(/"\/images\/siwa\.jpg"/g, '"/images/Fantasy-Island-egypt-siwaa-oasis.jpg"');
  content = content.replace(/'\/images\/Siwa Oasis\.jpg'/gi, "'/images/Fantasy-Island-egypt-siwaa-oasis.jpg'");
  content = content.replace(/"\/images\/Siwa Oasis\.jpg"/gi, '"/images/Fantasy-Island-egypt-siwaa-oasis.jpg"');
  
  // Replace White Desert
  content = content.replace(/'\/images\/White Desert\.jpg'/gi, "'/images/White Desertt.jpg'");
  content = content.replace(/"\/images\/White Desert\.jpg"/gi, '"/images/White Desertt.jpg"');

  // Replace Fayoum / Wadi El Hitan
  content = content.replace(/'\/images\/Wadi El Hitan\.jpeg'/gi, "'/images/Wadi El Hitann.jpg'");
  content = content.replace(/"\/images\/Wadi El Hitan\.jpeg"/gi, '"/images/Wadi El Hitann.jpg"');
  content = content.replace(/'\/images\/Wadi El Hitan\.jpg'/gi, "'/images/Wadi El Hitann.jpg'");
  content = content.replace(/"\/images\/Wadi El Hitan\.jpg"/gi, '"/images/Wadi El Hitann.jpg"');
  content = content.replace(/'\/images\/Fayoum Oasis\.jpg'/gi, "'/images/Wadi El Hitann.jpg'");
  content = content.replace(/"\/images\/Fayoum Oasis\.jpg"/gi, '"/images/Wadi El Hitann.jpg"');
  content = content.replace(/'\/images\/fayoum\.jpg'/gi, "'/images/Wadi El Hitann.jpg'");
  content = content.replace(/"\/images\/fayoum\.jpg"/gi, '"/images/Wadi El Hitann.jpg"');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated images in ${file}`);
  }
});

console.log('Done replacement script');
