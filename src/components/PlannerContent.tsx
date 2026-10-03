'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, MapPin, Compass, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import ActivityCard, { Activity, DayPlan } from '@/components/ActivityCard';

/* ─────────────────── DATA ─────────────────── */



// ── AI Destination Knowledge Base for Smart Finder ─────────────────────────
interface DestKnowledge {
  name: string;
  arabicName: string;
  landmarks: string[];
  phrases: string[];
  vibe: string;
  reason: (q: string) => string;
}

const DEST_KNOWLEDGE: DestKnowledge[] = [
  {
    name: 'Aswan',
    arabicName: 'أسوان',
    landmarks: ['Abu Simbel', 'Philae Temple', 'High Dam', 'Nubian Village', 'Elephantine Island'],
    phrases: [
      'abu simbel', 'ابو سمبل', 'أبو سمبل', 'معبد ابو سمبل', 'معبد أبو سمبل',
      'temple carved in the mountain', 'temple carved into the mountain', 'mountain temple',
      'ramses temple', 'ramesses ii', 'lake nasser', 'نوبة', 'النوبة', 'nubian',
      'philae', 'معبد فيلة', 'فيلة', 'high dam', 'السد العالي', 'felucca aswan', 'aswan', 'اسوان'
    ],
    vibe: 'Ancient mountain temples, peaceful Nile cataracts, and vibrant Nubian culture.',
    reason: () => 'Famous for Abu Simbel (the colossal rock temples carved into the mountain) and the island Temple of Philae in Aswan.'
  },
  {
    name: 'Giza',
    arabicName: 'الجيزة',
    landmarks: ['Great Pyramids', 'Great Sphinx', 'Saqqara Step Pyramid', 'Memphis'],
    phrases: [
      'pyramid', 'pyramids', 'great pyramid', 'الأهرامات', 'الاهرامات', 'هرم', 'خوفو',
      'sphinx', 'great sphinx', 'ابو الهول', 'أبو الهول', 'khufu', 'saqqara', 'سقارة',
      'ancient wonder', 'wonder of the world', 'camel ride desert', 'giza', 'الجيزة'
    ],
    vibe: 'Home to the last standing Wonder of the Ancient World.',
    reason: () => 'Home to the Great Pyramids of Khufu, Khafre, Menkaure, and the mysterious Sphinx.'
  },
  {
    name: 'Cairo',
    arabicName: 'القاهرة',
    landmarks: ['Khan el-Khalili', 'Egyptian Museum', 'NMEC', 'Cairo Tower', 'Saladin Citadel'],
    phrases: [
      'cairo', 'القاهرة', 'khan el-khalili', 'khan el khalili', 'خان الخليلي',
      'cairo tower', 'برج القاهرة', 'tahrir', 'ميدان التحرير', 'egyptian museum',
      'national museum of egyptian civilization', 'mummies', 'المومياوات',
      'islamic cairo', 'el moezz', 'شارع المعز', 'citadel', 'قلعة صلاح الدين', 'capital'
    ],
    vibe: 'The vibrant historic capital filled with millennia of Islamic and Egyptian treasures.',
    reason: () => 'The historic capital featuring Khan el-Khalili bazaar, the Egyptian Museum, and Salah El-Din Citadel.'
  },
  {
    name: 'Luxor',
    arabicName: 'الأقصر',
    landmarks: ['Karnak Temple', 'Valley of the Kings', 'Hatshepsut Temple', 'Luxor Temple', 'Hot Air Balloons'],
    phrases: [
      'luxor', 'الأقصر', 'الاقصر', 'karnak', 'الكرنك', 'معبد الكرنك',
      'valley of the kings', 'وادي الملوك', 'tombs of the pharaohs', 'king tut tomb',
      'hatshepsut', 'حتشبسوت', 'معبد حتشبسوت', 'hot air balloon', 'منطاد', 'بالون طائر',
      'open air museum', 'thebes', 'طيبة'
    ],
    vibe: 'The greatest open-air museum on Earth with monumental royal tombs and towering hypostyle halls.',
    reason: () => 'World-famous for the monumental Valley of the Kings, Karnak Temple, and Queen Hatshepsut\'s mortuary temple.'
  },
  {
    name: 'Alexandria',
    arabicName: 'الإسكندرية',
    landmarks: ['Bibliotheca Alexandrina', 'Citadel of Qaitbay', 'Montaza Palace', 'Catacombs of Kom el Shoqafa'],
    phrases: [
      'alexandria', 'الاسكندرية', 'الإسكندرية', 'عروس البحر', 'library of alexandria',
      'مكتبة الاسكندرية', 'مكتبة الإسكندرية', 'qaitbay', 'قلعة قايتباي', 'قايتباي',
      'mediterranean', 'البحر المتوسط', 'corniche', 'كورنيش', 'montaza', 'قصر المنتزه'
    ],
    vibe: 'The Mediterranean pearl of Greco-Roman heritage, coastal sea breezes, and fresh seafood.',
    reason: () => 'The Bride of the Mediterranean with the iconic Bibliotheca Alexandrina and the seafront Citadel of Qaitbay.'
  },
  {
    name: 'Dahab',
    arabicName: 'دهب',
    landmarks: ['Blue Hole', 'The Canyon', 'Lighthouse Reef', 'Blue Lagoon'],
    phrases: [
      'dahab', 'دهب', 'blue hole', 'البلو هول', 'بلو هول', 'blue lagoon',
      'bedouin', 'بدو', 'chilled', 'hippie', 'windsurfing', 'freediving',
      'relaxing beach sinai', 'canyon diving'
    ],
    vibe: 'Bohemian Red Sea paradise famous for relaxed coastal vibes and world-famous diving at the Blue Hole.',
    reason: () => 'Renowned for world-class freediving and snorkeling at the Blue Hole, windsurfing, and authentic Bedouin seaside vibes.'
  },
  {
    name: 'Siwa Oasis',
    arabicName: 'واحة سيوة',
    landmarks: ['Salt Lakes', 'Shali Fortress', 'Temple of the Oracle (Amun)', 'Cleopatra Spring', 'Great Sand Sea'],
    phrases: [
      'siwa', 'سيوة', 'واحة سيوة', 'siwa oasis', 'salt lakes', 'بحيرات الملح',
      'desert safari', 'safari sand dunes', 'shali', 'قلعة شالي', 'cleopatra bath',
      'cleopatra spring', 'عين كليوباترا', 'oasis in the desert', 'berber oasis'
    ],
    vibe: 'Mystical desert oasis with buoyant turquoise salt pools, sand dunes, and ancient Berber heritage.',
    reason: () => 'Famous for buoyant crystal-turquoise salt lakes, the ancient mud-brick Shali Fortress, and deep Sahara dunes.'
  },
  {
    name: 'Hurghada',
    arabicName: 'الغردقة',
    landmarks: ['Giftun Islands', 'Marina Boulevard', 'Makadi Bay', 'El Gouna'],
    phrases: [
      'hurghada', 'الغردقة', 'red sea', 'snorkeling', 'scuba diving', 'coral reefs',
      'giftun island', 'جزيرة جفتون', 'resort all inclusive', 'submarine', 'غواصة'
    ],
    vibe: 'Vibrant resort city with endless coral reefs, desert safaris, and water sports.',
    reason: () => 'Premier hub for Red Sea snorkeling, boat trips to Giftun Island, and luxury beach resorts.'
  },
  {
    name: 'Sharm El Sheikh',
    arabicName: 'شرم الشيخ',
    landmarks: ['Ras Mohammed National Park', 'Naama Bay', 'Shark’s Bay', 'Tiran Island'],
    phrases: [
      'sharm', 'شرم', 'شرم الشيخ', 'sharm el sheikh', 'ras mohammed', 'راس محمد',
      'naama bay', 'خليج نعمة', 'tiran', 'جزيرة تيران', 'diving sinai'
    ],
    vibe: 'Premier international coastal resort with protected coral reef marine parks.',
    reason: () => 'Celebrated worldwide for Ras Mohammed National Park coral drop-offs, diving expeditions, and vibrant nightlife.'
  },
  {
    name: 'Marsa Matrouh',
    arabicName: 'مرسى مطروح',
    landmarks: ['Ageeba Beach', 'Cleopatra Beach & Bath', 'Rommel’s Cave', 'Ghazala Bay'],
    phrases: [
      'marsa matrouh', 'مرسى مطروح', 'مطروح', 'ageeba', 'عجيبة', 'شاطئ عجيبة',
      'cleopatra bath', 'حمامات كليوباترا', 'white sand turquoise', 'egyptian maldives',
      'مالديف مصر', 'white beach'
    ],
    vibe: 'Crystal turquoise waters and pristine white sandy shores known as Egypt\'s Maldives.',
    reason: () => 'Known as Egypt\'s Maldives for the breathtaking limestone cliffs of Ageeba and turquoise coves.'
  },
  {
    name: 'Fayoum',
    arabicName: 'الفيوم',
    landmarks: ['Wadi El Rayan Waterfalls', 'Wadi Al-Hitan (Valley of Whales)', 'Tunis Village', 'Magic Lake'],
    phrases: [
      'fayoum', 'الفيوم', 'wadi el rayan', 'وادي الريان', 'waterfalls', 'شلالات',
      'wadi hitan', 'wadi al hitan', 'وادي الحيتان', 'whale valley', 'whales fossil',
      'magic lake', 'البحيرة المسحورة', 'tunis village', 'قرية تونس', 'pottery'
    ],
    vibe: 'Eco-tourism haven with desert waterfalls, prehistoric whale fossils, and artisanal pottery.',
    reason: () => 'UNESCO World Heritage Wadi Al-Hitan, desert waterfalls of Wadi El Rayan, and the artisanal Tunis pottery village.'
  },
  {
    name: 'North Coast',
    arabicName: 'الساحل الشمالي',
    landmarks: ['Marassi', 'Hacienda', 'New Alamein City', 'Almaza Bay'],
    phrases: [
      'north coast', 'الساحل', 'الساحل الشمالي', 'sahel', 'marassi', 'مراسي',
      'hacienda', 'هاسيندا', 'new alamein', 'العلمين الجديدة', 'summer beach party'
    ],
    vibe: 'Upscale Mediterranean summer hotspot with sparkling crystal waters and vibrant lifestyle.',
    reason: () => 'The glamorous summer coastline featuring pristine Mediterranean waters and luxury beachfront resorts.'
  },
  {
    name: 'Nuweiba',
    arabicName: 'نويبع',
    landmarks: ['Colored Canyon', 'Castle Zaman', 'Tarabin Beach'],
    phrases: [
      'nuweiba', 'نويبع', 'colored canyon', 'الكانيون الملون', 'castle zaman',
      'قلعة زمان', 'serene sinai', 'quiet beach sinai'
    ],
    vibe: 'Serene mountain-meets-sea haven with vivid sandstone canyons and peaceful beaches.',
    reason: () => 'Famous for hiking through the majestic Colored Canyon and tranquil mountain-seaside retreats.'
  },
  {
    name: 'Port Said',
    arabicName: 'بورسعيد',
    landmarks: ['Suez Canal Historic Building', 'Port Said Lighthouse', 'Ferry to Port Fouad'],
    phrases: [
      'port said', 'بورسعيد', 'suez canal north', 'قناة السويس', 'port fouad',
      'بورفؤاد', 'ferry suez', 'historic architecture'
    ],
    vibe: 'Historic Mediterranean canal port with French-colonial architecture.',
    reason: () => 'The northern entrance to the Suez Canal featuring grand historic architecture and free seagull ferries.'
  },
  {
    name: 'Minya',
    arabicName: 'المنيا',
    landmarks: ['Tell el-Amarna', 'Tuna el-Gebel', 'Beni Hasan Tombs'],
    phrases: [
      'minya', 'المنيا', 'tell el amarna', 'تل العمارنة', 'akhenaten', 'اخناتون',
      'nefertiti city', 'tuna el gebel', 'تونا الجبل', 'beni hasan', 'بني حسن'
    ],
    vibe: 'Bride of Upper Egypt and heart of Akhenaten’s sun revolution.',
    reason: () => 'Archaeological heartland of Akhenaten and Nefertiti at Tell el-Amarna and rock-cut tombs of Beni Hasan.'
  },
  {
    name: 'Sohag',
    arabicName: 'سوهاج',
    landmarks: ['Abydos Temple', 'Osireion', 'Red Monastery', 'White Monastery'],
    phrases: [
      'sohag', 'سوهاج', 'abydos', 'أبيدوس', 'ابيدوس', 'osireion', 'معبد سيتي',
      'temple of seti', 'red monastery', 'الدير الاحمر'
    ],
    vibe: 'Sacred grounds of Osiris and some of ancient Egypt’s finest relief carvings.',
    reason: () => 'Home to the magnificent Temple of Seti I at Abydos and the mysterious subterranean Osireion.'
  },
  {
    name: 'Qena',
    arabicName: 'قنا',
    landmarks: ['Dendera Temple of Hathor', 'Zodiac ceiling'],
    phrases: [
      'qena', 'قنا', 'dendera', 'دندرة', 'معبد دندرة', 'hathor temple',
      'معبد حتحور', 'astronomical ceiling', 'zodiac dendera'
    ],
    vibe: 'Sanctuary of goddess Hathor with vivid blue astronomical ceilings.',
    reason: () => 'Famous for the breathtaking Dendera Temple Complex with its remarkably preserved astronomical ceilings.'
  },
  {
    name: 'Ismailia',
    arabicName: 'الإسماعيلية',
    landmarks: ['Lake Timsah', 'Suez Canal Museum'],
    phrases: ['ismailia', 'الاسماعيلية', 'الإسماعيلية', 'lake timsah', 'بحيرة التمساح'],
    vibe: 'Lush garden city alongside the Suez Canal lakes.',
    reason: () => 'The City of Beauty and Enchantment centered around peaceful Lake Timsah.'
  },
  {
    name: 'Suez',
    arabicName: 'السويس',
    landmarks: ['Suez Canal Port', 'Ain Sokhna', 'Gulf of Suez'],
    phrases: ['suez', 'السويس', 'ain sokhna', 'العين السخنة', 'sokhna', 'سخنة'],
    vibe: 'Maritime Red Sea crossroads and closest beach gateway to Cairo.',
    reason: () => 'Southern gate of the Suez Canal and premier year-round beach gateway at Ain Sokhna.'
  },
  {
    name: 'Assiut',
    arabicName: 'أسيوط',
    landmarks: ['Deir el-Muharraq', 'Holy Family Trail'],
    phrases: ['assiut', 'أسيوط', 'اسيوط', 'deir el muharraq', 'الدير المحرق', 'holy family'],
    vibe: 'Historic Upper Egypt Nile city on the ancient Holy Family journey.',
    reason: () => 'Historic Upper Egypt destination holding pivotal sites on the Holy Family trail.'
  }
];

