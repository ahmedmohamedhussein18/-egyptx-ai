const fs = require('fs');
const p = 'src/context/AuthContext.tsx';
let t = fs.readFileSync(p, 'utf8');

t = t.replace('language?: string;', 'language?: string;\n  role?: string;\n  governorate_id?: string;');

// Fix the mapping where user is set
t = t.replace(
  `setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
        });`,
  `
      // Fetch profile to get role
      supabase.from('profiles').select('role, governorate_id').eq('id', session.user.id).single().then(({ data: profile }) => {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: profile?.role || 'tourist',
          governorate_id: profile?.governorate_id
        });
      });
  `
);

t = t.replace(
  `setUser({
        id: session.user.id,
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
      });`,
  `
      supabase.from('profiles').select('role, governorate_id').eq('id', session.user.id).single().then(({ data: profile }) => {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: profile?.role || 'tourist',
          governorate_id: profile?.governorate_id
        });
      });
  `
);

fs.writeFileSync(p, t);
