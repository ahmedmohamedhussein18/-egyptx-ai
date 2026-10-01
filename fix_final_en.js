const fs = require('fs');

const missingData = {
  explore: {
    cat: {
      museum: "Museums",
      beach: "Red Sea & Beaches"
    }
  },
  hidden: {
    mission: "Our Mission",
    reducedCrowding: "Reduced Crowding",
    loading: "Loading Hidden Sites...",
    noData: "No hidden sites found for this category.",
    aiRec: "AI Recommended",
    missionDesc: "Discover less-crowded, unique sites recommended by our AI.",
    noAi: "No AI recommendation available."
  },
  kids: {
    start: "Start Your Adventure",
    games: "Educational Games"
  },
  login: {
    signIn: "Sign In",
    access: "Access your account",
    demoTourist: "Demo Tourist Account",
    demoBusiness: "Demo Business Account",
    govLogin: "Government Login"
  },
  crafts: {
    empty: "No products found.",
    registerBtn: "Register as Vendor",
    viewDetails: "View Details",
    cat: {
      all: "All",
      pottery: "Pottery & Ceramics",
      jewelry: "Jewelry",
      textiles: "Textiles",
      woodwork: "Woodwork",
      glass: "Glass",
      leather: "Leather"
    },
    prod: {
      fayoum: "Fayoum Pottery Plate",
      scarab: "Silver Scarab Pendant",
      khayamiya: "Khayamiya Tapestry",
      alabaster: "Alabaster Vase",
      papyrus: "Hand-painted Papyrus",
      copper: "Engraved Copper Tray",
      desc: {
        fayoum: "Handcrafted plate from Fayoum",
        scarab: "Traditional silver pendant",
        khayamiya: "Authentic tentmaker appliqué",
        alabaster: "Hand-carved vase from Luxor",
        papyrus: "Ancient art replica on authentic papyrus",
        copper: "Intricate Mamluk style copper tray"
      }
    }
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

console.log('Successfully merged final missing English keys!');
