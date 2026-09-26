const fs = require('fs');

const languages = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'];

// Data to add
const additions = {
  en: {
    "home.welcomeBack": "Welcome back,",
    "home.badge": "National Smart Tourism Ecosystem",
    "home.scroll": "Scroll to explore",
    "exploreDest": "Explore &rarr;",
    "destinations.giza.name": "Giza",
    "destinations.giza.tagline": "The Eternal Wonders",
    "destinations.giza.highlights": "Great Pyramids • Sphinx • Sound & Light",
    "destinations.giza.desc": "Home to the last surviving wonder of the ancient world, the Great Pyramid of Giza stands as humanity's greatest architectural achievement. The iconic Sphinx guards the plateau alongside three magnificent pyramids built for pharaohs Khufu, Khafre, and Menkaure. Experience the legendary Sound and Light Show that brings 4,500 years of history to life every evening.",
    "destinations.luxor.name": "Luxor",
    "destinations.luxor.tagline": "The World's Greatest Open-Air Museum",
    "destinations.luxor.highlights": "Valley of Kings • Karnak • Luxor Temple",
    "destinations.luxor.desc": "Luxor is the world's greatest open-air museum, built on the ruins of ancient Thebes, once the most powerful city on Earth. The Valley of the Kings holds 63 royal tombs including Tutankhamun's, while Karnak Temple complex remains the largest ancient religious site ever built. Every stone in Luxor tells a story of pharaohs, gods, and eternal life.",
    "destinations.aswan.name": "Aswan",
    "destinations.aswan.tagline": "Where the Nile Begins",
    "destinations.aswan.highlights": "Philae Temple • Nubian Villages • Felucca Rides",
    "destinations.aswan.desc": "Where the Nile meets Nubian culture, Aswan offers Egypt's most serene and colorful experience. The magnificent Philae Temple, dedicated to goddess Isis, sits on its own island in the Nile. Sail a traditional felucca past granite islands, visit authentic Nubian villages, and witness the engineering marvel of the High Dam that reshaped modern Egypt.",
    "destinations.siwa.name": "Siwa",
    "destinations.siwa.tagline": "The Desert Oasis",
    "destinations.siwa.highlights": "Oracle Temple • Salt Lakes • Stargazing",
    "destinations.siwa.desc": "Siwa Oasis is Egypt's most remote and magical destination, a hidden world of palm groves and salt lakes deep in the Western Desert. Alexander the Great made the legendary journey here to consult the Oracle of Amun and was declared son of a god. Today, Siwa offers crystal-clear springs, ancient ruins, and some of the world's best stargazing far from city lights.",
    "destinations.fayoum.name": "Fayoum",
    "destinations.fayoum.tagline": "Nature's Hidden Gem",
    "destinations.fayoum.highlights": "Wadi El Rayan • Whale Valley • Lake Qarun",
    "destinations.fayoum.desc": "Fayoum is Egypt's best-kept secret — a lush oasis of waterfalls, lakes, and prehistoric wonders just 100km from Cairo. The Wadi El-Hitan (Valley of the Whales) is a UNESCO World Heritage Site where 40-million-year-old whale fossils reveal the Sahara was once a tropical sea. Lake Qarun, one of Egypt's oldest natural lakes, draws migratory birds from three continents.",
    "destinations.hurghada.name": "Hurghada",
    "destinations.hurghada.tagline": "Red Sea Paradise",
    "destinations.hurghada.highlights": "Coral Reefs • Marine Life • Desert Safari",
    "destinations.hurghada.desc": "Hurghada transformed from a small fishing village into one of the world's top Red Sea resort destinations. Its crystal-clear waters hide some of the most spectacular coral reefs on the planet, home to over 1,000 species of marine life. Whether you dive, snorkel, or simply relax on pristine beaches, Hurghada offers Egypt's most vibrant coastal experience."
  },
  ar: {
    "home.welcomeBack": "مرحباً بعودتك،",
    "home.badge": "النظام الوطني الذكي للسياحة",
    "home.scroll": "قم بالتمرير للاستكشاف",
    "exploreDest": "استكشف &rarr;",
    "destinations.giza.name": "الجيزة",
    "destinations.giza.tagline": "العجائب الخالدة",
    "destinations.giza.highlights": "الأهرامات • أبو الهول • الصوت والضوء",
    "destinations.giza.desc": "موطن العجيبة الوحيدة الباقية من العالم القديم، الهرم الأكبر بالجيزة، والذي يمثل أعظم إنجاز معماري للبشرية.",
    "destinations.luxor.name": "الأقصر",
    "destinations.luxor.tagline": "أكبر متحف مفتوح في العالم",
    "destinations.luxor.highlights": "وادي الملوك • الكرنك • معبد الأقصر",
    "destinations.luxor.desc": "الأقصر هي أكبر متحف مفتوح في العالم، بنيت على أنقاض طيبة القديمة.",
    "destinations.aswan.name": "أسوان",
    "destinations.aswan.tagline": "حيث يبدأ النيل",
    "destinations.aswan.highlights": "معبد فيلة • القرى النوبية • الفلوكة",
    "destinations.aswan.desc": "تقدم أسوان تجربة مصرية هادئة وملونة حيث تلتقي الثقافة النوبية بالنيل.",
    "destinations.siwa.name": "سيوة",
    "destinations.siwa.tagline": "واحة الصحراء",
    "destinations.siwa.highlights": "معبد الوحي • البحيرات المالحة • مراقبة النجوم",
    "destinations.siwa.desc": "واحة سيوة هي الوجهة الأكثر عزلة وسحراً في مصر.",
    "destinations.fayoum.name": "الفيوم",
    "destinations.fayoum.tagline": "جوهرة الطبيعة المخفية",
    "destinations.fayoum.highlights": "وادي الريان • وادي الحيتان • بحيرة قارون",
    "destinations.fayoum.desc": "الفيوم هي سر مصر الدفين، واحة خصبة من الشلالات والبحيرات.",
    "destinations.hurghada.name": "الغردقة",
    "destinations.hurghada.tagline": "جنة البحر الأحمر",
    "destinations.hurghada.highlights": "الشعاب المرجانية • الحياة البحرية • سفاري",
    "destinations.hurghada.desc": "تحولت الغردقة إلى واحدة من أفضل وجهات البحر الأحمر في العالم."
  },
  fr: {
    "home.welcomeBack": "Bon retour,",
    "home.badge": "Écosystème National",
    "home.scroll": "Faites défiler",
    "exploreDest": "Explorer &rarr;",
    "destinations.giza.name": "Gizeh", "destinations.giza.tagline": "Les merveilles éternelles", "destinations.giza.highlights": "Pyramides • Sphinx", "destinations.giza.desc": "Abritant la dernière merveille...",
    "destinations.luxor.name": "Louxor", "destinations.luxor.tagline": "Musée à ciel ouvert", "destinations.luxor.highlights": "Vallée des Rois", "destinations.luxor.desc": "Louxor est le plus grand...",
    "destinations.aswan.name": "Assouan", "destinations.aswan.tagline": "Où le Nil commence", "destinations.aswan.highlights": "Temple de Philae", "destinations.aswan.desc": "Assouan offre l'expérience...",
    "destinations.siwa.name": "Siwa", "destinations.siwa.tagline": "L'Oasis du désert", "destinations.siwa.highlights": "Lacs salés", "destinations.siwa.desc": "L'oasis de Siwa est...",
    "destinations.fayoum.name": "Fayoum", "destinations.fayoum.tagline": "Joyau caché de la nature", "destinations.fayoum.highlights": "Vallée des Baleines", "destinations.fayoum.desc": "Fayoum est le secret...",
    "destinations.hurghada.name": "Hurghada", "destinations.hurghada.tagline": "Paradis de la mer Rouge", "destinations.hurghada.highlights": "Récifs coralliens", "destinations.hurghada.desc": "Hurghada s'est transformée..."
  },
  de: {
    "home.welcomeBack": "Willkommen zurück,",
    "home.badge": "Nationales Smart-Ökosystem",
    "home.scroll": "Scrollen zum Entdecken",
    "exploreDest": "Erkunden &rarr;",
    "destinations.giza.name": "Gizeh", "destinations.giza.tagline": "Die ewigen Wunder", "destinations.giza.highlights": "Pyramiden • Sphinx", "destinations.giza.desc": "Die große Pyramide...",
    "destinations.luxor.name": "Luxor", "destinations.luxor.tagline": "Größtes Freilichtmuseum", "destinations.luxor.highlights": "Tal der Könige", "destinations.luxor.desc": "Luxor ist das größte...",
    "destinations.aswan.name": "Assuan", "destinations.aswan.tagline": "Wo der Nil beginnt", "destinations.aswan.highlights": "Philae Tempel", "destinations.aswan.desc": "Assuan bietet...",
    "destinations.siwa.name": "Siwa", "destinations.siwa.tagline": "Die Wüstenoase", "destinations.siwa.highlights": "Salzseen", "destinations.siwa.desc": "Die Oase Siwa ist...",
    "destinations.fayoum.name": "Fayyum", "destinations.fayoum.tagline": "Verstecktes Juwel", "destinations.fayoum.highlights": "Tal der Wale", "destinations.fayoum.desc": "Fayyum ist...",
    "destinations.hurghada.name": "Hurghada", "destinations.hurghada.tagline": "Rotes Meer Paradies", "destinations.hurghada.highlights": "Korallenriffe", "destinations.hurghada.desc": "Hurghada wurde..."
  },
  it: {
    "home.welcomeBack": "Bentornato,", "home.badge": "Ecosistema Nazionale", "home.scroll": "Scorri per esplorare", "exploreDest": "Esplora &rarr;",
    "destinations.giza.name": "Giza", "destinations.giza.tagline": "Meraviglie", "destinations.giza.highlights": "Piramidi", "destinations.giza.desc": "Giza desc...",
    "destinations.luxor.name": "Luxor", "destinations.luxor.tagline": "Museo", "destinations.luxor.highlights": "Valle", "destinations.luxor.desc": "Luxor desc...",
    "destinations.aswan.name": "Assuan", "destinations.aswan.tagline": "Nilo", "destinations.aswan.highlights": "Philae", "destinations.aswan.desc": "Assuan desc...",
    "destinations.siwa.name": "Siwa", "destinations.siwa.tagline": "Oasi", "destinations.siwa.highlights": "Laghi", "destinations.siwa.desc": "Siwa desc...",
    "destinations.fayoum.name": "Fayoum", "destinations.fayoum.tagline": "Gemma", "destinations.fayoum.highlights": "Balene", "destinations.fayoum.desc": "Fayoum desc...",
    "destinations.hurghada.name": "Hurghada", "destinations.hurghada.tagline": "Paradiso", "destinations.hurghada.highlights": "Coralli", "destinations.hurghada.desc": "Hurghada desc..."
  },
  es: {
    "home.welcomeBack": "Bienvenido,", "home.badge": "Ecosistema Nacional", "home.scroll": "Desplázate para explorar", "exploreDest": "Explorar &rarr;",
    "destinations.giza.name": "Giza", "destinations.giza.tagline": "Maravillas", "destinations.giza.highlights": "Pirámides", "destinations.giza.desc": "Giza desc...",
    "destinations.luxor.name": "Luxor", "destinations.luxor.tagline": "Museo", "destinations.luxor.highlights": "Valle", "destinations.luxor.desc": "Luxor desc...",
    "destinations.aswan.name": "Asuán", "destinations.aswan.tagline": "Nilo", "destinations.aswan.highlights": "Philae", "destinations.aswan.desc": "Asuán desc...",
    "destinations.siwa.name": "Siwa", "destinations.siwa.tagline": "Oasis", "destinations.siwa.highlights": "Lagos", "destinations.siwa.desc": "Siwa desc...",
    "destinations.fayoum.name": "Fayún", "destinations.fayoum.tagline": "Joya", "destinations.fayoum.highlights": "Ballenas", "destinations.fayoum.desc": "Fayún desc...",
    "destinations.hurghada.name": "Hurghada", "destinations.hurghada.tagline": "Paraíso", "destinations.hurghada.highlights": "Corales", "destinations.hurghada.desc": "Hurghada desc..."
  },
  zh: {
    "home.welcomeBack": "欢迎,", "home.badge": "国家生态系统", "home.scroll": "向下滚动探索", "exploreDest": "探索 &rarr;",
    "destinations.giza.name": "吉萨", "destinations.giza.tagline": "奇迹", "destinations.giza.highlights": "金字塔", "destinations.giza.desc": "吉萨...",
    "destinations.luxor.name": "卢克索", "destinations.luxor.tagline": "博物馆", "destinations.luxor.highlights": "帝王谷", "destinations.luxor.desc": "卢克索...",
    "destinations.aswan.name": "阿斯旺", "destinations.aswan.tagline": "尼罗河", "destinations.aswan.highlights": "菲莱", "destinations.aswan.desc": "阿斯旺...",
    "destinations.siwa.name": "锡瓦", "destinations.siwa.tagline": "绿洲", "destinations.siwa.highlights": "盐湖", "destinations.siwa.desc": "锡瓦...",
    "destinations.fayoum.name": "法尤姆", "destinations.fayoum.tagline": "宝石", "destinations.fayoum.highlights": "鲸鱼谷", "destinations.fayoum.desc": "法尤姆...",
    "destinations.hurghada.name": "赫尔格达", "destinations.hurghada.tagline": "天堂", "destinations.hurghada.highlights": "珊瑚", "destinations.hurghada.desc": "赫尔格达..."
  },
  ru: {
    "home.welcomeBack": "Добро пожаловать,", "home.badge": "Национальная Экосистема", "home.scroll": "Прокрутите для изучения", "exploreDest": "Исследовать &rarr;",
    "destinations.giza.name": "Гиза", "destinations.giza.tagline": "Чудеса", "destinations.giza.highlights": "Пирамиды", "destinations.giza.desc": "Гиза...",
    "destinations.luxor.name": "Луксор", "destinations.luxor.tagline": "Музей", "destinations.luxor.highlights": "Долина", "destinations.luxor.desc": "Луксор...",
    "destinations.aswan.name": "Асуан", "destinations.aswan.tagline": "Нил", "destinations.aswan.highlights": "Филы", "destinations.aswan.desc": "Асуан...",
    "destinations.siwa.name": "Сива", "destinations.siwa.tagline": "Оазис", "destinations.siwa.highlights": "Озера", "destinations.siwa.desc": "Сива...",
    "destinations.fayoum.name": "Файюм", "destinations.fayoum.tagline": "Жемчужина", "destinations.fayoum.highlights": "Киты", "destinations.fayoum.desc": "Файюм...",
    "destinations.hurghada.name": "Хургада", "destinations.hurghada.tagline": "Рай", "destinations.hurghada.highlights": "Кораллы", "destinations.hurghada.desc": "Хургада..."
  }
};

for (const lang of languages) {
  const file = "messages/" + lang + ".json";
  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  
  // Merge keys dot notation
  for (const [key, val] of Object.entries(additions[lang])) {
    const parts = key.split('.');
    let cur = data;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] || {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

console.log('Added missing keys to all 8 language files.');
