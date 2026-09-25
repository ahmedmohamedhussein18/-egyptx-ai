const fs = require('fs');

let file = fs.readFileSync('src/components/TouristPassportContent.tsx', 'utf8');

// 1. We need to fetch 'verification_method' from 'qr_checkins'
file = file.replace(/select\(\`\s*id,\s*checked_in_at,\s*attractions/g, 
  "select(`\n                        id,\n                        checked_in_at,\n                        verification_method,\n                        attractions");

// 2. Separate mappedStamps and exploredList from qr_checkins
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
            // Outline badge format for Planned Trips
            exploredList.push({
              id: c.id,
              name: c.attractions?.name_en || 'Unknown Site',
              country: 'Egypt', // Add fallback
              duration: 1, // Add fallback
              date: new Date(c.checked_in_at).toLocaleDateString(),
              icon,
              angle: (i % 2 === 0 ? 1 : -1) * (5 + (i * 2) % 10)
            });
          } else {
            // Real verified checkin
            mappedStamps.push(stamp);
          }
        });

        setCheckins(mappedStamps);
        setExplored(exploredList);

        // Fetch AI Planned trips
        /*
`;

file = file.replace(/const mappedStamps = \(checkinData \|\| \[\]\)\.map[\s\S]*?setCheckins\(mappedStamps\);\s*\/\/\s*Fetch AI Planned destinations \(Explored Online\)/, replacement);

// We need to close the comment block we started at the end of replacement
file = file.replace(/setExplored\(exploredList\);\s*\} catch \(err\) \{/g, 
  "// setExplored(exploredList);\n        */\n\n      } catch (err) {");


fs.writeFileSync('src/components/TouristPassportContent.tsx', file);
console.log('Fixed data fetching logic.');
