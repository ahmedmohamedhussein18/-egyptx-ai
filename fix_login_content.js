const fs = require('fs');

function processFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('useLanguage') && !content.includes('export default function RootLayout')) {
    content = content.replace(/(import .*? from 'react';?)/, "$1\nimport { useLanguage } from '@/context/LanguageContext';");
  }
  if (!content.includes('const { t } = useLanguage()') && !content.includes('export default function RootLayout')) {
    content = content.replace(/(export default function [a-zA-Z0-9_]+\([^)]*\) {)/, "$1\n  const { t } = useLanguage();");
    content = content.replace(/(const [a-zA-Z0-9_]+ = \([^)]*\) => {)/, "$1\n  const { t } = useLanguage();");
  }

  replacements.forEach(({ s, r }) => {
    if (content.includes(s) || (s instanceof RegExp && s.test(content))) {
      content = content.replace(s, r);
    }
  });
  
  fs.writeFileSync(filePath, content);
}

processFile('src/components/LoginContent.tsx', [
  { s: 'National Smart Tourism Ecosystem', r: "{t('login.subtitle')}" },
  { s: 'Sign In / Register', r: "{t('login.signIn')}" },
  { s: 'Access your passport, trips, and smart guide.', r: "{t('login.access')}" },
  { s: 'Sign in as Demo Tourist', r: "{t('login.demoTourist')}" },
  { s: 'Sign in as Demo Business', r: "{t('login.demoBusiness')}" },
  { s: 'Government Login', r: "{t('login.govLogin')}" },
]);
