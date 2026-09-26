const fs = require('fs');
const files = [
  'src/components/Navbar.tsx',
  'src/components/HeroSection.tsx',
  'src/components/Footer.tsx',
  'src/components/DestinationsSection.tsx',
  'src/components/ExploreContent.tsx',
  'src/components/TouristPassportContent.tsx',
  'src/components/EmergencyContent.tsx',
  'src/components/NewsContent.tsx',
  'src/components/MemoriesContent.tsx',
  'src/components/ExpensesContent.tsx',
  'src/components/AIGuideContent.tsx',
  'src/components/PlannerContent.tsx',
  'src/components/HiddenEgyptContent.tsx'
];

for(const f of files) {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    let changed = false;
    
    if (c.includes('"{t(')) {
      c = c.replace(/"\{t\((.*?)\)\}"/g, "{t($1)}");
      changed = true;
    }
    if (c.includes("'{t(")) {
      c = c.replace(/'\{t\((.*?)\)\}'/g, "{t($1)}");
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(f, c);
      console.log('Fixed syntax in', f);
    }
  }
}