const QUICK_AI_PROMPTS = [
  { label: '🏛️ أبو سمبل (Abu Simbel)', query: 'أبو سمبل' },
  { label: '⛰️ Temple carved in the mountain', query: 'temple carved in the mountain' },
  { label: '🔺 Great Pyramids & Sphinx', query: 'great pyramids and sphinx' },
  { label: '👑 Valley of the Kings', query: 'valley of the kings tombs' },
  { label: '🤿 Blue Hole & Bedouin vibe', query: 'blue hole and bedouin' },
  { label: '🏜️ Desert Salt Lakes', query: 'salt lakes desert oasis' },
  { label: '🌊 Ageeba White Sands', query: 'ageeba white sand beach' },
];

const DESTINATIONS_DATA = [
  { name: 'Cairo' }, { name: 'Giza' }, { name: 'Alexandria' }, { name: 'Luxor' }, 
  { name: 'Aswan' }, { name: 'Hurghada' }, { name: 'Sharm El Sheikh' }, { name: 'Marsa Matrouh' }, 
  { name: 'Fayoum' }, { name: 'Port Said' }, { name: 'Ismailia' }, { name: 'Suez' }, 
  { name: 'Minya' }, { name: 'Assiut' }, { name: 'Sohag' }, { name: 'Qena' }, 
  { name: 'Dahab' }, { name: 'Siwa Oasis' }, { name: 'North Coast' }, { name: 'Nuweiba' }
];


