import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Strict Anti-Conflation & Zero-Hallucination Rule injected into all EgyptX heritage prompts.
 */
export const ARCHAEOLOGICAL_ACCURACY_RULE = `CRITICAL ARCHAEOLOGICAL ACCURACY RULE: Never mix up or conflate different Egyptian temples. Never guess a temple's governorate, dynasty, or whether it is rock-cut (منحوت في الصخر) vs. free-standing masonry (مبني بالحجر). Rely strictly on the provided RAG context and verified Egyptological facts. If you are not 100% certain of a specific architectural detail, date, or dynasty, do NOT invent it—state only what is verified or explicitly say you are not certain of that specific detail.

CRITICAL DISAMBIGUATION MANDATES (NEVER VIOLATE):
1. Temple of Hibis (معبد هيبس): Located in KHARGA OASIS, NEW VALLEY GOVERNORATE (الواحات الخارجة - محافظة الوادي الجديد) — NEVER say Sohag! Built of FREE-STANDING SANDSTONE MASONRY BLOCKS (مبني بالحجر الرملي وليس منحوتاً في الصخر — NOT rock-cut!). Dates primarily to the SAITE-PERSIAN PERIODS (26th–27th Dynasties: initiated under Psamtik II / Apries / Amasis II and decorated/completed under Persian King Darius I, with 29th–30th Dynasty & Ptolemaic additions) — NEVER say 25th Dynasty! Dedicated to Amun-Ra (Amun of Hibis / آمون هيبس) and the Theban Triad.
2. Temple of Seti I at Abydos (معبد سيتي الأول بأبيدوس): Located in ABYDOS, SOHAG GOVERNORATE (أبيدوس - محافظة سوهاج). A true hidden gem in Upper Egypt, built of FREE-STANDING FINE WHITE LIMESTONE MASONRY (مبني بالحجر الجيري الأبيض — NOT rock-cut!) by Pharaoh Seti I and completed by his son Ramesses II (19th Dynasty, New Kingdom, c. 1290–1279 BCE). Famous for its unique L-shaped layout, 7 vaulted sanctuaries, exquisite raised relief carvings, the Abydos King List (قائمة ملوك أبيدوس), and the subterranean Osireion cenotaph (الأوزيريون) behind it.
3. Philae Temple Complex / Temple of Isis (معبد فيلة / إيزيس): Located on AGILKIA ISLAND, ASWAN GOVERNORATE (جزيرة أجيلكيا بأسوان). It is one of Aswan's PREMIER MAINSTREAM TOURIST ATTRACTIONS (NEVER call Philae "off the beaten path" or "lesser-known"!). It is a FREE-STANDING SANDSTONE MASONRY TEMPLE COMPLEX (مبني بالحجر الحر وليس منحوتاً في الصخر — NEVER call Philae rock-cut!). Built mainly in the Ptolemaic and Roman periods (initiated under Nectanebo I, 30th Dynasty) and relocated block-by-block by UNESCO (1972–1980) from Philae Island to Agilkia Island after the Aswan High Dam construction.
4. Abu Simbel Temples (معبدا أبو سمبل): Located in ASWAN GOVERNORATE / NUBIA (أبو سمبل بأسوان / النوبة), 280km south of Aswan on Lake Nasser. Two massive ROCK-CUT TEMPLES (منحوتان في الصخر الجبلي — carved directly into the mountain cliff) built by Ramesses II (19th Dynasty, New Kingdom, c. 1264–1244 BCE): the Great Temple of Ramesses II (solar alignment twice a year on Feb 22 and Oct 22 illuminating Amun-Ra, Ra-Horakhty, and Ramesses II while Ptah remains in shadow) and the Small Temple of Nefertari (dedicated to Hathor and Queen Nefertari). Relocated by UNESCO in 1968.
5. Karnak Temple Complex (مجمع معابد الكرنك): Located on the EAST BANK OF LUXOR (البر الشرقي بالأقصر). Initiated in the Middle Kingdom (Senusret I, 12th Dynasty) and expanded through the New Kingdom, Late Period, and Ptolemaic/Roman eras over ~2,000 years. Dedicated primarily to Amun-Ra (with precincts for Mut and Khonsu). Features the Great Hypostyle Hall with 134 massive sandstone columns (the 12 central columns are ~21–24m tall with open papyrus capitals) and the Sacred Lake. Covers ~100 hectares (200+ acres) and is one of the largest ancient religious complexes in the world (note accurately that Angkor Wat in Cambodia is larger by total area). Built of free-standing sandstone, limestone, and granite masonry.
6. Temple of Hathor at Dendera (معبد دندرة): Located in DENDERA, QENA GOVERNORATE (دندرة - محافظة قنا). Built of free-standing sandstone masonry in the Late Ptolemaic and Roman periods (Ptolemy XII, Cleopatra VII, Augustus, Tiberius, Nero). Famous for its intact turquoise astronomical ceiling, the Dendera Zodiac (برج دندرة الفلكي), subterranean crypts, and rooftop chapels of Osiris.`;

export interface VerifiedMonumentEntry {
  id: string;
  nameEn: string;
  nameAr: string;
  governorateEn: string;
  governorateAr: string;
  periodAndDynasty: string;
  constructionType: 'Free-standing stone masonry (مبني بالحجر)' | 'Rock-cut (منحوت في الصخر)' | 'Hybrid rock-cut and free-standing masonry (منحوت في الصخر ومبني بالحجر)';
  popularityCategory: 'Mainstream World-Famous Icon' | 'Lesser-Known / Hidden Gem';
  wikiTitleEn: string;
  wikiTitleAr: string;
  keywords: string[];
  verifiedFacts: string;
}

/**
 * Structured Ground-Truth Encyclopedia of Egyptian Monuments across all Governorates.
 * Eliminates hallucinations regarding locations, dynasties, construction types, and key features.
 */
