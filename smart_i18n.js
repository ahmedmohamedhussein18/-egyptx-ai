const fs = require('fs');

function replaceInFile(filePath, dict) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [text, key] of Object.entries(dict)) {
    // 1. JSX text nodes: >Text<
    const jsxRegex = new RegExp(">\\\\s*" + escapeRegExp(text) + "\\\\s*<", 'g');
    if (content.match(jsxRegex)) {
      content = content.replace(jsxRegex, ">{t('" + key + "')}<");
      changed = true;
    }

    // 2. JSX attributes: attr="Text"
    const attrRegex = new RegExp("=\\\"\\\\s*" + escapeRegExp(text) + "\\\\s*\\\"", 'g');
    if (content.match(attrRegex)) {
      content = content.replace(attrRegex, "={t('" + key + "')}");
      changed = true;
    }
    
    // 3. String literals (e.g. placeholder={'Text'}) or just bare 'Text'
    const singleQuoteRegex = new RegExp("'\\\\s*" + escapeRegExp(text) + "\\\\s*'", 'g');
    if (content.match(singleQuoteRegex)) {
      content = content.replace(singleQuoteRegex, "t('" + key + "')");
      changed = true;
    }

    // 4. Double quotes not in attributes
    const doubleQuoteRegex = new RegExp("\\\"\\\\s*" + escapeRegExp(text) + "\\\\s*\\\"", 'g');
    if (content.match(doubleQuoteRegex)) {
      content = content.replace(doubleQuoteRegex, "t('" + key + "')");
      changed = true;
    }
  }

  if (changed) {
    if (!content.includes('useLanguage')) {
      content = content.replace(
        /import React(.*?) from 'react';/,
        "import React$1 from 'react';\\nimport { useLanguage } from '@/context/LanguageContext';"
      );
      content = content.replace(
        /export default function (\\w+)\\((.*?)\\) {/,
        "export default function $1($2) {\\n  const { t } = useLanguage();"
      );
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated i18n in " + filePath);
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^$\\{key\\}()|[\\]\\\\]/g, '\\\\$&');
}

// Navbar
replaceInFile('src/components/Navbar.tsx', {
  "Home": "nav.home",
  "AI Planner": "nav.aiPlanner",
  "Explore Egypt": "nav.exploreEgypt",
  "Hidden Egypt": "nav.hiddenEgypt",
  "Crafts": "nav.crafts",
  "Tourist Passport": "nav.touristPassport",
  "News": "nav.news",
  "Logout": "nav.logout",
  "Login": "nav.login",
  "Command": "nav.command",
  "Command Center": "nav.command"
});

// HeroSection
replaceInFile('src/components/HeroSection.tsx', {
  "EgyptX AI": "home.title",
  "The National Smart Tourism Ecosystem": "home.subtitle",
  "Discover Egypt. Experience History. Shape the Future.": "home.slogan",
  "Plan My Journey": "home.planBtn",
  "Explore Egypt": "home.exploreBtn",
  "Virtual Egypt": "home.virtualEgypt",
  "50+ Sites": "home.sitesCount",
  "AI-Powered": "home.aiPowered",
  "Real-Time": "home.realTime"
});

// Footer
replaceInFile('src/components/Footer.tsx', {
  "The National Smart Tourism Ecosystem": "common.footer"
});

// DestinationsSection
replaceInFile('src/components/DestinationsSection.tsx', {
  "Featured Destinations": "explore.title",
  "From ancient wonders to hidden oases": "explore.subtitle"
});

// ExploreContent
replaceInFile('src/components/ExploreContent.tsx', {
  "Explore Egypt": "explore.title",
  "From ancient wonders to hidden oases": "explore.subtitle",
  "Interactive Map": "explore.map",
  "Rating unavailable": "explore.noRating",
  "Crowd data unavailable": "explore.noCrowd",
  "Explore Destination": "explore.exploreDest"
});