const generateMockItinerary = (duration: number, dests: string[]) => {
  const safeDests = dests.length > 0 ? dests : ['Cairo'];
  const mock = [];
  const pool = [
    { name: 'Great Pyramids of Giza', description: 'Explore the last remaining wonder of the ancient world. Take a camel ride into the desert for panoramic views.', type: 'history', cost: '$ Moderate', tip: '👟 Wear comfortable walking shoes and bring plenty of water.', fact: 'The Great Pyramid consists of an estimated 2.3 million stone blocks.' },
    { name: 'Egyptian Museum', description: 'Witness the golden mask of Tutankhamun and countless artifacts.', type: 'culture', cost: '$ Budget', tip: '📸 Photography pass requires a small extra fee.', fact: 'It houses over 120,000 items of ancient Egyptian antiquities.' },
    { name: 'Khan el-Khalili Bazaar', description: 'Wander through the historic shopping district and grab some souvenirs.', type: 'shopping', cost: 'Free to walk', tip: '🗣️ Be prepared to haggle playfully with shop owners.', fact: 'The bazaar dates back to 1382.' },
    { name: 'Nile Felucca Ride', description: 'Relaxing sunset sail on a traditional wooden boat.', type: 'relaxing', cost: '$ Moderate', tip: '🧥 Bring a light jacket as the river breeze gets cool at sunset.', fact: 'Feluccas have remained the primary mode of transportation on the Nile since antiquity.' },
    { name: 'Valley of the Kings', description: 'Descend into the vibrantly painted tombs of mighty pharaohs.', type: 'history', cost: '$$ Premium', tip: '🧢 Arrive early to beat the intense midday desert heat.', fact: 'Over 60 tombs have been discovered here, including that of King Tut.' },
    { name: 'Karnak Temple', description: 'Walk through the massive hypostyle hall of towering ancient pillars.', type: 'history', cost: '$ Moderate', tip: '🚶‍♂️ The complex is massive; don’t miss the Sacred Lake.', fact: 'It is the largest religious building ever constructed in the world.' },
    { name: 'Luxor Temple at Night', description: 'Witness the ancient columns beautifully illuminated against the night sky.', type: 'culture', cost: '$ Moderate', tip: '🌙 Visiting after sunset offers a magical, cooler experience.', fact: 'The temple is guarded by a massive avenue of human-headed sphinxes.' },
    { name: 'Red Sea Snorkeling', description: 'Dive into crystal-clear waters teeming with vibrant coral reefs and exotic fish.', type: 'nature', cost: '$$ Premium', tip: '🤿 Eco-friendly sunscreen is highly recommended to protect the reefs.', fact: 'The Red Sea is home to over 1,200 species of fish, 10% of which are found nowhere else.' }
  ];

  for (let i = 1; i <= duration; i++) {
    const city = safeDests[(i - 1) % safeDests.length];
    const numActivities = i % 3 === 0 ? 3 : 2; 
    const activities = [];
    
    let hour = 9;
    for (let a = 0; a < numActivities; a++) {
      const actPool = pool[(i + a * 3) % pool.length];
      const startTime = `${hour < 10 ? '0'+hour : hour}:00 AM`;
      const endHour = hour + 2 + (a % 2);
      const endTime = `${endHour > 12 ? (endHour-12 < 10 ? '0'+(endHour-12) : endHour-12) : endHour}:30 ${endHour >= 12 ? 'PM' : 'AM'}`;
      
      activities.push({
        ...actPool,
        time: `${startTime} - ${endTime}`
      });
      
      hour = endHour + 1;
      if (hour >= 12 && hour < 14) hour = 14;
    }
    
    mock.push({ day: i, city: city, activities });
  }
  return mock;
};

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

const getInterests = (t: any) => [
  { id: 'ancient', label: t('planner.intAncient'), emoji: '🏛️' },
  { id: 'beaches', label: t('planner.intBeaches'), emoji: '🏖️' },
  { id: 'adventure', label: t('planner.intAdventure'), emoji: '🏜️' },
  { id: 'food', label: t('planner.intFood'), emoji: '🍽️' },
  { id: 'culture', label: t('planner.intCulture'), emoji: '🎭' },
  { id: 'nature', label: t('planner.intNature'), emoji: '🌿' },
];

const getTravelStyles = (t: any) => [
  { id: 'solo', label: t('planner.styleSolo'), emoji: '🧑', desc: 'Independent explorer' },
  { id: 'couple', label: t('planner.styleCouple'), emoji: '💑', desc: 'Romantic getaway' },
  { id: 'family', label: t('planner.styleFamily'), emoji: '👨‍👩‍👧‍👦', desc: 'Kid-friendly fun' },
  { id: 'group', label: t('planner.styleGroup'), emoji: '👥', desc: 'Friends & tours' },
];

const getPaces = (t: any) => [
  { id: 'relaxed', label: t('planner.paceRelaxed') + ' (1-2 activities/day)' },
  { id: 'balanced', label: t('planner.paceBalanced') + ' (3-4 activities/day)' },
  { id: 'packed', label: t('planner.pacePacked') + ' (5+ activities/day)' },
];

