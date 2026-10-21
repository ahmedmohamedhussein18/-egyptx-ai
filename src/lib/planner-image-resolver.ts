/**
 * EGYPTX AI - EXPANDED AI PLANNER IMAGE RESOLVER (ISOLATED)
 * 
 * Maps all generated activities to authentic high-resolution photos
 * using a comprehensive keyword dictionary and a real-photo Nile fallback.
 * 
 * STRICTLY NO POSTER GRAPHICS.
 */

export interface PlannerImageCategory {
  category: string;
  keywords: string[];
  url: string;
}

export const PLANNER_IMAGE_MAPPINGS: PlannerImageCategory[] = [
  // 1. Safari / Desert / Dunes / Quad
  {
    category: 'safari',
    keywords: ['safari', 'desert', 'dune', 'camp', 'quad', 'sandboard', 'camel'],
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },

  // 2. Workshops / Handicrafts / Cultural Arts
  {
    category: 'workshop',
    keywords: ['workshop', 'handicraft', 'craft', 'coptic', 'heritage', 'painting', 'pottery', 'artisan'],
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  },

  // 3. Cooking / Dining / Food / Feasts / Restaurants
  {
    category: 'food',
    keywords: ['cooking', 'food', 'class', 'tasting', 'dinner', 'lunch', 'feast', 'restaurant', 'breakfast', 'cuisine', 'culinary'],
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  },

  // 4. Evening Walks / Corniche / Promenade / Night
  {
    category: 'walk',
    keywords: ['walk', 'promenade', 'corniche', 'evening', 'night', 'stroll'],
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },

  // 5. Souks / Traditional Markets / Bazaars / Shopping
  {
    category: 'market',
    keywords: ['souk', 'market', 'bazaar', 'shopping', 'khan'],
    url: 'https://images.unsplash.com/photo-1551806235-a05d89ce152c?auto=format&fit=crop&w=800&q=80',
  },

  // 6. Snorkeling / Scuba Diving / Marine / Beach / Red Sea
  {
    category: 'beach',
    keywords: ['snorkeling', 'diving', 'marine', 'sea', 'beach', 'coral', 'dahab', 'sharm', 'reef'],
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },

  // 7. Nile / Cruises / Feluccas / Boats
  {
    category: 'nile',
    keywords: ['cruise', 'nile', 'river', 'boat', 'felucca', 'sailing'],
    url: 'https://images.unsplash.com/photo-1558588942-930faae5a389?auto=format&fit=crop&w=800&q=80',
  },

  // 8. Mosques / Islamic Cairo / Citadel
  {
    category: 'mosque',
    keywords: ['mosque', 'azhar', 'islamic', 'tulun', 'citadel', 'sultan', 'muizz'],
    url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
  },

  // 9. Museums / Antiquities / Military / Artifacts / Mummies
  {
    category: 'museum',
    keywords: ['war', 'museum', 'military', 'antiquities', 'artifact', 'mummy', 'nmec', 'gem'],
    url: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80',
  },

  // 10. Pyramids / Sphinx / Giza / Saqqara
  {
    category: 'pyramid',
    keywords: ['pyramid', 'sphinx', 'giza', 'saqqara', 'khufu'],
    url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2b45?auto=format&fit=crop&w=800&q=80',
  },

  // 11. Temples / Karnak / Luxor / Abu Simbel
  {
    category: 'temple',
    keywords: ['temple', 'karnak', 'luxor', 'abu simbel', 'philae', 'hatshepsut'],
    url: 'https://images.unsplash.com/photo-1600520611035-84cb58dc8d85?auto=format&fit=crop&w=800&q=80',
  },
];

/**
 * Real-Photo Fallback: Guaranteed working high-resolution photo of Egypt
 * (COMPLETELY REPLACES ANY POSTER GRAPHIC OR BROKEN URL)
 */
export const PLANNER_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=800&q=80';

/**
 * Real local photo fallback (Aswan Nile photo) for offline resilience - NEVER a poster graphic
 */
export const PLANNER_LOCAL_PHOTO_FALLBACK = '/images/aswan.jpg';

/**
 * Validates a Wikipedia API image URL and page title.
 * Strictly REJECTS SVGs (.svg or .svg.png), flags, maps, coats of arms, icons,
 * and historical portrait mismatches for beach/nature queries (e.g., "Cleopatra Beach").
 */
