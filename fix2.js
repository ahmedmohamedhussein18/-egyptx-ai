const fs = require('fs');

let c = fs.readFileSync('src/components/AIGuideContent.tsx', 'utf8');

const s1 = Buffer.from('2LnYsNix2KfZi9iMINit2K/YqyDYrti32KMg2YHZiiDYp9mE2KfYqti12KfZhC4g2YrYsdis2Ykg2KfZhNmF2K3Yp9mI2YTYqSDZhdix2Kkg2KPYrtix2Yku', 'base64').toString('utf8');
const s2 = Buffer.from('2KfYs9ij2YQg2KfZhNmF2LHYtNivINin2YTYsNmD2Yog2LnZhiDYo9mKINiq2YHYp9i12YrZhCDYqtin2LHZitiu2YrYqSDYo9mIINmF2LnZhdin2LHZitipINiq2K7YtSDZh9iw2Kcg2KfZhNmF2LnZhNmFLi4u', 'base64').toString('utf8');
const s3 = Buffer.from('2KfZg9iq2Kgg2LPYpNin2YTZgyDZh9mG2KcuLi4=', 'base64').toString('utf8');

// Replace all garbled content fields
c = c.replace(/content: 'O[A-Za-z0-9,. \']+'/g, 'content: "' + s1 + '"');
c = c.replace(/content: 'U,[A-Za-z0-9,. \']+'/g, 'content: "' + s1 + '"');
c = c.replace(/<div className="text-center text-gray-500 text-sm mt-10">[^<]+<\/div>/g, '<div className="text-center text-gray-500 text-sm mt-10">' + s2 + '</div>');
c = c.replace(/placeholder="[A-Za-z0-9,. ]+"/g, 'placeholder="' + s3 + '"');

fs.writeFileSync('src/components/AIGuideContent.tsx', c, 'utf8');
console.log('Fixed!');
