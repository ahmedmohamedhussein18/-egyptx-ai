const fs = require('fs');

const extractAndReplace = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  Object.keys(replacements).forEach(englishText => {
    // Escape string for regex
    const regex = new RegExp(englishText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replacements[englishText]);
  });
  fs.writeFileSync(filePath, content);
};

// Map of file paths to { 'English string to replace': 'replacement code' }
const tasks = {
  'src/components/ExploreContent.tsx': {
    'Explore Details': "{t('explore.exploreDetails')}",
    "const CATEGORIES: Category[] = ['All', 'Ancient', 'Museum', 'Nature', 'Beach', 'Hidden'];": "const getCategories = (t: any): {id: Category, label: string}[] => [{id: 'All', label: t('explore.cat.all')}, {id: 'Ancient', label: t('explore.cat.ancient')}, {id: 'Museum', label: t('explore.cat.museum')}, {id: 'Nature', label: t('explore.cat.nature')}, {id: 'Beach', label: t('explore.cat.beach')}, {id: 'Hidden', label: t('explore.cat.hidden')}];",
    "categories.map((cat) =>": "getCategories(t).map((cat) =>",
    "key={cat}": "key={cat.id}",
    "activeCategory === cat": "activeCategory === cat.id",
    "setActiveCategory(cat)": "setActiveCategory(cat.id)",
    "{cat}": "{cat.label}",
    "Explore Egypt": "{t('explore.title')}",
    "Discover verified historical sites, hidden gems, and natural wonders.": "{t('explore.subtitle')}"
  }
};

Object.keys(tasks).forEach(file => {
  extractAndReplace(file, tasks[file]);
  console.log(`Processed ${file}`);
});