export function isValidWikipediaImage(
  imageUrl?: string,
  pageTitle: string = '',
  activityTitle: string = ''
): boolean {
  if (!imageUrl || typeof imageUrl !== 'string') return false;

  const lowerUrl = imageUrl.toLowerCase();
  const lowerPage = pageTitle.toLowerCase();
  const lowerAct = activityTitle.toLowerCase();

  // 1. Strictly reject SVGs (including Wikimedia rasterized SVG thumbnails ending in .svg.png)
  if (lowerUrl.endsWith('.svg') || lowerUrl.includes('.svg/') || lowerUrl.includes('.svg.')) {
    return false;
  }

  // 2. Reject flags, maps, coats of arms, icons, emblems, and locator diagrams
  const bannedPatterns = [
    'flag',
    'map',
    'coat_of_arms',
    'emblem',
    'icon',
    'symbol',
    'locator',
    'logo',
    'blank',
    'placeholder',
    'commons-logo',
    'question_book',
    'disambig',
  ];

  if (bannedPatterns.some((pattern) => lowerUrl.includes(pattern) || lowerPage.includes(pattern))) {
    return false;
  }

  // 3. Prevent historical person portraits/busts/statues when the activity is a beach, bay, or coast (e.g. "Cleopatra Beach")
  const isBeachOrCoast =
    lowerAct.includes('beach') ||
    lowerAct.includes('bay') ||
    lowerAct.includes('coast') ||
    lowerAct.includes('sea') ||
    lowerAct.includes('lagoon');

  if (isBeachOrCoast) {
    const portraitIndicators = ['cleopatra_vii', 'bust', 'statue', 'portrait', 'painting', 'coin', 'queen', 'pharaoh', 'relief'];
    if (
      portraitIndicators.some((ind) => lowerUrl.includes(ind) || lowerPage.includes(ind)) ||
      lowerPage === 'cleopatra'
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Smart Category Fallback Resolver:
 * When Wikipedia fails, returns 0 results, or is rejected (SVG/flag/map/portrait),
 * matches the activity title/description against the smart category dictionary.
 */
export function getSmartCategoryFallback(title: string = '', description: string = ''): string {
  const combined = `${title} ${description}`.toLowerCase();

  // 1. Beach / Sea / Bay / Matrouh / Cleopatra
  if (
    ['beach', 'sea', 'bay', 'matrouh', 'cleopatra', 'snorkeling', 'diving', 'coral', 'reef', 'dahab', 'hurghada', 'sharm'].some(
      (kw) => combined.includes(kw)
    )
  ) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
  }

  // 2. Market / Souk / Camel / Bazaar
  if (['market', 'souk', 'camel', 'bazaar', 'khan', 'shopping'].some((kw) => combined.includes(kw))) {
    return 'https://images.unsplash.com/photo-1551806235-a05d89ce152c?auto=format&fit=crop&w=800&q=80';
  }

  // 3. Museum / Antiquities
  if (
    ['museum', 'antiquities', 'artifact', 'mummy', 'nmec', 'gem', 'library', 'catacomb'].some((kw) =>
      combined.includes(kw)
    )
  ) {
    return 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80';
  }

  // 4. Desert / Safari / Siwa / Dune
  if (
    ['desert', 'safari', 'siwa', 'dune', 'oasis', 'quad', 'sandboard', 'camp', 'wadi'].some((kw) =>
      combined.includes(kw)
    )
  ) {
    return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80';
  }

  // 5. Additional high-precision categories from PLANNER_IMAGE_MAPPINGS
  for (const mapping of PLANNER_IMAGE_MAPPINGS) {
    if (mapping.keywords.some((kw) => combined.includes(kw))) {
      return mapping.url;
    }
  }

  // Ultimate guaranteed fallback
  return PLANNER_FALLBACK_IMAGE;
}

/**
 * Matches activity title and description against the keyword dictionary.
 * Priority 1: Smart Category Fallback & Keyword Dictionary
 * Fallback: Guaranteed Egypt Landmark photo
 */
export function getPlannerActivityImage(title: string = '', description: string = ''): string {
  return getSmartCategoryFallback(title, description);
}

// Backward compatibility alias
export function resolvePlannerActivityImage(
  act: { title?: string; name?: string; type?: string; description?: string; imagePath?: string },
  _cityName: string = 'Cairo',
  _activityIndex: number = 0
): { primaryUrl: string; fallbackUrl: string; categoryId: string; label: string } {
  const title = act.title || act.name || '';
  const desc = act.description || '';
  const url = getSmartCategoryFallback(title, desc);

  return {
    primaryUrl: url,
    fallbackUrl: PLANNER_FALLBACK_IMAGE,
    categoryId: 'matched',
    label: 'Activity Photo',
  };
}

/**
 * Smart query optimizer for the Unsplash API search.
 * Cleans filler verbs and maps tricky landmarks or activities to highly effective search terms.
 */
export function optimizeImageQuery(rawTitle: string): string {
  if (!rawTitle || !rawTitle.trim()) {
    return 'Egypt Landmark';
  }

  const titleLower = rawTitle.toLowerCase();

  // 1. Tricky landmarks mapping
  if (titleLower.includes('catacomb')) {
    return 'Alexandria Catacombs Egypt';
  }
  if (titleLower.includes('mummif')) {
    return 'Mummy ancient Egypt';
  }
  if (titleLower.includes('citadel')) {
    return 'Cairo Citadel';
  }
  if (titleLower.includes('valley of the kings')) {
    return 'Luxor Valley of the Kings';
  }
  if (titleLower.includes('wadi el hitan') || titleLower.includes('wadi al-hitan')) {
    return 'Fayoum Desert';
  }

  // 2. Specific activities mapping
  if (titleLower.includes('safari') || titleLower.includes('quad') || titleLower.includes('dune') || titleLower.includes('dunes')) {
    return 'Sahara Desert Safari';
  }
  if (titleLower.includes('dinner') || titleLower.includes('lunch') || titleLower.includes('food')) {
    return 'Egyptian Food';
  }
  if (titleLower.includes('snorkeling') || titleLower.includes('diving')) {
    return 'Red Sea Coral Reef';
  }
  if (titleLower.includes('felucca') || titleLower.includes('cruise')) {
    return 'Nile River Boat Sunset';
  }

  // 3. Clean filler verbs/words (e.g., "Visit", "Explore", "Enjoy", "Tour", "Experience", "Magnificent", "Beautiful", "the")
  const fillerRegex = /\b(visit|explore|enjoy|tour|experience|magnificent|beautiful|the)\b/gi;
  const cleaned = rawTitle
    .replace(fillerRegex, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const finalBase = cleaned.length >= 3 ? cleaned : rawTitle.trim();

  if (finalBase.toLowerCase().includes('egypt')) {
    return finalBase;
  }
  return `${finalBase} Egypt`;
}

/**
 * Generates a 3-level cascading search terms array for an activity:
 * - Term 1 (Highly Specific): Exact cleaned title + " Egypt"
 * - Term 2 (Category/Type): Extracted core noun + " Egypt" (e.g., Obelisk Egypt, Museum Egypt, Temple Egypt)
 * - Term 3 (Location/Vibe): Extracted city / location + " Egypt Landmark"
 */
export function generateSearchTerms(title: string, cityName: string = 'Cairo'): string[] {
  const raw = (title || '').trim();
  const lower = raw.toLowerCase();

  // 1. Term 1 (Highly Specific): exact title cleaned + " Egypt"
  let term1 = optimizeImageQuery(raw);
  if (!term1.toLowerCase().includes('egypt')) {
    term1 = `${term1} Egypt`;
  }

  // 2. Term 2 (Category/Type): core noun (Temple, Museum, Mosque, Beach, Tomb, Oasis, Market, Obelisk) + " Egypt"
  let term2 = `${cityName || 'Egypt'} Landmark`;
  if (lower.includes('obelisk')) {
    term2 = 'Obelisk Egypt';
  } else if (lower.includes('catacomb')) {
    term2 = 'Ancient Catacombs Tomb Egypt';
  } else if (lower.includes('museum') || lower.includes('mummif') || lower.includes('antiquit') || lower.includes('artifact')) {
    term2 = 'Museum Egypt';
  } else if (lower.includes('temple') || lower.includes('karnak') || lower.includes('luxor') || lower.includes('abu simbel')) {
    term2 = 'Ancient Egyptian Temple';
  } else if (lower.includes('mosque') || lower.includes('citadel') || lower.includes('islamic')) {
    term2 = 'Cairo Mosque Egypt';
  } else if (lower.includes('tomb') || lower.includes('pyramid') || lower.includes('mastaba') || lower.includes('sphinx')) {
    term2 = 'Ancient Egyptian Tomb';
  } else if (lower.includes('beach') || lower.includes('snorkeling') || lower.includes('diving') || lower.includes('reef') || lower.includes('sea')) {
    term2 = 'Red Sea Beach Egypt';
  } else if (lower.includes('wadi') || lower.includes('oasis') || lower.includes('desert') || lower.includes('safari') || lower.includes('dune') || lower.includes('quad')) {
    term2 = 'Egypt Desert Oasis';
  } else if (lower.includes('market') || lower.includes('bazaar') || lower.includes('souk') || lower.includes('souq') || lower.includes('shopping')) {
    term2 = 'Egyptian Bazaar Market';
  } else if (lower.includes('nile') || lower.includes('cruise') || lower.includes('boat') || lower.includes('felucca')) {
    term2 = 'Nile River Boat Egypt';
  } else if (lower.includes('dinner') || lower.includes('lunch') || lower.includes('food') || lower.includes('restaurant') || lower.includes('feast')) {
    term2 = 'Egyptian Cuisine Food';
  }

  // 3. Term 3 (Location/Vibe): city + " Landmark" (e.g. "Aswan Egypt Landmark")
  const knownCities = ['cairo', 'aswan', 'luxor', 'alexandria', 'fayoum', 'giza', 'hurghada', 'sharm', 'dahab', 'siwa', 'saqqara'];
  let matchedCity = '';
  for (const c of knownCities) {
    if (lower.includes(c)) {
      matchedCity = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }
  if (!matchedCity) {
    matchedCity = cityName || 'Egypt';
  }
  const term3 = `${matchedCity} Egypt Landmark`;

  // Return unique terms
  return Array.from(new Set([term1, term2, term3])).filter(Boolean);
}

/**
 * Strips out filler words/verbs from AI-generated activity titles
 * to extract the core historical landmark or entity name for Wikipedia Action API queries.
 */
export function cleanEntityTitle(rawTitle: string): string {
  if (!rawTitle) return '';

  const cleaned = rawTitle
    .replace(/^(visit|explore|enjoy|tour|experience|discover|see)\s+(the\s+|a\s+|an\s+)?/i, '')
    .replace(/^the\s+/i, '')
    .replace(/\s+(tour|visit|experience|trip|excursion)$/i, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || rawTitle.trim();
}