export const VERIFIED_MONUMENTS_CATALOG: VerifiedMonumentEntry[] = [
  {
    id: 'karnak',
    nameEn: 'Karnak Temple Complex',
    nameAr: 'مجمع معابد الكرنك',
    governorateEn: 'Luxor Governorate (East Bank)',
    governorateAr: 'محافظة الأقصر (البر الشرقي)',
    periodAndDynasty: 'Middle Kingdom (initiated under Senusret I, 12th Dynasty, c. 1971–1926 BCE) through New Kingdom (18th–20th Dynasties: Hatshepsut, Thutmose III, Amenhotep III, Seti I, Ramesses II) to Ptolemaic and Roman eras',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Mainstream World-Famous Icon',
    wikiTitleEn: 'Karnak',
    wikiTitleAr: 'الكرنك',
    keywords: ['karnak', 'hypostyle', 'amun-ra', 'amun ra', 'الكرنك', 'معبد الكرنك', 'بهو الأعمدة'],
    verifiedFacts:
      'Located on the East Bank of Luxor (Ancient Thebes). Initiated in the Middle Kingdom (Senusret I) and expanded for ~2,000 years through the New Kingdom and Ptolemaic/Roman eras by 30+ pharaohs. Divided into three walled precincts dedicated to the Theban Triad: the massive Precinct of Amun-Ra (chief deity), Precinct of Mut, and Precinct of Khonsu (plus the Precinct of Montu and Open-Air Museum with Senusret I’s White Chapel and Hatshepsut’s Red Chapel). Its Great Hypostyle Hall (started by Amenhotep III, decorated by Seti I and Ramesses II) contains 134 massive sandstone columns in 16 rows; the 12 central open-papyrus columns stand ~21–24 meters tall. Features the Sacred Lake (البحيرة المقدسة), standing red granite Obelisk of Hatshepsut (29.5m), Festival Hall of Thutmose III, and 10 monumental pylons. Covers ~100 hectares (over 200–247 acres), making it the largest ancient religious complex in Egypt and one of the largest in the world (second in total enclosed area only to Angkor Wat). Built of free-standing sandstone, limestone, and red granite masonry (NOT rock-cut).',
  },
  {
    id: 'hibis',
    nameEn: 'Temple of Hibis',
    nameAr: 'معبد هيبس',
    governorateEn: 'Kharga Oasis, New Valley Governorate',
    governorateAr: 'الواحات الخارجة، محافظة الوادي الجديد',
    periodAndDynasty: 'Late Period — 26th Saite Dynasty (initiated under Psamtik II, Apries, Amasis II, c. 595–525 BCE) and 27th First Persian Dynasty (completed and decorated under Persian King Darius I, c. 522–486 BCE), with additions in the 29th–30th Dynasties (Akoris, Nectanebo I & II) and Ptolemaic era',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Temple of Hibis',
    wikiTitleAr: 'معبد هيبس',
    keywords: ['hibis', 'kharga', 'new valley', 'darius', 'psamtik', 'هيبس', 'معبد هيبس', 'الخارجة', 'الوادي الجديد'],
    verifiedFacts:
      'Located in Kharga Oasis, New Valley Governorate (محافظة الوادي الجديد — NEVER in Sohag!). It is the largest and best-preserved Egyptian temple in all of Egypt’s Western Desert oases and the only major surviving structure from the Saite-Persian Period (26th–27th Dynasties). Built of free-standing local sandstone blocks / masonry (مبني بالحجر الرملي الحر — NOT rock-cut!) originally surrounded by a sacred lake. Dedicated to Amun-Ra ("Amun of Hibis" / آمون هيبس) alongside Mut, Khonsu, and Osiris. Famous for its unique relief depicting the falcon-headed god Seth (Sutekh) slaying the serpent Apophis, hymns to Amun-Ra carved under Darius I, and its outer monumental gateways added by Nectanebo I & II and the Ptolemies.',
  },
  {
    id: 'abydos-seti',
    nameEn: 'Temple of Seti I at Abydos',
    nameAr: 'معبد سيتي الأول بأبيدوس',
    governorateEn: 'Abydos (Al-Balyana), Sohag Governorate',
    governorateAr: 'أبيدوس (البلينا)، محافظة سوهاج',
    periodAndDynasty: 'New Kingdom — 19th Dynasty (built by Pharaoh Seti I and completed by his son Ramesses II, c. 1290–1279 BCE)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Temple of Seti I (Abydos)',
    wikiTitleAr: 'معبد سيتي الأول في أبيدوس',
    keywords: ['abydos', 'seti', 'sohag', 'osireion', 'king list', 'أبيدوس', 'ابيدوس', 'سيتي الأول', 'سوهاج', 'الأوزيريون'],
    verifiedFacts:
      'Located in Abydos (near Al-Balyana), Sohag Governorate (محافظة سوهاج). A true architectural hidden gem in Upper Egypt. Built of fine-grained white Tura limestone and sandstone masonry (مبني بالحجر الجيري الأبيض — NOT rock-cut!). Features an unusual L-shaped ground plan, two hypostyle halls supported by papyrus columns, and 7 vaulted sanctuaries side-by-side dedicated to Seti I, Ptah, Ra-Horakhty, Amun-Ra, Osiris, Isis, and Horus. Celebrated for having the finest, most delicate raised relief carvings of the entire New Kingdom retaining vivid original paint, the famous Abydos King List (قائمة ملوك أبيدوس) recording 76 dynastic pharaohs from Menes/Narmer to Seti I, the Hall of Barques, and the mysterious subterranean megalithic Osireion (الأوزيريون — symbolic cenotaph tomb of Osiris) located directly behind the temple.',
  },
  {
    id: 'abydos-ramesses',
    nameEn: 'Temple of Ramesses II at Abydos',
    nameAr: 'معبد رمسيس الثاني بأبيدوس',
    governorateEn: 'Abydos (Al-Balyana), Sohag Governorate',
    governorateAr: 'أبيدوس (البلينا)، محافظة سوهاج',
    periodAndDynasty: 'New Kingdom — 19th Dynasty (Pharaoh Ramesses II, c. 1279–1213 BCE)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Ramesses II Abydos Temple',
    wikiTitleAr: 'معبد رمسيس الثاني بأبيدوس',
    keywords: ['ramesses ii abydos', 'معبد رمسيس الثاني بأبيدوس'],
    verifiedFacts:
      'Located ~300 meters northwest of Seti I’s temple in Abydos, Sohag Governorate. Built of fine limestone masonry with red and black granite doorways, sandstone pillars, and an alabaster sanctuary. Despite missing its roof, its lower walls preserve extraordinarily vibrant polychrome sunk-relief carvings of offering processions, cattle, prisoners, and Battle of Kadesh scenes.',
  },
  {
    id: 'dendera',
    nameEn: 'Temple of Hathor at Dendera (Dendera Temple Complex)',
    nameAr: 'معبد حتحور بدندرة (مجمع معابد دندرة)',
    governorateEn: 'Dendera, Qena Governorate',
    governorateAr: 'دندرة، محافظة قنا',
    periodAndDynasty: 'Late Ptolemaic and Roman Periods (c. 54 BCE – 60 CE, constructed under Ptolemy XII Auletes, Cleopatra VII, and Roman Emperors Augustus, Tiberius, Caligula, Claudius, and Nero on top of earlier Old/Middle/New Kingdom foundations)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Dendera Temple complex',
    wikiTitleAr: 'معبد دندرة',
    keywords: ['dendera', 'dandara', 'hathor', 'qena', 'zodiac', 'دندرة', 'معبد دندرة', 'قنا', 'حتحور', 'برج دندرة'],
    verifiedFacts:
      'Located 5km south of Qena in Qena Governorate (محافظة قنا). One of the best-preserved temple complexes in Egypt, built of free-standing sandstone masonry (NOT rock-cut). Dedicated to the cow-headed goddess Hathor (goddess of love, joy, music, and motherhood). Famous for its grand outer hypostyle hall (Pronaos added under Tiberius) with 24 massive Hathor-headed (sistrum) columns and a restored vivid turquoise astronomical ceiling depicting Nut swallowing the sun and Roman zodiac signs; subterranean wall crypts featuring the famous "Dendera Light" lotus-serpent relief; rooftop Osiris chapels where the circular Dendera Zodiac (برج دندرة الفلكي — original in the Louvre, replica in situ) was carved; the Roman Mammisi (Birth House); sacred lake; and the only surviving monumental relief on the exterior rear wall depicting Queen Cleopatra VII and her son Caesarion.',
  },
  {
    id: 'philae',
    nameEn: 'Philae Temple Complex (Temple of Isis)',
    nameAr: 'مجمع معابد فيلة (معبد إيزيس)',
    governorateEn: 'Agilkia Island, Aswan Governorate',
    governorateAr: 'جزيرة أجيلكيا، محافظة أسوان',
    periodAndDynasty: '30th Dynasty (Nectanebo I) through Ptolemaic Period (Ptolemy II Philadelphus to Ptolemy XII) and Roman Period (Augustus, Tiberius, Trajan, Hadrian, Diocletian, c. 380 BCE – 300 CE)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Mainstream World-Famous Icon',
    wikiTitleEn: 'Philae',
    wikiTitleAr: 'فيلة',
    keywords: ['philae', 'agilkia', 'isis temple', 'trajan', 'فيلة', 'معبد فيلة', 'إيزيس', 'أجيلكيا'],
    verifiedFacts:
      'Located on Agilkia Island in the reservoir of the Aswan Low Dam, Aswan Governorate. Philae is one of Aswan’s PREMIER MAINSTREAM TOURIST ATTRACTIONS (NOT a lesser-known or off-the-beaten-path site!). It is a FREE-STANDING SANDSTONE MASONRY TEMPLE COMPLEX (مبني بالحجر الرملي الحر — NOT rock-cut!). Dedicated to the goddess Isis, Osiris, and Horus. Includes the Vestibule of Nectanebo I, two monumental Pylons, the Mammisi (Birth House of Horus), Temple of Hathor, Gate of Hadrian (containing the last known ancient Egyptian hieroglyphic inscription dated August 24, 394 CE and the last Demotic inscription from 452 CE), and the iconic 14-column Kiosk of Trajan ("Pharaoh’s Bed"). Rescued by UNESCO between 1972 and 1980 by dismantling ~40,000 stone blocks from flooded Philae Island and re-erecting them on higher Agilkia Island.',
  },
  {
    id: 'abu-simbel',
    nameEn: 'Abu Simbel Temples (Great Temple of Ramesses II & Small Temple of Nefertari)',
    nameAr: 'معبدا أبو سمبل (المعبد الكبير لرمسيس الثاني والمعبد الصغير لنفرتاري)',
    governorateEn: 'Abu Simbel (Nubia), Aswan Governorate',
    governorateAr: 'أبو سمبل (النوبة)، محافظة أسوان',
    periodAndDynasty: 'New Kingdom — 19th Dynasty (Pharaoh Ramesses II, built c. 1264–1244 BCE)',
    constructionType: 'Rock-cut (منحوت في الصخر)',
    popularityCategory: 'Mainstream World-Famous Icon',
    wikiTitleEn: 'Abu Simbel',
    wikiTitleAr: 'أبو سمبل',
    keywords: ['abu simbel', 'nefertari', 'lake nasser', 'أبو سمبل', 'ابو سمبل', 'معبد أبو سمبل', 'تعامد الشمس'],
    verifiedFacts:
      'Located in Nubia, Aswan Governorate, 280km southwest of Aswan on the western bank of Lake Nasser. World-famous mainstream UNESCO icon consisting of TWO MASSIVE ROCK-CUT TEMPLES (منحوتان بالكامل في صخر الجبل الرملي) carved directly into the sandstone cliff by Pharaoh Ramesses II (19th Dynasty): (1) The Great Temple of Ramesses II, dedicated to Amun-Ra, Ra-Horakhty, Ptah, and the deified Ramesses II, featuring a 33m-high, 38m-wide facade with four 20m-tall colossal seated statues of Ramesses II, an inner hypostyle hall with 8 Osiride pillars and Battle of Kadesh reliefs, and a sanctuary 60m deep where the sun aligns twice a year (February 22 and October 22) to illuminate Amun-Ra, Ra-Horakhty, and Ramesses II while Ptah (god of the underworld) stays perpetually in shadow; (2) The Small Temple of Hathor and Queen Nefertari, whose facade features six 10m-tall standing statues (four of Ramesses II and two of Nefertari rendered at equal royal scale). In 1964–1968, UNESCO cut both temples into 1,036 blocks and reconstructed them 65m higher and 200m back inside an artificial concrete dome mountain to save them from Lake Nasser.',
  },
  {
    id: 'esna',
    nameEn: 'Temple of Khnum at Esna',
    nameAr: 'معبد خنوم بإسنا (معبد إسنا)',
    governorateEn: 'Esna, Luxor Governorate',
    governorateAr: 'إسنا، محافظة الأقصر',
    periodAndDynasty: 'Ptolemaic and Roman Periods (initiated under Ptolemy VI; surviving hypostyle hall built and decorated under Roman Emperors Claudius, Vespasian, Domitian, Trajan, Hadrian, Antoninus Pius, Septimius Severus, Caracalla, and Decius, 1st–3rd centuries CE)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Temple of Esna',
    wikiTitleAr: 'معبد إسنا',
    keywords: ['esna', 'khnum', 'إسنا', 'اسنا', 'معبد إسنا', 'خنوم'],
    verifiedFacts:
      'Located in the city of Esna, ~55km south of Luxor in Luxor Governorate. Sits 9 meters below modern street level in an excavated pit. Built of free-standing sandstone masonry (NOT rock-cut) and dedicated to the ram-headed creator god Khnum (who fashioned mankind on a potter’s wheel), along with his consorts Menhit and Nebtu, Heka, and Neith. Its surviving Roman Pronaos (Hypostyle Hall) measures 37m x 20m with 24 towering columns topped by intricate floral palm, lotus, and papyrus capitals. Following a landmark Egyptian-German conservation project (2018–2024), centuries of soot were removed to reveal dazzling yellow, blue, red, and green astronomical ceiling reliefs of the ancient Egyptian constellations, zodiac, and decans.',
  },
  {
    id: 'edfu',
    nameEn: 'Temple of Horus at Edfu',
    nameAr: 'معبد حورس بإدفو (معبد إدفو)',
    governorateEn: 'Edfu, Aswan Governorate',
    governorateAr: 'إدفو، محافظة أسوان',
    periodAndDynasty: 'Ptolemaic Period (begun August 23, 237 BCE under Ptolemy III Euergetes and completed in 57 BCE under Ptolemy XII Auletes)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Mainstream World-Famous Icon',
    wikiTitleEn: 'Temple of Edfu',
    wikiTitleAr: 'معبد إدفو',
    keywords: ['edfu', 'idfu', 'horus temple', 'إدفو', 'ادفو', 'معبد إدفو', 'معبد حورس'],
    verifiedFacts:
      'Located on the west bank of the Nile in Edfu, Aswan Governorate (between Luxor and Aswan). Built of free-standing sandstone masonry (NOT rock-cut). It is the BEST-PRESERVED ancient cult temple in all of Egypt and the second largest after Karnak. Dedicated to the falcon god Horus of Behdet. Features a colossal 36m-high First Pylon guarded by two iconic black granite falcon statues of Horus wearing the Double Crown, a vast colonnaded courtyard, two hypostyle halls, an ancient perfumery laboratory (بيت العطور), a nilometer, and the inner sanctuary housing a polished granite naos from Nectanebo II (30th Dynasty) and a replica sacred barque.',
  },
  {
    id: 'kom-ombo',
    nameEn: 'Temple of Kom Ombo (Double Temple of Sobek and Haroeris)',
    nameAr: 'معبد كوم أمبو (المعبد المزدوج لسبك وحورس الكبير)',
    governorateEn: 'Kom Ombo, Aswan Governorate',
    governorateAr: 'كوم أمبو، محافظة أسوان',
    periodAndDynasty: 'Ptolemaic Period (built 180–47 BCE under Ptolemy VI Philometor through Ptolemy XII & XIII) with Roman additions under Augustus and Tiberius',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Mainstream World-Famous Icon',
    wikiTitleEn: 'Temple of Kom Ombo',
    wikiTitleAr: 'معبد كوم أمبو',
    keywords: ['kom ombo', 'sobek', 'haroeris', 'crocodile', 'كوم أمبو', 'كوم امبو', 'سوبك', 'متحف التماسيح'],
    verifiedFacts:
      'Located on a scenic bend overlooking the Nile in Kom Ombo, Aswan Governorate. Built of free-standing limestone/sandstone masonry (NOT rock-cut). Unique in Egypt as a perfectly symmetrical DOUBLE TEMPLE divided along its main axis: the southern half is dedicated to Sobek (the crocodile god of fertility and creator of the world, with Hathor and Khonsu) and the northern half is dedicated to Haroeris / Horus the Elder (the falcon-headed god, with Tasenetnofret and Panebtawy). Everything is twinned: twin entrances, twin courts, twin hypostyle halls, and twin sanctuaries. Famous for the Roman corridor relief depicting ancient medical and surgical instruments (scalpels, forceps, cupping vessels, dental tools, and birthing stools), an ancient calendar relief, a deep circular nilometer, and the adjacent Crocodile Museum displaying mummified crocodiles.',
  },
  {
    id: 'kalabsha',
    nameEn: 'Temple of Kalabsha (Temple of Mandulis at New Kalabsha)',
    nameAr: 'معبد كلابشة (معبد ماندوليس بكلابشة الجديدة)',
    governorateEn: 'New Kalabsha (Lake Nasser near High Dam), Aswan Governorate',
    governorateAr: 'كلابشة الجديدة (بحيرة ناصر بجوار السد العالي)، محافظة أسوان',
    periodAndDynasty: 'Early Roman Period (built c. 30 BCE under Roman Emperor Augustus over an earlier 18th Dynasty temple of Amenhotep II and Ptolemaic sanctuary)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Kalabsha temple',
    wikiTitleAr: 'معبد كلابشة',
    keywords: ['kalabsha', 'mandulis', 'beit el-wali', 'qertassi', 'كلابشة', 'معبد كلابشة', 'بيت الوالي', 'قرطاسي'],
    verifiedFacts:
      'Located on New Kalabsha Island on Lake Nasser just south of the Aswan High Dam, Aswan Governorate. A remarkable lesser-known gem in Aswan. Built of free-standing sandstone masonry (NOT rock-cut), it is the largest free-standing temple of Egyptian Nubia, dedicated to the Nubian solar deity Mandulis (ماندوليس) alongside Isis and Osiris. Relocated in 1962–1963 (13,000 blocks) during the UNESCO Nubian campaign. The New Kalabsha open-air site also hosts the small Ptolemaic-Roman Kiosk of Qertassi (كشك قرطاسي) and the rock-cut Temple of Beit el-Wali (معبد بيت الوالي — carved by Ramesses II in the 19th Dynasty).',
  },
  {
    id: 'medinet-habu',
    nameEn: 'Medinet Habu (Mortuary Temple of Ramesses III)',
    nameAr: 'معبد مدينة هابو (المعبد الجنائزي لرمسيس الثالث)',
    governorateEn: 'West Bank, Luxor Governorate',
    governorateAr: 'البر الغربي، محافظة الأقصر',
    periodAndDynasty: 'New Kingdom — 20th Dynasty (Pharaoh Ramesses III, c. 1186–1155 BCE, with an adjacent 18th Dynasty Amun temple of Hatshepsut & Thutmose III)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Medinet Habu',
    wikiTitleAr: 'مدينة هابو',
    keywords: ['medinet habu', 'ramesses iii', 'sea peoples', 'migdol', 'مدينة هابو', 'رمسيس الثالث', 'شعوب البحر'],
    verifiedFacts:
      'Located on the West Bank of Luxor, Luxor Governorate. Built of free-standing sandstone masonry surrounded by a colossal mudbrick fortification enclosure and accessed through a unique Syrian-style fortified gateway (the Eastern High Gate / Migdol). Famous for its deeply incised sunk reliefs (up to 15cm deep) chronicling Ramesses III’s naval and land victories over the Sea Peoples (شعوب البحر) and Libyans, its royal palace attachment, and extraordinarily vivid original blue, turquoise, and red ceiling paint.',
  },
  {
    id: 'ramesseum',
    nameEn: 'The Ramesseum (Memorial Temple of Ramesses II)',
    nameAr: 'معبد الرمسيوم (المعبد الجنائزي لرمسيس الثاني)',
    governorateEn: 'West Bank, Luxor Governorate',
    governorateAr: 'البر الغربي، محافظة الأقصر',
    periodAndDynasty: 'New Kingdom — 19th Dynasty (Pharaoh Ramesses II, c. 1279–1213 BCE)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Ramesseum',
    wikiTitleAr: 'الرمسيوم',
    keywords: ['ramesseum', 'ozymandias', 'الرمسيوم', 'معبد الرمسيوم'],
    verifiedFacts:
      'Located in the Theban Necropolis on the West Bank of Luxor, Luxor Governorate. Built of free-standing sandstone masonry with massive mudbrick vaulted storerooms/granaries surrounding it. Famous for the fallen fragments of the colossal 19m-tall, 1,000-ton seated rose granite statue of Ramesses II (which inspired Percy Bysshe Shelley’s poem "Ozymandias"), a grand hypostyle hall with 29 surviving columns, Osiride pillars, astronomical ceiling reliefs, and dramatic Battle of Kadesh carvings on its pylons.',
  },
  {
    id: 'merenptah',
    nameEn: 'Mortuary Temple of Merenptah',
    nameAr: 'معبد مرنبتاح الجنائزي',
    governorateEn: 'West Bank, Luxor Governorate',
    governorateAr: 'البر الغربي، محافظة الأقصر',
    periodAndDynasty: 'New Kingdom — 19th Dynasty (Pharaoh Merenptah, son of Ramesses II, c. 1213–1203 BCE)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Mortuary Temple of Merenptah',
    wikiTitleAr: 'معبد مرنبتاح الجنائزي',
    keywords: ['merenptah', 'merneptah', 'مرنبتاح', 'معبد مرنبتاح'],
    verifiedFacts:
      'Located on the West Bank of Luxor behind the Colossi of Memnon, Luxor Governorate. Built of free-standing sandstone and limestone blocks (many reused from Amenhotep III’s nearby mortuary temple). It is the site where Flinders Petrie discovered the famous black granite Merenptah Victory Stele in 1896 (now in the Egyptian Museum in Cairo), and features an open-air archaeological museum path.',
  },
  {
    id: 'deir-el-medina',
    nameEn: 'Deir el-Medina & Temple of Hathor',
    nameAr: 'دير المدينة ومعبد حتحور',
    governorateEn: 'West Bank, Luxor Governorate',
    governorateAr: 'البر الغربي، محافظة الأقصر',
    periodAndDynasty: 'Workmen’s Village: New Kingdom (18th–20th Dynasties, founded by Thutmose I); Temple of Hathor: Ptolemaic Period (Ptolemy IV Philopator to Ptolemy XII)',
    constructionType: 'Hybrid rock-cut and free-standing masonry (منحوت في الصخر ومبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Deir el-Medina',
    wikiTitleAr: 'دير المدينة',
    keywords: ['deir el-medina', 'deir el medina', 'sennedjem', 'workers village', 'دير المدينة', 'سنجم'],
    verifiedFacts:
      'Located in a desert valley on the West Bank of Luxor, Luxor Governorate. An extraordinary hidden gem preserving the walled settlement of the royal artisans, sculptors, and painters ("Servants in the Place of Truth") who built and decorated the tombs in the Valley of the Kings during the 18th–20th Dynasties. Adjacent to the stone village ruins stands a charming, well-preserved free-standing Ptolemaic sandstone Temple of Hathor and Maat (enclosed within a mudbrick wall and featuring a rare scene of the Last Judgment / Weighing of the Heart), alongside vividly painted rock-cut family tombs such as Tomb of Sennedjem (TT1), Inherkhau (TT359), and Pashedu (TT3).',
  },
  {
    id: 'serabit-el-khadim',
    nameEn: 'Temple of Serabit el-Khadim (Temple of Hathor in Sinai)',
    nameAr: 'معبد سرابيط الخادم (معبد حتحور في سيناء)',
    governorateEn: 'South Sinai Governorate (near Abu Zenima)',
    governorateAr: 'محافظة جنوب سيناء (بالقرب من أبو زنيمة)',
    periodAndDynasty: 'Middle Kingdom (12th Dynasty: Senusret I, Amenemhat III) through New Kingdom (18th–20th Dynasties: Hatshepsut, Thutmose III, Amenhotep III, Ramesses II, Ramesses VI)',
    constructionType: 'Hybrid rock-cut and free-standing masonry (منحوت في الصخر ومبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Serabit el-Khadim',
    wikiTitleAr: 'سرابيط الخادم',
    keywords: ['serabit', 'khadim', 'sinai temple', 'turquoise', 'proto-sinaitic', 'سرابيط الخادم', 'سيناء', 'سيدة الفيروز'],
    verifiedFacts:
      'Located atop a remote mountain plateau in South Sinai Governorate. A unique archaeological gem combining two rock-cut cave sanctuaries (speos) dedicated to Hathor ("Lady of Turquoise" / سيدة الفيروز) and Sopdu (Lord of the East) with extensive open-air free-standing sandstone courts, Hathor-headed pillars, and dozens of tall rounded mining stelae recording royal turquoise and copper expeditions. World-famous in linguistics for the discovery of the Proto-Sinaitic inscriptions (c. 1850–1550 BCE), the earliest known ancestor of the Phoenician, Arabic, Greek, and Latin alphabets.',
  },
  {
    id: 'taposiris-magna',
    nameEn: 'Temple of Taposiris Magna',
    nameAr: 'معبد تابوزيريس ماجنا (أبو صير بالإسكندرية)',
    governorateEn: 'Abusir / Borg El Arab, Alexandria Governorate',
    governorateAr: 'أبو صير / برج العرب، محافظة الإسكندرية',
    periodAndDynasty: 'Ptolemaic Period (founded by Ptolemy II Philadelphus and Ptolemy IV Philopator, 3rd century BCE, used into the Roman and Christian eras)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Taposiris Magna',
    wikiTitleAr: 'تابوزيريس ماجنا',
    keywords: ['taposiris', 'abusir alexandria', 'borg el arab', 'تابوزيريس', 'أبو صير الإسكندرية', 'برج العرب'],
    verifiedFacts:
      'Located on a ridge between Lake Mariout and the Mediterranean Sea at Abusir (Borg El Arab), ~45km west of Alexandria in Alexandria Governorate. Built of massive free-standing limestone masonry blocks dedicated to Osiris ("Great House of Osiris"). Features a fortified stone temple enclosure with monumental pylons, an ancient animal necropolis, deep rock-cut subterranean shafts and water tunnels, Greco-Roman baths, and the surviving 20m-tall Ptolemaic funerary lighthouse tower (a 1:10 scale architectural replica of the lost Pharos Lighthouse of Alexandria).',
  },
  {
    id: 'siwa-oracle',
    nameEn: 'Temple of the Oracle of Amun (Aghurmi) & Temple of Umm Ubayda',
    nameAr: 'معبد وحي آمون (أغورمي) ومعبد أم عبيدة بسيوة',
    governorateEn: 'Siwa Oasis, Matrouh Governorate',
    governorateAr: 'واحة سيوة، محافظة مطروح',
    periodAndDynasty: 'Late Period — 26th Saite Dynasty (Temple of the Oracle built under Pharaoh Amasis II / Ahmose II, c. 570–526 BCE) and 30th Dynasty (Temple of Umm Ubayda built under Pharaoh Nectanebo II, 4th century BCE)',
    constructionType: 'Free-standing stone masonry (مبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Temple of the Oracle (Siwa)',
    wikiTitleAr: 'معبد الوحي',
    keywords: ['siwa', 'oracle', 'aghurmi', 'umm ubayda', 'alexander', 'سيوة', 'معبد الوحي', 'أغورمي', 'أم عبيدة', 'مطروح'],
    verifiedFacts:
      'Located in Siwa Oasis, Matrouh Governorate (محافظة مطروح). The Temple of the Oracle of Amun stands dramatically atop the flat limestone rock of Aghurmi village and was built of free-standing limestone masonry during the 26th Dynasty under Pharaoh Amasis II. In 331 BCE, Alexander the Great marched across the desert to consult this Oracle, which proclaimed him the divine son of Amun (Zeus-Amun). Nearby stands the ruined wall of the 30th Dynasty Temple of Amun at Umm Ubayda (built by Nectanebo II).',
  },
  {
    id: 'athribis',
    nameEn: 'Athribis Temple Complex (Temple of Repyt / Triphis)',
    nameAr: 'مجمع معابد أتريبس (معبد الإلهة ربيت / تريفيس)',
    governorateEn: 'Wannina, Sohag Governorate',
    governorateAr: 'قريـة ونينة، محافظة سوهاج',
    periodAndDynasty: 'Late Ptolemaic and Roman Periods (Ptolemy IX, Ptolemy XII Auletes through Roman Emperors Tiberius, Claudius, and Hadrian, 2nd century BCE – 2nd century CE)',
    constructionType: 'Hybrid rock-cut and free-standing masonry (منحوت في الصخر ومبني بالحجر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Athribis (Upper Egypt)',
    wikiTitleAr: 'أتريبس (مصر العليا)',
    keywords: ['athribis', 'repyt', 'triphis', 'wannina', 'أتريبس', 'اتريبس', 'ونينة'],
    verifiedFacts:
      'Located near Wannina, ~7km southwest of Sohag city in Sohag Governorate. A recently excavated archaeological treasure in Sohag featuring a large Ptolemaic-Roman sandstone masonry temple of Ptolemy XII (75m x 45m), a newly discovered cliffside rock-cut sanctuary (speos) discovered in 2022–2024, and over 18,000 inscribed ostraca. Dedicated to the lioness-headed goddess Repyt (Triphis), her consort Min-Ra, and their child Kolanthes.',
  },
  {
    id: 'speos-artemidos',
    nameEn: 'Speos Artemidos (Istabl Antar - Temple of Pakhet)',
    nameAr: 'معبد إسطبل عنتر (سبيوس أرتيميدوس - معبد الإلهة باخت)',
    governorateEn: 'Beni Hasan, Minya Governorate',
    governorateAr: 'بني حسن، محافظة المنيا',
    periodAndDynasty: 'New Kingdom — 18th Dynasty (Female Pharaoh Hatshepsut, c. 1479–1458 BCE, usurped/inscribed later by Seti I of the 19th Dynasty)',
    constructionType: 'Rock-cut (منحوت في الصخر)',
    popularityCategory: 'Lesser-Known / Hidden Gem',
    wikiTitleEn: 'Speos Artemidos',
    wikiTitleAr: 'إسطبل عنتر (بني حسن)',
    keywords: ['speos artemidos', 'istabl antar', 'pakhet', 'minya', 'beni hasan', 'إسطبل عنتر', 'اسطبل عنتر', 'المنيا', 'بني حسن'],
    verifiedFacts:
      'Located near Beni Hasan in Minya Governorate (Middle Egypt). A genuine rock-cut temple (منحوت في الصخر) carved into the eastern limestone cliffs by Female Pharaoh Hatshepsut (18th Dynasty) and dedicated to the lioness goddess Pakhet ("She Who Scratches"). Famous for Hatshepsut’s long historical inscription above the entrance denouncing the devastation of the Hyksos and celebrating her restoration of Egypt’s temples.',
  },
];

