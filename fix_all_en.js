const fs = require('fs');

const missingData = {
  nav: {
    brand: "EGYPTX AI"
  },
  home: {
    fourPillars: {
      title: "THE FOUR CORE PILLARS",
      subtitle: "A seamless digital experience from planning to memories",
      aiPlanning: {
        title: "AI Planning",
        desc: "Generate personalized itineraries in seconds based on your preferences, budget, and travel style.",
        action: "Plan a Trip"
      },
      smartSites: {
        title: "Smart Sites",
        desc: "AR-enhanced exploration and real-time AI hieroglyph translation.",
        action: "Scan Sites"
      },
      vrEgypt: {
        title: "VR Egypt",
        desc: "Virtual access to restricted tombs and monuments worldwide.",
        action: "Enter VR"
      },
      aiMemories: {
        title: "AI Memories",
        desc: "Automatically organize and enhance your trip photos with AI.",
        action: "View Memories"
      }
    },
    smartTourism: {
      title: "Smart Tourism Overview",
      subtitle: "Revolutionizing how the world experiences Egypt",
      aiPowered: {
        title: "AI-Powered Tourism",
        desc: "Personalized AI journey planning that understands your preferences, pace, and passions to craft the perfect Egyptian adventure.",
        tag: "MACHINE LEARNING"
      },
      smartHeritage: {
        title: "Smart Heritage",
        desc: "Digital preservation and AR-enhanced experiences at Egypt's most treasured archaeological sites and monuments.",
        tag: "DIGITAL TWIN"
      },
      distribution: {
        title: "Intelligent Tourism Distribution",
        desc: "AI-driven crowd management and smart routing that ensures sustainable tourism while maximizing visitor experience.",
        tag: "REAL-TIME ANALYTICS"
      }
    },
    ecosystem: {
      title1: "Expanding the ",
      title2: "Ecosystem",
      subtitle: "EgyptX AI is continuously evolving. Here's what's coming next.",
      tourists: "Tourists",
      businesses: "Businesses",
      data: "Data",
      heritage: "Heritage",
      comingSoon: "Coming Soon",
      stats: {
        systems: "7 Integrated Systems",
        realTime: "Real-time Data Flow",
        insights: "AI-Powered Insights",
        coverage: "National Coverage"
      },
      features: {
        vrEgypt: { title: "VR Egypt", desc: "Immersive 360° virtual tours of ancient wonders" },
        kidsMode: { title: "Kids Mode", desc: "A magical, educational experience for young explorers" },
        emergency: { title: "Emergency Assistant", desc: "24/7 instant multilingual emergency support and location sharing" },
        aiMemories: { title: "AI Memories", desc: "Auto-generated story of your journey with photos and highlights" },
        treasureHunt: { title: "Treasure Hunt", desc: "Gamified exploration challenges with real rewards" },
        sustainability: { title: "Sustainability Dashboard", desc: "Tracking Egypt's environmental impact and progress" },
        researchHub: { title: "Research Hub", desc: "AI-powered access to Egypt's historical and archaeological data" }
      }
    },
    mobility: {
      title: "SMART MOBILITY",
      subtitle: "CONNECTED TRANSPORT ECOSYSTEM",
      comingSoon: "Coming Soon",
      airport: { title: "Airport Transfers", desc: "Seamless transfers from Cairo, Sphinx, and Luxor International airports." },
      city: { title: "City Transport", desc: "On-demand smart vehicles for safe and verified inner-city travel." },
      buses: { title: "Tourist Buses", desc: "Intercity eco-friendly buses connecting major governorates and attractions." },
      nile: { title: "Nile Cruises", desc: "Integrated booking for authenticated smart cruises along the Nile." },
      integration: "INTEGRATION IN PROGRESS",
      notifyPlaceholder: "Enter email to get notified",
      notifyBtn: "NOTIFY ME",
      added: "Added to waitlist"
    }
  },
  cta: {
    title: "Experience Egypt, Intelligently.",
    subtitle: "Let AI guide your journey through 5000 years of civilization",
    btn: "Plan My Journey",
    poweredBy: "Powered by Egyptian Intelligence"
  },
  planner: {
    intAncient: "Ancient Ruins",
    intBeaches: "Beaches",
    intAdventure: "Adventure",
    intFood: "Local Food",
    intCulture: "Culture",
    intNature: "Nature",
    styleSolo: "Solo",
    styleCouple: "Couple",
    styleFamily: "Family",
    styleGroup: "Group",
    planYour: "Plan Your",
    journey: "Egypt Journey",
    paceTitle: "Preferred Pace",
    tryAgain: "Try Again",
    routeMap: "Route Map",
    exploreAll: "Explore All Destinations"
  },
  explore: {
    catAll: "All",
    catAncient: "Ancient Sites",
    catMuseum: "Museums",
    catNature: "Nature",
    catBeach: "Red Sea & Beaches",
    catHidden: "Hidden Egypt",
    exploreDetails: "Explore Details",
    cat: {
      all: "All",
      ancient: "Ancient Sites",
      hidden: "Hidden Egypt",
      nature: "Nature"
    }
  },
  passport: {
    verified: "Verified",
    badges: {
      pharaoh: { title: "Pharaoh Explorer", desc: "Visited 3+ ancient sites" },
      desert: { title: "Desert Explorer", desc: "Explored a hidden oasis" },
      heritage: { title: "Heritage Hunter", desc: "Collected 5+ digital stamps" },
      culture: { title: "Culture Seeker", desc: "Experienced local Egyptian cuisine (Pending)" },
      nile: { title: "Nile Navigator", desc: "Take a Nile cruise (Pending)" }
    }
  },
  news: {
    badge: "LATEST NEWS",
    title: "EGYPT TOURISM & HERITAGE",
    subtitle: "Stay updated with the latest discoveries, events, and tourism news.",
    filters: {
      all: "ALL",
      archaeology: "ARCHAEOLOGY",
      tourism: "TOURISM",
      heritage: "HERITAGE",
      museums: "MUSEUMS",
      history: "HISTORY"
    },
    items: {
      gem: {
        title: "Grand Egyptian Museum Opens to the World",
        desc: "The Grand Egyptian Museum (GEM) in Giza, the world's largest archaeological museum, officially opened in 2023. It houses over 100,000 artifacts including the complete treasures of Tutankhamun displayed together for the first time in history."
      },
      luxor: {
        title: "New Tomb Discovered in Luxor's Valley of the Kings",
        desc: "Egyptian archaeologists discovered a new tomb in the Valley of the Kings in Luxor, designated KV65. The discovery adds to our understanding of the New Kingdom period and the burial practices of ancient Egyptian nobles."
      },
      tourism2024: {
        title: "Egypt Records 15 Million Tourist Arrivals in 2024",
        desc: "Egypt's tourism sector achieved a record 15 million tourist arrivals in 2024, generating $14.9 billion in revenues. The country aims to attract 30 million tourists annually by 2028 as part of its national tourism development strategy."
      },
      unesco: {
        title: "UNESCO Launches Digital Heritage Preservation Project",
        desc: "A new joint initiative between UNESCO and the Egyptian Ministry of Antiquities will create high-fidelity 3D digital twins of threatened monuments, starting with Islamic Cairo and historic Alexandria."
      },
      alexandria: {
        title: "Bibliotheca Alexandrina Announces New Manuscript Exhibition",
        desc: "The modern Library of Alexandria will host a rare exhibition of newly restored Islamic and Coptic manuscripts, showcasing the incredible diversity of Egypt's intellectual history through the centuries."
      }
    },
    learnMore: "LEARN MORE",
    noArticles: "No articles found"
  },
  destinations: {
    featured: "Featured Destinations",
    subtitle: "From ancient wonders to hidden oases"
  },
  hidden: {
    title: "Hidden Egypt",
    subtitle: "Discover the untold stories of Egypt's most mysterious locations.",
    exploreBtn: "Explore Hidden Sites"
  },
  kids: {
    title: "Kids Mode",
    subtitle: "A magical, educational experience for young explorers",
    playBtn: "Play & Learn"
  },
  login: {
    title: "Welcome Back",
    subtitle: "Log in to your account",
    email: "Email Address",
    pass: "Password",
    btn: "Log In",
    register: "Create an Account"
  },
  crafts: {
    title: "Egyptian Crafts",
    subtitle: "Authentic, handcrafted souvenirs from local artisans.",
    shopBtn: "Shop Now"
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

console.log('Successfully merged all missing English keys!');
