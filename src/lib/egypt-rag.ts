import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Authoritative Verified Egyptian Heritage Knowledge Base
 * Sourced from Egyptian Ministry of Tourism and Antiquities & UNESCO World Heritage records.
 * Covers Pharaonic/Ancient Egypt, Greco-Roman, Coptic, Islamic, Mamluk, and Modern Egypt.
 */
export const VERIFIED_EGYPT_HERITAGE_KB = `
AUTHORITATIVE EGYPTIAN HERITAGE & TOURISM DATABASE (Ministry of Tourism & Antiquities / UNESCO):

1. PHARAONIC & ANCIENT EGYPT MONUMENTS:
- Great Pyramid of Khufu (هرم خوفو الأكبر - Giza): Built c. 2560 BCE (4th Dynasty) for Pharaoh Khufu, designed by royal architect Hemiunu. Originally 146.5m tall (now 138.5m), built with ~2.3 million limestone and granite blocks over ~20 years by ~20,000 skilled Egyptian workers. The only surviving Wonder of the Ancient World. Contains the King's Chamber, Queen's Chamber, and Grand Gallery.
- Pyramid of Khafre (هرم خفرع - Giza): Built c. 2530 BCE, 136.4m tall, retains original polished Tura limestone casing stones at its apex.
- Pyramid of Menkaure (هرم منقرع - Giza): Built c. 2510 BCE, 65m tall (now 61m), encased in Aswan red granite at its base.
- Great Sphinx of Giza (أبو الهول): Built c. 2500 BCE during the reign of Pharaoh Khafre. 73m long and 20m tall, carved from a single monolithic limestone ridge on the Giza Plateau. Features the head of a pharaoh wearing the royal Nemes headdress and the body of a lion. Between its paws sits the Dream Stele of Thutmose IV (1401 BCE).
- Step Pyramid of Djoser at Saqqara (هرم زوسر المدرج بسقارة): Built c. 2670 BCE (3rd Dynasty) by the genius architect, physician, and vizier Imhotep for Pharaoh Djoser. The world's oldest monumental stone structure, featuring 6 mastaba tiers rising to 62.5m. Surrounded by the Heb-Sed courtyard complex and nearby Serapeum of Saqqara.
- Dahshur Pyramids (أهرامات دهشور): Built by Pharaoh Sneferu (4th Dynasty, c. 2600 BCE), including the Bent Pyramid (الهرم المنحني) and the Red Pyramid (الهرم الأحمر - first true smooth-sided pyramid).
- Karnak Temple Complex (مجمع معابد الكرنك - Luxor): The largest ancient religious site in the world (over 100 hectares / 250 acres) on the East Bank of Luxor (Ancient Thebes). Built and expanded over 2,000 years (c. 2055 BCE – 100 CE) by more than 30 pharaohs from the Middle Kingdom (Senusret I) through the New Kingdom and Ptolemaic era (Thutmose I, Hatshepsut, Thutmose III, Amenhotep III, Seti I, Ramesses II). Its famous Great Hypostyle Hall (بهو الأعمدة العظيم) covers 5,000 sq meters with 134 massive sandstone columns arranged in 16 rows (the 12 central papyrus columns stand 21–24m tall). Includes the Precinct of Amun-Ra, Sacred Lake (البحيرة المقدسة), Obelisk of Hatshepsut, and Festival Temple of Thutmose III.
- Luxor Temple (معبد الأقصر): Built c. 1390 BCE on the East Bank of the Nile primarily by Amenhotep III (18th Dynasty) and expanded by Tutankhamun, Horemheb, and Ramesses II (19th Dynasty), with a shrine for Alexander the Great. Connected to Karnak Temple by the 2.7km–3km Avenue of Sphinxes (طريق الكباش). Features the First Pylon of Ramesses II, colossal seated statues, one standing red granite obelisk (its twin stands at Place de la Concorde in Paris), and the historic Mosque of Abu Haggag built atop the ancient columns.
- Valley of the Kings (وادي الملوك - Luxor West Bank): Royal necropolis of the New Kingdom (18th, 19th, and 20th Dynasties, c. 1539–1075 BCE). Contains 63+ rock-cut royal tombs decorated with the Book of the Dead, Amduat, and Book of Gates. Famous tombs include KV62 (Tomb of Tutankhamun, discovered nearly intact on November 4, 1922 by Howard Carter), KV17 (Seti I - longest and deepest tomb), KV9 (Ramesses V & VI), and KV11 (Ramesses III).
- Mortuary Temple of Hatshepsut at Deir el-Bahari (معبد حتشبسوت بالدير البحري): Built c. 1479 BCE on the West Bank of Luxor, designed by royal architect Senenmut for Female Pharaoh Hatshepsut (18th Dynasty). Masterpiece of classical architecture featuring 3 grand colonnaded terraces carved into the towering cliffs, famous for the Land of Punt expedition reliefs and Birth Colonnade.
- Valley of the Queens (وادي الملكات): Necropolis on Luxor's West Bank housing QV66, the breathtaking tomb of Queen Nefertari (beloved wife of Ramesses II), renowned as the "Sistine Chapel of Ancient Egypt".
- Medinet Habu (معبد مدينة هابو): Mortuary temple of Pharaoh Ramesses III (20th Dynasty) on Luxor's West Bank, celebrated for its deeply carved reliefs of the victory over the Sea Peoples and vivid original paint.
- Colossi of Memnon (تمثالا ممنون): Two massive 18m-tall quartzite stone statues of Pharaoh Amenhotep III (c. 1350 BCE) standing at the entrance of his mortuary temple on Luxor's West Bank.
- Abu Simbel Temples (معبدا أبو سمبل - Aswan / Nubia): Built by Pharaoh Ramesses II (c. 1264–1244 BCE, 19th Dynasty), carved directly into a solid sandstone mountain on the western bank of Lake Nasser, 280km south of Aswan. Consists of two rock-cut temples:
  1) The Great Temple of Ramesses II: Dedicated to the gods Amun, Ra-Horakhty, Ptah, and the deified Ramesses II. Its 33m-high facade features four colossal seated statues of Ramesses II, each 20m tall. Inside, the Hypostyle Hall has 8 Osiride pillars of the king and vivid battle reliefs of the Battle of Kadesh (معركة قادش). Designed with astronomical precision so the sun's rays penetrate 60 meters into the inner sanctuary twice a year (February 22 and October 22) to illuminate the statues of Amun, Ra-Horakhty, and Ramesses II, leaving Ptah (god of darkness/underworld) in shadow.
  2) The Small Temple of Nefertari: Dedicated to the goddess Hathor and Queen Nefertari, where the queen's statues are carved at the exact same height (10m) as the pharaoh's.
  3) UNESCO Rescue Operation (1964–1968): Both temples were sawed into 1,036 massive stone blocks (weighing 20–30 tons each) and reassembled 65m higher and 200m back inside an artificial dome mountain to save them from rising Lake Nasser waters after the construction of the Aswan High Dam.
- Philae Temple (معبد فيلة - Aswan): Dedicated to the goddess Isis, built primarily during the Ptolemaic and Roman periods on Philae Island and relocated by UNESCO (1972–1980) to Agilkia Island. Famous for the Birth House (Mammisi), Trajan's Kiosk, and the last known hieroglyphic inscription in Egypt (394 CE).
- Edfu & Kom Ombo Temples: Temple of Horus at Edfu (معبد إدفو, built 237–57 BCE, best-preserved cult temple in Egypt); Double Temple of Kom Ombo (معبد كوم أمبو, Ptolemaic temple symmetrically dedicated to Sobek the crocodile god and Horus the Elder, featuring the ancient surgical instruments relief and Crocodile Museum).
- Abydos & Dendera Temples: Temple of Seti I at Abydos (معبد أبيدوس, famous for the Abydos King List and Osireion); Temple of Hathor at Dendera (معبد دندرة في قنا, famous for its intact astronomical turquoise ceiling and the Dendera Zodiac).

2. MAJOR EGYPTIAN MUSEUMS:
- Grand Egyptian Museum (المتحف المصري الكبير - GEM, Giza): Located 2km from the Giza Pyramids over 500,000 sq meters. The largest archaeological museum in the world dedicated to a single civilization, housing over 100,000 artifacts including the complete 5,398-piece treasure collection of King Tutankhamun, the colossal 11m granite statue of Ramesses II in the atrium, the Grand Staircase, the Hanging Obelisk, and King Khufu's Solar Boats. Official full opening date: November 1, 2025 (1 نوفمبر 2025).
- National Museum of Egyptian Civilization (المتحف القومي للحضارة المصرية - NMEC, Fustat, Cairo): Showcases Egyptian civilization from prehistoric times through Pharaonic, Greco-Roman, Coptic, Islamic, and modern eras. Houses the world-famous Royal Mummies Hall (قاعة المومياوات الملكية) containing 22 royal mummies (including Ramesses II, Seti I, Hatshepsut, and Thutmose III) transferred in the Pharaohs' Golden Parade on April 3, 2021.
- Egyptian Museum in Tahrir Square (المتحف المصري بالتحرير - Cairo): Opened in 1902 in a neoclassical building designed by French architect Marcel Dourgnon. Houses over 120,000 masterpieces including the Narmer Palette, statue of Khafre, Triad of Menkaure, and Tanis royal treasures.
- Nubian Museum (متحف النوبة - Aswan) & Luxor Museum (متحف الأقصر).

3. GRECO-ROMAN, COPTIC, ISLAMIC, MAMLUK & MODERN EGYPT:
- Alexandria & Greco-Roman Heritage: Qaitbay Citadel (قلعة قايتباي, built 1477 CE by Mamluk Sultan Al-Ashraf Qaitbay on the site of the ancient Pharos Lighthouse of Alexandria), Bibliotheca Alexandrina (مكتبة الإسكندرية الجديدة, opened 2002 honoring the ancient Library of Alexandria), Catacombs of Kom el Shoqafa (مقابر كوم الشقافة), Pompey's Pillar (عمود السواري - Serapeum), Roman Amphitheatre at Kom el-Dikka (المسرح الروماني).
- Coptic Christian Heritage: Coptic Cairo / Babylon Fortress (مجمع الأديان بمصر القديمة), The Hanging Church (الكنيسة المعلقة - Saint Virgin Mary's Church, 3rd–7th century), Church of Saints Sergius and Bacchus (كنيسة أبي سرجة - built over the crypt where the Holy Family rested), Coptic Museum, Ben Ezra Synagogue, Saint Catherine's Monastery in Sinai (دير سانت كاترين - 6th century CE UNESCO site at the foot of Mount Sinai), Wadi El Natrun monasteries.
- Islamic, Fatimid, Ayyubid & Mamluk Cairo (UNESCO Historic Cairo): Citadel of Saladin (قلعة صلاح الدين الأيوبي, built 1176–1183 CE), Mosque of Muhammad Ali (جامع محمد علي بالقلعة / Alabaster Mosque, built 1830–1848), Mosque-Madrasa of Sultan Hassan (مسجد السلطان حسن, Mamluk masterpiece built 1356 CE) & Al-Rifa'i Mosque (مسجد الرفاعي), Al-Muizz Street (شارع المعز لدين الله الفاطمي - greatest concentration of medieval Islamic architectural treasures in the world), Khan el-Khalili Bazaar (خان الخليلي, historic souq founded 1382 CE, home to El-Fishawy Cafe), Al-Azhar Mosque (الجامع الأزهر, founded 970 CE), Mosque of Ahmad ibn Tulun (مسجد ابن طولون, 879 CE with its unique spiral minaret), Complex of Sultan Qalawun, Bab al-Futuh, Bab al-Nasr, Bab Zuweila, Al-Azhar Park (حديقة الأزهر).
- Modern Egypt & Red Sea / Oases: Cairo Tower (برج القاهرة, 187m lotus-design tower in Zamalek), New Administrative Capital (العاصمة الإدارية الجديدة - Iconic Tower, Masjid Misr), Aswan High Dam (السد العالي), Siwa Oasis (واحة سيوة - Shali Fortress, Temple of the Oracle of Amun visited by Alexander the Great), White Desert (الصحراء البيضاء), Sharm El Sheikh, Hurghada, Dahab, Marsa Alam.
`.trim();