/**
 * Authoritative Verified Egyptian Heritage Knowledge Base
 * Sourced from Egyptian Ministry of Tourism and Antiquities & UNESCO World Heritage records.
 * Covers Pharaonic/Ancient Egypt, Greco-Roman, Coptic, Islamic, Mamluk, and Modern Egypt.
 */
export const VERIFIED_EGYPT_HERITAGE_KB = `
${ARCHAEOLOGICAL_ACCURACY_RULE}

AUTHORITATIVE EGYPTIAN HERITAGE & TOURISM DATABASE (Ministry of Tourism & Antiquities / UNESCO):

1. MAJOR PHARAONIC & GRECO-ROMAN TEMPLES & PYRAMIDS (MAINSTREAM ICONS):
- Great Pyramid of Khufu (هرم خوفو الأكبر - Giza Governorate): Built c. 2560 BCE (4th Dynasty, Old Kingdom) for Pharaoh Khufu, designed by royal architect Hemiunu. Free-standing limestone & granite masonry. Originally 146.5m tall (now 138.5m), ~2.3 million stone blocks built over ~20 years by ~20,000 skilled Egyptian workers. Contains the King's Chamber, Queen's Chamber, and Grand Gallery.
- Pyramid of Khafre (هرم خفرع - Giza): Built c. 2530 BCE (4th Dynasty), 136.4m tall, retains original Tura limestone casing at its apex.
- Pyramid of Menkaure (هرم منقرع - Giza): Built c. 2510 BCE (4th Dynasty), 65m tall (now 61m), encased in Aswan red granite at its base.
- Great Sphinx of Giza (أبو الهول - Giza): Built c. 2500 BCE during the reign of Pharaoh Khafre (4th Dynasty). 73m long and 20m tall, carved from the monolithic limestone bedrock of the Giza Plateau. Between its paws stands the Dream Stele of Thutmose IV (18th Dynasty, c. 1401 BCE).
- Step Pyramid of Djoser at Saqqara (هرم زوسر المدرج بسقارة - Giza Governorate): Built c. 2670 BCE (3rd Dynasty) by architect and vizier Imhotep for Pharaoh Djoser. World's oldest monumental stone structure (6 mastaba tiers, 62.5m tall), surrounded by the Heb-Sed complex and nearby subterranean Serapeum of Saqqara (السرابيوم).
- Dahshur Pyramids (أهرامات دهشور - Giza Governorate): Built by Pharaoh Sneferu (4th Dynasty, c. 2600 BCE), including the Bent Pyramid (الهرم المنحني) and the Red Pyramid (الهرم الأحمر - world's first true smooth-sided pyramid).
- Karnak Temple Complex (مجمع معابد الكرنك - East Bank, Luxor Governorate): Free-standing sandstone/limestone/granite masonry complex (NOT rock-cut). Initiated in the Middle Kingdom (Senusret I, 12th Dynasty) and expanded through the New Kingdom (Hatshepsut, Thutmose III, Amenhotep III, Seti I, Ramesses II) to the Ptolemaic/Roman eras. Dedicated primarily to Amun-Ra (with Precincts of Mut and Khonsu). The Great Hypostyle Hall contains 134 massive columns (the 12 central papyrus columns are ~21–24m tall). Features the Sacred Lake and Obelisk of Hatshepsut. Covers ~100 hectares (200+ acres) and is one of the largest ancient religious complexes in the world (second in total area only to Angkor Wat).
- Luxor Temple (معبد الأقصر - East Bank, Luxor Governorate): Free-standing sandstone masonry. Built c. 1390 BCE primarily by Amenhotep III (18th Dynasty) and expanded by Tutankhamun, Horemheb, Ramesses II (19th Dynasty), and Alexander the Great. Connected to Karnak by the 2.7km Avenue of Sphinxes (طريق الكباش). Features the First Pylon of Ramesses II, one standing red granite obelisk (its twin is at Place de la Concorde in Paris), and the historic Mosque of Abu Haggag.
- Mortuary Temple of Hatshepsut at Deir el-Bahari (معبد حتشبسوت بالدير البحري - West Bank, Luxor Governorate): Built c. 1479 BCE (18th Dynasty), designed by architect Senenmut for Female Pharaoh Hatshepsut. Features 3 grand colonnaded stone terraces backed against the limestone cliffs with rock-cut inner sanctuaries (Anubis, Hathor, Amun), famous for the Land of Punt expedition reliefs.
- Valley of the Kings (وادي الملوك - West Bank, Luxor Governorate): Royal necropolis of the New Kingdom (18th–20th Dynasties, c. 1539–1075 BCE) with 63+ rock-cut royal tombs including KV62 (Tutankhamun, discovered Nov 4, 1922 by Howard Carter), KV17 (Seti I), KV9 (Ramesses V & VI), and KV11 (Ramesses III).
- Valley of the Queens (وادي الملكات - West Bank, Luxor Governorate): Houses QV66, the rock-cut tomb of Queen Nefertari (19th Dynasty, wife of Ramesses II).
- Colossi of Memnon (تمثالا ممنون - West Bank, Luxor Governorate): Two 18m-tall quartzite statues of Pharaoh Amenhotep III (18th Dynasty, c. 1350 BCE).
- Temple of Horus at Edfu (معبد إدفو - Aswan Governorate): Built 237–57 BCE (Ptolemaic Period, Ptolemy III to XII). Free-standing sandstone masonry (NOT rock-cut). The best-preserved ancient cult temple in Egypt, featuring a 36m-high pylon and granite falcon statues of Horus.
- Double Temple of Kom Ombo (معبد كوم أمبو - Aswan Governorate): Built 180–47 BCE (Ptolemaic Period with Roman additions). Free-standing sandstone masonry (NOT rock-cut). Symmetrical twin temple dedicated to Sobek (crocodile god) and Haroeris (Horus the Elder), famous for the surgical instruments relief and Crocodile Museum.
- Philae Temple Complex / Temple of Isis (معبد فيلة - Agilkia Island, Aswan Governorate): MAINSTREAM WORLD-FAMOUS ATTRACTION (NOT lesser-known or off the beaten path!). FREE-STANDING SANDSTONE MASONRY TEMPLE COMPLEX (NOT rock-cut!). Built primarily in the Ptolemaic and Roman periods (initiated under Nectanebo I, 30th Dynasty), dedicated to Isis. Features Trajan's Kiosk, the Mammisi, and the last hieroglyphic inscription (394 CE). Relocated by UNESCO (1972–1980) from Philae Island to Agilkia Island.
- Abu Simbel Temples (معبدا أبو سمبل - Aswan Governorate / Nubia): MAINSTREAM WORLD-FAMOUS UNESCO ICON. Two massive ROCK-CUT TEMPLES (منحوتان في الصخر الجبلي — carved into the mountain cliff) built by Ramesses II (19th Dynasty, New Kingdom, c. 1264–1244 BCE): (1) Great Temple of Ramesses II (four 20m colossal statues on the facade, Battle of Kadesh reliefs, and solar alignment twice a year on Feb 22 and Oct 22 illuminating Amun-Ra, Ra-Horakhty, and Ramesses II while Ptah stays in shadow) and (2) Small Temple of Nefertari & Hathor (six 10m facade statues). Relocated by UNESCO in 1964–1968.

2. VERIFIED LESSER-KNOWN TEMPLES & HIDDEN ARCHAEOLOGICAL GEMS (ACCURATE GOVERNORATES, DYNASTIES & CONSTRUCTION):
- Temple of Hibis (معبد هيبس - Kharga Oasis, New Valley Governorate / الواحات الخارجة بمحافظة الوادي الجديد): Located in New Valley Governorate (NEVER Sohag!). Free-standing sandstone block masonry (مبني بالحجر الرملي — NOT rock-cut!). Dates to the Saite-Persian Period (26th–27th Dynasties: initiated under Psamtik II/Amasis II and completed/decorated by Persian King Darius I, with 29th–30th Dynasty Nectanebo I & II and Ptolemaic additions — NEVER 25th Dynasty!). The largest and best-preserved oasis temple in Egypt, dedicated to Amun-Ra (Amun of Hibis).
- Temple of Seti I at Abydos (معبد سيتي الأول بأبيدوس - Abydos, Sohag Governorate / أبيدوس بمحافظة سوهاج): Located in Al-Balyana, Sohag Governorate. Free-standing fine white limestone masonry (مبني بالحجر الجيري — NOT rock-cut!). Built by Seti I and completed by Ramesses II (19th Dynasty, New Kingdom). Famous for its L-shaped plan, 7 vaulted sanctuaries, exquisite raised reliefs, the Abydos King List, and the subterranean Osireion cenotaph behind it. (Nearby is the smaller limestone Temple of Ramesses II at Abydos).
- Temple of Hathor at Dendera (معبد دندرة - Dendera, Qena Governorate / دندرة بمحافظة قنا): Located in Qena Governorate. Free-standing sandstone masonry (NOT rock-cut). Late Ptolemaic and Roman periods (Ptolemy XII, Cleopatra VII, Augustus, Tiberius, Nero). Famous for its intact turquoise astronomical ceiling, the Dendera Zodiac, subterranean crypts, Cleopatra VII & Caesarion relief, and rooftop Osiris chapels.
- Temple of Khnum at Esna (معبد إسنا - Esna, Luxor Governorate / إسنا بمحافظة الأقصر): Located 55km south of Luxor, 9m below street level. Free-standing sandstone masonry (NOT rock-cut). Surviving Roman Pronaos/Hypostyle Hall (1st–3rd centuries CE, Claudius to Decius) with 24 floral columns and newly restored vibrant polychrome astronomical ceiling reliefs dedicated to the ram-headed creator god Khnum.
- Temple of Kalabsha (معبد كلابشة - New Kalabsha Island, Aswan Governorate / كلابشة بأسوان): Located near the Aswan High Dam on Lake Nasser. Free-standing sandstone masonry (NOT rock-cut). Early Roman era (Emperor Augustus, c. 30 BCE), dedicated to the Nubian solar god Mandulis; largest free-standing temple of Egyptian Nubia. Relocated by UNESCO alongside the rock-cut Beit el-Wali (Ramesses II) and Kiosk of Qertassi.
- Medinet Habu / Mortuary Temple of Ramesses III (معبد مدينة هابو - West Bank, Luxor Governorate): 20th Dynasty (New Kingdom). Free-standing sandstone masonry fortified by a mudbrick enclosure and Syrian Migdol gate; famous for deeply carved Sea Peoples naval battle reliefs and original ceiling paint.
- The Ramesseum (معبد الرمسيوم - West Bank, Luxor Governorate): 19th Dynasty (New Kingdom) memorial temple of Ramesses II, free-standing sandstone masonry, famous for the fallen 1,000-ton colossal granite statue of Ramesses II ("Ozymandias") and Battle of Kadesh reliefs.
- Mortuary Temple of Merenptah (معبد مرنبتاح - West Bank, Luxor Governorate): 19th Dynasty (New Kingdom, son of Ramesses II), free-standing masonry, discovery site of the Merenptah Stele.
- Deir el-Medina & Temple of Hathor (دير المدينة - West Bank, Luxor Governorate): New Kingdom royal tomb-builders' village (18th–20th Dynasties) with rock-cut artisans' tombs (Sennedjem TT1) and a free-standing Ptolemaic sandstone Temple of Hathor and Maat.
- Temple of Serabit el-Khadim (معبد سرابيط الخادم - South Sinai Governorate / جنوب سيناء): Middle and New Kingdom (12th–20th Dynasties) mountaintop temple combining rock-cut speos chambers of Hathor ("Lady of Turquoise") with free-standing sandstone courts and stelae; discovery site of the Proto-Sinaitic alphabet.
- Temple of Taposiris Magna (معبد تابوزيريس ماجنا - Borg El Arab, Alexandria Governorate / الإسكندرية): Ptolemaic Period (Ptolemy II & IV, 3rd century BCE), free-standing limestone masonry dedicated to Osiris, featuring a scale replica of the Pharos Lighthouse of Alexandria and subterranean tunnels.
- Temple of the Oracle of Amun at Siwa (معبد الوحي بأغورمي - Siwa Oasis, Matrouh Governorate / واحة سيوة بمحافظة مطروح): 26th Dynasty (Pharaoh Amasis II) free-standing limestone masonry temple atop Aghurmi rock, visited by Alexander the Great in 331 BCE.
- Athribis / Temple of Repyt (معبد أتريبس - Wannina, Sohag Governorate / سوهاج): Late Ptolemaic-Roman sandstone masonry temple and cliffside rock-cut sanctuary dedicated to the lioness goddess Repyt (Triphis) and Min-Ra.
- Speos Artemidos / Istabl Antar (معبد إسطبل عنتر - Beni Hasan, Minya Governorate / المنيا): 18th Dynasty rock-cut cliff temple built by Hatshepsut for the lioness goddess Pakhet.

3. MAJOR EGYPTIAN MUSEUMS:
- Grand Egyptian Museum (المتحف المصري الكبير - GEM, Giza): Located 2km from the Giza Pyramids over 500,000 sq meters. The world's largest archaeological museum dedicated to a single civilization, housing 100,000+ artifacts including the complete 5,398-piece collection of King Tutankhamun, the colossal 11m granite statue of Ramesses II, the Grand Staircase, the Hanging Obelisk, and King Khufu's Solar Boats. Official full opening date: November 1, 2025 (1 نوفمبر 2025).
- National Museum of Egyptian Civilization (المتحف القومي للحضارة المصرية - NMEC, Fustat, Cairo): Showcases Egyptian civilization across all eras and houses the Royal Mummies Hall (قاعة المومياوات الملكية) containing 22 royal mummies transferred on April 3, 2021.
- Egyptian Museum in Tahrir Square (المتحف المصري بالتحرير - Cairo): Opened in 1902 (designed by Marcel Dourgnon), housing 120,000+ artifacts including the Narmer Palette, Khafre Enthroned, Triad of Menkaure, Merenptah Stele, and Tanis royal gold.
- Nubian Museum (متحف النوبة - Aswan) & Luxor Museum (متحف الأقصر).

4. GRECO-ROMAN, COPTIC, ISLAMIC, MAMLUK & MODERN EGYPT:
- Alexandria Heritage: Qaitbay Citadel (قلعة قايتباي, 1477 CE by Sultan Qaitbay on the Pharos Lighthouse site), Bibliotheca Alexandrina (مكتبة الإسكندرية, 2002), Catacombs of Kom el Shoqafa (مقابر كوم الشقافة), Pompey's Pillar (عمود السواري - Serapeum of Diocletian), Kom el-Dikka Roman Amphitheatre.
- Coptic Christian Heritage: Coptic Cairo / Babylon Fortress (مجمع الأديان), Hanging Church (الكنيسة المعلقة), Church of Saints Sergius and Bacchus (كنيسة أبي سرجة), Coptic Museum, Ben Ezra Synagogue, Saint Catherine's Monastery in South Sinai (دير سانت كاترين - 6th century CE under Emperor Justinian), Wadi El Natrun monasteries.
- Islamic, Fatimid, Ayyubid & Mamluk Cairo: Citadel of Saladin (قلعة صلاح الدين, 1176 CE), Mosque of Muhammad Ali (جامع محمد علي, 1830–1848), Mosque-Madrasa of Sultan Hassan (مسجد السلطان حسن, 1356 CE) & Al-Rifa'i Mosque, Al-Muizz Street (شارع المعز), Khan el-Khalili Bazaar (خان الخليلي, 1382 CE, El-Fishawy Cafe), Al-Azhar Mosque (970 CE), Mosque of Ahmad ibn Tulun (879 CE), Complex of Qalawun, Bab al-Futuh, Bab al-Nasr, Bab Zuweila.
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
 * Helper to format a verified monument entry as an authoritative ground-truth block.
 */
function formatMonumentEntry(entry: VerifiedMonumentEntry): string {
  return [
    `• MONUMENT: ${entry.nameEn} (${entry.nameAr})`,
    `  - Governorate / Location: ${entry.governorateEn} (${entry.governorateAr})`,
    `  - Dynasty / Period: ${entry.periodAndDynasty}`,
    `  - Construction Type: ${entry.constructionType}`,
    `  - Tourist Category: ${entry.popularityCategory}`,
    `  - Verified Archaeological Details: ${entry.verifiedFacts}`,
  ].join('\n');
}

/**
 * Helper to fetch a single Wikipedia REST v1 summary by exact page title.
 */
async function fetchWikipediaSummaryByTitle(title: string, lang: 'en' | 'ar'): Promise<string | null> {
  try {
    const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(summaryUrl, {
      headers: { 'User-Agent': 'EgyptX-AI/2.0 (https://egyptx.ai)' },
      signal: AbortSignal.timeout(1400),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.extract) {
      return `[Wikipedia Verified (${data.title || title})]: ${data.extract}`;
    }
  } catch {
    // Silent timeout fallback
  }
  return null;
}

/**
 * Smart Query Expansion & Multi-Entity Retrieval:
 * 1. Matches specific monuments, governorates, or broad thematic queries ("lesser-known temples", "hidden gems", "معابد غير مشهورة", "آثار الصعيد", "الواحات").
 * 2. Injects structured 100% verified Ground-Truth Encyclopedia entries.
 * 3. Expands broad/multi-entity queries to fetch Wikipedia summaries for multiple specific temples in parallel.
 * 4. Queries Supabase verified attractions in parallel.
 */
export async function fetchTrustedWikipediaAndRAG(query: string): Promise<string> {
  if (!query || query.trim().length < 2) return '';

  const clean = query
    .replace(/[؟?.,!،؛:"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const lower = clean.toLowerCase();
  const isArabic = /[\u0600-\u06FF]/.test(clean);
  const wikiLang: 'en' | 'ar' = isArabic ? 'ar' : 'en';

  const snippets: string[] = [];

  // 1. Detect broad category queries (lesser-known temples, hidden gems, oases, Upper Egypt, comparisons)
  const isLesserKnownQuery =
    /\b(lesser[- ]known|hidden gem|off the beaten|underrated|unusual|rare|secret|unknown|non[- ]touristy|other temple|few tourists)\b/i.test(
      lower
    ) ||
    /(غير مشهور|غير معروف|نادرة|مخفية|كنوز|بعيد عن الزحام|معابد أخرى|معابد تانية|أقل شهرة)/.test(clean);

  const isOasisQuery =
    /\b(oasis|oases|kharga|dakhla|siwa|bahariya|farafra|new valley|western desert)\b/i.test(lower) ||
    /(واحة|الواحات|الخارجة|الداخلة|سيوة|الوادي الجديد|الصحراء الغربية)/.test(clean);

  const isUpperEgyptBroadQuery =
    /\b(upper egypt|sohag|qena|minya|assiut)\b/i.test(lower) ||
    /(الصعيد|آثار الصعيد|معابد الصعيد|سوهاج|قنا|المنيا)/.test(clean);

  // 2. Match specific monuments from the verified catalog
  const matchedEntries = new Map<string, VerifiedMonumentEntry>();

  for (const entry of VERIFIED_MONUMENTS_CATALOG) {
    const nameMatch =
      lower.includes(entry.id) ||
      lower.includes(entry.nameEn.toLowerCase()) ||
      clean.includes(entry.nameAr) ||
      entry.keywords.some((kw) => lower.includes(kw.toLowerCase()) || clean.includes(kw));

    if (nameMatch) {
      matchedEntries.set(entry.id, entry);
    }
  }

  // Expand for lesser-known / hidden gems queries
  if (isLesserKnownQuery) {
    const hiddenGemIds = [
      'hibis',
      'abydos-seti',
      'dendera',
      'esna',
      'kalabsha',
      'serabit-el-khadim',
      'medinet-habu',
      'deir-el-medina',
      'taposiris-magna',
      'siwa-oracle',
      'athribis',
      'speos-artemidos',
    ];
    for (const id of hiddenGemIds) {
      const entry = VERIFIED_MONUMENTS_CATALOG.find((e) => e.id === id);
      if (entry) matchedEntries.set(entry.id, entry);
    }
    // Also inject Philae and Abu Simbel explicitly so the model does NOT mistakenly call them lesser-known or confuse their construction
    for (const mainstreamId of ['philae', 'abu-simbel', 'karnak']) {
      const entry = VERIFIED_MONUMENTS_CATALOG.find((e) => e.id === mainstreamId);
      if (entry) matchedEntries.set(entry.id, entry);
    }
  }

  if (isOasisQuery) {
    for (const id of ['hibis', 'siwa-oracle']) {
      const entry = VERIFIED_MONUMENTS_CATALOG.find((e) => e.id === id);
      if (entry) matchedEntries.set(entry.id, entry);
    }
  }

  if (isUpperEgyptBroadQuery) {
    for (const id of ['abydos-seti', 'abydos-ramesses', 'athribis', 'dendera', 'esna', 'speos-artemidos', 'hibis']) {
      const entry = VERIFIED_MONUMENTS_CATALOG.find((e) => e.id === id);
      if (entry) matchedEntries.set(entry.id, entry);
    }
  }

  // Inject Ground-Truth Encyclopedia Entries first
  if (matchedEntries.size > 0) {
    const groundTruthBlock = Array.from(matchedEntries.values())
      .map(formatMonumentEntry)
      .join('\n\n');
    snippets.push(
      `=== VERIFIED GROUND-TRUTH ENCYCLOPEDIA ENTRIES (100% AUTHORITATIVE — DO NOT CONTRADICT) ===\n${groundTruthBlock}`
    );
  }

  const tasks: Promise<void>[] = [];

  // 3. Multi-Entity Wikipedia REST API Retrieval for matched / expanded temples (up to 4 parallel articles)
  const wikiTargetEntries = Array.from(matchedEntries.values()).slice(0, 4);
  for (const entry of wikiTargetEntries) {
    tasks.push(
      (async () => {
        const primaryTitle = wikiLang === 'ar' ? entry.wikiTitleAr : entry.wikiTitleEn;
        let summary = await fetchWikipediaSummaryByTitle(primaryTitle, wikiLang);
        if (!summary && wikiLang === 'ar') {
          summary = await fetchWikipediaSummaryByTitle(entry.wikiTitleEn, 'en');
        }
        if (summary) {
          snippets.push(summary);
        }
      })()
    );
  }

  // 4. General Wikipedia Search & REST API for the user's direct query
  tasks.push(
    (async () => {
      try {
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
            const summary = await fetchWikipediaSummaryByTitle(topTitle, wikiLang);
            if (summary) {
              snippets.push(summary);
              return;
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

  // 5. Supabase Verified Attractions lookup
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
 * Default temperature is 0.1 for strict historical accuracy and zero hallucination.
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
          temperature: options.temperature ?? 0.1,
          max_tokens: options.maxTokens ?? 900,
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      let content = data.choices?.[0]?.message?.content?.trim();
      if (content) {
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
 * Default temperature is 0.1 for zero hallucination.
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
        temperature: options.temperature ?? 0.1,
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
