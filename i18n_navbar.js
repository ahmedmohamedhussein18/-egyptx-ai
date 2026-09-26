const fs = require('fs');

function applySpecific(file, replaces) {
  if (!fs.existsSync(file)) return;
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const [search, replace] of Object.entries(replaces)) {
    if (text.includes(search)) {
      text = text.split(search).join(replace);
      changed = true;
    }
  }
  
  if (changed) {
    if (!text.includes('useLanguage')) {
      text = text.replace(/import React(.*?) from 'react';/, "import React$1 from 'react';\nimport { useLanguage } from '@/context/LanguageContext';");
    }
    // inject hook
    if (text.includes('export default function ') && !text.includes('const { t } = useLanguage()')) {
      text = text.replace(/export default function (\w+)\((.*?)\) {/, "export default function $1($2) {\n  const { t } = useLanguage();");
    }
    fs.writeFileSync(file, text);
    console.log("Updated", file);
  }
}

applySpecific('src/components/Navbar.tsx', {
  "const navItems = [": "const getNavItems = (t: any) => [",
  "{ name: 'Home', href: '/' }": "{ name: t('nav.home'), href: '/' }",
  "{ name: 'AI Planner', href: '/planner' }": "{ name: t('nav.aiPlanner'), href: '/planner' }",
  "{ name: 'Explore Egypt', href: '/explore' }": "{ name: t('nav.exploreEgypt'), href: '/explore' }",
  "{ name: 'Hidden Egypt', href: '/hidden-egypt' }": "{ name: t('nav.hiddenEgypt'), href: '/hidden-egypt' }",
  "{ name: 'Crafts', href: '/crafts' }": "{ name: t('nav.crafts'), href: '/crafts' }",
  "{ name: 'Tourist Passport', href: '/tourist-passport' }": "{ name: t('nav.touristPassport'), href: '/tourist-passport' }",
  "{ name: 'News', href: '/news' }": "{ name: t('nav.news'), href: '/news' }",
  "navItems.map": "getNavItems(t).map",
  "Login": "{t('nav.login')}",
  "Logout": "{t('nav.logout')}",
  "Command Center": "{t('nav.command')}",
  "Command": "{t('nav.command')}" // Note: might conflict if "Command" is part of another word. Let's be careful.
});
