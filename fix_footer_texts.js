const fs = require('fs');

let c = fs.readFileSync('src/components/Footer.tsx', 'utf8');

c = c.replace(/>\s*EgyptX AI\s*</, ">{t('footer.title')}<");
c = c.replace(/>\s*The National Smart Tourism Ecosystem\.\s*</, ">{t('footer.subtitle')}<");

c = c.replace(/>Explore</, ">{t('footer.explore')}<");
c = c.replace(/>Home</, ">{t('footer.home')}<");
c = c.replace(/>AI Planner</, ">{t('footer.aiPlanner')}<");
c = c.replace(/>Explore Egypt</, ">{t('footer.exploreEgypt')}<");
c = c.replace(/>Smart Sites</, ">{t('footer.smartSites')}<");

c = c.replace(/>Experience</, ">{t('footer.experience')}<");
c = c.replace(/>Museum AI</, ">{t('footer.museumAi')}<");
c = c.replace(/>Hidden Egypt</, ">{t('footer.hiddenEgypt')}<");
c = c.replace(/>Emergency Assistant</, ">{t('footer.emergency')}<");
c = c.replace(/>Tourist Passport</, ">{t('footer.touristPassport')}<");

c = c.replace(/>Ecosystem</, ">{t('footer.ecosystem')}<");
c = c.replace(/>Command Center</, ">{t('footer.commandCenter')}<");
c = c.replace(/>Business Portal</, ">{t('footer.businessPortal')}<");
c = c.replace(/>Government</, ">{t('footer.government')}<");
c = c.replace(/>Partners</, ">{t('footer.partners')}<");

c = c.replace(/>Discover</, ">{t('footer.discover')}<");
c = c.replace(/>Egyptian Crafts</, ">{t('footer.egyptianCrafts')}<");
c = c.replace(/>About EgyptX</, ">{t('footer.about')}<");
c = c.replace(/>Technology</, ">{t('footer.technology')}<");
c = c.replace(/>Terms \& Privacy</, ">{t('footer.terms')}<");

c = c.replace(/>\s*\&copy; 2026 EgyptX AI\. The National Smart Tourism Ecosystem\.\s*</, ">{t('footer.copy')}<");

fs.writeFileSync('src/components/Footer.tsx', c);
console.log('Fixed Footer');
