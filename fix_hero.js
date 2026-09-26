const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

if (!content.includes('useLanguage')) {
  content = content.replace(
    /import \{ useAuth \} from '@\/context\/AuthContext';/,
    "import { useAuth } from '@/context/AuthContext';\nimport { useLanguage } from '@/context/LanguageContext';"
  );
  content = content.replace(
    /const HeroSection = \(\) => \{/,
    "const HeroSection = () => {\n  const { t } = useLanguage();"
  );
  fs.writeFileSync('src/components/HeroSection.tsx', content);
  console.log('Fixed HeroSection');
}
