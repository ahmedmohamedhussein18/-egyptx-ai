const fs = require('fs');
const p = 'src/components/Navbar.tsx';
let t = fs.readFileSync(p, 'utf8');

// Replace the Command link in desktop
t = t.replace(
  /<Link\s*href="\/command-center"\s*className="px-4 py-2 text-sm font-medium text-white\/90 border border-\[\#C9A84C\]\/50 rounded hover:bg-\[\#C9A84C\]\/10 hover:border-\[\#C9A84C\] transition-colors"\s*>\s*Command\s*<\/Link>/g,
  `{user?.role && ['national_admin', 'governorate_admin'].includes(user.role) && (
              <Link
                href={user.role === 'national_admin' ? '/command-center' : '/government/dashboard'}
                className="px-4 py-2 text-sm font-medium text-[#C9A84C] border border-[#C9A84C]/50 rounded hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-colors"
              >
                Command
              </Link>
            )}`
);

// Replace the Command link in mobile menu
t = t.replace(
  /<Link\s*href="\/command-center"\s*onClick=\{\(\) => setMobileMenuOpen\(false\)\}\s*className="block w-full px-4 py-3 text-center text-sm font-medium text-\[\#C9A84C\] border border-\[\#C9A84C\]\/50 rounded-md hover:bg-\[\#C9A84C\]\/10 transition-colors"\s*>\s*Command Center\s*<\/Link>/g,
  `{user?.role && ['national_admin', 'governorate_admin'].includes(user.role) && (
              <Link
                href={user.role === 'national_admin' ? '/command-center' : '/government/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-3 text-center text-sm font-medium text-[#C9A84C] border border-[#C9A84C]/50 rounded-md hover:bg-[#C9A84C]/10 transition-colors"
              >
                Command Center
              </Link>
            )}`
);

fs.writeFileSync(p, t);
console.log('Updated Navbar');
