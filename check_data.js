const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, val] = line.split('=');
  if (key && val) acc[key.trim()] = val.trim();
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkData() {
  const { count: checkins } = await supabase.from('qr_checkins').select('*', { count: 'exact', head: true });
  const { count: analytics } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true });
  const { count: attractions } = await supabase.from('attractions').select('*', { count: 'exact', head: true });

  console.log('checkins:', checkins);
  console.log('analytics:', analytics);
  console.log('attractions:', attractions);
}

checkData();
