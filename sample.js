const fs = require('fs');

// Only components that are user-facing (tourist-facing pages), skip government/command-center
const files = [
  'src/components/EcosystemSection.tsx',
  'src/components/SmartMobilitySection.tsx',
];

files.forEach(f => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const matches = content.match(/(?:title|description|label|desc|subtitle|text|name|tag|action|heading|caption)\s*:\s*['"]([^'"]{5,})['"]/g);
    if (matches && matches.length > 0) {
      console.log('=== ' + f + ' ===');
      matches.slice(0, 15).forEach(m => console.log('  ' + m.trim()));
    }
  } catch(e) {}
});
