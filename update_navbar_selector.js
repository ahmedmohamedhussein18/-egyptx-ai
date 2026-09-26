const fs = require('fs');
const p = 'src/components/Navbar.tsx';
let t = fs.readFileSync(p, 'utf8');

const langSelectorHTML = `
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-white/80 hover:text-[#C9A84C] transition-colors rounded-full bg-white/5 border border-white/10">
                <Globe className="w-4 h-4" />
                <span className="uppercase">{locale}</span>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-[#0A1628] border border-[#C9A84C]/20 rounded-xl overflow-hidden shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {[
                  {code: 'en', flag: '🇬🇧', label: 'English'},
                  {code: 'ar', flag: '🇪🇬', label: 'العربية'},
                  {code: 'fr', flag: '🇫🇷', label: 'Français'},
                  {code: 'de', flag: '🇩🇪', label: 'Deutsch'},
                  {code: 'it', flag: '🇮🇹', label: 'Italiano'},
                  {code: 'es', flag: '🇪🇸', label: 'Español'},
                  {code: 'zh', flag: '🇨🇳', label: '中文'},
                  {code: 'ru', flag: '🇷🇺', label: 'Русский'}
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    className={\`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-white/5 \${locale === l.code ? 'text-[#C9A84C] font-bold bg-[#C9A84C]/10' : 'text-white/80'}\`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
`;

t = t.replace("{/* Right side buttons */}", langSelectorHTML + "\n          {/* Right side buttons */}");
t = t.replace("          {/* Mobile Menu */}", "        </div>\n\n  {/* Mobile Menu */}");

fs.writeFileSync(p, t);