// TouristPassportContent
replaceInFile('src/components/TouristPassportContent.tsx', {
  "My EgyptX Passport": "passport.title",
  "Tourist's Journey": "passport.journey",
  "Total Stamps": "passport.totalStamps",
  "Status: Verified": "passport.status",
  "Visited Places": "passport.visited",
  "Achievements & Badges": "passport.achievements",
  "Start exploring to collect your first stamp": "passport.start",
  "My Planned Trips": "passport.planned"
});

// EmergencyContent
replaceInFile('src/components/EmergencyContent.tsx', {
  "Emergency Assistant": "emergency.title",
  "Find Nearest Hospital": "emergency.hospital",
  "Find Nearest Police Station": "emergency.police",
  "EgyptX AI does not replace official emergency services": "emergency.disclaimer"
});

// NewsContent
replaceInFile('src/components/NewsContent.tsx', {
  "Egypt Tourism News": "news.title",
  "Learn More": "news.learnMore",
  "Source:": "news.source"
});

// MemoriesContent
replaceInFile('src/components/MemoriesContent.tsx', {
  "My Egypt Memories": "memories.title",
  "Add Memory": "memories.add",
  "Your Egypt story starts here": "memories.story",
  "Upload Photo": "memories.upload",
  "Select Place": "memories.select",
  "Caption": "memories.caption",
  "Save": "common.save",
  "Cancel": "common.cancel"
});

// ExpensesContent
replaceInFile('src/components/ExpensesContent.tsx', {
  "Trip Expenses": "expenses.title",
  "Add Expense": "expenses.add",
  "No expenses recorded yet": "expenses.noExpenses",
  "Save": "common.save",
  "Cancel": "common.cancel"
});

// AIGuideContent
replaceInFile('src/components/AIGuideContent.tsx', {
  "AI Vision Guide": "aiGuide.title",
  "Snap a photo of any monument...": "aiGuide.snap",
  "Identify with AI": "aiGuide.identify",
  "HIGH CONFIDENCE": "aiGuide.high",
  "MEDIUM CONFIDENCE": "aiGuide.med",
  "LOW CONFIDENCE": "aiGuide.low",
  "General AI Description": "aiGuide.desc",
  "Verified Location": "aiGuide.verified",
  "View Full Details": "aiGuide.viewFull"
});

// PlannerContent
replaceInFile('src/components/PlannerContent.tsx', {
  "Plan Your Egypt Journey": "planner.title",
  "Tell us about your dream trip...": "planner.prompt",
  "Where are you from?": "planner.whereFrom",
  "Target Governorate": "planner.targetGov",
  "Anywhere in Egypt": "planner.anywhere",
  "Travelers": "planner.travelers",
  "Preferred Pace": "planner.pace",
  "Relaxed": "planner.paceRelaxed",
  "Balanced": "planner.paceBalanced",
  "Packed": "planner.pacePacked",
  "Trip Duration": "planner.duration",
  "Budget": "planner.budget",
  "What interests you?": "planner.interests",
  "Travel Style": "planner.style",
  "Additional Constraints": "planner.constraints",
  "Accessibility Needs": "planner.accessibility",
  "Places to Avoid": "planner.avoid",
  "Prefer less crowded locations": "planner.lessCrowded",
  "Generate My Egypt Journey": "planner.generateBtn",
  "Analyzing your preferences...": "planner.loading1",
  "Building your journey...": "planner.loading2",
  "Your Personalized Itinerary": "planner.itineraryTitle",
  "Day ": "planner.day",
  "Morning": "planner.morning",
  "Afternoon": "planner.afternoon",
  "Evening": "planner.evening",
  "Modify Plan": "planner.modifyBtn"
});

// HiddenEgyptContent
replaceInFile('src/components/HiddenEgyptContent.tsx', {
  "Hidden Egypt": "nav.hiddenEgypt",
  "Explore Destination": "explore.exploreDest"
});
