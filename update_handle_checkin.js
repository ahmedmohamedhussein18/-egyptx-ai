const fs = require('fs');
const p = 'src/components/PlannerContent.tsx';
let t = fs.readFileSync(p, 'utf8');

t = t.replace(
  `        body: JSON.stringify({
          day: dayNumber,
          city: dayCity,
          attractionName: firstActivityName
        })`,
  `        body: JSON.stringify({
          day: dayNumber,
          city: dayCity,
          attractionName: firstActivityName,
          activities: itinerary?.find(d => d.day === dayNumber)?.activities || []
        })`
);

fs.writeFileSync(p, t);
console.log('Updated handleCheckinDay body');
