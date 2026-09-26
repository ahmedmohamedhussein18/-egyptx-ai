const fs = require('fs');

function replaceInFile(filePath, replacements, needsImport = true) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if needed
  if (needsImport && !content.includes('useLanguage')) {
    content = content.replace(
      /import React(.*?) from 'react';/,
      "import React$1 from 'react';\nimport { useLanguage } from '@/context/LanguageContext';"
    );
    // Add const { t } = useLanguage(); inside the component
    // Need to find the main export default function
    content = content.replace(
      /export default function (\w+)\((.*?)\) {/,
      "export default function $1($2) {\n  const { t } = useLanguage();"
    );
    // Sometimes it's const Component = () => {
    content = content.replace(
      /const (\w+) = \((.*?)\) => {/,
      "const $1 = ($2) => {\n  const { t } = useLanguage();"
    );
  }

  for (const [oldStr, newStr] of Object.entries(replacements)) {
    content = content.split(oldStr).join(newStr);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated i18n in ${filePath}`);
}

// Navbar
replaceInFile('src/components/Navbar.tsx', {
  "const navItems = [": "const getNavItems = (t: any) => [",
  "{ name: 'Home', href: '/' }": "{ name: t('nav.home'), href: '/' }",
  "{ name: 'AI Planner', href: '/planner' }": "{ name: t('nav.aiPlanner'), href: '/planner' }",
  "{ name: 'Explore Egypt', href: '/explore' }": "{ name: t('nav.exploreEgypt'), href: '/explore' }",
  "{ name: 'Hidden Egypt', href: '/hidden-egypt' }": "{ name: t('nav.hiddenEgypt'), href: '/hidden-egypt' }",
  "{ name: 'Crafts', href: '/crafts' }": "{ name: t('nav.crafts'), href: '/crafts' }",
  "{ name: 'Tourist Passport', href: '/tourist-passport' }": "{ name: t('nav.touristPassport'), href: '/tourist-passport' }",
  "{ name: 'News', href: '/news' }": "{ name: t('nav.news'), href: '/news' }",
  "];": "];",
  "navItems.map": "getNavItems(t).map",
  "Logout": "{t('nav.logout')}",
  "Login": "{t('nav.login')}",
  "Command": "{t('nav.command')}",
  "Command Center": "{t('nav.command')}"
}, false);

// HeroSection
replaceInFile('src/components/HeroSection.tsx', {
  "EgyptX AI": "{t('home.title')}",
  "The National Smart Tourism Ecosystem": "{t('home.subtitle')}",
  "Discover Egypt. Experience History. Shape the Future.": "{t('home.slogan')}",
  "Plan My Journey": "{t('home.planBtn')}",
  "Explore Egypt": "{t('home.exploreBtn')}",
  "Virtual Egypt": "{t('home.virtualEgypt')}",
  "50+ Sites": "{t('home.sitesCount')}",
  "AI-Powered": "{t('home.aiPowered')}",
  "Real-Time": "{t('home.realTime')}"
});

// Footer
replaceInFile('src/components/Footer.tsx', {
  "The National Smart Tourism Ecosystem": "{t('common.footer')}"
});

// DestinationsSection
replaceInFile('src/components/DestinationsSection.tsx', {
  "Featured Destinations": "{t('explore.title')}",
  "From ancient wonders to hidden oases": "{t('explore.subtitle')}"
});

// ExploreContent
replaceInFile('src/components/ExploreContent.tsx', {
  "Explore Egypt": "{t('explore.title')}",
  "From ancient wonders to hidden oases": "{t('explore.subtitle')}",
  "Interactive Map": "{t('explore.map')}",
  "Rating unavailable": "{t('explore.noRating')}",
  "Crowd data unavailable": "{t('explore.noCrowd')}",
  "Explore Destination": "{t('explore.exploreDest')}"
});

// TouristPassportContent
replaceInFile('src/components/TouristPassportContent.tsx', {
  "My EgyptX Passport": "{t('passport.title')}",
  "Tourist's Journey": "{t('passport.journey')}",
  "Total Stamps": "{t('passport.totalStamps')}",
  "Status: Verified": "{t('passport.status')}",
  "Visited Places": "{t('passport.visited')}",
  "Achievements & Badges": "{t('passport.achievements')}",
  "Start exploring to collect your first stamp": "{t('passport.start')}",
  "My Planned Trips": "{t('passport.planned')}"
});

// EmergencyContent
replaceInFile('src/components/EmergencyContent.tsx', {
  "Emergency Assistant": "{t('emergency.title')}",
  "Find Nearest Hospital": "{t('emergency.hospital')}",
  "Find Nearest Police Station": "{t('emergency.police')}",
  "EgyptX AI does not replace official emergency services": "{t('emergency.disclaimer')}"
});

// NewsContent
replaceInFile('src/components/NewsContent.tsx', {
  "Egypt Tourism News": "{t('news.title')}",
  "Learn More": "{t('news.learnMore')}",
  "Source:": "{t('news.source')}"
});

// MemoriesContent
replaceInFile('src/components/MemoriesContent.tsx', {
  "My Egypt Memories": "{t('memories.title')}",
  "Add Memory": "{t('memories.add')}",
  "Your Egypt story starts here": "{t('memories.story')}",
  "Upload Photo": "{t('memories.upload')}",
  "Select Place": "{t('memories.select')}",
  "Caption": "{t('memories.caption')}",
  "Save": "{t('common.save')}",
  "Cancel": "{t('common.cancel')}"
});

// ExpensesContent
replaceInFile('src/components/ExpensesContent.tsx', {
  "Trip Expenses": "{t('expenses.title')}",
  "Add Expense": "{t('expenses.add')}",
  "No expenses recorded yet": "{t('expenses.noExpenses')}",
  "Save": "{t('common.save')}",
  "Cancel": "{t('common.cancel')}"
});

// AIGuideContent
replaceInFile('src/components/AIGuideContent.tsx', {
  "AI Vision Guide": "{t('aiGuide.title')}",
  "Snap a photo of any monument...": "{t('aiGuide.snap')}",
  "Identify with AI": "{t('aiGuide.identify')}",
  "HIGH CONFIDENCE": "{t('aiGuide.high')}",
  "MEDIUM CONFIDENCE": "{t('aiGuide.med')}",
  "LOW CONFIDENCE": "{t('aiGuide.low')}",
  "General AI Description": "{t('aiGuide.desc')}",
  "Verified Location": "{t('aiGuide.verified')}",
  "View Full Details": "{t('aiGuide.viewFull')}"
});

// PlannerContent
replaceInFile('src/components/PlannerContent.tsx', {
  "Plan Your Egypt Journey": "{t('planner.title')}",
  "Tell us about your dream trip...": "{t('planner.prompt')}",
  "Where are you from?": "{t('planner.whereFrom')}",
  "Target Governorate": "{t('planner.targetGov')}",
  "Anywhere in Egypt": "{t('planner.anywhere')}",
  "Travelers": "{t('planner.travelers')}",
  "Preferred Pace": "{t('planner.pace')}",
  "Relaxed": "{t('planner.paceRelaxed')}",
  "Balanced": "{t('planner.paceBalanced')}",
  "Packed": "{t('planner.pacePacked')}",
  "Trip Duration": "{t('planner.duration')}",
  "Budget": "{t('planner.budget')}",
  "What interests you?": "{t('planner.interests')}",
  "Travel Style": "{t('planner.style')}",
  "Additional Constraints": "{t('planner.constraints')}",
  "Accessibility Needs": "{t('planner.accessibility')}",
  "Places to Avoid": "{t('planner.avoid')}",
  "Prefer less crowded locations": "{t('planner.lessCrowded')}",
  "Generate My Egypt Journey": "{t('planner.generateBtn')}",
  "Analyzing your preferences...": "{t('planner.loading1')}",
  "Building your journey...": "{t('planner.loading2')}",
  "Your Personalized Itinerary": "{t('planner.itineraryTitle')}",
  "Day": "{t('planner.day')}",
  "Morning": "{t('planner.morning')}",
  "Afternoon": "{t('planner.afternoon')}",
  "Evening": "{t('planner.evening')}",
  "Modify Plan": "{t('planner.modifyBtn')}"
});

// HiddenEgyptContent
replaceInFile('src/components/HiddenEgyptContent.tsx', {
  "Hidden Egypt": "{t('nav.hiddenEgypt')}",
  "Explore Destination": "{t('explore.exploreDest')}"
});