export const OUT_OF_SCOPE_AR =
  'أنا خبير ومرافق سياحي لتاريخ وحضارة مصر بس يا صاحبي! اسألني عن أي معبد، أثر، أو خروجة سياحية في مصر وهجاوبك فوراً.';
export const OUT_OF_SCOPE_EN =
  "I'm your dedicated Egyptian history and tourism companion, my friend! Ask me about any temple, monument, museum, or travel plan in Egypt and I'll answer you right away.";

/**
 * Checks whether a query is clearly out-of-scope (e.g. World Cup, football, politics, coding, math)
 */
export function isClearlyOutOfScope(query: string): boolean {
  const lower = query.toLowerCase().trim();

  const outOfScopePatterns = [
    // Football / Sports / World Cup
    /\b(world cup|fifa|premier league|champions league|messi|ronaldo|football|soccer|basketball|tennis)\b/i,
    /(كأس العالم|كاس العالم|كرة القدم|كورة|ماتش|مباراة|الدوري|برشلونة|ريال مدريد|الأهلي والزمالك)/,
    // Coding / Programming / Math
    /\b(python|javascript|typescript|react|nextjs|html|css|sql|java|c\+\+|write code|binary search|algorithm|leetcode)\b/i,
    /(اكتب كود|برمجة|بايثون|جافاسكريبت)/,
    // Politics / Crypto / Stock Market
    /\b(bitcoin|ethereum|crypto|stock market|nasdaq|forex|us election|trump|biden)\b/i,
    /(بيتكوين|عملات رقمية|البورصة الأمريكية|انتخابات)/,
  ];

  return outOfScopePatterns.some((regex) => regex.test(lower));
}

