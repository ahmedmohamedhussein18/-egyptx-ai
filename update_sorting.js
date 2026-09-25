const fs = require('fs');

let text = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');

const replacement = `        if (error) throw error;
        
        const strictOrder = [
          "great pyramid of giza",
          "egyptian museum cairo",
          "karnak temple",
          "luxor temple",
          "valley of the kings",
          "abu simbel temples",
          "philae temple",
          "siwa oasis",
          "white desert",
          "grand egyptian museum",
          "saqqara step pyramid",
          "fayoum oasis",
          "red sea coast hurghada",
          "sharm el sheikh",
          "ras mohammed",
          "alexandria library",
          "saint catherine monastery",
          "citadel of saladin",
          "wadi el hitan",
          "egyptian museum (tahrir)",
          "mosque of muhammad ali",
          "sultan hassan mosque",
          "al-rifa'i mosque",
          "khan el-khalili bazaar",
          "al-azhar mosque",
          "hanging church (el muallaqa)",
          "coptic museum",
          "ben ezra synagogue",
          "amr ibn al-as mosque",
          "cairo tower (borg el qahira)",
          "manial palace museum",
          "museum of islamic art (cairo)",
          "bayt al-suhaymi",
          "al-azhar park",
          "qasr el nil bridge",
          "ibn tulun mosque",
          "gayer-anderson museum"
        ];

        const getSortIndex = (name_en: string) => {
          if (!name_en) return 999;
          const name = name_en.toLowerCase();
          
          for (let i = 0; i < strictOrder.length; i++) {
            // Check for direct match or substring match from strictOrder
            // Clean up both strings to make matching more robust
            const target = strictOrder[i].replace(/[\\(\\)-']/g, '').trim();
            const current = name.replace(/[\\(\\)-']/g, '').trim();
            
            if (current.includes(target) || target.includes(current)) {
              return i;
            }
          }
          return 999;
        };

        const sortedData = (data || []).sort((a, b) => getSortIndex(a.name_en) - getSortIndex(b.name_en));

        setAttractions(sortedData);`;

text = text.replace(/if \(error\) throw error;\s*setAttractions\(data \|\| \[\]\);/s, replacement);

fs.writeFileSync('src/components/ExploreContent.tsx', text, 'utf8');
console.log('Fixed ExploreContent successfully.');
