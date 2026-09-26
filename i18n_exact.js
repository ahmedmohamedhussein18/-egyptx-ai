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
  ">Login<": ">{t('nav.login')}<",
  ">Logout<": ">{t('nav.logout')}<",
  ">Command Center<": ">{t('nav.command')}<",
  ">Command<": ">{t('nav.command')}<",
  ">AI Vision Guide<": ">{t('aiGuide.title')}<"
});

applySpecific('src/components/HeroSection.tsx', {
  ">EgyptX AI<": ">{t('home.title')}<",
  ">The National Smart Tourism Ecosystem<": ">{t('home.subtitle')}<",
  ">Discover Egypt. Experience History. Shape the Future.<": ">{t('home.slogan')}<",
  ">Plan My Journey<": ">{t('home.planBtn')}<",
  ">Explore Egypt<": ">{t('home.exploreBtn')}<",
  ">Virtual Egypt<": ">{t('home.virtualEgypt')}<",
  ">50+ Sites<": ">{t('home.sitesCount')}<",
  ">AI-Powered<": ">{t('home.aiPowered')}<",
  ">Real-Time<": ">{t('home.realTime')}<"
});

applySpecific('src/components/Footer.tsx', {
  ">The National Smart Tourism Ecosystem<": ">{t('common.footer')}<"
});

applySpecific('src/components/DestinationsSection.tsx', {
  ">Featured Destinations<": ">{t('explore.title')}<",
  ">From ancient wonders to hidden oases<": ">{t('explore.subtitle')}<"
});

applySpecific('src/components/ExploreContent.tsx', {
  ">Explore Egypt<": ">{t('explore.title')}<",
  ">From ancient wonders to hidden oases<": ">{t('explore.subtitle')}<",
  ">Interactive Map<": ">{t('explore.map')}<",
  ">Rating unavailable<": ">{t('explore.noRating')}<",
  ">Crowd data unavailable<": ">{t('explore.noCrowd')}<",
  ">Explore Destination<": ">{t('explore.exploreDest')}<"
});

applySpecific('src/components/TouristPassportContent.tsx', {
  ">My EgyptX Passport<": ">{t('passport.title')}<",
  ">Tourist's Journey<": ">{t('passport.journey')}<",
  ">Total Stamps<": ">{t('passport.totalStamps')}<",
  ">Status: Verified<": ">{t('passport.status')}<",
  ">Visited Places<": ">{t('passport.visited')}<",
  ">Achievements & Badges<": ">{t('passport.achievements')}<",
  ">Start exploring to collect your first stamp<": ">{t('passport.start')}<",
  ">My Planned Trips<": ">{t('passport.planned')}<"
});

applySpecific('src/components/EmergencyContent.tsx', {
  ">Emergency Assistant<": ">{t('emergency.title')}<",
  ">Find Nearest Hospital<": ">{t('emergency.hospital')}<",
  ">Find Nearest Police Station<": ">{t('emergency.police')}<",
  ">EgyptX AI does not replace official emergency services<": ">{t('emergency.disclaimer')}<"
});

applySpecific('src/components/NewsContent.tsx', {
  ">Egypt Tourism News<": ">{t('news.title')}<",
  ">Learn More<": ">{t('news.learnMore')}<",
  ">Source:<": ">{t('news.source')}<"
});

applySpecific('src/components/MemoriesContent.tsx', {
  ">My Egypt Memories<": ">{t('memories.title')}<",
  ">Add Memory<": ">{t('memories.add')}<",
  ">Your Egypt story starts here<": ">{t('memories.story')}<",
  ">Upload Photo<": ">{t('memories.upload')}<",
  ">Select Place<": ">{t('memories.select')}<",
  ">Caption<": ">{t('memories.caption')}<",
  ">Save<": ">{t('common.save')}<",
  ">Cancel<": ">{t('common.cancel')}<",
  ">Close<": ">{t('common.close')}<"
});

applySpecific('src/components/ExpensesContent.tsx', {
  ">Trip Expenses<": ">{t('expenses.title')}<",
  ">Add Expense<": ">{t('expenses.add')}<",
  ">No expenses recorded yet<": ">{t('expenses.noExpenses')}<",
  ">Save<": ">{t('common.save')}<",
  ">Cancel<": ">{t('common.cancel')}<"
});

applySpecific('src/components/AIGuideContent.tsx', {
  ">AI Vision Guide<": ">{t('aiGuide.title')}<",
  ">Snap a photo of any monument...<": ">{t('aiGuide.snap')}<",
  ">Identify with AI<": ">{t('aiGuide.identify')}<",
  ">HIGH CONFIDENCE<": ">{t('aiGuide.high')}<",
  ">MEDIUM CONFIDENCE<": ">{t('aiGuide.med')}<",
  ">LOW CONFIDENCE<": ">{t('aiGuide.low')}<",
  ">General AI Description<": ">{t('aiGuide.desc')}<",
  ">Verified Location<": ">{t('aiGuide.verified')}<",
  ">View Full Details<": ">{t('aiGuide.viewFull')}<"
});

applySpecific('src/components/HiddenEgyptContent.tsx', {
  ">Hidden Egypt<": ">{t('nav.hiddenEgypt')}<",
  ">Explore Destination<": ">{t('explore.exploreDest')}<"
});

applySpecific('src/components/PlannerContent.tsx', {
  ">Plan Your Egypt Journey<": ">{t('planner.title')}<",
  "placeholder=\"Tell us about your dream trip...\"": "placeholder={t('planner.prompt')}",
  ">Where are you from?<": ">{t('planner.whereFrom')}<",
  ">Target Governorate<": ">{t('planner.targetGov')}<",
  ">Anywhere in Egypt<": ">{t('planner.anywhere')}<",
  ">Travelers<": ">{t('planner.travelers')}<",
  ">Preferred Pace<": ">{t('planner.pace')}<",
  ">Relaxed<": ">{t('planner.paceRelaxed')}<",
  ">Balanced<": ">{t('planner.paceBalanced')}<",
  ">Packed<": ">{t('planner.pacePacked')}<",
  ">Trip Duration<": ">{t('planner.duration')}<",
  ">Budget<": ">{t('planner.budget')}<",
  ">What interests you?<": ">{t('planner.interests')}<",
  ">Travel Style<": ">{t('planner.style')}<",
  ">Additional Constraints<": ">{t('planner.constraints')}<",
  ">Accessibility Needs<": ">{t('planner.accessibility')}<",
  ">Places to Avoid<": ">{t('planner.avoid')}<",
  ">Prefer less crowded locations<": ">{t('planner.lessCrowded')}<",
  ">Generate My Egypt Journey<": ">{t('planner.generateBtn')}<",
  ">Analyzing your preferences...<": ">{t('planner.loading1')}<",
  ">Building your journey...<": ">{t('planner.loading2')}<",
  ">Your Personalized Itinerary<": ">{t('planner.itineraryTitle')}<",
  ">Morning<": ">{t('planner.morning')}<",
  ">Afternoon<": ">{t('planner.afternoon')}<",
  ">Evening<": ">{t('planner.evening')}<",
  ">Modify Plan<": ">{t('planner.modifyBtn')}<"
});

applySpecific('src/app/kids/page.tsx', {
  ">Kids Mode<": ">{t('nav.kidsMode')}<"
});