interface Governorate {
  id: string;
  name_en: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PREMIUM MODERN EGYPT ROUTE MAP
   - ViewBox: 0 0 400 520
   - Bounded coordinates: all 20 cities stay safely within the viewport
   - Intelligent alternating label positions (top, bottom, left, right) with
     crisp glassmorphism pills that never overlap
   - Glowing gold (#C9A84C) Bezier curves connecting the selected route
   ───────────────────────────────────────────────────────────────────────────── */

interface CityGeo {
  x: number;
  y: number;
  side: 'top' | 'right' | 'bottom' | 'left';
}

const CITY_COORDS: Record<string, CityGeo> = {
  'Cairo':           { x: 215, y: 110, side: 'top'    },
  'Giza':            { x: 198, y: 130, side: 'left'   },
  'Alexandria':      { x: 168, y:  55, side: 'top'    },
  'North Coast':     { x: 125, y:  65, side: 'top'    },
  'Marsa Matrouh':   { x:  75, y:  75, side: 'bottom' },
  'Siwa Oasis':      { x:  55, y: 160, side: 'bottom' },
  'Port Said':       { x: 255, y:  55, side: 'top'    },
  'Ismailia':        { x: 250, y:  95, side: 'right'  },
  'Suez':            { x: 255, y: 130, side: 'right'  },
  'Fayoum':          { x: 190, y: 165, side: 'left'   },
  'Minya':           { x: 202, y: 220, side: 'left'   },
  'Assiut':          { x: 215, y: 275, side: 'left'   },
  'Sohag':           { x: 230, y: 325, side: 'left'   },
  'Qena':            { x: 248, y: 370, side: 'left'   },
  'Luxor':           { x: 255, y: 405, side: 'right'  },
  'Aswan':           { x: 260, y: 468, side: 'right'  },
  'Hurghada':        { x: 310, y: 270, side: 'right'  },
  'Sharm El Sheikh': { x: 300, y: 210, side: 'right'  },
  'Dahab':           { x: 325, y: 175, side: 'right'  },
  'Nuweiba':         { x: 335, y: 145, side: 'right'  },
};

function EgyptMap({ cities }: { cities: string[] }) {
  const uniqueCities = [...new Set(cities)];
  const routePoints = cities.map((c) => CITY_COORDS[c]).filter(Boolean);

  // Quadratic Bezier curve generator
  const buildCurvedRoute = (pts: CityGeo[]) => {
    if (pts.length < 2) return '';
    let d = "M " + pts[0].x + " " + pts[0].y;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const cx = (p0.x + p1.x) / 2 - dy * 0.18;
      const cy = (p0.y + p1.y) / 2 + dx * 0.18;
      d += " Q " + cx.toFixed(1) + " " + cy.toFixed(1) + " " + p1.x + " " + p1.y;
    }
    return d;
  };

  const curvedPathD = buildCurvedRoute(routePoints);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/90 via-[#060E1F]/95 to-[#030712] rounded-2xl border border-[#C9A84C]/20 shadow-[0_10px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(201,168,76,0.15)]" />

      <svg
        viewBox="0 0 400 520"
        className="relative z-10 w-full h-full max-h-[500px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mapGoldRoute" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#E2CB85" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>

          <filter id="mapGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.8  0 0.8 0 0 0.6  0 0 0 0 0.2  0 0 0 1 0"
              result="goldGlow"
            />
            <feMerge>
              <feMergeNode in="goldGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g stroke="#C9A84C" strokeOpacity="0.04" strokeWidth="0.5">
          <line x1="40" y1="100" x2="360" y2="100" />
          <line x1="40" y1="200" x2="360" y2="200" />
          <line x1="40" y1="300" x2="360" y2="300" />
          <line x1="40" y1="400" x2="360" y2="400" />
          <line x1="100" y1="40" x2="100" y2="480" />
          <line x1="200" y1="40" x2="200" y2="480" />
          <line x1="300" y1="40" x2="300" y2="480" />
        </g>

        <path
          d="M170 35 L265 35 L278 65 L290 90 L278 115 L272 138 L285 155 L275 172 L270 190 L282 210 L275 235 L270 260 L262 285 L255 310 L248 335 L242 358 L235 385 L225 415 L215 448 L198 480 L180 470 L160 450 L145 425 L132 400 L125 368 L130 335 L140 305 L152 270 L158 240 L165 210 L175 178 L180 155 L186 130 L180 108 L174 82 L170 58 Z"
          fill="#C9A84C"
          fillOpacity="0.04"
          stroke="#C9A84C"
          strokeWidth="1.2"
          strokeOpacity="0.22"
          strokeDasharray="4 2"
        />

        <path
          d="M215 110 Q205 180 202 220 T215 275 T230 325 T248 370 T255 405 T260 470"
          stroke="#1B6B93"
          strokeWidth="2.5"
          strokeOpacity="0.25"
          strokeLinecap="round"
          fill="none"
        />

        {routePoints.length > 1 && (
          <g>
            <path
              d={curvedPathD}
              stroke="#C9A84C"
              strokeWidth="8"
              strokeOpacity="0.18"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={curvedPathD}
              stroke="url(#mapGoldRoute)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray="8 4"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.9))' }}
            />
          </g>
        )}

        {uniqueCities.map((city, idx) => {
          const c = CITY_COORDS[city];
          if (!c) return null;

          const pillWidth = city.length * 6.5 + 16;
          const pillHeight = 18;

          let pillX = c.x - pillWidth / 2;
          let pillY = c.y - pillHeight / 2;

          if (c.side === 'top') {
            pillX = c.x - pillWidth / 2;
            pillY = c.y - 22;
          } else if (c.side === 'bottom') {
            pillX = c.x - pillWidth / 2;
            pillY = c.y + 12;
          } else if (c.side === 'left') {
            pillX = c.x - pillWidth - 10;
            pillY = c.y - pillHeight / 2;
          } else if (c.side === 'right') {
            pillX = c.x + 10;
            pillY = c.y - pillHeight / 2;
          }

          pillX = Math.max(12, Math.min(388 - pillWidth, pillX));
          pillY = Math.max(12, Math.min(508 - pillHeight, pillY));

          return (
            <g key={city} className="transition-all duration-300">
              <circle
                cx={c.x}
                cy={c.y}
                r="11"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.2"
                strokeOpacity="0.35"
                className="animate-ping"
                style={{
                  animationDuration: '2.8s',
                  animationDelay: `${idx * 0.25}s`,
                  transformOrigin: `${c.x}px ${c.y}px`,
                }}
              />

              <circle
                cx={c.x}
                cy={c.y}
                r="5"
                fill="#E2CB85"
                stroke="#030712"
                strokeWidth="2"
                filter="url(#mapGlowFilter)"
              />

              <g>
                <rect
                  x={pillX}
                  y={pillY}
                  width={pillWidth}
                  height={pillHeight}
                  rx="6"
                  fill="#0A1628"
                  fillOpacity="0.88"
                  stroke="#C9A84C"
                  strokeWidth="0.8"
                  strokeOpacity="0.45"
                  style={{
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))',
                  }}
                />
                <text
                  x={pillX + pillWidth / 2}
                  y={pillY + pillHeight / 2 + 3.5}
                  textAnchor="middle"
                  fill="#E2CB85"
                  fontSize="9"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="0.3px"
                >
                  {city}
                </text>
              </g>
            </g>
          );
        })}

