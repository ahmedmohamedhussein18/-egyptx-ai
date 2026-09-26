const fs = require('fs');
const p = 'src/components/PlannerContent.tsx';
let t = fs.readFileSync(p, 'utf8');

t = t.replace(
  '          await supabase.from(\'trip_places\').insert({\n            trip_day_id: tripDay.id,\n            attraction_id: matchedId,\n            time_slot: act.time,\n            notes: `${act.name}: ${act.description}`\n          });',
  `          await supabase.from('trip_places').insert({
            trip_day_id: tripDay.id,
            attraction_id: matchedId,
            time_slot: act.time,
            notes: \`\${act.name}: \${act.description}\`
          });

          if (matchedId) {
            await fetch('/api/planner-checkin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                logAnalyticsOnly: true,
                attractionId: matchedId,
                city: day.city
              })
            });
          }`
);

fs.writeFileSync(p, t);
console.log('Updated handleSaveTrip');
