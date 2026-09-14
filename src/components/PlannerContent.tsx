'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─────────────────── DATA ─────────────────── */

const COUNTRIES = [
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
  { code: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: 'CN', flag: '🇨🇳', name: 'China' },
  { code: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: 'IN', flag: '🇮🇳', name: 'India' },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: 'MX', flag: '🇲🇽', name: 'Mexico' },
  { code: 'TR', flag: '🇹🇷', name: 'Turkey' },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'SE', flag: '🇸🇪', name: 'Sweden' },
  { code: 'PL', flag: '🇵🇱', name: 'Poland' },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina' },
];

const INTERESTS = [
  { id: 'ancient', label: 'Ancient Egypt', emoji: '🏛️' },
  { id: 'beaches', label: 'Beaches', emoji: '🏖️' },
  { id: 'adventure', label: 'Adventure', emoji: '🏜️' },
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
];

const TRAVEL_STYLES = [
  { id: 'solo', label: 'Solo', emoji: '🧑', desc: 'Independent explorer' },
  { id: 'couple', label: 'Couple', emoji: '💑', desc: 'Romantic getaway' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', desc: 'Kid-friendly fun' },
  { id: 'group', label: 'Group', emoji: '👥', desc: 'Friends & tours' },
];

interface Activity {
  time: string;
  name: string;
  description: string;
  type: string;
}

interface DayPlan {
  day: number;
  city: string;
  activities: Activity[];
}

/* City coordinates on our simplified SVG map (viewBox 0 0 300 500) */
const CITY_COORDS: Record<string, { x: number; y: number }> = {
  Cairo: { x: 195, y: 135 },
  Giza: { x: 185, y: 140 },
  Luxor: { x: 205, y: 265 },
  Aswan: { x: 210, y: 315 },
  Hurghada: { x: 230, y: 220 },
  'Sharm El Sheikh': { x: 245, y: 175 },
  Siwa: { x: 100, y: 125 },
  Fayoum: { x: 175, y: 160 },
  Alexandria: { x: 165, y: 115 },
};

/* Hardcoded attraction database keyed by city and interest tag */
const ATTRACTIONS: Record<string, { tags: string[]; activities: Activity[] }> = {
  Cairo: {
    tags: ['ancient', 'culture', 'food'],
    activities: [
      { time: '09:00', name: 'Grand Egyptian Museum', description: 'World-class collection of pharaonic antiquities including Tutankhamun\'s treasures', type: 'ancient' },
      { time: '12:00', name: 'Khan El Khalili Bazaar', description: 'Historic marketplace with traditional crafts, spices, and street food', type: 'culture' },
      { time: '14:00', name: 'Islamic Cairo Walking Tour', description: 'Explore the medieval streets, mosques, and madrasas of historic Cairo', type: 'culture' },
      { time: '16:00', name: 'Egyptian Street Food Tour', description: 'Taste koshari, foul, ta\'ameya, and other authentic Egyptian dishes', type: 'food' },
      { time: '19:00', name: 'Nile Dinner Cruise', description: 'Elegant dinner aboard a traditional felucca with Cairo skyline views', type: 'food' },
      { time: '10:00', name: 'Coptic Cairo', description: 'Visit the Hanging Church, Ben Ezra Synagogue, and early Christian ruins', type: 'culture' },
      { time: '15:00', name: 'Al-Azhar Park', description: 'Beautiful gardens with panoramic views of the old city', type: 'nature' },
    ],
  },
  Giza: {
    tags: ['ancient', 'adventure'],
    activities: [
      { time: '07:00', name: 'Great Pyramids of Giza', description: 'Stand before the last surviving Wonder of the Ancient World', type: 'ancient' },
      { time: '09:30', name: 'The Great Sphinx', description: 'Iconic limestone statue guarding the Giza plateau', type: 'ancient' },
      { time: '11:00', name: 'Camel Ride at the Pyramids', description: 'Ride across the desert with pyramids as your backdrop', type: 'adventure' },
      { time: '13:00', name: 'Solar Boat Museum', description: 'Ancient cedar boat discovered buried near Khufu\'s pyramid', type: 'ancient' },
      { time: '19:00', name: 'Sound & Light Show', description: 'Spectacular evening show illuminating the pyramids and narrating their history', type: 'culture' },
    ],
  },
  Luxor: {
    tags: ['ancient', 'culture', 'adventure'],
    activities: [
      { time: '06:00', name: 'Hot Air Balloon over Luxor', description: 'Sunrise balloon flight over the Valley of the Kings and Nile', type: 'adventure' },
      { time: '08:00', name: 'Valley of the Kings', description: 'Explore royal tombs adorned with vivid 3,000-year-old paintings', type: 'ancient' },
      { time: '10:30', name: 'Temple of Hatshepsut', description: 'Terraced mortuary temple of Egypt\'s famous female pharaoh', type: 'ancient' },
      { time: '14:00', name: 'Karnak Temple Complex', description: 'Vast open-air temple with towering columns and sacred lake', type: 'ancient' },
      { time: '17:00', name: 'Luxor Temple at Sunset', description: 'Beautifully lit ancient temple on the east bank of the Nile', type: 'ancient' },
      { time: '12:00', name: 'Luxor Museum', description: 'Curated collection of Theban artifacts in a modern setting', type: 'culture' },
    ],
  },
  Aswan: {
    tags: ['ancient', 'nature', 'culture'],
    activities: [
      { time: '08:00', name: 'Philae Temple', description: 'Island temple dedicated to Isis, rescued from Nile flooding', type: 'ancient' },
      { time: '10:00', name: 'Felucca Sailing on the Nile', description: 'Traditional sailboat ride around Elephantine Island', type: 'nature' },
      { time: '13:00', name: 'Nubian Village Visit', description: 'Colorful village with traditional houses, crocodiles, and local cuisine', type: 'culture' },
      { time: '15:00', name: 'Aswan High Dam', description: 'Engineering marvel creating Lake Nasser, one of the largest reservoirs', type: 'culture' },
      { time: '16:30', name: 'Unfinished Obelisk', description: 'Massive ancient granite obelisk still attached to bedrock', type: 'ancient' },
      { time: '06:00', name: 'Abu Simbel Day Trip', description: 'Colossal temples of Ramesses II carved into a mountainside', type: 'ancient' },
    ],
  },
  Hurghada: {
    tags: ['beaches', 'adventure', 'nature'],
    activities: [
      { time: '08:00', name: 'Snorkeling at Giftun Island', description: 'Crystal-clear Red Sea waters with colorful coral reefs', type: 'beaches' },
      { time: '10:00', name: 'Scuba Diving Experience', description: 'Explore underwater gardens and tropical fish', type: 'adventure' },
      { time: '14:00', name: 'Desert Safari by Quad Bike', description: 'Adrenaline-fueled ride through the Eastern Desert', type: 'adventure' },
      { time: '16:00', name: 'Bedouin Camp & Stargazing', description: 'Traditional dinner under the stars with Bedouin hospitality', type: 'nature' },
      { time: '09:00', name: 'Glass Bottom Boat Tour', description: 'View marine life without getting wet', type: 'beaches' },
      { time: '11:00', name: 'Makadi Water World', description: 'Family-friendly waterpark along the Red Sea coast', type: 'beaches' },
    ],
  },
  Siwa: {
    tags: ['nature', 'adventure', 'ancient'],
    activities: [
      { time: '08:00', name: 'Temple of the Oracle (Amun)', description: 'Where Alexander the Great was declared son of Zeus-Ammon', type: 'ancient' },
      { time: '10:00', name: 'Cleopatra\'s Spring', description: 'Natural spring pool surrounded by palm trees', type: 'nature' },
      { time: '14:00', name: 'Great Sand Sea Adventure', description: 'Thrilling 4x4 dune bashing in the world\'s largest sand desert', type: 'adventure' },
      { time: '17:00', name: 'Salt Lake Sunset', description: 'Surreal salt lakes with mirror-like reflections at golden hour', type: 'nature' },
      { time: '20:00', name: 'Desert Stargazing', description: 'Zero light pollution — Milky Way visible to the naked eye', type: 'nature' },
      { time: '09:00', name: 'Shali Fortress Ruins', description: 'Medieval mud-brick citadel overlooking the oasis', type: 'ancient' },
    ],
  },
  Fayoum: {
    tags: ['nature', 'adventure', 'ancient'],
    activities: [
      { time: '08:00', name: 'Wadi El Rayan Waterfalls', description: 'Egypt\'s only waterfalls in a stunning desert oasis', type: 'nature' },
      { time: '10:30', name: 'Whale Valley (Wadi Al-Hitan)', description: 'UNESCO site with 40-million-year-old whale fossils', type: 'nature' },
      { time: '14:00', name: 'Lake Qarun', description: 'Ancient lake with birdwatching and peaceful boat rides', type: 'nature' },
      { time: '16:00', name: 'Sandboarding at Fayoum Dunes', description: 'Slide down towering golden dunes', type: 'adventure' },
      { time: '09:00', name: 'Hawara Pyramid', description: 'Middle Kingdom pyramid with remains of the famous Labyrinth', type: 'ancient' },
    ],
  },
  Alexandria: {
    tags: ['culture', 'food', 'ancient'],
    activities: [
      { time: '09:00', name: 'Bibliotheca Alexandrina', description: 'Stunning modern library honoring the ancient Library of Alexandria', type: 'culture' },
      { time: '11:00', name: 'Catacombs of Kom El Shoqafa', description: 'Underground Roman burial site blending Egyptian and Greek art', type: 'ancient' },
      { time: '13:00', name: 'Alexandria Seafood Feast', description: 'Fresh grilled fish and seafood at the waterfront', type: 'food' },
      { time: '15:00', name: 'Citadel of Qaitbay', description: 'Medieval fortress built on the site of the ancient Lighthouse', type: 'ancient' },
      { time: '17:00', name: 'Corniche Sunset Walk', description: 'Scenic Mediterranean promenade with cafes and sea views', type: 'culture' },
    ],
  },
};

/* ─────────────────── ITINERARY GENERATOR ─────────────────── */

function generateItinerary(
  duration: number,
  interests: string[],
  budget: number,
): DayPlan[] {
  // Determine which cities to include based on interests and duration
  const cityScores: { city: string; score: number }[] = [];
  for (const [city, data] of Object.entries(ATTRACTIONS)) {
    const overlap = data.tags.filter(t => interests.includes(t)).length;
    if (overlap > 0) {
      cityScores.push({ city, score: overlap });
    }
  }
  cityScores.sort((a, b) => b.score - a.score);

  // Always start with Cairo/Giza
  const orderedCities: string[] = ['Cairo', 'Giza'];
  for (const { city } of cityScores) {
    if (!orderedCities.includes(city) && orderedCities.length < duration) {
      orderedCities.push(city);
    }
  }
  // Fill remaining days with existing cities cycling
  while (orderedCities.length < duration) {
    orderedCities.push(orderedCities[orderedCities.length % cityScores.length] || 'Cairo');
  }

  const usedActivities = new Set<string>();
  const plan: DayPlan[] = [];

  for (let d = 0; d < duration; d++) {
    const city = orderedCities[d];
    const cityData = ATTRACTIONS[city] || ATTRACTIONS['Cairo'];

    // Pick 3-5 activities, preferring matching interests
    const relevantFirst = [...cityData.activities].sort((a, b) => {
      const aMatch = interests.includes(a.type) ? 1 : 0;
      const bMatch = interests.includes(b.type) ? 1 : 0;
      return bMatch - aMatch;
    });

    const count = budget > 2000 ? 5 : budget > 1000 ? 4 : 3;
    const dayActivities: Activity[] = [];
    for (const act of relevantFirst) {
      const key = `${city}-${act.name}`;
      if (!usedActivities.has(key) && dayActivities.length < count) {
        dayActivities.push(act);
        usedActivities.add(key);
      }
    }

    // Sort by time
    dayActivities.sort((a, b) => a.time.localeCompare(b.time));

    plan.push({ day: d + 1, city, activities: dayActivities });
  }

  return plan;
}

/* ─────────────────── EGYPT MAP SVG ─────────────────── */

function EgyptMap({ cities }: { cities: string[] }) {
  const uniqueCities = [...new Set(cities)];
  return (
    <svg viewBox="0 0 300 500" className="w-full h-full" fill="none">
      {/* Simplified Egypt outline */}
      <path
        d="M165 50 L250 50 L260 80 L270 100 L260 120 L255 140 L265 155 L255 170 L250 185 L260 200 L255 220 L250 240 L245 260 L240 280 L235 300 L230 320 L225 340 L218 370 L210 400 L195 430 L180 450 L165 440 L150 420 L140 400 L130 380 L125 350 L130 320 L140 290 L150 260 L155 230 L160 200 L170 170 L175 150 L180 130 L175 110 L170 90 L165 70 Z"
        fill="#C9A84C"
        fillOpacity="0.08"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      {/* Nile */}
      <path
        d="M195 130 Q200 160 205 200 Q210 240 205 270 Q200 310 210 350 Q215 380 195 430"
        stroke="#1B6B93"
        strokeWidth="2.5"
        strokeOpacity="0.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sinai */}
      <path
        d="M255 140 L280 120 L290 155 L270 190 L255 170"
        fill="#C9A84C"
        fillOpacity="0.05"
        stroke="#C9A84C"
        strokeWidth="1"
        strokeOpacity="0.2"
      />
      {/* Red Sea coast hint */}
      <path
        d="M260 200 Q270 210 265 230 Q260 250 255 270"
        stroke="#1B6B93"
        strokeWidth="1"
        strokeOpacity="0.3"
        fill="none"
      />
      {/* City markers */}
      {uniqueCities.map((city) => {
        const coords = CITY_COORDS[city];
        if (!coords) return null;
        return (
          <g key={city}>
            {/* Glow */}
            <circle cx={coords.x} cy={coords.y} r="12" fill="#C9A84C" fillOpacity="0.15" />
            <circle cx={coords.x} cy={coords.y} r="5" fill="#C9A84C" fillOpacity="0.9" stroke="#030712" strokeWidth="2" />
            <text
              x={coords.x}
              y={coords.y - 14}
              textAnchor="middle"
              fill="#C9A84C"
              fontSize="10"
              fontWeight="600"
              fontFamily="system-ui"
            >
              {city}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────── LOADING ANIMATION ─────────────────── */

function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative w-24 h-24">
        {/* Spinning rings */}
        <div className="absolute inset-0 rounded-full border-2 border-[#C9A84C]/30 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-2 rounded-full border-2 border-[#1B6B93]/40 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full border-2 border-[#C9A84C]/50 animate-spin" style={{ animationDuration: '1.5s' }} />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[#C9A84C] animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[#C9A84C] font-semibold text-lg">AI is crafting your journey...</p>
        <p className="text-white/40 text-sm mt-1">Analyzing preferences & optimizing routes</p>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function PlannerPage() {
  // Form state
  const [country, setCountry] = useState('');
  const [duration, setDuration] = useState(5);
  const [budget, setBudget] = useState(1500);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState('');

  // Result state
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!country || interests.length === 0 || !travelStyle) return;
    setLoading(true);
    setItinerary(null);
    // Simulate AI thinking
    setTimeout(() => {
      const result = generateItinerary(duration, interests, budget);
      setItinerary(result);
      setLoading(false);
    }, 1800);
  };

  const isFormValid = country && interests.length > 0 && travelStyle;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Header area */}
      <div className="relative pt-28 pb-12 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#C9A84C]/5 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#1B6B93]/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A84C]/30 bg-white/5 backdrop-blur-md mb-6"
          >
            <span className="text-lg">🤖</span>
            <span className="text-[#C9A84C] text-xs font-medium tracking-wide uppercase">AI-Powered Journey Planner</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] bg-clip-text text-transparent">Plan Your</span>{' '}
            <span className="text-white">Egypt Journey</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Tell us about your dream trip, and our AI will craft a personalized itinerary across Egypt&apos;s most breathtaking destinations.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {!loading && !itinerary && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* ── Country ── */}
              <div className="bg-[#0A1628]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#C9A84C]/10">
                <label className="block text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">
                  Where are you from?
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ── Duration & Budget ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A1628]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#C9A84C]/10">
                  <label className="block text-sm font-semibold text-white/70 mb-1 uppercase tracking-wider">
                    Trip Duration
                  </label>
                  <p className="text-3xl font-bold text-[#C9A84C] mb-4">{duration} {duration === 1 ? 'Day' : 'Days'}</p>
                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-[#1B6B93]/30 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                  />
                  <div className="flex justify-between text-xs text-white/30 mt-2">
                    <span>1 day</span>
                    <span>14 days</span>
                  </div>
                </div>

                <div className="bg-[#0A1628]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#C9A84C]/10">
                  <label className="block text-sm font-semibold text-white/70 mb-1 uppercase tracking-wider">
                    Budget
                  </label>
                  <p className="text-3xl font-bold text-[#C9A84C] mb-4">${budget.toLocaleString()}</p>
                  <input
                    type="range"
                    min={200}
                    max={5000}
                    step={100}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-[#1B6B93]/30 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                  />
                  <div className="flex justify-between text-xs text-white/30 mt-2">
                    <span>$200</span>
                    <span>$5,000</span>
                  </div>
                </div>
              </div>

              {/* ── Interests ── */}
              <div className="bg-[#0A1628]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#C9A84C]/10">
                <label className="block text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">
                  What interests you? <span className="text-white/30 normal-case">(select multiple)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map(i => {
                    const active = interests.includes(i.id);
                    return (
                      <button
                        key={i.id}
                        onClick={() => toggleInterest(i.id)}
                        className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.15)]'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white/80'
                        }`}
                      >
                        <span className="mr-2">{i.emoji}</span>
                        {i.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Travel Style ── */}
              <div className="bg-[#0A1628]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#C9A84C]/10">
                <label className="block text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">
                  Travel Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TRAVEL_STYLES.map(s => {
                    const active = travelStyle === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setTravelStyle(s.id)}
                        className={`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 ${
                          active
                            ? 'bg-[#C9A84C]/15 border-[#C9A84C] shadow-[0_0_20px_rgba(201,168,76,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <span className="text-3xl mb-2">{s.emoji}</span>
                        <span className={`font-semibold text-sm ${active ? 'text-[#C9A84C]' : 'text-white/80'}`}>{s.label}</span>
                        <span className="text-[11px] text-white/30 mt-1">{s.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Generate ── */}
              <div className="text-center pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={!isFormValid}
                  className={`px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isFormValid
                      ? 'bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] hover:scale-105 cursor-pointer'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  ✨ Generate My Egypt Journey
                </button>
                {!isFormValid && (
                  <p className="text-white/30 text-sm mt-3">Please fill in all fields to continue</p>
                )}
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingAnimation />
            </motion.div>
          )}

          {!loading && itinerary && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Result header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Your Personalized Itinerary</h2>
                  <p className="text-white/40">{duration} days &middot; {TRAVEL_STYLES.find(s => s.id === travelStyle)?.label} trip &middot; ${budget.toLocaleString()} budget</p>
                </div>
                <button
                  onClick={() => { setItinerary(null); }}
                  className="px-5 py-2.5 rounded-lg border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-medium hover:bg-[#C9A84C]/10 transition-colors"
                >
                  ← Modify Plan
                </button>
              </div>

              {/* Map + Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-[#0A1628]/60 backdrop-blur-md rounded-2xl border border-[#C9A84C]/10 p-4">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4 text-center">Route Map</h3>
                    <div className="w-full" style={{ maxHeight: '500px' }}>
                      <EgyptMap cities={itinerary.map(d => d.city)} />
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  {itinerary.map((day, dayIdx) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: dayIdx * 0.1 }}
                      className="bg-[#0A1628]/60 backdrop-blur-md rounded-2xl border border-[#C9A84C]/10 overflow-hidden"
                    >
                      {/* Day header */}
                      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] font-bold text-lg">
                          {day.day}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Day {day.day} — {day.city}</h3>
                          <p className="text-white/30 text-sm">{day.activities.length} activities planned</p>
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="px-6 py-4 space-y-0">
                        {day.activities.map((act, actIdx) => (
                          <div
                            key={actIdx}
                            className="flex gap-4 py-3 group"
                          >
                            {/* Timeline line */}
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-[#C9A84C]/60 group-hover:bg-[#C9A84C] transition-colors ring-4 ring-[#C9A84C]/10" />
                              {actIdx < day.activities.length - 1 && (
                                <div className="w-px flex-1 bg-[#C9A84C]/15 mt-1" />
                              )}
                            </div>
                            {/* Content */}
                            <div className="pb-2 flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-xs font-mono text-[#1B6B93] font-semibold">{act.time}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 capitalize">{act.type}</span>
                              </div>
                              <h4 className="font-semibold text-white group-hover:text-[#C9A84C] transition-colors">{act.name}</h4>
                              <p className="text-sm text-white/40 mt-0.5">{act.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Bottom CTA */}
                  <div className="text-center pt-8 pb-4">
                    <p className="text-white/30 text-sm mb-4">Want to explore more of Egypt?</p>
                    <Link
                      href="/"
                      className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-bold hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-shadow"
                    >
                      Explore All Destinations
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