        <g opacity="0.35" transform="translate(18, 502)">
          <text fontSize="7.5" fill="#C9A84C" fontFamily="monospace">
            LAT: 26.8206° N · LON: 30.8025° E
          </text>
        </g>
        <g opacity="0.4" transform="translate(372, 502)">
          <text textAnchor="end" fontSize="7.5" fill="#E2CB85" fontFamily="monospace">
            EGYPTX SATELLITE
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REAL-TIME API SYNCED EPIC LOADING ANIMATION
   ───────────────────────────────────────────────────────────────────────────── */

const LOADING_STEPS = [
  "Consulting Egyptology AI...",
  "Curating hidden gems...",
  "Designing your premium experience...",
  "Finalizing itinerary..."
];

function CinematicLoading({
  progress = 90,
  phase = 'loading',
}: {
  progress?: number;
  phase?: 'loading' | 'success';
}) {
  const [textIdx, setTextIdx] = React.useState(0);
  const displayProgress = Math.round(progress).toString().padStart(2, '0');

  React.useEffect(() => {
    if (phase === 'success') return;
    const timer = setInterval(() => {
      setTextIdx((i) => (i + 1) % LOADING_STEPS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#030712]/92 backdrop-blur-xl">
      {/* Background ambient luxury glows */}
      <div className="absolute w-[500px] h-[500px] bg-[#C9A84C]/10 rounded-full blur-[140px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[450px] h-[450px] bg-[#1B6B93]/15 rounded-full blur-[140px] pointer-events-none -bottom-20 -right-20" />

      {/* Centered dark navy glassmorphism card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg bg-[#0B1120]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(201,168,76,0.1)] text-center flex flex-col items-center overflow-hidden"
      >
        {/* Subtle top gold decorative line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-80" />

        {/* Loader Icon / Glowing Gold Geometric Spinner */}
        <div className="relative w-28 h-28 my-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'success' ? (
              <motion.div
                key="success-icon"
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#19A974] to-[#0A1628] border-2 border-[#19A974] flex items-center justify-center shadow-[0_0_30px_rgba(25,169,116,0.7)]"
              >
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            ) : (
              <div key="loader-rings" className="relative w-24 h-24 flex items-center justify-center">
                {/* Outer spinning gold ring with glowing drop-shadow */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-t-[#C9A84C] border-r-[#C9A84C]/50 border-b-transparent border-l-transparent drop-shadow-[0_0_15px_#C9A84C]"
                />
                {/* Reverse inner Nile-blue ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2.5 rounded-full border-2 border-dashed border-[#1B6B93]/70 drop-shadow-[0_0_10px_rgba(27,107,147,0.5)]"
                />
                {/* Center glowing golden pyramid pulse */}
                <motion.div
                  animate={{
                    scale: [0.95, 1.08, 0.95],
                    filter: [
                      'drop-shadow(0 0 10px rgba(201,168,76,0.6))',
                      'drop-shadow(0 0 25px rgba(201,168,76,0.95))',
                      'drop-shadow(0 0 10px rgba(201,168,76,0.6))',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-12 h-12 flex items-center justify-center text-2xl"
                >
                  🏛️
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic cycling status text */}
        <div className="min-h-[56px] flex items-center justify-center my-2">
          <AnimatePresence mode="wait">
            {phase === 'success' ? (
              <motion.h3
                key="complete-heading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-2xl md:text-3xl font-extrabold text-[#19A974] tracking-tight drop-shadow-[0_0_15px_rgba(25,169,116,0.5)]"
              >
                Itinerary Crafted Successfully!
              </motion.h3>
            ) : (
              <motion.h3
                key={textIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C] tracking-wide drop-shadow-md"
              >
                {LOADING_STEPS[textIdx]}
              </motion.h3>
            )}
          </AnimatePresence>
        </div>

        {/* Subtitle description */}
        <p className="text-white/60 text-xs md:text-sm max-w-sm mb-6 font-medium">
          {phase === 'success'
            ? 'Your personalized Egyptian expedition is ready.'
            : 'Applying real-time weather, crowds, and travel pacing models...'}
        </p>

        {/* Progress bar container */}
        <div className="w-full max-w-xs">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                phase === 'success'
                  ? 'bg-gradient-to-r from-[#19A974] to-[#2dd4a4] shadow-[0_0_15px_rgba(25,169,116,0.8)]'
                  : 'bg-gradient-to-r from-[#8A7334] via-[#E2CB85] to-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.8)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2.5 flex justify-between items-center text-[11px] font-mono text-[#E2CB85]/90 px-0.5">
            <span className="font-bold tracking-wider">{displayProgress}%</span>
            <span className="uppercase text-[9px] tracking-widest text-white/50">
              {phase === 'success' ? 'READY' : progress >= 90 ? 'FINALIZING...' : 'AI PROCESSING'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
function TripAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: 'ai', text: 'Hi! I am your EgyptX Trip Assistant. Need to change anything?' }]);
  const [input, setInput] = useState('');

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMsgs([...msgs, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'ai', text: 'I have noted your request and will adjust the itinerary!' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-[#0A1628]/95 backdrop-blur-xl border border-[#C9A84C]/30 w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96">
          <div className="bg-[#C9A84C]/10 border-b border-[#C9A84C]/20 p-3 flex justify-between items-center">
            <span className="font-bold text-[#C9A84C]">✨ Trip Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg text-sm ${m.role === 'ai' ? 'bg-white/5 text-white/90 mr-8' : 'bg-[#C9A84C]/20 text-[#C9A84C] ml-8'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMsg} className="p-3 border-t border-white/10 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Modify trip..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(201,168,76,0.4)] hover:scale-110 transition-transform">
          💬
        </button>
      )}
    </div>
  );
}

export default function PlannerContent() {
  const { t } = useLanguage();
  const supabase = createClient();
  
  // Existing Form state
  const [country, setCountry] = useState('');
  const [duration, setDuration] = useState(5);
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState<string | null>(null);

  // New Form state
  const [travelers, setTravelers] = useState(2);
  const [governorateId, setGovernorateId] = useState('');
  const [pace, setPace] = useState('balanced');
  const [accessibility, setAccessibility] = useState('');
  const [avoidPlaces, setAvoidPlaces] = useState('');
  const [avoidCrowds, setAvoidCrowds] = useState(false);
  // Wizard state
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinations, setDestinations] = useState<string[]>([]);

  // AI Destination Smart Finder State
  const [aiDestQuery, setAiDestQuery] = useState('');
  const [aiDestMatch, setAiDestMatch] = useState<{
    dest: string;
    matchedPhrase: string;
    reason: string;
    landmarks: string[];
  } | null>(null);

  const normalizeQuery = (str: string) => str.toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .trim();

  const handleAiDestSearch = (input: string) => {
    setAiDestQuery(input);
    if (!input.trim()) {
      setAiDestMatch(null);
      return;
    }

    const norm = normalizeQuery(input);
    let bestMatch: {
      dest: string;
      matchedPhrase: string;
      reason: string;
      landmarks: string[];
    } | null = null;
    let highestScore = 0;

    for (const info of DEST_KNOWLEDGE) {
      const normName = info.name.toLowerCase();
      const normAr = normalizeQuery(info.arabicName);

      // Direct city name match
      if (norm === normName || norm === normAr || norm.includes(normName) || norm.includes(normAr)) {
        bestMatch = {
          dest: info.name,
          matchedPhrase: info.name,
          reason: info.reason(input),
          landmarks: info.landmarks,
        };
        highestScore = 100;
        break;
      }

      // Keyword / Landmark / Phrase matching
      for (const phrase of info.phrases) {
        const normPhrase = normalizeQuery(phrase);
        if (norm === normPhrase || norm.includes(normPhrase) || normPhrase.includes(norm)) {
          const score = (norm === normPhrase) ? 95 : 85;
          if (score > highestScore) {
            highestScore = score;
            bestMatch = {
              dest: info.name,
              matchedPhrase: phrase,
              reason: info.reason(input),
              landmarks: info.landmarks,
            };
          }
        }
      }

      // Landmarks matching
      for (const lm of info.landmarks) {
        const normLm = normalizeQuery(lm);
        if (norm.includes(normLm) || normLm.includes(norm)) {
          if (80 > highestScore) {
            highestScore = 80;
            bestMatch = {
              dest: info.name,
              matchedPhrase: lm,
              reason: info.reason(input),
              landmarks: info.landmarks,
            };
          }
        }
      }
    }

    if (bestMatch) {
      setAiDestMatch(bestMatch);
      // Auto-select into destinations array if not already selected
      setDestinations(prev => prev.includes(bestMatch!.dest) ? prev : [...prev, bestMatch!.dest]);
    } else {
      setAiDestMatch(null);
    }
  };

  const displayedDestinations = useMemo(() => {
    if (!aiDestMatch) return DESTINATIONS_DATA;
    const matched = DESTINATIONS_DATA.filter(d => d.name === aiDestMatch.dest);
    const others = DESTINATIONS_DATA.filter(d => d.name !== aiDestMatch.dest);
    return [...matched, ...others];
  }, [aiDestMatch]);

  // Parental verification modal states removed per CRITICAL FEATURE OVERHAUL
  


  // Data state
  const [governorates, setGovernorates] = useState<Governorate[]>([]);

  // Result state
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState<'loading' | 'success'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  
  // Action states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  useEffect(() => {
    trackEvent('page_view');
    fetchGovernorates();

    // ── Voice AI Smart Form Listener (Optimized) ──
    const handleVoiceFill = (e: any) => {
      const { country: extractedCountry, days, budget: extractedBudget } = e.detail || {};

      // 1. Duration (days)
      if (days && typeof days === 'number' && days > 0) {
        setDuration(Math.min(Math.max(days, 1), 14));
      }

      // 2. Budget
      if (extractedBudget) {
        setBudget(`$${extractedBudget}`);
      }

      // 3. Country Matching (Multi-lingual)
      if (extractedCountry) {
        const countryNorm = String(extractedCountry).toLowerCase().trim();
        const countryMapAr: Record<string, string> = {
          'أمريكا': 'US', 'امريكا': 'US', 'الولايات المتحدة': 'US',
          'بريطانيا': 'GB', 'إنجلترا': 'GB', 'انجلترا': 'GB', 'المملكة المتحدة': 'GB',
          'ألمانيا': 'DE', 'المانيا': 'DE',
          'فرنسا': 'FR',
          'إيطاليا': 'IT', 'ايطاليا': 'IT',
          'إسبانيا': 'ES', 'اسبانيا': 'ES',
          'اليابان': 'JP',
          'الصين': 'CN',
          'كوريا': 'KR',
          'الهند': 'IN',
          'البرازيل': 'BR',
          'أستراليا': 'AU', 'استراليا': 'AU',
          'كندا': 'CA',
          'روسيا': 'RU',
          'السعودية': 'SA', 'المملكة العربية السعودية': 'SA',
          'الإمارات': 'AE', 'الامارات': 'AE',
          'مصر': 'EG',
          'تركيا': 'TR'
        };

        let matchedCode = countryMapAr[countryNorm];

        if (!matchedCode) {
          const directMatch = COUNTRIES.find(c =>
            c.name.toLowerCase().includes(countryNorm) ||
            countryNorm.includes(c.name.toLowerCase()) ||
            c.code.toLowerCase() === countryNorm
          );
          if (directMatch) matchedCode = directMatch.code;
        }

        if (matchedCode) {
          setCountry(matchedCode);
        }
      }
    };

    const handleSliderUpdate = (e: any) => {
      const val = Number(e.detail);
      if (val && !isNaN(val)) {
        setDuration(Math.min(Math.max(val, 1), 14));
      }
    };

    window.addEventListener('voice-fill-planner', handleVoiceFill);
    window.addEventListener('fill-ai-planner', handleVoiceFill);
    window.addEventListener('update-duration-slider', handleSliderUpdate);

    return () => {
      window.removeEventListener('voice-fill-planner', handleVoiceFill);
      window.removeEventListener('fill-ai-planner', handleVoiceFill);
      window.removeEventListener('update-duration-slider', handleSliderUpdate);
    };
  }, []);

  const fetchGovernorates = async () => {
    const { data } = await supabase.from('governorates').select('id, name_en').order('name_en');
    if (data) setGovernorates(data);
  };

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  
  const handleTravelStyleChange = (id: string) => {
    // Parental verification removed: allow direct selection of family & all travel styles
    setTravelStyle(id);
  };
  
  const getPayload = () => ({ destinations, routePreference: "shortest-distance",
    country,
    duration,
    budget,
    interests,
    travelStyle,
    travelers,
    governorateId,
    pace,
    accessibility,
    avoidPlaces,
    avoidCrowds
  });

  const handleGenerate = async () => {
    if (!country || interests.length === 0 || !travelStyle) return;
    
    trackEvent('planner_started', getPayload());
    
    setLoading(true);
    setLoadingProgress(0);
    setLoadingPhase('loading');
    setItinerary(null);
    setError(null);
    setSaveSuccess(false);

    // Real-time animation sync: Animate rapidly to 90%, then hold while awaiting AI response
    let currentProg = 0;
    const progressTimer = setInterval(() => {
      currentProg += currentProg < 45 ? 6 : currentProg < 75 ? 3 : 1;
      if (currentProg >= 90) {
        currentProg = 90;
        clearInterval(progressTimer);
      }
      setLoadingProgress(currentProg);
    }, 75);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload())
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      // AI Response Resolved! Snap to 100% and activate success micro-interaction
      clearInterval(progressTimer);
      setLoadingProgress(100);
      setLoadingPhase('success');

      // Delight user with success micro-interaction for 750ms before revealing itinerary
      await new Promise((res) => setTimeout(res, 750));
      
      setItinerary(data.itinerary || data);
      trackEvent('planner_completed', { duration, budget });
    } catch (err: any) {
      clearInterval(progressTimer);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!itinerary) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login?redirect=/planner';
        return;
      }

      // Insert trip plan
      const cleanBudget = parseFloat(String(budget).replace(/[^0-9.]/g, '')) || 0;
      const cleanTravelers = parseInt(String(travelers).replace(/[^0-9]/g, '')) || 1;

      const { data: tripPlan, error: planError } = await supabase.from('trip_plans').insert({
        user_id: user.id,
        title: JSON.stringify({ title: `Egypt Trip (${duration} Days)`, country: country || 'Unknown', city: itinerary[0]?.city || 'Egypt' }),
        governorate_id: governorateId || null,
        duration_days: duration,
        budget: cleanBudget,
        travelers: cleanTravelers
      }).select().single();

      if (planError) throw planError;

      // Fetch all attractions for matching
      const { data: allAttractions } = await supabase.from('attractions').select('id, name_en');

      // Insert days and places
      for (const day of itinerary) {
        const { data: tripDay, error: dayError } = await supabase.from('trip_days').insert({
          trip_plan_id: tripPlan.id,
          day_number: day.day
        }).select().single();

        if (dayError) throw dayError;

        for (const act of day.activities) {
          let matchedId = null;
          if (allAttractions) {
            const match = allAttractions.find(a => 
              act.name.toLowerCase().includes(a.name_en.toLowerCase()) || 
              a.name_en.toLowerCase().includes(act.name.toLowerCase())
            );
            if (match) matchedId = match.id;
          }

          await supabase.from('trip_places').insert({
            trip_day_id: tripDay.id,
            attraction_id: matchedId,
            time_slot: act.time,
            notes: `${act.name}: ${act.description}`
          });
        }
      }

      setSaveSuccess(true);
    } catch (err: any) {
      alert('Error saving trip: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

    const [checkedInDays, setCheckedInDays] = useState<Record<number, boolean>>({});

  const handleCheckinDay = async (dayNumber: number, dayCity: string, firstActivityName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login?redirect=/planner';
        return;
      }

      setCheckedInDays(prev => ({ ...prev, [dayNumber]: true }));
      
      await fetch('/api/planner-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: dayNumber,
          city: dayCity,
          attractionName: firstActivityName
        })
      });
    } catch (err) {
      console.error('Failed to checkin day', err);
      // Revert if error
      setCheckedInDays(prev => ({ ...prev, [dayNumber]: false }));
    }
  };

  const handleRegenerateDay = async (dayNumber: number) => {
    if (!itinerary) return;
    setRegeneratingDay(dayNumber);
    try {
      const response = await fetch('/api/generate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...getPayload(),
          dayNumber,
          existingItinerary: itinerary
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to regenerate day');

      setItinerary(prev => {
        if (!prev) return prev;
        const newItin = [...prev];
        const idx = newItin.findIndex(d => d.day === dayNumber);
        if (idx !== -1) {
          newItin[idx] = data;
        }
        return newItin;
      });
      setSaveSuccess(false); // They modified it, can save again
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRegeneratingDay(null);
    }
  };

  const isFormValid = country && interests.length > 0 && travelStyle;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Parental verification modal completely removed */}
  
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
            <span className="bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] bg-clip-text text-transparent">{t('planner.planYour')}</span>{' '}
            <span className="text-white">{t('planner.journey')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            {t('planner.prompt')}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {!loading && !itinerary && !error && (
            
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[#0A1628]/60 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-[#C9A84C]/10"
            >
              {/* Wizard Progress */}
              <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0">
                  <div className="h-full bg-[#C9A84C] transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                </div>
                {[1,2,3,4].map(s => (
                  <div key={s} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-[#C9A84C] text-[#030712]' : 'bg-[#060E1A] text-white/40 border border-white/20'}`}>
                    {s}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Step 1: Your Travel Group</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {getTravelStyles(t).map(s => {
                      const active = travelStyle === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={(e) => { e.preventDefault(); handleTravelStyleChange(s.id); }}
                          className={`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 ${
                            active
                              ? 'bg-[#C9A84C]/25 border-[#C9A84C] shadow-[0_0_25px_rgba(201,168,76,0.4)] scale-[1.02]'
                              : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                          }`}
                        >
                        <span className="text-3xl mb-2">{s.emoji}</span>
                        <span className={`font-semibold text-sm ${active ? 'text-[#C9A84C]' : 'text-white/80'}`}>{s.label}</span>
                      </button>
                    );
                  })}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-3">Number of Travelers</label>
                    <input type="number" min="1" max="50" value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} className="w-full max-w-xs bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/50" />
                  </div>
                  <div className="flex justify-end pt-4"><button type="button" onClick={(e) => { e.preventDefault(); setStep(2); }} disabled={!travelStyle} className="px-6 py-2 bg-[#C9A84C] text-[#030712] font-bold rounded-xl disabled:opacity-50 hover:bg-[#E2CB85] transition-colors">Next →</button></div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  
                  <style>{`
                    .custom-date-picker::-webkit-calendar-picker-indicator {
                      filter: invert(0.8) sepia(1) saturate(3) hue-rotate(5deg) brightness(1.2);
                      cursor: pointer;
                      opacity: 0.6;
                      transition: 0.2s;
                    }
                    .custom-date-picker::-webkit-calendar-picker-indicator:hover {
                      opacity: 1;
                    }
                  `}</style>
<h3 className="text-2xl font-bold text-white mb-4">Step 2: When are you going?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-white/70 mb-2">Start Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="custom-date-picker w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white/70 mb-2">End Date (Calculates Duration)</label>
                      <input type="date" value={endDate} onChange={e => {
                        setEndDate(e.target.value);
                        if(startDate && e.target.value) {
                          const diff = (new Date(e.target.value).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
                          if(diff > 0) setDuration(Math.min(Math.max(diff, 1), 14));
                        }
                      }} className="custom-date-picker w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-white/70 mb-2">Country of Origin</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white">
                      <option value="">Select Country</option>
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(1)} className="px-6 py-2 border border-white/20 text-white rounded-xl">← Back</button>
                    <button onClick={() => setStep(3)} disabled={!startDate || !endDate || !country} className="px-6 py-2 bg-[#C9A84C] text-[#030712] font-bold rounded-xl disabled:opacity-50">Next →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white">Step 3: Top Destinations</h3>
                      <p className="text-sm text-white/60">Choose your favorite Egyptian destinations or let our AI guide find them for you.</p>
                    </div>
                    {destinations.length > 0 && (
                      <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-bold">
                        {destinations.length} Selected
                      </span>
                    )}
                  </div>

                  {/* ── ✨ AI CHOOSE (SMART FINDER) ── */}
                  <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-b from-[#0A1628]/95 to-[#060E1A]/95 border-2 border-[#C9A84C]/40 shadow-[0_0_30px_rgba(201,168,76,0.15)] space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.3)]">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C]">
                            ✨ AI Choose (Smart Finder)
                          </h4>
                          <p className="text-xs text-white/60">
                            Don\'t know the city name? Type any description or landmark in English or Arabic (e.g. \"أبو سمبل\" or \"the temple carved in the mountain\").
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Glowing Interactive Search Bar */}
                    <div className="relative flex items-center bg-[#060E1A] border-2 border-[#C9A84C]/50 focus-within:border-[#C9A84C] focus-within:shadow-[0_0_25px_rgba(201,168,76,0.35)] rounded-2xl transition-all duration-300 p-1.5">
                      <Sparkles className="w-5 h-5 text-[#C9A84C] ml-3 shrink-0" />
                      <input
                        type="text"
                        value={aiDestQuery}
                        onChange={(e) => handleAiDestSearch(e.target.value)}
                        placeholder="Type any description, monument or vibe (e.g., أبو سمبل, blue hole, temple carved in the mountain)..."
                        className="w-full bg-transparent px-3 py-2 text-white placeholder-white/40 focus:outline-none text-sm md:text-base font-medium"
                      />
                      {aiDestQuery && (
                        <button
                          onClick={() => handleAiDestSearch('')}
                          className="text-white/40 hover:text-white px-2 py-1 text-xs"
                          title="Clear search"
                        >
                          ✕
                        </button>
                      )}
                      <button
                        onClick={() => handleAiDestSearch(aiDestQuery)}
                        className="px-4 py-2 bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-bold text-xs md:text-sm rounded-xl shrink-0 shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Finder
                      </button>
                    </div>

                    {/* AI Match Result Card */}
                    <AnimatePresence>
                      {aiDestMatch && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          className="bg-gradient-to-r from-[#C9A84C]/15 via-[#0A1628]/95 to-[#1B6B93]/20 border-2 border-[#C9A84C] rounded-2xl p-4 shadow-[0_0_30px_rgba(201,168,76,0.3)] backdrop-blur-md"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#E2CB85] text-[#030712] flex items-center justify-center shrink-0 shadow-md">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">AI Match Identified</span>
                                  <span className="text-white font-extrabold text-lg">→ {aiDestMatch.dest}</span>
                                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                                    ✓ Auto-Selected for Trip
                                  </span>
                                </div>
                                <p className="text-sm text-white/90 mt-1 leading-relaxed">
                                  {aiDestMatch.reason}
                                </p>
                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                  <span className="text-xs text-white/50">Famous for:</span>
                                  {aiDestMatch.landmarks.slice(0, 4).map(lm => (
                                    <span key={lm} className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-white/90 border border-white/5">
                                      {lm}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setDestinations(prev => prev.filter(x => x !== aiDestMatch.dest));
                                setAiDestMatch(null);
                                setAiDestQuery('');
                              }}
                              className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-colors shrink-0"
                            >
                              Reset
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Quick Inspiration Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scroll">
                      <span className="text-xs text-white/50 shrink-0 font-medium">Quick Prompts:</span>
                      {QUICK_AI_PROMPTS.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => handleAiDestSearch(p.query)}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/50 text-white/80 hover:text-[#C9A84C] transition-all shrink-0 whitespace-nowrap"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destination Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-h-[480px] overflow-y-auto pr-2 custom-scroll">
                    {displayedDestinations.map(({ name: dest }: { name: string }) => {
                        const active = destinations.includes(dest);
                        const isAiMatched = aiDestMatch?.dest === dest;
                        return (
                          <div 
                            key={dest} 
                            onClick={() => setDestinations(d => active ? d.filter(x => x !== dest) : [...d, dest])} 
                            className={`relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300 ${
                              active 
                                ? 'ring-2 ring-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.6)] border-transparent' 
                                : 'border border-white/10 hover:border-white/30'
                            }`}
                          >
                            <img 
                              src={'/destinations/' + dest.toLowerCase().replace(/\s+/g, '-') + '.jpg'} 
                              alt={dest} 
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                            {isAiMatched && (
                              <div className="absolute top-3 left-3 bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-black text-[11px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10 animate-pulse">
                                <Sparkles className="w-3 h-3" />
                                AI Pick
                              </div>
                            )}
                            {active && (
                              <div className="absolute top-3 right-3 bg-[#0B1120]/80 p-1.5 rounded-full backdrop-blur-sm border border-[#C9A84C]/40">
                                <svg className="w-4 h-4 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end">
                              <span className="text-white font-bold text-lg tracking-wide drop-shadow-md">
                                {dest}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <style>{`
                      .custom-scroll::-webkit-scrollbar { width: 6px; }
                      .custom-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
                      .custom-scroll::-webkit-scrollbar-thumb { background: rgba(201, 168, 76, 0.3); border-radius: 10px; }
                      .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(201, 168, 76, 0.6); }
                    `}</style>
                    <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(2)} className="px-6 py-2 border border-white/20 text-white rounded-xl">← Back</button>
                    <button onClick={() => setStep(4)} disabled={destinations.length===0} className="px-6 py-2 bg-[#C9A84C] text-[#030712] font-bold rounded-xl disabled:opacity-50">Next →</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Step 4: Interests & Pace</h3>
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-4">Interests</label>
                    <div className="flex flex-wrap gap-3">
                      {getInterests(t).map(i => {
                        const active = interests.includes(i.id);
                        return (
                          <button key={i.id} onClick={() => toggleInterest(i.id)} className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all ${active ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                            {i.emoji} {i.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-white/70 mb-2">Pace</label>
                    <select value={pace} onChange={e => setPace(e.target.value)} className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white">
                      {getPaces(t).map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-white/70 mb-2">Total Budget</label>
                    <input type="text" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. $2000" className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white" />
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(3)} className="px-6 py-2 border border-white/20 text-white rounded-xl">← Back</button>
                    <button onClick={handleGenerate} disabled={!isFormValid} className="px-8 py-3 bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-bold rounded-xl shadow-[0_0_20px_rgba(201,168,76,0.4)] disabled:opacity-50">✨ Generate Itinerary</button>
                  </div>
                </div>
              )}
            </motion.div>

)}

          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto bg-red-950/40 border border-red-500/50 rounded-2xl p-8 text-center backdrop-blur-md"
            >
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-200 mb-2">Oops! Something went wrong.</h3>
              <p className="text-red-200/70 mb-6">{error}</p>
              <button
                onClick={() => setError(null)}
                className="px-8 py-3 rounded-xl bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30 transition-colors font-semibold"
              >
                {t('planner.tryAgain')}
              </button>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CinematicLoading progress={loadingProgress} phase={loadingPhase} />
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
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 w-full">
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C] mb-5 tracking-tight drop-shadow-sm leading-tight">
                      Your {duration}-Day Curated Expedition Across Egypt
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/90 font-medium shadow-sm flex items-center gap-2">
                        👥 {travelers} Traveler{travelers > 1 ? 's' : ''}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-[#C9A84C]/15 backdrop-blur-md border border-[#C9A84C]/30 text-[#E2CB85] font-semibold shadow-sm flex items-center gap-2 tracking-wide">
                        💳 {budget || 'Flexible'} Budget
                      </span>
                      <span className="px-4 py-2 rounded-full bg-[#1B6B93]/15 backdrop-blur-md border border-[#1B6B93]/30 text-[#4EB1E2] font-medium shadow-sm flex items-center gap-2 capitalize">
                        ✨ {travelStyle || 'Balanced'} Style
                      </span>
                    </div>
                  </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setItinerary(null); setSaveSuccess(false); }}
                    className="px-5 py-2.5 rounded-lg border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-medium hover:bg-[#C9A84C]/10 transition-colors"
                  >
                    ← {t('planner.modifyBtn')}
                  </button>
                  <button
                    onClick={handleSaveTrip}
                    disabled={saving || saveSuccess}
                    className="px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#030712] text-sm font-bold hover:bg-[#E2CB85] transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Trip'}
                  </button>
                </div>
              </div>

              {/* Map + Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-[#0A1628]/60 backdrop-blur-md rounded-2xl border border-[#C9A84C]/10 p-4">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4 text-center">{t('planner.routeMap')}</h3>
                    <div className="w-full" style={{ maxHeight: '500px' }}>
                      <EgyptMap cities={destinations.length > 0 ? destinations : itinerary.map(d => d.city)} />
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
                      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] font-bold text-lg">
                            {day.day}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">Day {day.day} — {day.city}</h3>
                            <p className="text-white/30 text-sm">{day.activities.length} activities planned</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRegenerateDay(day.day)}
                            disabled={regeneratingDay !== null}
                            className="px-3 py-1.5 rounded bg-white/5 text-white/50 text-xs font-medium hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                          >
                            🔄 Regenerate Day
                          </button>
                          <button
                            onClick={() => handleCheckinDay(day.day, day.city, day.activities[0]?.name || '')}
                            disabled={checkedInDays[day.day]}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
                              checkedInDays[day.day] 
                                ? 'bg-[#19A974]/20 text-[#19A974] border-[#19A974]/50' 
                                : 'bg-transparent text-[#C9A84C] border-[#C9A84C] hover:bg-[#C9A84C]/10'
                            }`}
                          >
                            {checkedInDays[day.day] ? '✓ تم التسجيل' : '📍 تسجيل زيارة'}
                          </button>
                        </div>
                      </div>

                      {/* Regenerating overlay / Activities */}
                      <div className="px-6 py-4 space-y-0 relative min-h-[100px]">
                        {regeneratingDay === day.day && (
                          <div className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-sm z-10 flex items-center justify-center">
                            <CinematicLoading progress={loadingProgress} phase={loadingPhase} />
                          </div>
                        )}
                        
                        
                        {day.activities.map((act, actIdx) => (
                          <ActivityCard 
                            key={`day-${day.day}-act-${actIdx}-${act.name || 'act'}`} 
                            act={act} 
                            actIdx={actIdx} 
                            dayIdx={dayIdx} 
                            cityName={day.city} 
                          />
                        ))}
                        {day.activities.length === 0 && (
                          <p className="text-white/40 text-sm py-4 text-center">No activities planned for this day based on constraints.</p>
                        )}
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
                      {t('planner.exploreAll')}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      <TripAssistant />
      </div>
    </div>
  );
}
