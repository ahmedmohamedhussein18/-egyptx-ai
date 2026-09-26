const fs = require('fs');

const path = 'src/components/HeroSection.tsx';
let text = fs.readFileSync(path, 'utf8');

if (!text.includes('useLanguage')) {
  text = text.replace("import { useAuth } from '@/context/AuthContext';", "import { useAuth } from '@/context/AuthContext';\nimport { useLanguage } from '@/context/LanguageContext';");
  text = text.replace("const { user } = useAuth();", "const { user } = useAuth();\n  const { t } = useLanguage();");
}

text = text.replace(">National Smart Tourism Ecosystem<", ">{t('home.subtitle')}<");
text = text.replace(">The National Smart Tourism Ecosystem<", ">{t('home.subtitle')}<");
text = text.replace(">Discover Egypt. Experience History. Shape the Future.<", ">{t('home.slogan')}<");
text = text.replace(">Plan My Journey<", ">{t('home.planBtn')}<");
text = text.replace(">Explore Egypt<", ">{t('home.exploreBtn')}<");
text = text.replace(">Virtual Egypt<", ">{t('home.virtualEgypt')}<");
text = text.replace(">50+ Sites<", ">{t('home.sitesCount')}<");
text = text.replace(">AI-Powered<", ">{t('home.aiPowered')}<");
text = text.replace(">Real-Time<", ">{t('home.realTime')}<");

fs.writeFileSync(path, text, 'utf8');
console.log('Updated HeroSection');
