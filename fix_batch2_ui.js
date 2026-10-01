const fs = require('fs');

function replaceAll(file, replacements) {
  let c = fs.readFileSync(file, 'utf8');
  for (let old of Object.keys(replacements)) {
    c = c.split(old).join(replacements[old]);
  }
  fs.writeFileSync(file, c);
}

// 1. PlannerContent.tsx
replaceAll('src/components/PlannerContent.tsx', {
  "Plan Your": "{t('planner.planYour')}",
  "Egypt Journey": "{t('planner.journey')}",
  "Preferred Pace": "{t('planner.paceTitle')}",
  "Try Again": "{t('planner.tryAgain')}",
  "Route Map": "{t('planner.routeMap')}",
  "Explore All Destinations": "{t('planner.exploreAll')}",
});
console.log('Fixed PlannerContent');

// 2. NewsContent.tsx
replaceAll('src/components/NewsContent.tsx', {
  "Learn More": "{t('news.learnMore')}",
  "No articles found": "{t('news.noArticles')}"
});
// Add useLanguage if missing
let news = fs.readFileSync('src/components/NewsContent.tsx', 'utf8');
if (!news.includes('useLanguage')) {
  news = news.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { useLanguage } from '@/context/LanguageContext';");
  news = news.replace("export default function NewsContent() {", "export default function NewsContent() {\n  const { t } = useLanguage();");
  fs.writeFileSync('src/components/NewsContent.tsx', news);
}
console.log('Fixed NewsContent');

// 3. TouristPassportContent.tsx
replaceAll('src/components/TouristPassportContent.tsx', {
  ">Status<": ">{t('passport.status')}<",
  ">Verified<": ">{t('passport.verified')}<",
  
  // The BADGES array
  "const BADGES = [": "const getBadges = (t: any, isPharaoh: boolean, isDesert: boolean, isHeritage: boolean) => [",
  "title: 'Pharaoh Explorer'": "title: t('passport.badges.pharaoh.title')",
  "desc: 'Visited 3+ ancient sites'": "desc: t('passport.badges.pharaoh.desc')",
  "title: 'Desert Explorer'": "title: t('passport.badges.desert.title')",
  "desc: 'Explored a hidden oasis'": "desc: t('passport.badges.desert.desc')",
  "title: 'Heritage Hunter'": "title: t('passport.badges.heritage.title')",
  "desc: 'Collected 5+ digital stamps'": "desc: t('passport.badges.heritage.desc')",
  "title: 'Culture Seeker'": "title: t('passport.badges.culture.title')",
  "desc: 'Experienced local Egyptian cuisine (Pending)'": "desc: t('passport.badges.culture.desc')",
  "title: 'Nile Navigator'": "title: t('passport.badges.nile.title')",
  "desc: 'Take a Nile cruise (Pending)'": "desc: t('passport.badges.nile.desc')",
  
  // Usage of BADGES
  "BADGES.map((badge, idx)": "getBadges(t, isPharaoh, isDesert, isHeritage).map((badge, idx)"
});
console.log('Fixed TouristPassportContent');
