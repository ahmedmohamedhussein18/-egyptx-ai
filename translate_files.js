const fs = require('fs');

const languageFiles = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'];
const translations = {};
languageFiles.forEach(l => translations[l] = {});

function add(key, enVal) {
  translations.en[key] = enVal;
  translations.ar[key] = enVal;
  translations.fr[key] = enVal;
  translations.de[key] = enVal;
  translations.it[key] = enVal;
  translations.es[key] = enVal;
  translations.zh[key] = enVal;
  translations.ru[key] = enVal;
}

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

  replacements.forEach(({ s, r, k, en }) => {
    if (content.includes(s) || (s instanceof RegExp && s.test(content))) {
      content = content.replace(s, r);
      if (k && en) add(k, en);
    }
  });
  
  fs.writeFileSync(filePath, content);
}

// 4. PlannerContent
processFile('src/components/PlannerContent.tsx', [
  { s: 'Plan Your Egypt Journey', r: "{t('planner.title')}", k: 'planner.title', en: 'Plan Your Egypt Journey' },
  { s: 'Tell us about your dream trip', r: "{t('planner.prompt')}", k: 'planner.prompt', en: 'Tell us about your dream trip' },
  { s: 'Where are you from?', r: "{t('planner.whereFrom')}", k: 'planner.whereFrom', en: 'Where are you from?' },
  { s: 'Trip Duration', r: "{t('planner.duration')}", k: 'planner.duration', en: 'Trip Duration' },
  { s: 'Budget', r: "{t('planner.budget')}", k: 'planner.budget', en: 'Budget' },
  { s: 'What interests you?', r: "{t('planner.interests')}", k: 'planner.interests', en: 'What interests you?' },
  { s: 'Ancient Egypt', r: "{t('planner.intAncient')}", k: 'planner.intAncient', en: 'Ancient Egypt' },
  { s: 'Beaches', r: "{t('planner.intBeaches')}", k: 'planner.intBeaches', en: 'Beaches' },
  { s: 'Adventure', r: "{t('planner.intAdventure')}", k: 'planner.intAdventure', en: 'Adventure' },
  { s: 'Food', r: "{t('planner.intFood')}", k: 'planner.intFood', en: 'Food' },
  { s: 'Culture', r: "{t('planner.intCulture')}", k: 'planner.intCulture', en: 'Culture' },
  { s: 'Nature', r: "{t('planner.intNature')}", k: 'planner.intNature', en: 'Nature' },
  { s: 'Solo', r: "{t('planner.styleSolo')}", k: 'planner.styleSolo', en: 'Solo' },
  { s: 'Couple', r: "{t('planner.styleCouple')}", k: 'planner.styleCouple', en: 'Couple' },
  { s: 'Family', r: "{t('planner.styleFamily')}", k: 'planner.styleFamily', en: 'Family' },
  { s: 'Group', r: "{t('planner.styleGroup')}", k: 'planner.styleGroup', en: 'Group' },
  { s: 'Relaxed', r: "{t('planner.paceRelaxed')}", k: 'planner.paceRelaxed', en: 'Relaxed' },
  { s: 'Balanced', r: "{t('planner.paceBalanced')}", k: 'planner.paceBalanced', en: 'Balanced' },
  { s: 'Packed', r: "{t('planner.pacePacked')}", k: 'planner.pacePacked', en: 'Packed' },
  { s: 'Generate My Egypt Journey', r: "{t('planner.generateBtn')}", k: 'planner.generateBtn', en: 'Generate My Egypt Journey' },
  { s: 'Your Personalized Itinerary', r: "{t('planner.itineraryTitle')}", k: 'planner.itineraryTitle', en: 'Your Personalized Itinerary' },
  { s: 'Modify Plan', r: "{t('planner.modifyBtn')}", k: 'planner.modifyBtn', en: 'Modify Plan' },
]);

// 6. HiddenEgyptContent
processFile('src/components/HiddenEgyptContent.tsx', [
  { s: '>Hidden Egypt<', r: ">{t('hidden.title')}<", k: 'hidden.title', en: 'Hidden Egypt' },
  { s: 'Discover the untold stories', r: "{t('hidden.subtitle')}", k: 'hidden.subtitle', en: 'Discover the untold stories' },
  { s: '>National Impact Mission<', r: ">{t('hidden.mission')}<", k: 'hidden.mission', en: 'National Impact Mission' },
  { s: 'By exploring these verified hidden gems', r: "{t('hidden.missionDesc')}", k: 'hidden.missionDesc', en: 'By exploring these verified hidden gems, you actively help distribute tourism across Egypt, protecting our major heritage sites from overcrowding.' },
  { s: '>Reduced<br/>Crowding<', r: ">{t('hidden.reducedCrowding')}<", k: 'hidden.reducedCrowding', en: 'Reduced Crowding' },
  { s: 'Loading hidden gems...', r: "{t('hidden.loading')}", k: 'hidden.loading', en: 'Loading hidden gems...' },
  { s: 'Platform visit data unavailable', r: "{t('hidden.noData')}", k: 'hidden.noData', en: 'Platform visit data unavailable' },
  { s: 'AI Recommendation', r: "{t('hidden.aiRec')}", k: 'hidden.aiRec', en: 'AI Recommendation' },
  { s: 'AI Insight unavailable', r: "{t('hidden.noAi')}", k: 'hidden.noAi', en: 'AI Insight unavailable' },
  { s: 'Explore &rarr;', r: "{t('exploreDest')}", k: 'exploreDest', en: 'Explore &rarr;' },
]);

