const fs = require('fs');

let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

c = c.replace(/<span className="[^"]*">Plan Your<\/span>\{\' \'\}\n\s*<span className="text-white">Egypt Journey<\/span>/g, "{t('planner.title')}");
c = c.replace(/Tell us about your dream trip, and our AI will craft a personalized itinerary across Egypt&apos;s most breathtaking destinations\./g, "{t('planner.prompt')}");

c = c.replace(/Where are you from\? \*/g, "{t('planner.whereFrom')} *");
c = c.replace(/>Select your country</g, ">{t('planner.selectCountry')}<");

c = c.replace(/Target Governorate/g, "{t('planner.targetGov')}");
c = c.replace(/>Anywhere in Egypt</g, ">{t('planner.anywhere')}<");

c = c.replace(/Travelers \*/g, "{t('planner.travelers')} *");
c = c.replace(/placeholder="e\.g\., 2 adults, 1 child"/g, "placeholder={t('planner.egTravelers')}");

c = c.replace(/Preferred Pace \*/g, "{t('planner.pace')} *");
c = c.replace(/>Relaxed</g, ">{t('planner.paceRelaxed')}<");
c = c.replace(/>Balanced</g, ">{t('planner.paceBalanced')}<");
c = c.replace(/>Packed</g, ">{t('planner.pacePacked')}<");

c = c.replace(/Trip Duration \*/g, "{t('planner.duration')} *");
c = c.replace(/placeholder="e\.g\., 7 Days"/g, "placeholder={t('planner.egDuration')}");

c = c.replace(/Budget \*/g, "{t('planner.budget')} *");
c = c.replace(/placeholder="e\.g\., \$2000 total"/g, "placeholder={t('planner.egBudget')}");

c = c.replace(/What interests you\? \*/g, "{t('planner.interests')} *");
c = c.replace(/placeholder="e\.g\., Pyramids, diving, local food"/g, "placeholder={t('planner.egInterests')}");

c = c.replace(/>Travel Style</g, ">{t('planner.style')}<");
c = c.replace(/placeholder="e\.g\., Luxury, backpacking, family"/g, "placeholder={t('planner.egStyle')}");

c = c.replace(/>Additional Constraints</g, ">{t('planner.constraints')}<");
c = c.replace(/>Accessibility Needs</g, ">{t('planner.accessibility')}<");
c = c.replace(/>Places to Avoid</g, ">{t('planner.avoid')}<");
c = c.replace(/>Prefer less crowded locations</g, ">{t('planner.lessCrowded')}<");

c = c.replace(/>Generate My Egypt Journey</g, ">{t('planner.generateBtn')}<");

c = c.replace(/>Analyzing your preferences\.\.\.</g, ">{t('planner.loading1')}<");
c = c.replace(/>Building your journey\.\.\.</g, ">{t('planner.loading2')}<");

c = c.replace(/>Your Personalized Itinerary</g, ">{t('planner.itineraryTitle')}<");

c = c.replace(/>Modify Plan</g, ">{t('planner.modifyBtn')}<");
c = c.replace(/>Save Trip</g, ">{t('common.save')}<");
c = c.replace(/>Saved!</g, ">{t('planner.saved')}<");

// Error messages
c = c.replace(/'Please select a country'/g, "t('planner.errCountry')");
c = c.replace(/'Please enter travelers'/g, "t('planner.errTravelers')");
c = c.replace(/'Please enter duration'/g, "t('planner.errDuration')");
c = c.replace(/'Please enter budget'/g, "t('planner.errBudget')");
c = c.replace(/'Please tell us your interests'/g, "t('planner.errInterests')");

fs.writeFileSync('src/components/PlannerContent.tsx', c);
console.log('Fixed PlannerContent');
