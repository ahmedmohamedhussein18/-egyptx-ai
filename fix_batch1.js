const fs = require('fs');

function replaceAll(file, replacements) {
  let c = fs.readFileSync(file, 'utf8');
  for (let old of Object.keys(replacements)) {
    c = c.split(old).join(replacements[old]);
  }
  fs.writeFileSync(file, c);
}

// 1. CTASection.tsx
replaceAll('src/components/CTASection.tsx', {
  'Experience Egypt, Intelligently.': '{t(\'cta.title\')}',
  'Let AI guide your journey through 5,000 years of civilization': '{t(\'cta.subtitle\')}',
  'Plan My Journey': '{t(\'cta.btn\')}',
  'Powered by Egyptian Intelligence': '{t(\'cta.poweredBy\')}',
  "import { motion } from 'framer-motion';": "import { motion } from 'framer-motion';\nimport { useLanguage } from '@/context/LanguageContext';"
});
let cta = fs.readFileSync('src/components/CTASection.tsx', 'utf8');
cta = cta.replace('export default function CTASection() {', 'export default function CTASection() {\n  const { t } = useLanguage();');
fs.writeFileSync('src/components/CTASection.tsx', cta);
console.log('Fixed CTASection');

// 2. ExploreContent.tsx
replaceAll('src/components/ExploreContent.tsx', {
  "Explore Details": "{t('explore.exploreDetails')}",
  "const categories: Category[] = ['All', 'Ancient', 'Museum', 'Nature', 'Beach', 'Hidden'];": "const getCategories = (t: any): {id: Category, label: string}[] => [{id: 'All', label: t('explore.cat.all')}, {id: 'Ancient', label: t('explore.cat.ancient')}, {id: 'Museum', label: t('explore.cat.museum')}, {id: 'Nature', label: t('explore.cat.nature')}, {id: 'Beach', label: t('explore.cat.beach')}, {id: 'Hidden', label: t('explore.cat.hidden')}];",
  "categories.map((cat) => (": "getCategories(t).map((cat) => (",
  "key={cat}": "key={cat.id}",
  "activeCategory === cat": "activeCategory === cat.id",
  "setActiveCategory(cat)": "setActiveCategory(cat.id)",
  " {cat}": " {cat.label}",
  "Explore Egypt": "{t('explore.title')}",
  "Discover verified historical sites, hidden gems, and natural wonders.": "{t('explore.subtitle')}"
});
let exp = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');
exp = exp.replace(
  '<h2 className="text-3xl md:text-5xl font-bold text-white mb-4">\n            {t(\'explore.title\')}\n          </h2>',
  '<h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t(\'explore.title\')}</h2>'
);
fs.writeFileSync('src/components/ExploreContent.tsx', exp);
console.log('Fixed ExploreContent');

// 3. CraftsContent.tsx
let crf = fs.readFileSync('src/components/CraftsContent.tsx', 'utf8');
if (!crf.includes('useLanguage')) {
  crf = crf.replace("import { Store } from 'lucide-react';", "import { Store } from 'lucide-react';\nimport { useLanguage } from '@/context/LanguageContext';");
  crf = crf.replace("export default function CraftsContent() {", "export default function CraftsContent() {\n  const { t } = useLanguage();");
}
fs.writeFileSync('src/components/CraftsContent.tsx', crf);
replaceAll('src/components/CraftsContent.tsx', {
  "const CATEGORIES = ['All', 'Pottery', 'Papyrus', 'Textiles', 'Jewelry', 'Wood Crafts', 'Traditional Crafts'];": 
  "const getCategories = (t: any) => [{id: 'All', label: t('crafts.cat.all')}, {id: 'Pottery', label: t('crafts.cat.pottery')}, {id: 'Papyrus', label: t('crafts.cat.papyrus')}, {id: 'Textiles', label: t('crafts.cat.textiles')}, {id: 'Jewelry', label: t('crafts.cat.jewelry')}, {id: 'Wood Crafts', label: t('crafts.cat.wood')}, {id: 'Traditional Crafts', label: t('crafts.cat.traditional')}];",
  
  "const DEMO_PRODUCTS = [": "const getProducts = (t: any) => [",
  "title: 'Hand-Painted Fayoum Pottery Bowl'": "title: t('crafts.prod.1')",
  "title: 'Authentic Painted Papyrus Scroll'": "title: t('crafts.prod.2')",
  "title: 'Akhmim Handwoven Textile'": "title: t('crafts.prod.3')",
  "title: 'Silver Lotus Flower Pendant'": "title: t('crafts.prod.4')",
  "title: 'Mother of Pearl Inlaid Box'": "title: t('crafts.prod.5')",
  "title: 'Traditional Alabaster Vase'": "title: t('crafts.prod.6')",
  "title: 'Nubian Handwoven Basket'": "title: t('crafts.prod.7')",
  "title: 'Gold Cartouche Pendant'": "title: t('crafts.prod.8')",
  
  "? DEMO_PRODUCTS ": "? getProducts(t) ",
  ": DEMO_PRODUCTS.filter(p => p.category === activeCategory);": ": getProducts(t).filter((p: any) => p.category === activeCategory);",
  
  "CATEGORIES.map(category => (": "getCategories(t).map((category: any) => (",
  "key={category}": "key={category.id}",
  "activeCategory === category": "activeCategory === category.id",
  "setActiveCategory(category)": "setActiveCategory(category.id)",
  ">{category}<": ">{category.label}<",
  
  "Authentic Egyptian Crafts": "{t('crafts.title')}",
  "Support local artisans and bring home a piece of Egyptian heritage. All items are verified for authenticity.": "{t('crafts.subtitle')}",
  "No products found in this category.": "{t('crafts.empty')}",
  "Register as an Artisan": "{t('crafts.registerBtn')}",
  "View Details": "{t('crafts.viewDetails')}"
});
console.log('Fixed CraftsContent');