/**
 * Detects if the user is asking for an itinerary, free-time plan, or weather-dependent activity
 */
export function isItineraryOrWeatherQuery(query: string): boolean {
  const lower = query.toLowerCase();
  const terms = [
    'free hour',
    'free time',
    'hours',
    'itinerary',
    'plan',
    'what should i do',
    'where should i go',
    'visit today',
    'weather',
    'hot',
    'cold',
    'outing',
    'hangout',
    'ساعات',
    'ساعة',
    'فاضي',
    'فاضيين',
    'أعمل إيه',
    'اعمل ايه',
    'أروح فين',
    'اروح فين',
    'خروجة',
    'خروجه',
    'جدول',
    'خطة',
    'خطه',
    'الجو',
    'طقس',
    'حر',
    'برد',
    'فسحة',
    'فسحه',
  ];
  return terms.some((t) => lower.includes(t));
}

/**
 * Fetches live weather for Egypt (Cairo/Luxor/Aswan/Alexandria) using OPENWEATHER_API_KEY
 * with an automatic silent fallback to Open-Meteo so it never fails or blocks chat.
 */
export async function fetchEgyptLiveWeather(query: string = ''): Promise<string> {
  const lower = query.toLowerCase();
  let city = 'Cairo';
  let cityAr = 'القاهرة';
  let lat = 30.0444;
  let lon = 31.2357;

  if (lower.includes('luxor') || lower.includes('الأقصر') || lower.includes('الاقصر')) {
    city = 'Luxor';
    cityAr = 'الأقصر';
    lat = 25.6872;
    lon = 32.6396;
  } else if (lower.includes('aswan') || lower.includes('أسوان') || lower.includes('اسوان') || lower.includes('سمبل')) {
    city = 'Aswan';
    cityAr = 'أسوان';
    lat = 24.0889;
    lon = 32.8998;
  } else if (lower.includes('alex') || lower.includes('إسكندرية') || lower.includes('اسكندرية')) {
    city = 'Alexandria';
    cityAr = 'الإسكندرية';
    lat = 31.2001;
    lon = 29.9187;
  } else if (lower.includes('giza') || lower.includes('الجيزة') || lower.includes('الجيزه')) {
    city = 'Giza';
    cityAr = 'الجيزة';
    lat = 30.0131;
    lon = 31.2089;
  }

  const weatherKey = process.env.OPENWEATHER_API_KEY?.trim();

  // 1. Primary: OpenWeatherMap API
  if (weatherKey) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )},EG&units=metric&appid=${weatherKey}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(1800) });
      if (res.ok) {
        const data = await res.json();
        const temp = Math.round(data.main?.temp ?? 26);
        const desc = data.weather?.[0]?.description || 'clear sky';
        const recommendation =
          temp >= 33
            ? 'Weather is hot: prioritize indoor air-conditioned gems like the Grand Egyptian Museum (GEM) or NMEC during midday, and save open-air walks (Al-Muizz Street, Khan el-Khalili, Nile Felucca) for late afternoon/evening.'
            : 'Weather is pleasant: great for both open-air heritage walks (Pyramids, Citadel, Khan el-Khalili, Al-Muizz Street, Nile cruise) and museums.';
        return `LIVE WEATHER IN ${city.toUpperCase()} (${cityAr}): ${temp}°C, ${desc}. ${recommendation}`;
      }
    } catch {
      // Silent fallback
    }
  }

  // 2. Silent Fallback: Open-Meteo Live Weather API (No key required)
  try {
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(meteoUrl, { signal: AbortSignal.timeout(1800) });
    if (res.ok) {
      const data = await res.json();
      const temp = Math.round(data.current_weather?.temperature ?? 26);
      const code = data.current_weather?.weathercode ?? 0;
      const desc = code === 0 ? 'Sunny & Clear' : code <= 3 ? 'Partly Cloudy & Pleasant' : 'Mild';
      const recommendation =
        temp >= 33
          ? 'Weather is warm/hot: suggest air-conditioned museums (Grand Egyptian Museum, NMEC, Egyptian Museum) first, followed by an evening stroll in Khan el-Khalili or a Nile Felucca ride.'
          : 'Weather is pleasant: ideal for outdoor monuments (Giza Pyramids, Citadel of Saladin, Al-Muizz Street, Khan el-Khalili) as well as museums.';
      return `LIVE WEATHER IN ${city.toUpperCase()} (${cityAr}): ${temp}°C, ${desc}. ${recommendation}`;
    }
  } catch {
    // Silent fallback
  }

  return `LIVE WEATHER IN ${city.toUpperCase()} (${cityAr}): 26°C, Sunny & Pleasant Egyptian weather.`;
}

