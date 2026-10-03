export interface ArtifactItem {
  id: string;
  name: string;
  image: string;
  period: string;
  description: string;
}

export interface MonumentData {
  id: string | number;
  slug: string;
  title: string;
  titleAr: string;
  city: string;
  governorate: string;
  coordinates: string;
  era: string;
  patron: string;
  siteType: string;
  duration: string;
  visitors: string;
  description: string;
  historicalContext: string;
  videoSrc: string;
  vrPortalUrl: string;
  mapEmbedUrl: string;
  narrations: Record<string, string>;
  artifacts: ArtifactItem[];
}

export const MONUMENTS: Record<string, MonumentData> = {
  '1': {
    id: 1,
    slug: 'abu-simbel',
    title: 'Abu Simbel Temples',
    titleAr: 'معابد أبو سمبل',
    city: 'Aswan',
    governorate: 'Aswan Governorate',
    coordinates: '22.3372° N, 31.6258° E',
    era: 'New Kingdom · 19th Dynasty (c. 1264 BCE)',
    patron: 'Pharaoh Ramesses II & Queen Nefertari',
    siteType: 'Rock-Cut Hypostyle Sanctuary',
    duration: '35 - 45 Mins',
    visitors: '184,200+',
    description:
      'Carved directly into the sandstone cliffs of Nubia, the colossal temples of Abu Simbel commemorate the reign of Ramesses the Great and his beloved queen Nefertari. Relocated in a monumental 1968 UNESCO rescue mission, the complex features twice-yearly solar alignments that illuminate the sacred inner sanctum.',
    historicalContext:
      'The Great Temple was engineered so that on October 22 and February 22, the rays of the rising sun penetrate 65 meters into the mountain sanctuary, illuminating the statues of Amun, Ra-Horakhty, and Ramesses II, while leaving the underworld deity Ptah in perpetual darkness.',
    videoSrc: '/videos/vr1.mp4',
    vrPortalUrl:
      'https://www.google.com/maps/embed?pb=!4v1538055014192!6m8!1m7!1sCdK2TtrqrFuNrPbBhDPIoA!2m2!1d22.33726!2d31.62578!3f0!4f0!5f0.7820865974627469',
    mapEmbedUrl: 'https://maps.google.com/maps?q=22.33726,31.62578&hl=en&z=14&output=embed',
    narrations: {
      ar: 'مرحباً بك في معابد أبو سمبل العظيمة في أسوان. منحوتة في قلب الجبل بأمر من الملك رمسيس الثاني في القرن الثالث عشر قبل الميلاد، حيث تقف التماثيل الأربعة العملاقة بارتفاع عشرين متراً حارسةً على ضفاف بحيرة ناصر الخالدة.',
      en: 'Welcome to the magnificent Abu Simbel Temples in Aswan. Carved into solid mountain rock during the 13th century BCE by Pharaoh Ramesses II, these four colossal twenty-meter statues guard the sacred sanctuary along the timeless waters of Lake Nasser.',
      fr: 'Bienvenue aux majestueux temples d\'Abou Simbel à Assouan. Sculptés dans la falaise rocheuse au treizième siècle avant notre ère par le pharaon Ramsès II, ces colosses de vingt mètres veillent sur les rives mythiques du lac Nasser.',
      de: 'Willkommen bei den monumentalen Tempeln von Abu Simbel in Assuan. Im 13. Jahrhundert v. Chr. unter Pharao Ramses II. aus dem massiven Fels gehauen, bewachen die zwanzig Meter hohen Kolossalstatuen das heilige Heiligtum am Ufer des Nassersees.',
      es: 'Bienvenido a los majestuosos Templos de Abu Simbel en Asuán. Esculpidos en la roca viva en el siglo XIII a.C. por orden de Ramsés II, estas cuatro estatuas colosales de veinte metros custodian el santuario sagrado junto al lago Nasser.',
      it: 'Benvenuti ai maestosi Templi di Abu Simbel ad Assuan. Scolpiti nella roccia viva nel tredicesimo secolo a.C. per volere di Ramses II, questi colossi di venti metri custodiscono l\'antico santuario lungo le rive del Lago Nasser.',
    },
    artifacts: [
      {
        id: 'a1',
        name: 'The Four Colossi of Ramesses II',
        image: '/destinations/aswan.jpg',
        period: '1264 BCE',
        description: 'Towering 20-meter enthroned statues wearing the double Pschent crown of Upper and Lower Egypt.',
      },
      {
        id: 'a2',
        name: 'Temple of Hathor & Nefertari',
        image: '/destinations/luxor.jpg',
        period: '1255 BCE',
        description: 'Dedicated to Goddess Hathor and Queen Nefertari, uniquely sculpted at equal height with the king.',
      },
      {
        id: 'a3',
        name: 'The Solar Chamber Sanctuary',
        image: '/destinations/giza.jpg',
        period: '1264 BCE',
        description: 'Deep subterranean sanctuary aligned precisely with the equinoctial solar cycle.',
      },
      {
        id: 'a4',
        name: 'Battle of Kadesh Reliefs',
        image: '/destinations/cairo.jpg',
        period: '1274 BCE',
        description: 'Vividly carved epic military inscriptions depicting the chariot clash against the Hittites.',
      },
    ],
  },
  '2': {
    id: 2,
    slug: 'al-azhar-mosque',
    title: 'Al-Azhar Mosque',
    titleAr: 'الجامع الأزهر الشريف',
    city: 'Cairo',
    governorate: 'Cairo Governorate',
    coordinates: '30.0464° N, 31.2627° E',
    era: 'Fatimid Caliphate (Founded 970 AD)',
    patron: 'Jawhar al-Siqilli & Caliph Al-Mu\'izz',
    siteType: 'Historic Mosque & Islamic University',
    duration: '25 - 35 Mins',
    visitors: '240,500+',
    description:
      'Founded in 970 AD at the heart of medieval Cairo, Al-Azhar Mosque is both an architectural triumph of Fatimid stucco decoration and one of the world\'s oldest continuously operating universities.',
    historicalContext:
      'Expanded across Mamluk and Ottoman eras, its expansive white marble courtyard and five distinctive minarets represent over a millennium of Islamic architectural evolution.',
    videoSrc: '/videos/vr2.mp4',
    vrPortalUrl:
      'https://www.google.com/maps/embed?pb=!4v1538055014192!6m8!1m7!1sCdK2TtrqrFuNrPbBhDPIoA!2m2!1d30.04644!2d31.26274!3f180!4f0!5f0.7820865974627469',
    mapEmbedUrl: 'https://maps.google.com/maps?q=30.04644,31.26274&hl=en&z=14&output=embed',
    narrations: {
      ar: 'أهلاً بك في الجامع الأزهر الشريف، منارة الفكر الإسلامي وعمارة الفاطميين البديعة في قلب القاهرة المعز لدين الله منذ أكثر من ألف عام.',
      en: 'Welcome to the historic Al-Azhar Mosque, the luminous beacon of Islamic scholarship and Fatimid architectural splendor in the heart of historic Cairo.',
      fr: 'Bienvenue à la mosquée Al-Azhar, chef-d\'œuvre d\'architecture fatimide et l\'une des plus anciennes universités du monde au cœur du Caire historique.',
      de: 'Willkommen in der Al-Azhar-Moschee, einem Meisterwerk fatimidischer Architektur und einer der ältesten Universitäten der Welt im Herzen von Kairo.',
      es: 'Bienvenido a la Mezquita de Al-Azhar, obra maestra de la arquitectura fatimí y una de las universidades más antiguas del mundo en el corazón de El Cairo.',
      it: 'Benvenuti alla Moschea di Al-Azhar, gioiello dell\'architettura fatimide e una delle università più antiche del mondo nel cuore del Cairo.',
    },
    artifacts: [
      {
        id: 'b1',
        name: 'The Central Marble Sahn',
        image: '/destinations/cairo.jpg',
        period: '970 AD',
        description: 'Vast pristine courtyard lined with keel arches and intricate Fatimid stucco panels.',
      },
      {
        id: 'b2',
        name: 'Minaret of Qaitbay',
        image: '/destinations/alexandria.jpg',
        period: '1468 AD',
        description: 'Late Mamluk masterpiece featuring geometric stone carvings and carved muqarnas balconies.',
      },
      {
        id: 'b3',
        name: 'Al-Azhar Historic Library',
        image: '/destinations/minya.jpg',
        period: '1005 AD',
        description: 'Treasury housing over 100,000 rare ancient Islamic manuscripts and gilded Qurans.',
      },
      {
        id: 'b4',
        name: 'The Bab al-Muzayin (Barbers Gate)',
        image: '/destinations/fayoum.jpg',
        period: '1753 AD',
        description: 'Monumental double-arched entrance constructed during the Ottoman period.',
      },
    ],
  },
  '3': {
    id: 3,
    slug: 'al-azhar-park',
    title: 'Al-Azhar Park',
    titleAr: 'حديقة الأزهر',
    city: 'Cairo',
    governorate: 'Cairo Governorate',
    coordinates: '30.0407° N, 31.2651° E',
    era: 'Ayyubid Heritage & Modern Renaissance (2005)',
    patron: 'Aga Khan Historic Cities Programme',
    siteType: 'Botanical Islamic Hilltop Gardens',
    duration: '30 - 45 Mins',
    visitors: '310,000+',
    description:
      'Transformed from a 500-year-old debris mound into a world-renowned Islamic garden, Al-Azhar Park frames unforgettable panoramic views of Cairo\'s minarets and Saladin\'s Citadel while preserving the excavated 12th-century Ayyubid Wall.',
    historicalContext:
      'The project integrated extensive archaeological restoration, unearthing 1.5 km of Saladin\'s historic city fortifications complete with medieval gates, towers, and firing slits.',
    videoSrc: '/videos/vr3.mp4',
    vrPortalUrl:
      'https://www.google.com/maps/embed?pb=!4v1538055014192!6m8!1m7!1sCdK2TtrqrFuNrPbBhDPIoA!2m2!1d30.04066!2d31.26514!3f0!4f0!5f0.7820865974627469',
    mapEmbedUrl: 'https://maps.google.com/maps?q=30.04066,31.26514&hl=en&z=14&output=embed',
    narrations: {
      ar: 'استمتع بإطلالة بانورامية ساحرة على مآذن القاهرة التاريخية وقلعة صلاح الدين من قلب حدائق الأزهر الخضراء.',
      en: 'Enjoy a magical panoramic view of historic Cairo\'s legendary skyline and Saladin\'s Citadel from the tranquil gardens of Al-Azhar Park.',
      fr: 'Profitez d\'une vue panoramique exceptionnelle sur les minarets du Caire historique et la citadelle de Saladin depuis le parc Al-Azhar.',
      de: 'Genießen Sie den spektakulären Panoramablick auf die historische Skyline von Kairo und die Zitadelle von Saladin vom Al-Azhar-Park.',
      es: 'Disfruta de una vista panorámica mágica del horizonte histórico de El Cairo y la Ciudadela de Saladino desde el Parque Al-Azhar.',
      it: 'Goditi una magica vista panoramica sullo skyline storico del Cairo e sulla Cittadella di Saladino dal Parco di Al-Azhar.',
    },
    artifacts: [
      {
        id: 'c1',
        name: 'The 12th Century Ayyubid Wall',
        image: '/destinations/cairo.jpg',
        period: '1176 AD',
        description: 'Fortified stone defense wall constructed by Sultan Saladin to safeguard Cairo against crusades.',
      },
      {
        id: 'c2',
        name: 'Lakeside Sunken Pavilion',
        image: '/destinations/dahab.jpg',
        period: '2005 AD',
        description: 'Traditional Islamic stone-carved fountains and geometric irrigation cascades.',
      },
      {
        id: 'c3',
        name: 'Citadel Viewpoint Belvedere',
        image: '/destinations/giza.jpg',
        period: 'Historic Axis',
        description: 'Elevated terrace overlooking the Mosque of Muhammad Ali and Sultan Hassan.',
      },
      {
        id: 'c4',
        name: 'Bab al-Bahr Bastion',
        image: '/destinations/port-said.jpg',
        period: '1183 AD',
        description: 'Restored military defense tower featuring defensive arrow slits and archer chambers.',
      },
    ],
  },
  '4': {
    id: 4,
    slug: 'al-rifai-mosque',
    title: "Al-Rifa'i Mosque",
    titleAr: 'مسجد الرفاعي',
    city: 'Cairo',
    governorate: 'Cairo Governorate',
    coordinates: '30.0392° N, 31.2583° E',
    era: 'Muhammad Ali Dynasty (1869 - 1912 AD)',
    patron: 'Khushyar Hanim & Khedive Ismail',
    siteType: 'Royal Mausoleum & Grand Neo-Mamluk Mosque',
    duration: '25 - 40 Mins',
    visitors: '135,000+',
    description:
      'Standing majestically opposite the historic Mosque of Sultan Hassan, Al-Rifa\'i Mosque is a dazzling royal sanctuary adorned with imported Italian marble, gold-leaf ceilings, and the ornate tombs of Egypt\'s royal dynasty.',
    historicalContext:
      'Completed in 1912 by architect Max Herz Pasha, the mosque houses the royal tombs of Khedive Ismail, King Fuad I, and King Farouk, as well as the last Shah of Iran Mohammad Reza Pahlavi.',
    videoSrc: '/videos/vr4.mp4',
    vrPortalUrl:
      'https://www.google.com/maps/embed?pb=!4v1538055014192!6m8!1m7!1sCdK2TtrqrFuNrPbBhDPIoA!2m2!1d30.03918!2d31.25831!3f0!4f0!5f0.7820865974627469',
    mapEmbedUrl: 'https://maps.google.com/maps?q=30.03918,31.25831&hl=en&z=14&output=embed',
    narrations: {
      ar: 'مرحباً بك في مسجد الرفاعي الملكي بالقاهرة، تحفة العمارة المملوكية الحديثة والمثوى الأخير لملوك الأسرة العلوية الخالدة.',
      en: 'Welcome to the royal Al-Rifa\'i Mosque in Cairo, a breathtaking masterpiece of neo-Mamluk artistry and the final resting place of Egypt\'s royal dynasty.',
      fr: 'Bienvenue à la mosquée royale Al-Rifa\'i au Caire, chef-d\'œuvre du style néo-mamelouk et mausolée de la dynastie royale d\'Égypte.',
      de: 'Willkommen in der königlichen Al-Rifa\'i-Moschee in Kairo, einem Meisterwerk neo-mamlukischer Architektur und königlichem Mausoleum.',
      es: 'Bienvenido a la Mezquita de Al-Rifa\'i en El Cairo, una deslumbrante obra del arte neo-mameluco y mausoleo real de Egipto.',
      it: 'Benvenuti alla Moschea reale di Al-Rifa\'i al Cairo, splendido capolavoro neo-mamelucco e mausoleo della dinastia reale egiziana.',
    },
    artifacts: [
      {
        id: 'd1',
        name: 'The Royal Tomb of King Farouk',
        image: '/destinations/cairo.jpg',
        period: '1965 AD',
        description: 'Exquisitely carved Italian marble sarcophagus resting within the royal mausoleum nave.',
      },
      {
        id: 'd2',
        name: 'Gilded Stucco Ceilings',
        image: '/destinations/luxor.jpg',
        period: '1912 AD',
        description: 'Ornate geometric gold-leaf vaulting engineered with precision by architect Max Herz Pasha.',
      },
      {
        id: 'd3',
        name: 'Mausoleum of Ahmad al-Rifa\'i',
        image: '/destinations/aswan.jpg',
        period: '1869 AD',
        description: 'Intricately carved ebony and ivory mashrabiya screen surrounding the Sufi saint\'s tomb.',
      },
      {
        id: 'd4',
        name: 'Monumental 44-Meter Minarets',
        image: '/destinations/sohag.jpg',
        period: '1911 AD',
        description: 'Dual stone minarets mirrored harmoniously to dialogue with Sultan Hassan Mosque.',
      },
    ],
  },
  '5': {
    id: 5,
    slug: 'alexandria-library',
    title: 'Bibliotheca Alexandrina',
    titleAr: 'مكتبة الإسكندرية',
    city: 'Alexandria',
    governorate: 'Alexandria Governorate',
    coordinates: '31.2089° N, 29.9092° E',
    era: 'Modern Renaissance (Inaugurated 2002)',
    patron: 'Snohetta & UNESCO Global Partnership',
    siteType: 'International Cultural Center & Monumental Library',
    duration: '30 - 45 Mins',
    visitors: '410,000+',
    description:
      'Rising dramatically on the Mediterranean shore where the legendary ancient Library once stood, the Bibliotheca Alexandrina is a tilting sun disc of granite and glass hosting millions of volumes and digital heritage archives.',
    historicalContext:
      'The exterior granite wall is hand-carved with characters from 120 different human scripts, paying homage to the ancient world\'s greatest repository of universal human knowledge.',
    videoSrc: '/videos/vr5.mp4',
    vrPortalUrl:
      'https://www.google.com/maps/embed?pb=!4v1538055014192!6m8!1m7!1sCdK2TtrqrFuNrPbBhDPIoA!2m2!1d31.20889!2d29.90916!3f0!4f0!5f0.7820865974627469',
    mapEmbedUrl: 'https://maps.google.com/maps?q=31.20889,29.90916&hl=en&z=14&output=embed',
    narrations: {
      ar: 'مرحباً بك في مكتبة الإسكندرية الجديدة على ساحل البحر الأبيض المتوسط، إحياء عالمي لأعظم منارة معرفة في تاريخ الحضارة الإنسانية.',
      en: 'Welcome to the Bibliotheca Alexandrina on the Mediterranean coast, a global revival of the greatest beacon of knowledge in human history.',
      fr: 'Bienvenue à la Bibliotheca Alexandrina sur la Méditerranée, renaissance contemporaine du plus grand phare du savoir de l\'humanité.',
      de: 'Willkommen in der Bibliotheca Alexandrina am Mittelmeer, der modernen Wiedergeburt der berühmtesten Bibliothek der Menschheit.',
      es: 'Bienvenido a la Bibliotheca Alexandrina en la costa mediterránea, el renacimiento moderno del mayor faro del conocimiento de la historia.',
      it: 'Benvenuti alla Bibliotheca Alexandrina sul Mediterraneo, la rinascita contemporanea del più grande tempio della conoscenza umana.',
    },
    artifacts: [
      {
        id: 'e1',
        name: 'The 120-Script Granite Wall',
        image: '/destinations/alexandria.jpg',
        period: '2001 AD',
        description: 'Curving Aswan granite monolith carved with letters and hieroglyphs from every human tongue.',
      },
      {
        id: 'e2',
        name: 'Cascading Main Reading Room',
        image: '/destinations/marsa-matrouh.jpg',
        period: '2002 AD',
        description: 'Vast 7-tiered hypostyle reading arena sheltered beneath a soaring lotus-glass disc roof.',
      },
      {
        id: 'e3',
        name: 'Antiquities Museum Treasures',
        image: '/destinations/cairo.jpg',
        period: 'Hellenistic Era',
        description: 'Subterranean gallery displaying Greco-Roman statues salvaged from the submerged harbor.',
      },
      {
        id: 'e4',
        name: 'Manuscript Restoration Vaults',
        image: '/destinations/ismailia.jpg',
        period: 'Modern Preservation',
        description: 'Rare collection including early parchment fragments and the Codex Alexandrinus facsimile.',
      },
    ],
  },
  '6': {
    id: 6,
    slug: 'amr-ibn-al-as-mosque',
    title: 'Amr ibn al-As Mosque',
    titleAr: 'جامع عمرو بن العاص',
    city: 'Cairo',
    governorate: 'Cairo Governorate',
    coordinates: '30.0070° N, 31.2307° E',
    era: 'Early Islamic Era (Founded 642 AD / 21 AH)',
    patron: 'General Amr ibn al-As & Caliph Umar',
    siteType: 'Historic First Mosque in Africa',
    duration: '25 - 35 Mins',
    visitors: '190,000+',
    description:
      'Erected in 642 AD at the dawn of the historic capital Fustat, this revered site is the oldest mosque built on the African continent, serving as the nucleus of Islamic civilization in Egypt for over fourteen centuries.',
    historicalContext:
      'Though rebuilt and enlarged through multiple dynasties, the mosque maintains its solemn serenity, supported by hundreds of antique marble columns repurposed across classical antiquity.',
    videoSrc: '/videos/vr6.mp4',
    vrPortalUrl:
      'https://www.google.com/maps/embed?pb=!4v1538055014192!6m8!1m7!1sCdK2TtrqrFuNrPbBhDPIoA!2m2!1d30.00695!2d31.23069!3f0!4f0!5f0.7820865974627469',
    mapEmbedUrl: 'https://maps.google.com/maps?q=30.00695,31.23069&hl=en&z=14&output=embed',
    narrations: {
      ar: 'أهلاً بك في جامع عمرو بن العاص بالفسطاط، تاج الجوامع وأول مسجد أُسس في مصر وقارة إفريقيا عام 642 ميلادياً.',
      en: 'Welcome to the Mosque of Amr ibn al-As in Fustat, the historic crown of mosques and the very first Islamic sanctuary established in Africa in 642 AD.',
      fr: 'Bienvenue à la mosquée Amr ibn al-As à Fostat, la toute première mosquée bâtie sur le continent africain en l\'an 642.',
      de: 'Willkommen in der Amr-ibn-al-As-Moschee in Fustat, der allerersten Moschee, die im Jahr 642 n. Chr. auf dem afrikanischen Kontinent erbaut wurde.',
      es: 'Bienvenido a la Mezquita de Amr ibn al-As en Fustat, la primera mezquita erigida en África en el año 642 d.C.',
      it: 'Benvenuti alla Moschea di Amr ibn al-As a Fustat, la prima moschea costruita nel continente africano nel 642 d.C.',
    },
    artifacts: [
      {
        id: 'f1',
        name: 'The Antique Marble Hypostyle Forest',
        image: '/destinations/cairo.jpg',
        period: 'Multiple Eras',
        description: 'Vast prayer hall supported by over 200 salvaged classical Roman and Byzantine marble columns.',
      },
      {
        id: 'f2',
        name: 'Carved Wood Stalactite Mihrab',
        image: '/destinations/fayoum.jpg',
        period: 'Fatimid / Mamluk',
        description: 'Sacred prayer niche featuring deep geometric wood inlays and gilded Kufic inscriptions.',
      },
      {
        id: 'f3',
        name: 'The Sacred Water Well of Fustat',
        image: '/destinations/minya.jpg',
        period: '642 AD',
        description: 'Original ablution spring used by the early founding companions during the construction of Fustat.',
      },
      {
        id: 'f4',
        name: 'Crowned Corner Minarets',
        image: '/destinations/suez.jpg',
        period: 'Mamluk Era',
        description: 'Distinctive open-arched minaret towers overlooking the ancient pottery quarters of Old Cairo.',
      },
    ],
  },
};

export function getMonumentById(param: string | number): MonumentData {
  const p = String(param || '1').toLowerCase().trim();
  if (MONUMENTS[p]) return MONUMENTS[p];

  const bySlug = Object.values(MONUMENTS).find(
    (m) => m.slug === p || m.title.toLowerCase().replace(/\s+/g, '-').includes(p)
  );
  if (bySlug) return bySlug;

  return MONUMENTS['1'];
}
