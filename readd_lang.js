const fs = require('fs');

let c = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const langSelectorCode = `
// --- Language Selector ---
const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇪🇬' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' }
];

function LanguageSelector({ locale, setLocale }: { locale: string, setLocale: (loc: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-white"
      >
        <span>{current.flag}</span>
        <span className="uppercase">{current.code}</span>
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-32 bg-[#0A1628] border border-[#C9A84C]/20 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setLocale(lang.code); setOpen(false); }}
                className={\`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[#C9A84C]/10 flex items-center gap-2 \${locale === lang.code ? 'text-[#C9A84C]' : 'text-white'}\`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// -------------------------

`;

// Insert the component before export default function Navbar
c = c.replace(/export default function Navbar/, langSelectorCode + 'export default function Navbar');

// Insert it in the desktop view before the user login button
// Search for:
// <div className="hidden lg:flex items-center gap-4">
//   <Link href="/command-center"

c = c.replace(
  /<div className="hidden lg:flex items-center gap-4">/,
  `<div className="hidden lg:flex items-center gap-4">
            <LanguageSelector locale={locale} setLocale={setLocale} />`
);

// We should also add it to mobile view. But let's check what mobile view looks like.
c = c.replace(
  /<div className="pt-4 pb-3 border-t border-white\/10">/,
  `<div className="px-4 py-2">
                  <LanguageSelector locale={locale} setLocale={setLocale} />
                </div>
                <div className="pt-4 pb-3 border-t border-white/10">`
);

// We also need to extract `locale, setLocale` from useLanguage() since I only extracted `t` earlier.
// `const { t } = useLanguage();` -> `const { t, locale, setLocale } = useLanguage();`
c = c.replace(/const \{ t \} = useLanguage\(\);/, 'const { t, locale, setLocale } = useLanguage();');

fs.writeFileSync('src/components/Navbar.tsx', c);
console.log('Language selector added to Navbar');
