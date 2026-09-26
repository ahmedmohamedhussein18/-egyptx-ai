const fs = require('fs');

const path = 'src/components/PlannerContent.tsx';
let text = fs.readFileSync(path, 'utf8');

if (!text.includes('useLanguage')) {
  text = text.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { useLanguage } from '@/context/LanguageContext';");
  text = text.replace("export default function PlannerContent() {", "export default function PlannerContent() {\n  const { t, locale } = useLanguage();");
}

// Pass language to API
text = text.replace("const requestBody = {", "const requestBody = {\n        language: locale,");

// Top strings
text = text.replace(">Plan Your Egypt Journey<", ">{t('planner.title')}<");
text = text.replace('placeholder="Tell us about your dream trip', 'placeholder={t("planner.prompt")}');
text = text.replace(">Where are you from?<", ">{t('planner.whereFrom')}<");
text = text.replace(">Target Governorate<", ">{t('planner.targetGov')}<");
text = text.replace(">Anywhere in Egypt<", ">{t('planner.anywhere')}<");
text = text.replace(">Travelers<", ">{t('planner.travelers')}<");
text = text.replace(">Preferred Pace<", ">{t('planner.pace')}<");
text = text.replace(">Relaxed<", ">{t('planner.paceRelaxed')}<");
text = text.replace(">Balanced<", ">{t('planner.paceBalanced')}<");
text = text.replace(">Packed<", ">{t('planner.pacePacked')}<");
text = text.replace(">Trip Duration<", ">{t('planner.duration')}<");
text = text.replace(">Budget<", ">{t('planner.budget')}<");
text = text.replace(">What interests you?<", ">{t('planner.interests')}<");
text = text.replace(">Travel Style<", ">{t('planner.style')}<");
text = text.replace(">Additional Constraints<", ">{t('planner.constraints')}<");
text = text.replace(">Accessibility Needs<", ">{t('planner.accessibility')}<");
text = text.replace('placeholder="e.g. Wheelchair access', 'placeholder={t("planner.accessibility")}');
text = text.replace(">Places to Avoid<", ">{t('planner.avoid')}<");
text = text.replace(">Prefer less crowded locations<", ">{t('planner.lessCrowded')}<");
text = text.replace(">Generate My Egypt Journey<", ">{t('planner.generateBtn')}<");
text = text.replace(">Analyzing your preferences...<", ">{t('planner.loading1')}<");
text = text.replace(">Building your journey...<", ">{t('planner.loading2')}<");
text = text.replace(">Your Personalized Itinerary<", ">{t('planner.itineraryTitle')}<");
text = text.replace(">Day <", ">{t('planner.day')} <");
text = text.replace(">Morning<", ">{t('planner.morning')}<");
text = text.replace(">Afternoon<", ">{t('planner.afternoon')}<");
text = text.replace(">Evening<", ">{t('planner.evening')}<");
text = text.replace(">Modify Plan<", ">{t('planner.modifyBtn')}<");


fs.writeFileSync(path, text, 'utf8');
console.log('Updated PlannerContent');
