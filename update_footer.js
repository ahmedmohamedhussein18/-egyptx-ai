const fs = require('fs');

const path = 'src/components/Footer.tsx';
let text = fs.readFileSync(path, 'utf8');

if (!text.includes('useLanguage')) {
  text = text.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { useLanguage } from '@/context/LanguageContext';");
  text = text.replace("export default function Footer() {", "export default function Footer() {\n  const { t } = useLanguage();");
}

text = text.replace(">The National Smart Tourism Ecosystem.<", ">{t('common.footer')}<");
text = text.replace(">Home<", ">{t('nav.home')}<");
text = text.replace(">AI Planner<", ">{t('nav.aiPlanner')}<");
text = text.replace(">Explore Egypt<", ">{t('nav.exploreEgypt')}<");
text = text.replace(">Hidden Egypt<", ">{t('nav.hiddenEgypt')}<");
text = text.replace(">Tourist Passport<", ">{t('nav.touristPassport')}<");
text = text.replace(">News<", ">{t('nav.news')}<");

fs.writeFileSync(path, text, 'utf8');
console.log('Updated Footer');
