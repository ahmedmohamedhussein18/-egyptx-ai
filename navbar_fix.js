const fs = require('fs');

let c = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// 1. Add Lucide imports
c = c.replace(
  "import { Sparkles } from 'lucide-react';",
  "import { Sparkles, MessageCircle, Brain } from 'lucide-react';"
);

// 2. Remove emojis and add icons
c = c.replace(
  /\{ name: '.* Slang', href: '\/slang' \},/,
  "{ name: 'Slang', href: '/slang', icon: MessageCircle },"
);
c = c.replace(
  /\{ name: '.* Memory', href: '\/memory-core' \},/,
  "{ name: 'Memory', href: '/memory-core', icon: Brain },"
);

// 3. Remove "AI" from logo
c = c.replace(
  /<span className="ml-2 px-2 py-0\.5 rounded text-xs font-bold bg-\[#1B6B93\]\/20 text-\[#1B6B93\] border border-\[#1B6B93\]\/30">\s*AI\s*<\/span>/,
  ""
);

// 4. Desktop Navigation - gap-8 and new rendering
const oldDesktopNavRegex = /<nav className="hidden xl:flex items-center gap-5">[\s\S]*?<\/nav>/;
const newDesktopNav = `<nav className="hidden xl:flex items-center gap-8">
            {getNavItems(t).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors group py-2 whitespace-nowrap after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[2px] after:bg-[#C9A84C] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]"
              >
                {item.icon && <item.icon className="w-4 h-4 text-white/50 group-hover:text-[#C9A84C] transition-colors" />}
                {item.name}
                {item.href === '/planner' && (
                  <span 
                    className="ml-1 px-[6px] py-[2px] rounded text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase" 
                    style={{ border: '1px solid rgba(255, 215, 0, 0.5)', boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)' }}
                  >
                    AI
                  </span>
                )}
              </Link>
            ))}
            {user && (
              <Link
                href="/ai-guide"
                title="AI Vision Guide"
                className="relative text-[#C9A84C] hover:text-[#E3C973] transition-colors group py-2 flex items-center"
              >
                <Sparkles className="w-5 h-5" />
                <span className="absolute left-1/2 bottom-0 w-full h-[2px] bg-[#C9A84C] -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </Link>
            )}
          </nav>`;
c = c.replace(oldDesktopNavRegex, newDesktopNav);

// 5. Utility buttons on Right Side
// Soften borders and hovers
// Language Selector
c = c.replace(
  /className="flex items-center gap-2 px-3 py-1\.5 rounded text-sm font-medium text-white\/80 border border-white\/10 hover:bg-white\/5 hover:border-white\/20 transition-all"/g,
  'className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium text-white/80 border border-white/15 hover:bg-white/5 transition-all"'
);

// Command Button
c = c.replace(
  /<Link\n\s*href="\/command-center"\n\s*className="px-4 py-2 text-sm font-medium text-white\/90 border border-\[#C9A84C\]\/50 rounded hover:bg-\[#C9A84C\]\/10 hover:border-\[#C9A84C\] transition-colors"\n\s*>\{t\('nav\.command'\)\}<\/Link>/,
  `<Link href="/command-center" className="px-4 py-2 text-sm font-medium text-white/90 border border-white/15 rounded hover:bg-white/5 transition-colors">{t('nav.command')}</Link>`
);

// 6. Header Glassmorphism always
c = c.replace(
  /<header\n\s*className=\{\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \$\{\n\s*scrolled\n\s*\? 'bg-\[#0A1628\]\/80 backdrop-blur-xl border-b border-\[#C9A84C\]\/10 py-3'\n\s*: 'bg-transparent py-5'\n\s*\}\`\}\n\s*>/,
  `<header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 py-3" style={{ background: 'rgba(10, 15, 25, 0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>`
);

// Wait, I should also align items carefully in LanguageSelector if needed.
// The dropdown for language is a div.
// The main layout `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` contains `flex items-center justify-between`. This handles vertical centering well.

fs.writeFileSync('src/components/Navbar.tsx', c);
console.log('Navbar fixes applied!');