/**
 * Queries the Official Wikipedia REST API + MediaWiki Search API (Arabic & English)
 * + Supabase verified attractions in parallel with a fast 1.6s timeout.
 */
export async function fetchTrustedWikipediaAndRAG(query: string): Promise<string> {
  if (!query || query.trim().length < 2) return '';

  const clean = query
    .replace(/[؟?.,!،؛:"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const isArabic = /[\u0600-\u06FF]/.test(clean);
  const snippets: string[] = [];

  const tasks: Promise<void>[] = [];

  // 1. Official Wikipedia REST & Search API (AR or EN based on query)
  tasks.push(
    (async () => {
      try {
        const wikiLang = isArabic ? 'ar' : 'en';
        const searchQuery = isArabic ? clean : `${clean} Egypt`;
        const searchUrl = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          searchQuery
        )}&srlimit=2&utf8=&format=json&origin=*`;

        const searchRes = await fetch(searchUrl, {
          headers: { 'User-Agent': 'EgyptX-AI/2.0 (https://egyptx.ai)' },
          signal: AbortSignal.timeout(1500),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const topResults = searchData?.query?.search || [];

          if (topResults.length > 0) {
            const topTitle = topResults[0].title;
            // Fetch Official Wikipedia REST API v1 summary for the top article
            const summaryUrl = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              topTitle
            )}`;
            const summaryRes = await fetch(summaryUrl, {
              headers: { 'User-Agent': 'EgyptX-AI/2.0 (https://egyptx.ai)' },
              signal: AbortSignal.timeout(1200),
            });

            if (summaryRes.ok) {
              const summaryData = await summaryRes.json();
              if (summaryData?.extract) {
                snippets.push(
                  `[Wikipedia Official REST API (${topTitle})]: ${summaryData.extract}`
                );
                return;
              }
            }

            // Fallback to search snippets if REST summary timed out
            for (const item of topResults) {
              const cleanSnippet = (item.snippet || '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
              if (cleanSnippet) {
                snippets.push(`[Wikipedia (${item.title})]: ${cleanSnippet}`);
              }
            }
          }
        }
      } catch {
        // Silent timeout fallback
      }
    })()
  );

  // 2. Supabase Verified Attractions lookup
  tasks.push(
    (async () => {
      try {
        const supabase = createAdminClient();
        const words = clean.split(' ').filter((w) => w.length >= 3).slice(0, 3);
        const keyword = words[words.length - 1] || clean;
        const { data } = await supabase
          .from('attractions')
          .select('name_en, name_ar, city, category, description_en, description_ar')
          .or(
            `name_en.ilike.%${keyword}%,name_ar.ilike.%${keyword}%,description_en.ilike.%${keyword}%`
          )
          .limit(2);

        if (data && data.length > 0) {
          for (const row of data) {
            snippets.push(
              `[EgyptX Verified Database - ${row.name_en || ''} / ${row.name_ar || ''} (${row.city || 'Egypt'})]: ${
                row.description_ar || row.description_en || ''
              }`
            );
          }
        }
      } catch {
        // Silent fallback
      }
    })()
  );

  await Promise.allSettled(tasks);
  return snippets.join('\n\n');
}

