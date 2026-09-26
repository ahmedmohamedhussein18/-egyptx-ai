const fs = require('fs');
const p = 'src/components/HiddenEgyptContent.tsx';
let t = fs.readFileSync(p, 'utf8');

const oldFunc = `function getHiddenSvg(name_en: string) {
  const name = name_en.toLowerCase();
  if (name.includes('siwa')) {
    return <Image src="/images/Fantasy-Island-egypt-siwaa-oasis.jpg" alt={name_en} fill className="object-cover" />;
  }
  
  if (name.includes('fayoum')) {
    return <Image src="/images/Wadi El Hitann.jpg" alt={name_en} fill className="object-cover" />;
  }

  if (name.includes('white desert')) {
    return <Image src="/images/white-desert.jpg" alt={name_en} fill className="object-cover" />;
  }

  if (name.includes('ras mohammed')) {
    return <Image src="/images/ras-mohammed.jpg" alt={name_en} fill className="object-cover" />;
  }`;

const newFunc = `function getHiddenSvg(name_en: string, name_ar: string) {
  const name = name_en.toLowerCase();
  const altText = \`\${name_en} / \${name_ar}\`;
  
  if (name.includes('siwa')) {
    return <Image src="/images/Fantasy-Island-egypt-siwaa-oasis.jpg" alt={altText} fill className="object-cover" />;
  }
  
  if (name.includes('fayoum') || name.includes('wadi el hitan')) {
    return <Image src="https://images.unsplash.com/photo-1547849185-3bc6334a1fc2?q=80&w=2000&auto=format&fit=crop" alt={altText} fill unoptimized className="object-cover" />;
  }

  if (name.includes('white desert')) {
    return <Image src="https://images.unsplash.com/photo-1627725920703-e83616238fb0?q=80&w=2000&auto=format&fit=crop" alt={altText} fill unoptimized className="object-cover" />;
  }

  if (name.includes('ras mohammed')) {
    return <Image src="/images/ras-mohammed.jpg" alt={altText} fill className="object-cover" />;
  }`;

t = t.replace(oldFunc, newFunc);

t = t.replace(
  /\{getHiddenSvg\(dest\.name_en\)\}/g,
  `{getHiddenSvg(dest.name_en, dest.name_ar)}`
);

fs.writeFileSync(p, t);
console.log('Updated HiddenEgyptContent.tsx');
