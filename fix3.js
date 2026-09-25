const fs = require('fs');
let text = fs.readFileSync('src/components/TouristPassportContent.tsx', 'utf8');
const beforeFetch = text.split('// Fetch checkins with joined attraction data')[0];
const afterFetch = text.split('// Derived stats')[1];

const fetchLogic = `// Fetch checkins with joined attraction data
        const { data: checkinData, error: checkinError } = await supabase
          .from('qr_checkins')
          .select(\`
            id,
            checked_in_at,
            verification_method,
            attractions (
              id,
              name_en,
              category
            )
          \`)
          .eq('user_id', user.id)
          .order('checked_in_at', { ascending: true });

        if (checkinError) throw checkinError;

        // Map data to STAMPS format
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

      } catch (err) {
        console.error('Error loading passport data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadPassportData();
  }, [router]);

  // Derived stats`;

fs.writeFileSync('src/components/TouristPassportContent.tsx', beforeFetch + fetchLogic + afterFetch, 'utf8');
console.log('Fixed syntax error');
