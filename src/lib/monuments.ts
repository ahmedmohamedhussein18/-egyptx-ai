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
  videoUrl?: string;
  previewVideo?: string;
  src?: string;
  vrPortalUrl: string;
  matterportUrl?: string;
  isMatterport?: boolean;
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
    vrPortalUrl: 'https://my.matterport.com/show/?m=VxYAEMXh6dW',
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
    slug: 'islamic-art-museum',
    title: 'Museum of Islamic Art',
    titleAr: 'متحف الفن الإسلامي',
    city: 'Cairo',
    governorate: 'Cairo Governorate',
    coordinates: '30.0464° N, 31.2627° E',
    era: 'Historic Cairo (Founded 1881 AD)',
    patron: 'Khedive Tawfiq & Ministry of Antiquities',
    siteType: 'Museum of Islamic Heritage & Artifacts',
    duration: '35 - 50 Mins',
    visitors: '240,500+',
    description:
      'The Museum of Islamic Art in Cairo houses one of the world\'s greatest collections of Islamic artifacts, featuring exceptional woodwork, ceramics, textiles, and rare manuscripts from across the Islamic world.',
    historicalContext:
      'Home to over 100,000 priceless artifacts from various Islamic eras, it represents the highest artistic achievements of Islamic civilization.',
    videoSrc: '/videos/islamic_art_museum.mp4',
    videoUrl: '/videos/islamic_art_museum.mp4',
    previewVideo: '/videos/islamic_art_museum.mp4',
    src: '/videos/islamic_art_museum.mp4',
    vrPortalUrl: 'https://my.matterport.com/show/?m=GLcinPBnEet',
    mapEmbedUrl: 'https://maps.google.com/maps?q=30.04644,31.26274&hl=en&z=14&output=embed',
    narrations: {
      ar: 'أهلاً بك في متحف الفن الإسلامي بالقاهرة، أكبر متحف إسلامي في العالم يضم أكثر من مائة ألف تحفة أثرية وفنية نادرة من مختلف العصور الإسلامية من الأندلس وحتى الهند.',
      en: 'Welcome to the Museum of Islamic Art in Cairo, the largest Islamic art museum in the world, showcasing over one hundred thousand rare masterpieces spanning from Andalusia to India.',
      fr: 'Bienvenue au Musée d\'art islamique du Caire, le plus grand musée d\'art islamique au monde, abritant plus de cent mille chefs-d\'œuvre inestimables de la civilisation islamique.',
      de: 'Willkommen im Museum für Islamische Kunst in Kairo, dem weltweit größten Museum für islamische Kunst mit über einhunderttausend seltenen Meisterwerken.',
      es: 'Bienvenido al Museo de Arte Islámico de El Cairo, el mayor museo de arte islámico del mundo con más de cien mil obras maestras excepcionales.',
      it: 'Benvenuti al Museo d\'Arte Islamica del Cairo, il più grande museo di arte islamica al mondo con oltre centomila capolavori inestimabili.',
    },
    artifacts: [
      {
        id: 'b1',
        name: 'Mamluk Enamelled Glass Mosque Lamp',
        image: '/destinations/cairo.jpg',
        period: '14th Century Mamluk',
        description: 'Splendid gilded and polychrome enamelled glass mosque lamp commissioned by Sultan Hasan.',
      },
      {
        id: 'b2',
        name: 'Carved Wood Key of the Holy Kaaba',
        image: '/destinations/alexandria.jpg',
        period: '1363 AD (Mamluk)',
        description: 'Historic ceremonial carved bronze and gold-inlaid key to the Kaaba inscribed in the name of Sultan Shaaban.',
      },
      {
        id: 'b3',
        name: 'Pristine Fatimid Rock Crystal Ewer',
        image: '/destinations/minya.jpg',
        period: '10th Century Fatimid',
        description: 'Extraordinary carved rock crystal vessel exemplifying the zenith of Fatimid royal luxury craftsmanship.',
      },
      {
        id: 'b4',
        name: 'Umayyad Inscribed Bronze Ewer of Marwan II',
        image: '/destinations/fayoum.jpg',
        period: '750 AD (Umayyad)',
        description: 'Historic cast bronze zoomorphic ewer discovered in Fayoum, belonging to the last Umayyad Caliph.',
      },
    ],
  },
  '3': {
    id: 3,
    slug: 'coptic-museum',
    title: 'The Coptic Museum',
    titleAr: 'المتحف القبطي',
    city: 'Cairo',
    governorate: 'Cairo Governorate',
    coordinates: '29.9869° N, 31.2312° E',
    era: 'Coptic Heritage & Antiquities (Founded 1908)',
    patron: 'Marcus Simaika Pasha & Ministry of Antiquities',
    siteType: 'Ecclesiastical & Historic Museum',
    duration: '30 - 45 Mins',
    visitors: '310,000+',
    description:
      'Located within the ancient Roman fortress of Babylon in Old Cairo, the Coptic Museum holds the largest collection of Egyptian Christian artifacts in the world, spanning a rich cultural tapestry of textiles, frescoes, and woodwork.',
    historicalContext:
      'Founded in 1908 by Marcus Simaika Pasha with the support of the Coptic Church, the museum preserves the bridge between ancient Pharaonic culture and the Islamic era.',
    videoSrc: '/videos/coptic_museum.mp4',
    videoUrl: '/videos/coptic_museum.mp4',
    previewVideo: '/videos/coptic_museum.mp4',
    src: '/videos/coptic_museum.mp4',
    matterportUrl: 'https://my.matterport.com/show/?m=yMMHWqMJZbY',
    isMatterport: true,
    vrPortalUrl: 'https://my.matterport.com/show/?m=yMMHWqMJZbY',
    mapEmbedUrl: 'https://maps.google.com/maps?q=29.9869,31.2312&hl=en&z=14&output=embed',
    narrations: {
      ar: 'أهلاً بك في المتحف القبطي بمصر القديمة، أكبر متحف للآثار والفنون القبطية في العالم، حيث تلتقي الحضارة الفرعونية بالإغريقية والرومانية والإسلامية في نسيج تراثي فريد يروي تاريخ المسيحية في مصر.',
      en: 'Welcome to The Coptic Museum in Old Cairo, holding the largest collection of Coptic Christian artifacts in the world, beautifully bridging ancient Pharaonic, Greco-Roman, and Islamic traditions.',
      fr: 'Bienvenue au Musée Copte du Vieux-Caire, qui abrite la plus riche collection d\'art et d\'antiquités coptes au monde, témoignant de l\'héritage chrétien d\'Égypte.',
      de: 'Willkommen im Koptischen Museum in Alt-Kairo, der weltweit bedeutendsten Sammlung koptisch-christlicher Kunst und historischer Zeugnisse.',
      es: 'Bienvenido al Museo Copto en el Viejo El Cairo, que alberga la mayor colección de arte cristiano copto del mundo, reflejo del rico patrimonio de Egipto.',
      it: 'Benvenuti al Museo Copto nel Cairo Vecchia, la più importante collezione al mondo di arte e reperti cristiani copti.',
    },
    artifacts: [
      {
        id: 'c1',
        name: 'Nag Hammadi Gnostic Codices',
        image: '/destinations/cairo.jpg',
        period: '3rd - 4th Century AD',
        description: 'Priceless primary papyrus codices bound in leather, preserving early Christian Gnostic and mystical theological writings.',
      },
      {
        id: 'c2',
        name: 'Bawit Monastery Christ in Majesty Fresco',
        image: '/destinations/minya.jpg',
        period: '6th - 7th Century AD',
        description: 'Vivid monastic niche tempera painting depicting Christ seated in glory surrounded by the Archangels and Apostles from the monastery of Apollo.',
      },
      {
        id: 'c3',
        name: 'Intricately Carved Cedar Iconostasis of St. Barbara',
        image: '/destinations/giza.jpg',
        period: '10th - 11th Century AD (Fatimid Coptic)',
        description: 'Finely carved cedar wood sanctuary screen panels decorated with geometric entrelac and scenes of the life of Christ.',
      },
      {
        id: 'c4',
        name: 'Illuminated Bilingual Coptic-Arabic Gospels',
        image: '/destinations/alexandria.jpg',
        period: '12th - 13th Century AD',
        description: 'Exquisitely calligraphed and gilded vellum manuscript showing parallel columns in Bohairic Coptic and Arabic.',
      },
    ],
  },
  '4': {
    id: 4,
    slug: 'gayer-anderson-museum',
    title: 'Gayer-Anderson Museum',
    titleAr: 'متحف جاير أندرسون (بيت الكريتلية)',
    city: 'Cairo',
    governorate: 'Cairo Governorate',
    coordinates: '30.0287° N, 31.2497° E',
    era: 'Ottoman & Mamluk Domestic Heritage (1631 - 1942 AD)',
    patron: 'Major R.G. Gayer-Anderson Pasha',
    siteType: 'Historic Domestic Architecture & Antiquities Museum',
    duration: '25 - 40 Mins',
    visitors: '135,000+',
    description:
      'Located next to the Mosque of Ibn Tulun in historic Cairo, this magnificently preserved domestic complex consists of two historic Ottoman-era houses, filled with remarkable art, furniture, and antiquities collected by Major R.G. Gayer-Anderson Pasha.',
    historicalContext:
      'Composed of two 17th-century houses (Bayt al-Kritliyya and Bayt Amna bint Salim), the complex features breathtaking mashrabiya lattice screens, marble fountains, and an eclectic collection of oriental art.',
    videoSrc: '/videos/gayer_anderson.mp4',
    videoUrl: '/videos/gayer_anderson.mp4',
    previewVideo: '/videos/gayer_anderson.mp4',
    src: '/videos/gayer_anderson.mp4',
    matterportUrl: 'https://my.matterport.com/show/?m=vrWe4j1FC65',
    isMatterport: true,
    vrPortalUrl: 'https://my.matterport.com/show/?m=vrWe4j1FC65',
    mapEmbedUrl: 'https://maps.google.com/maps?q=30.0287,31.2497&hl=en&z=14&output=embed',
    narrations: {
      ar: 'أهلاً بك في متحف جاير أندرسون التاريخي (بيت الكريتلية) بالقاهرة، أحد أروع نماذج العمارة السكنية الإسلامية في العصرين العثماني والمملوكي، حيث يمتزج عبق التاريخ وسحر ألف ليلة وليلة بمجموعات المستشرق الإنجليزي النادرة بجوار جامع أحمد بن طولون.',
      en: 'Welcome to the historic Gayer-Anderson Museum (Bayt al-Kretliya) in Cairo, one of the finest surviving examples of 17th-century Ottoman and Mamluk domestic architecture, renowned for its intricate mashrabiya woodwork, marble courtyards, and legendary orientalist antiquities adjoining Ibn Tulun Mosque.',
      fr: 'Bienvenue au musée Gayer-Anderson (Bayt al-Kretliya) au Caire, chef-d\'œuvre exceptionnel de l\'architecture domestique ottomane et mamelouke du XVIIe siècle, abritant de sublimes moucharabiehs et de fascinantes collections orientales.',
      de: 'Willkommen im Gayer-Anderson-Museum (Bayt al-Kretliya) in Kairo, einem herausragenden Juwel osmanischer und mamlukischer Wohnarchitektur des 17. Jahrhunderts mit prächtigen Maschrabiyya-Gittern und exotischen Kunstsammlungen.',
      es: 'Bienvenido al Museo Gayer-Anderson (Bayt al-Kretliya) en El Cairo, una joya incomparable de la arquitectura residencial otomana y mameluca del siglo XVII, famosa por sus celosías de mashrabiya y raras antigüedades orientales.',
      it: 'Benvenuti al Museo Gayer-Anderson (Bayt al-Kretliya) al Cairo, straordinario capolavoro dell\'architettura residenziale ottomana e mamelucca del XVII secolo, celebre per le sue raffinate gelosie mashrabiya e preziose collezioni.',
    },
    artifacts: [
      {
        id: 'd1',
        name: 'Bayt al-Kretliya Grand Mashrabiya Balcony',
        image: '/destinations/cairo.jpg',
        period: '1631 AD (Ottoman Era)',
        description: 'Intricately turned wooden lattice screen balcony overlooking the open courtyard, providing ventilation, privacy, and cooling breezes.',
      },
      {
        id: 'd2',
        name: 'Damascene Gilded Reception Hall (Qa\'a)',
        image: '/destinations/luxor.jpg',
        period: '17th - 18th Century AD',
        description: 'Spectacular reception hall adorned with polychrome gilded wooden ceilings, inset marble fountains, and Turkish ceramic tiles.',
      },
      {
        id: 'd3',
        name: 'Major Gayer-Anderson\'s Ancient Bronze Bastet',
        image: '/destinations/aswan.jpg',
        period: 'Late Period (c. 600 BCE)',
        description: 'Iconic bronze statuette of the cat-goddess Bastet wearing gold earrings, treasured centerpiece of the physician\'s collection.',
      },
      {
        id: 'd4',
        name: 'The Enchanted Well & Rooftop Harem Terrace',
        image: '/destinations/sohag.jpg',
        period: '1540 - 1631 AD',
        description: 'Historic cistern well steeped in local Cairo folklore, surrounded by covered rooftop walkways overlooking the minaret of Ibn Tulun.',
      },
    ],
  },
  '5': {
    id: 5,
    slug: 'niankhkhnum-tomb',
    title: 'Niankhkhnum & Khnumhotep Tomb',
    titleAr: 'مقبرة ني عنخ خنوم وخنوم حتب',
    city: 'Saqqara',
    governorate: 'Giza Governorate',
    coordinates: '29.8711° N, 31.2165° E',
    era: 'Old Kingdom, 5th Dynasty (c. 2400 BCE)',
    patron: 'King Nyuserre Ini & Royal Overseers',
    siteType: 'Ancient Egyptian Mastaba Tomb & Necropolis',
    duration: '30 - 45 Mins',
    visitors: '410,000+',
    description:
      'Known as the "Tomb of the Two Brothers", this exceptional Old Kingdom mastaba at Saqqara belongs to Niankhkhnum and Khnumhotep, royal manicurists and priests of the sun temple of Nyuserre. It features exceptionally detailed, vivid reliefs of daily life, banquets, and rituals.',
    historicalContext:
      'Discovered in 1964 by Ahmed Moussa, the tomb is famous for its remarkably preserved vivid polychrome reliefs depicting intimate scenes of camaraderie, hunting in the marshes, and lavish funerary rites.',
    videoSrc: '/videos/niankhkhnum_tomb.mp4',
    videoUrl: '/videos/niankhkhnum_tomb.mp4',
    previewVideo: '/videos/niankhkhnum_tomb.mp4',
    src: '/videos/niankhkhnum_tomb.mp4',
    matterportUrl: 'https://my.matterport.com/show/?m=CwRgpfTMpbx',
    isMatterport: true,
    vrPortalUrl: 'https://my.matterport.com/show/?m=CwRgpfTMpbx',
    mapEmbedUrl: 'https://maps.google.com/maps?q=29.8711,31.2165&hl=en&z=14&output=embed',
    narrations: {
      ar: 'أهلاً بك في مقبرة ني عنخ خنوم وخنوم حتب بسقارة، الشهيرة بمقبرة "الأخوين"، إحدى أروع مقابر الدولة القديمة المكتشفة عام 1964، والتي تتميز بنقوش جدارية ملونة استثنائية تسجل تفاصيل الحياة اليومية، الصيد، الموسيقى، والطقوس الجنائزية في عصر الملك ني أوسر رع.',
      en: 'Welcome to the double mastaba of Niankhkhnum and Khnumhotep in Saqqara, famously known as the "Tomb of the Two Brothers". Discovered in 1964, this 5th Dynasty masterpiece boasts remarkably preserved, vivid polychrome reliefs depicting daily life, marshland hunting, music, and royal funerary ceremonies under King Nyuserre.',
      fr: 'Bienvenue dans la double mastaba de Niankhkhnum et Khnumhotep à Saqqarah, dite "Tombe des Deux Frères", chef-d\'œuvre de la Ve dynastie réputé pour ses fresques polychromes éclatantes illustrant la vie quotidienne et les rituels funéraires.',
      de: 'Willkommen in der Doppel-Mastaba von Niankhkhnum und Khnumhotep in Sakkara, bekannt als das "Grab der zwei Brüder". Dieses Meisterwerk der 5. Dynastie fasziniert mit lebendigen polychromen Reliefs des täglichen Lebens und königlichen Ritualen.',
      es: 'Bienvenido a la doble mastaba de Niankhkhnum y Khnumhotep en Saqqara, conocida como la "Tumba de los Dos Hermanos", joya de la V Dinastía célebre por sus vívidos relieves polícromos de la vida cotidiana y ceremonias sagradas.',
      it: 'Benvenuti nella doppia mastaba di Niankhkhnum e Khnumhotep a Saqqara, detta "Tomba dei Due Fratelli", capolavoro della V Dinastia celebre per gli straordinari rilievi policromi che ritraggono vita quotidiana e cerimonie religiose.',
    },
    artifacts: [
      {
        id: 'e1',
        name: 'The Iconic Nose-Touching Embrace Relief',
        image: '/destinations/cairo.jpg',
        period: 'c. 2400 BCE (5th Dynasty)',
        description: 'Famous intimate polychrome limestone relief depicting Niankhkhnum and Khnumhotep touching noses in mutual affection and brotherhood.',
      },
      {
        id: 'e2',
        name: 'Marshland Fishing & Fowling Murals',
        image: '/destinations/fayoum.jpg',
        period: 'c. 2400 BCE (Old Kingdom)',
        description: 'Vividly painted scenes of hunting in papyrus thickets, teeming with detailed depictions of kingfishers, frogs, and Nile tilapia.',
      },
      {
        id: 'e3',
        name: 'Royal Manicurists & Barbering Registry',
        image: '/destinations/giza.jpg',
        period: '5th Dynasty, Reign of Nyuserre',
        description: 'Hieroglyphic inscriptions and carved registers detailing their high royal titles as Overseers of Manicurists at the Royal Palace.',
      },
      {
        id: 'e4',
        name: 'Banqueting Musicians & Offering Procession',
        image: '/destinations/luxor.jpg',
        period: 'c. 2400 BCE (Old Kingdom)',
        description: 'Vibrant wall reliefs showing harpists, clappers, and dancing girls performing alongside laden tables of bread, roast fowl, and beer.',
      },
    ],
  },
  '6': {
    id: 6,
    slug: 'wahty-tomb',
    title: 'Wahty Tomb',
    titleAr: 'مقبرة واح تي',
    city: 'Saqqara',
    governorate: 'Giza Governorate',
    coordinates: '29.8715° N, 31.2170° E',
    era: 'Old Kingdom, 5th Dynasty (c. 2400 BCE)',
    patron: 'Wahty & King Neferirkare Kakai',
    siteType: 'Ancient Egyptian Rock-Cut Tomb',
    duration: '25 - 35 Mins',
    visitors: '190,000+',
    description:
      'Discovered virtually untouched in 2018 at Saqqara, this remarkably preserved 4,400-year-old rock-cut tomb belonged to Wahty, a high-ranking royal purification priest from the Fifth Dynasty of Egypt.',
    historicalContext:
      'The tomb contains fifty-five beautifully carved statues of Wahty and his family, along with vividly colored wall reliefs depicting scenes of brewing, pottery, musical performances, and sailing.',
    videoSrc: '/videos/wahty_tomb.mp4',
    videoUrl: '/videos/wahty_tomb.mp4',
    previewVideo: '/videos/wahty_tomb.mp4',
    src: '/videos/wahty_tomb.mp4',
    matterportUrl: 'https://my.matterport.com/show/?m=BsXpwTSYSyN',
    isMatterport: true,
    vrPortalUrl: 'https://my.matterport.com/show/?m=BsXpwTSYSyN',
    mapEmbedUrl: 'https://maps.google.com/maps?q=29.8715,31.2170&hl=en&z=14&output=embed',
    narrations: {
      ar: 'أهلاً بك في مقبرة واح تي الاستثنائية بسقارة، أحد أعظم الاكتشافات الأثرية في القرن الحادي والعشرين. مقبرة كاملة لكاهن التطهير الملكي من الأسرة الخامسة لم تمسها يد منذ 4400 عام، وتضم 55 تمثالاً صخرياً ملوناً ونقوشاً جدارية مفعمة بألوانها الأصلية الزاهية التي تخلد تفاصيل الحياة المصرية القديمة.',
      en: 'Welcome to the extraordinary rock-cut tomb of Wahty in Saqqara, hailed as one of the most stunning archaeological discoveries of the 21st century. Undisturbed for 4,400 years, this Fifth Dynasty royal purification priest\'s tomb features 55 vivid rock-cut statues and pristine polychrome reliefs showcasing daily Egyptian life, sacred rituals, and family devotion.',
      fr: 'Bienvenue dans l\'extraordinaire tombeau rupestre de Wahty à Saqqarah, découverte majeure du XXIe siècle. Inviolé depuis 4 400 ans, ce sanctuaire de la Ve dynastie abrite 55 statues taillées dans la roche et de somptueux reliefs polychromes intacts.',
      de: 'Willkommen im außergewöhnlichen Felsengrab von Wahty in Sakkara, einer der spektakulärsten Entdeckungen des 21. Jahrhunderts. 4.400 Jahre unberührt, birgt dieses Grab der 5. Dynastie 55 farbenprächtige Felsstatuen und lebendige Wandreliefs.',
      es: 'Bienvenido a la extraordinaria tumba excavada en la roca de Wahty en Saqqara, uno de los descubrimientos más asombrosos del siglo XXI. Intacta durante 4.400 años, esta joya de la V Dinastía alberga 55 estatuas esculpidas y deslumbrantes relieves policromados.',
      it: 'Benvenuti nella straordinaria tomba rupestre di Wahty a Saqqara, una delle scoperte archeologiche più importanti del XXI secolo. Rimasta intatta per 4.400 anni, la tomba della V Dinastia custodisce 55 statue scolpite e magnifici rilievi policromi originali.',
    },
    artifacts: [
      {
        id: 'f1',
        name: 'Rock-Cut Painted Statues of Wahty',
        image: '/destinations/cairo.jpg',
        period: 'c. 2400 BCE (5th Dynasty)',
        description: 'Life-sized rock-cut statues carved directly into the tomb wall, preserving vivid ochre, white, and black pigments depicting the royal purification priest.',
      },
      {
        id: 'f2',
        name: 'Polychrome Brewing & Pottery Craft Murals',
        image: '/destinations/fayoum.jpg',
        period: 'c. 2400 BCE (Old Kingdom)',
        description: 'Vivid painted registers illustrating ancient Egyptian craftsmen shaping ceramic vessels on wheels, baking bread, and fermenting beer.',
      },
      {
        id: 'f3',
        name: 'Wahty with Mother Meritmin & Wife Weretptah',
        image: '/destinations/minya.jpg',
        period: 'c. 2400 BCE (5th Dynasty)',
        description: 'Intimate family niche reliefs honoring Wahty\'s beloved mother Meritmin and wife Weretptah, Priestess of Hathor.',
      },
      {
        id: 'f4',
        name: 'Hieroglyphic Sacred Ritual & Sailing Registers',
        image: '/destinations/suez.jpg',
        period: 'Reign of King Neferirkare',
        description: 'Exquisitely preserved polychrome relief of sacred funerary barques navigating the Nile with detailed hieroglyphic religious formulas.',
      },
    ],
  },
};

export function getMonumentById(param: string | number): MonumentData {
  const p = String(param || '1').toLowerCase().trim();
  if (MONUMENTS[p]) return MONUMENTS[p];

  if (p === 'islamic-art-museum' || p === 'islamic_art_museum' || p.includes('islamic')) return MONUMENTS['2'];
  if (p === 'coptic-museum' || p.includes('coptic')) return MONUMENTS['3'];
  if (p === 'gayer-anderson-museum' || p.includes('gayer')) return MONUMENTS['4'];
  if (p === 'niankhkhnum-tomb' || p.includes('niankhkhnum')) return MONUMENTS['5'];
  if (p === 'wahty-tomb' || p.includes('wahty')) return MONUMENTS['6'];

  const bySlug = Object.values(MONUMENTS).find(
    (m) => m.slug === p || m.title.toLowerCase().replace(/\s+/g, '-').includes(p)
  );
  if (bySlug) return bySlug;

  return MONUMENTS['1'];
}
