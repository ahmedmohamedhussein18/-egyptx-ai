const fs = require('fs');
let c = fs.readFileSync('src/components/KidsModeContent.tsx', 'utf8');
if (!c.includes('useLanguage')) {
  c = c.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { useLanguage } from '@/context/LanguageContext';");
  c = c.replace(/export default function KidsModeContent\(\) \{/, "export default function KidsModeContent() {\n  const { t } = useLanguage();");
  c = c.replace(/>\s*Kids Mode\s*</, ">{t('nav.kidsMode')}<");
  fs.writeFileSync('src/components/KidsModeContent.tsx', c);
  console.log('Fixed KidsModeContent');
}
