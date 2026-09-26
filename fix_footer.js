const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!content.includes('useLanguage')) {
  content = content.replace(
    /import React from 'react';/,
    "import React from 'react';\nimport { useLanguage } from '@/context/LanguageContext';"
  );
  content = content.replace(
    /export default function Footer\(\) \{/,
    "export default function Footer() {\n  const { t } = useLanguage();"
  );
  content = content.replace(
    />The National Smart Tourism Ecosystem\.</,
    ">{t('common.footer')}."
  );
  fs.writeFileSync('src/components/Footer.tsx', content);
  console.log('Fixed Footer');
}
