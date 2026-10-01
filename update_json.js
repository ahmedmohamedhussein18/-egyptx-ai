const fs = require('fs');
const files = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'].map(l => 'messages/' + l + '.json');

const newKeys = {
  fourPillars: {
    title: 'The Four Core Pillars',
    subtitle: 'A seamless digital experience from planning to memories',
    aiPlanning: {
      title: 'AI Planning',
      desc: 'Intelligent itinerary generation based on crowds, weather, and preferences.',
      action: 'Plan a Trip'
    },
    smartSites: {
      title: 'Smart Sites',
      desc: 'AR-enabled exploration and instant AI translation of hieroglyphs.',
      action: 'Scan Sites'
    },
    vrEgypt: {
      title: 'VR Egypt',
      desc: 'Virtual access to restricted tombs and monuments globally.',
      action: 'Enter VR'
    },
    aiMemories: {
      title: 'AI Memories',
      desc: 'Automatically organize and enhance your journey photos.',
      action: 'See Memories'
    }
  },
  smartTourism: {
    title: 'Smart Tourism Overview',
    subtitle: 'Revolutionizing how the world experiences Egypt',
    aiPowered: {
      title: 'AI-Powered Tourism',
      desc: "Personalized AI journey planning that understands your preferences, pace, and passions to craft the perfect Egyptian adventure.",
      tag: 'Machine Learning'
    },
    smartHeritage: {
      title: 'Smart Heritage',
      desc: "Digital preservation and AR-enhanced experiences at Egypt's most treasured archaeological sites and monuments.",
      tag: 'Digital Twin'
    },
    distribution: {
      title: 'Intelligent Tourism Distribution',
      desc: 'AI-driven crowd management and smart routing that ensures sustainable tourism while maximizing visitor experience.',
      tag: 'Real-Time Analytics'
    }
  }
};

files.forEach(f => {
  let data = JSON.parse(fs.readFileSync(f, 'utf8'));
  data.home = data.home || {};
  data.home.fourPillars = newKeys.fourPillars;
  data.home.smartTourism = newKeys.smartTourism;
  fs.writeFileSync(f, JSON.stringify(data, null, 2));
});
console.log('JSON files updated.');