// 7. TouristPassportContent
processFile('src/components/TouristPassportContent.tsx', [
  { s: '>Tourist Passport<', r: ">{t('passport.title')}<" },
  { s: 'Your Journey', r: "{t('passport.journey')}" },
  { s: 'Total Stamps', r: "{t('passport.totalStamps')}" },
  { s: 'Status: Verified', r: "{t('passport.status')}" },
  { s: 'Visited Places', r: "{t('passport.visited')}" },
  { s: 'Achievements & Badges', r: "{t('passport.achievements')}" },
  { s: 'Start exploring to collect your first stamp', r: "{t('passport.start')}" },
  { s: 'My Planned Trips', r: "{t('passport.planned')}" },
]);

// 8. EmergencyContent
processFile('src/components/EmergencyContent.tsx', [
  { s: '>Emergency Assistant<', r: ">{t('emergency.title')}<" },
  { s: 'Find Nearest Hospital', r: "{t('emergency.hospital')}" },
  { s: 'Find Nearest Police Station', r: "{t('emergency.police')}" },
  { s: 'EgyptX AI does not replace official emergency services', r: "{t('emergency.disclaimer')}" },
]);

// 9. KidsModeContent
processFile('src/components/KidsModeContent.tsx', [
  { s: '>Kids Mode<', r: ">{t('kids.title')}<" },
  { s: 'Learn about ancient Egypt through games and fun facts', r: "{t('kids.subtitle')}", k: 'kids.subtitle', en: 'Learn about ancient Egypt through games and fun facts' },
  { s: 'Start Adventure', r: "{t('kids.start')}", k: 'kids.start', en: 'Start Adventure' },
  { s: 'Play Games', r: "{t('kids.games')}", k: 'kids.games', en: 'Play Games' },
]);

// 10. MemoriesContent
processFile('src/components/MemoriesContent.tsx', [
  { s: '>My Egypt Memories<', r: ">{t('memories.title')}<" },
  { s: '>Add Memory<', r: ">{t('memories.add')}<" },
  { s: '>Your Egypt story starts here<', r: ">{t('memories.story')}<" },
  { s: 'Upload Photo', r: "{t('memories.upload')}" },
  { s: 'Select Place', r: "{t('memories.select')}" },
  { s: 'Caption', r: "{t('memories.caption')}" },
]);

// 11. ExpensesContent
processFile('src/components/ExpensesContent.tsx', [
  { s: '>Trip Expenses<', r: ">{t('expenses.title')}<" },
  { s: 'Add Expense', r: "{t('expenses.add')}" },
  { s: 'No expenses recorded yet', r: "{t('expenses.noExpenses')}" },
]);

// 12. AIGuideContent
processFile('src/components/AIGuideContent.tsx', [
  { s: '>AI Vision Guide<', r: ">{t('aiGuide.title')}<" },
  { s: 'Snap a photo of any monument...', r: "{t('aiGuide.snap')}" },
  { s: 'Identify with AI', r: "{t('aiGuide.identify')}" },
  { s: '>HIGH CONFIDENCE<', r: ">{t('aiGuide.high')}<" },
  { s: '>MEDIUM CONFIDENCE<', r: ">{t('aiGuide.med')}<" },
  { s: '>LOW CONFIDENCE<', r: ">{t('aiGuide.low')}<" },
  { s: 'General AI Description', r: "{t('aiGuide.desc')}" },
  { s: 'Verified Location', r: "{t('aiGuide.verified')}" },
  { s: 'View Full Details', r: "{t('aiGuide.viewFull')}" },
]);

// 13. NewsContent
processFile('src/app/news/page.tsx', [
  { s: '>Egypt Tourism News<', r: ">{t('news.title')}<" },
  { s: 'Learn More', r: "{t('news.learnMore')}" },
  { s: 'Source:', r: "{t('news.source')}" },
]);

// 15. LoginContent
processFile('src/app/login/page.tsx', [
  { s: 'National Smart Tourism Ecosystem', r: "{t('login.subtitle')}", k: 'login.subtitle', en: 'National Smart Tourism Ecosystem' },
  { s: 'Sign In / Register', r: "{t('login.signIn')}", k: 'login.signIn', en: 'Sign In / Register' },
  { s: 'Access your passport, trips, and smart guide.', r: "{t('login.access')}", k: 'login.access', en: 'Access your passport, trips, and smart guide.' },
  { s: 'Sign in as Demo Tourist', r: "{t('login.demoTourist')}", k: 'login.demoTourist', en: 'Sign in as Demo Tourist' },
  { s: 'Sign in as Demo Business', r: "{t('login.demoBusiness')}", k: 'login.demoBusiness', en: 'Sign in as Demo Business' },
  { s: 'Government Login', r: "{t('login.govLogin')}", k: 'login.govLogin', en: 'Government Login' },
]);


// Update translations
for (const lang of languageFiles) {
  const file = "messages/" + lang + ".json";
  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  
  for (const [key, val] of Object.entries(translations[lang])) {
    const parts = key.split('.');
    let cur = data;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] || {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

console.log('Translations updated.');