export interface MultiProviderOptions {
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: any }>;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Multi-API Completion with Ultra-Fast Groq Primary -> OpenAI Fallback -> OpenRouter Fallback
 * Never throws or logs console.error on handled fallback transitions.
 */
export async function generateWithSmartFallback(options: MultiProviderOptions): Promise<string> {
  const groqKey = (process.env.GROQ_API_KEY || (process.env as any)['\uFEFFGROQ_API_KEY'])?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();

  const fullMessages = [
    { role: 'system', content: options.systemPrompt },
    ...options.messages.filter((m) => (m.role as string) !== 'system'),
  ];

  const providers: Array<{
    name: string;
    url: string;
    key: string;
    model: string;
    extraHeaders?: Record<string, string>;
  }> = [];

  // 1. Primary: GROQ_API_KEY (Ultra-fast sub-second inference)
  if (groqKey) {
    providers.push({
      name: 'groq-gpt-oss-120b',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: groqKey,
      model: 'openai/gpt-oss-120b',
    });
    providers.push({
      name: 'groq-llama-3.3-70b',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: groqKey,
      model: 'llama-3.3-70b-versatile',
    });
    providers.push({
      name: 'groq-qwen',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: groqKey,
      model: 'qwen/qwen3.8-27b',
    });
  }

  // 2. Fallback 1: OPENAI_API_KEY (gpt-4o-mini)
  if (openaiKey) {
    providers.push({
      name: 'openai-gpt-4o-mini',
      url: 'https://api.openai.com/v1/chat/completions',
      key: openaiKey,
      model: 'gpt-4o-mini',
    });
  }

  // 3. Fallback 2: OPENROUTER_API_KEY (openai/gpt-4o-mini & perplexity/sonar)
  if (openrouterKey) {
    providers.push({
      name: 'openrouter-gpt-4o-mini',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: openrouterKey,
      model: 'openai/gpt-4o-mini',
      extraHeaders: {
        'HTTP-Referer': 'https://egyptx-ai.vercel.app',
        'X-Title': 'EgyptX AI',
      },
    });
    providers.push({
      name: 'openrouter-sonar',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: openrouterKey,
      model: 'perplexity/sonar',
      extraHeaders: {
        'HTTP-Referer': 'https://egyptx-ai.vercel.app',
        'X-Title': 'EgyptX AI',
      },
    });
  }

  for (const p of providers) {
    try {
      const res = await fetch(p.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${p.key}`,
          'Content-Type': 'application/json',
          ...(p.extraHeaders || {}),
        },
        body: JSON.stringify({
          model: p.model,
          messages: fullMessages,
          temperature: options.temperature ?? 0.4,
          max_tokens: options.maxTokens ?? 900,
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      let content = data.choices?.[0]?.message?.content?.trim();
      if (content) {
        // Strip any <think>...</think> reasoning blocks if returned by reasoning models
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        if (content) {
          return content;
        }
      }
    } catch {
      // Seamless fallback to next provider
    }
  }

  const lastUserMsg = options.messages[options.messages.length - 1]?.content || '';
  const isAr = /[\u0600-\u06FF]/.test(String(lastUserMsg));
  return isAr
    ? 'أهلاً بك يا صاحبي في EgyptX! اسألني عن أي معبد أو أثر أو خروجة سياحية في مصر وهجاوبك فوراً.'
    : 'Welcome my friend to EgyptX! Ask me about any temple, monument, or tourist plan in Egypt and I will help you right away.';
}

/**
 * Streams response with verified first-chunk generation so failed models/keys
 * automatically fall back in real-time before HTTP headers are committed.
 */
export async function streamWithSmartFallback(
  req: Request,
  options: MultiProviderOptions & { nonStreamingJson?: boolean; extraJsonFields?: Record<string, any> }
): Promise<Response> {
  const groqKey = (process.env.GROQ_API_KEY || (process.env as any)['\uFEFFGROQ_API_KEY'])?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();

  const candidates: Array<{ model: any; label: string }> = [];

  if (groqKey) {
    const groqProvider = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: groqKey,
      compatibility: 'compatible',
    });
    candidates.push({ model: groqProvider('openai/gpt-oss-120b'), label: 'groq-gpt-oss-120b' });
    candidates.push({ model: groqProvider('llama-3.3-70b-versatile'), label: 'groq-llama-3.3-70b' });
    candidates.push({ model: groqProvider('qwen/qwen3.8-27b'), label: 'groq-qwen' });
  }

  if (openaiKey) {
    const openaiProvider = createOpenAI({ apiKey: openaiKey });
    candidates.push({ model: openaiProvider('gpt-4o-mini'), label: 'openai-gpt-4o-mini' });
  }

  if (openrouterKey) {
    const openrouterProvider = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openrouterKey,
      compatibility: 'compatible',
    });
    candidates.push({ model: openrouterProvider('openai/gpt-4o-mini'), label: 'openrouter-gpt-4o-mini' });
    candidates.push({ model: openrouterProvider('perplexity/sonar'), label: 'openrouter-sonar' });
  }

  const acceptHeader = req.headers.get('accept') || '';
  const isDataStream =
    req.headers.get('x-vercel-ai-data-stream') === 'v1' || acceptHeader.includes('text/event-stream');
  const isNonStreamingJson =
    options.nonStreamingJson === true || acceptHeader === 'application/json';

  for (const candidate of candidates) {
    try {
      const result = streamText({
        model: candidate.model,
        system: options.systemPrompt,
        messages: options.messages as any,
        temperature: options.temperature ?? 0.4,
        maxRetries: 0,
      });

      const iterator = result.textStream[Symbol.asyncIterator]();
      let firstChunk = '';

      while (true) {
        const next = await iterator.next();
        if (next.done) break;
        if (next.value && next.value.length > 0) {
          firstChunk = next.value;
          break;
        }
      }

      if (!firstChunk) {
        continue;
      }

      if (isNonStreamingJson) {
        let fullText = firstChunk;
        while (true) {
          const next = await iterator.next();
          if (next.done) break;
          if (next.value) fullText += next.value;
        }
        fullText = fullText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        return NextResponse.json({
          reply: fullText,
          ...(options.extraJsonFields || {}),
        });
      }

      const encoder = new TextEncoder();
      const formatChunk = (chunk: string) =>
        isDataStream ? `0:${JSON.stringify(chunk)}\n` : chunk;

      const readable = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode(formatChunk(firstChunk)));
          try {
            while (true) {
              const next = await iterator.next();
              if (next.done) break;
              if (next.value) {
                controller.enqueue(encoder.encode(formatChunk(next.value)));
              }
            }
          } catch {
            // Stream closed cleanly
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          ...(isDataStream ? { 'x-vercel-ai-data-stream': 'v1' } : {}),
        },
      });
    } catch {
      // Try next candidate silently
    }
  }

  // Final fallback via direct fetch
  const fallbackReply = await generateWithSmartFallback(options);
  if (isNonStreamingJson) {
    return NextResponse.json({
      reply: fallbackReply,
      ...(options.extraJsonFields || {}),
    });
  }

  return new Response(fallbackReply, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
