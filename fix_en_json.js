const fs = require('fs');

const missingData = {
  "home": {
    "smartTourism": {
      "title": "Smart Tourism Overview",
      "subtitle": "Revolutionizing how the world experiences Egypt",
      "aiPowered": {
        "title": "AI-Powered Tourism",
        "desc": "Personalized AI journey planning that understands your preferences, pace, and passions to craft the perfect Egyptian adventure.",
        "tag": "MACHINE LEARNING"
      },
      "smartHeritage": {
        "title": "Smart Heritage",
        "desc": "Digital preservation and AR-enhanced experiences at Egypt's most treasured archaeological sites and monuments.",
        "tag": "DIGITAL TWIN"
      },
      "distribution": {
        "title": "Intelligent Tourism Distribution",
        "desc": "AI-driven crowd management and smart routing that ensures sustainable tourism while maximizing visitor experience.",
        "tag": "REAL-TIME ANALYTICS"
      }
    },
    "ecosystem": {
      "title1": "Expanding the ",
      "title2": "Ecosystem",
      "subtitle": "EgyptX AI is continuously evolving. Here's what's coming next.",
      "features": {
        "vrEgypt": { "title": "VR Egypt", "desc": "Immersive 360° virtual tours of ancient wonders" },
        "kidsMode": { "title": "Kids Mode", "desc": "A magical, educational experience for young explorers" },
        "emergency": { "title": "Emergency Assistant", "desc": "24/7 instant multilingual emergency support and location sharing" },
        "aiMemories": { "title": "AI Memories", "desc": "Auto-generated story of your journey with photos and highlights" },
        "treasureHunt": { "title": "Treasure Hunt", "desc": "Gamified exploration challenges with real rewards" },
        "sustainability": { "title": "Sustainability Dashboard", "desc": "Tracking Egypt's environmental impact and progress" },
        "researchHub": { "title": "Research Hub", "desc": "AI-powered access to Egypt's historical and archaeological data" }
      }
    },
    "mobility": {
      "title": "SMART MOBILITY",
      "subtitle": "CONNECTED TRANSPORT ECOSYSTEM",
      "airport": { "title": "Airport Transfers", "desc": "Seamless transfers from Cairo, Sphinx, and Luxor International airports." },
      "city": { "title": "City Transport", "desc": "On-demand smart vehicles for safe and verified inner-city travel." },
      "buses": { "title": "Tourist Buses", "desc": "Intercity eco-friendly buses connecting major governorates and attractions." },
      "nile": { "title": "Nile Cruises", "desc": "Integrated booking for authenticated smart cruises along the Nile." },
      "integration": "INTEGRATION IN PROGRESS",
      "notifyPlaceholder": "Enter email to get notified",
      "notifyBtn": "NOTIFY ME",
      "added": "Added to waitlist"
    }
  },
  "cta": {
    "title": "Experience Egypt, Intelligently.",
    "subtitle": "Let AI guide your journey through 5000 years of civilization",
    "btn": "Plan My Journey",
    "poweredBy": "Powered by Egyptian Intelligence"
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const f = 'messages/en.json';
let data = JSON.parse(fs.readFileSync(f, 'utf8'));
deepMerge(data, missingData);
fs.writeFileSync(f, JSON.stringify(data, null, 2));

console.log('Successfully merged missing English keys.');
