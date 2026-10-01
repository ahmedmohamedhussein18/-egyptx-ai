const fs = require('fs');

// 1. Fix CraftsContent.tsx
let crf = fs.readFileSync('src/components/CraftsContent.tsx', 'utf8');
if (!crf.includes('useLanguage')) {
  crf = crf.replace("import { AlertCircle, Filter, Store } from 'lucide-react';", "import { AlertCircle, Filter, Store } from 'lucide-react';\nimport { useLanguage } from '@/context/LanguageContext';");
  fs.writeFileSync('src/components/CraftsContent.tsx', crf);
}

// 2. Fix ExploreContent.tsx
let exp = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');
exp = exp.replace(
  /categories\.map\(\(category\) => \(/g,
  "getCategories(t).map((category: any) => ("
);
exp = exp.replace(
  /key=\{category\}/g,
  "key={category.id}"
);
exp = exp.replace(
  /onClick=\{\(\) => setActiveCategory\(category\)\}/g,
  "onClick={() => setActiveCategory(category.id)}"
);
exp = exp.replace(
  /activeCategory === cat.idegory/g,
  "activeCategory === category.id"
);
exp = exp.replace(
  /activeCategory === category/g,
  "activeCategory === category.id"
);
exp = exp.replace(
  />\s*\{category\}\s*<\/button>/g,
  ">{category.label}</button>"
);
fs.writeFileSync('src/components/ExploreContent.tsx', exp);

console.log('Fixed TS errors in ExploreContent and CraftsContent');
