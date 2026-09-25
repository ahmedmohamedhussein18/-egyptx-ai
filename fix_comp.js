const fs = require('fs');

const b64 = (str) => Buffer.from(str, 'base64').toString('utf8');

const compPath = 'src/components/AIGuideContent.tsx';
let compStr = fs.readFileSync(compPath, 'utf8');

// The corrupted texts are inside strings:
// 1. content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.'
compStr = compStr.replace(
  /content:\s*'[^']*'/g,
  (match) => {
    if (match.includes('U,') || match.includes('O')) return \`content: '\${b64("2LnYsNix2KfZi9iMINit2K/YqyDYrti32KMg2YHZiiDYp9mE2KfYqti12KfZhC4g2YrYsdis2Ykg2KfZhNmF2K3Yp9mI2YTYqSDZhdix2Kkg2KPYrtix2Yku")}'\`;
    return match;
  }
);

// 2. اسأل المرشد الذكي...
compStr = compStr.replace(
  /<div className="text-center text-gray-500 text-sm mt-10">[^<]*<\/div>/g,
  \`<div className="text-center text-gray-500 text-sm mt-10">{\` + "\`" + b64('2KfYs9ij2YQg2KfZhNmF2LHYtNivINin2YTYsNmD2Yog2LnZhiDYo9mKINiq2YHYp9i12YrZhCDYqtin2LHZitiu2YrYqSDYo9mIINmF2LnZhdin2LHZitipINiq2K7YtSDZh9iw2Kcg2KfZhNmF2LnZhNmFLi4u') + "\`" + \`}</div>\`
);

// 3. اكتب سؤالك هنا...
compStr = compStr.replace(
  /placeholder="[^"]*"/g,
  (match) => {
    if (match.includes('O') || match.includes('U')) return \`placeholder="\${b64("2KfZg9iq2Kgg2LPYpNin2YTZgyDZh9mG2KcuLi4=")}"\`;
    return match;
  }
);

fs.writeFileSync(compPath, compStr, 'utf8');
console.log('Fixed component successfully.');
