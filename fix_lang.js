const fs = require('fs');
let c = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');

const replacement = `const getInitialLocale = () => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('egyptx-locale') || 'en';
};
  const [locale, setLocaleState] = useState(getInitialLocale);`;

c = c.replace(/const \[locale, setLocaleState\] = useState\('en'\);/, replacement);

// Add the mounted check before return
if (!c.includes('if (!mounted) return <>{children}</>;')) {
  c = c.replace(/return \(\s*<LanguageContext\.Provider/, "if (!mounted) return <>{children}</>;\n  return (\n    <LanguageContext.Provider");
}

fs.writeFileSync('src/context/LanguageContext.tsx', c);
console.log('LanguageContext updated.');
