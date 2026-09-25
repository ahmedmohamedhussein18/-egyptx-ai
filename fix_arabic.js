const fs = require('fs');

const b64 = (str) => Buffer.from(str, 'base64').toString('utf8');

// Fix API Route
const routePath = 'src/app/api/ai-guide/chat/route.ts';
let routeStr = fs.readFileSync(routePath, 'utf8');
routeStr = routeStr.replace(
  /"U,USO3 U,O_US U.O1U,U\^U.O O U.U\^OU,Oc UO U\?USOc U,U,OOO O"Oc O1U,U% UOO  O U,O3O O U, O"O_U,Oc"/g,
  \`"\${b64('2YTZitizINmE2K/ZiiDZhdi52YTZiNmF2KfYqiDZhdmI2KvZgtipINmD2KfZgdmK2Kkg2YTZhNil2KzYp9io2Kkg2LnZhNmJINmH2LDYpyDYp9mE2LPYpNin2YQg2KjYr9mC2Kku')}"\`
);
routeStr = routeStr.replace(
  /"U,USO3 U,O_US U.O1U,U\^U.O O U.U\^OU,Oc UO U\?USOc U,U,OOO O"Oc O1U,U% UOO  O U,O3O O U, O"O_U,Oc."/g,
  \`"\${b64('2YTZitizINmE2K/ZiiDZhdi52YTZiNmF2KfYqiDZhdmI2KvZgtipINmD2KfZgdmK2Kkg2YTZhNil2KzYp9io2Kkg2LnZhNmJINmH2LDYpyDYp9mE2LPYpNin2YQg2KjYr9mC2Kku')}"\`
);
fs.writeFileSync(routePath, routeStr, 'utf8');

// Fix AIGuideContent
const compPath = 'src/components/AIGuideContent.tsx';
let compStr = fs.readFileSync(compPath, 'utf8');
// replace any garbled text in single quotes
compStr = compStr.replace(
  /content: '.*?'/g,
  (match) => {
    if (match.includes('O')) return \`content: '\${b64('2LnYsNix2KfZi9iMINit2K/YqyDYrti32KMg2YHZiiDYp9mE2KfYqti12KfZhC4g2YrYsdis2Ykg2KfZhNmF2K3Yp9mI2YTYqSDZhdix2Kkg2KPYrtix2Yku')}'\`;
    return match;
  }
);
compStr = compStr.replace(
  /<div className="text-center text-gray-500 text-sm mt-10">[^<]*<\/div>/g,
  \`<div className="text-center text-gray-500 text-sm mt-10">{\`\${b64('2KfYs9ij2YQg2KfZhNmF2LHYtNivINin2YTYsNmD2Yog2LnZhiDYo9mKINiq2YHYp9i12YrZhCDYqtin2LHZitiu2YrYqSDYo9mIINmF2LnZhdin2LHZitipINiq2K7YtSDZh9iw2Kcg2KfZhNmF2LnZhNmFLi4u')}\`}</div>\`
);
compStr = compStr.replace(
  /placeholder="[^"]*"/g,
  (match) => {
    if (match.includes('O')) return \`placeholder="\${b64('2KfZg9iq2Kgg2LPYpNin2YTZgyDZh9mG2KcuLi4=')}"\`;
    return match;
  }
);
fs.writeFileSync(compPath, compStr, 'utf8');
console.log('Fixed encodings safely.');
