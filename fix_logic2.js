const fs = require('fs');
let text = fs.readFileSync('src/components/TouristPassportContent.tsx', 'utf8');

text = text.replace(/select\([\s\S]*?id,[\s\S]*?checked_in_at,[\s\S]*?attractions/, 
  `select(\`
            id,
            checked_in_at,
            verification_method,
            attractions`);

const replacement = `
        const mappedStamps: any[] = [];
        const exploredList: any[] = [];
        
        (checkinData || []).forEach((c: any, i: number) => {
          let icon = Crown;
          if (c.attractions?.category === 'nature') icon = Palmtree;
          if (c.attractions?.category === 'hidden') icon = Tent;
          
          const stamp = {
            id: c.id,
            name: c.attractions?.name_en || 'Unknown Site',
            date: new Date(c.checked_in_at).toLocaleDateString(),
            icon,
            angle: (i % 2 === 0 ? 1 : -1) * (15 + (i * 5) % 20)
          };

          if (c.verification_method === 'ai_planner_self_report') {
            exploredList.push({
              id: c.id,
              name: c.attractions?.name_en || 'Unknown Site',
              country: 'AI Planner', 
              duration: 1, 
              date: new Date(c.checked_in_at).toLocaleDateString(),
              icon,
              angle: (i % 2 === 0 ? 1 : -1) * (5 + (i * 2) % 10)
            });
          } else {
            mappedStamps.push(stamp);
          }
        });

        setCheckins(mappedStamps);
        setExplored(exploredList);

        // Fetch AI Planned destinations (Explored Online)
        // Ignoring old logic entirely
        try {
          // done
        } catch(e) {}
`;

text = text.replace(/const mappedStamps = \(checkinData \|\| \[\]\)\.map\([\s\S]*?setCheckins\(mappedStamps\);[\s\S]*?setExplored\(exploredList\);/, replacement);

fs.writeFileSync('src/components/TouristPassportContent.tsx', text);
console.log('Fixed data fetching logic 2');
