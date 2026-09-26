const fs = require('fs');
let c = fs.readFileSync('src/components/DestinationsSection.tsx', 'utf8');
if (!c.includes('useLanguage')) {
  c = c.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { useLanguage } from '@/context/LanguageContext';");
  c = c.replace(/export default function DestinationsSection\(\) \{/, "export default function DestinationsSection() {\n  const { t } = useLanguage();");
  c = c.replace(/>\s*Featured Destinations\s*</, ">{t('explore.title')}<");
  c = c.replace(/>\s*From ancient wonders to hidden oases\s*</, ">{t('explore.subtitle')}<");
  fs.writeFileSync('src/components/DestinationsSection.tsx', c);
  console.log('Fixed DestinationsSection');
}
