const fs = require('fs');

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

const translations = {
  en: {
    cta: {
      title: "Experience Egypt, Intelligently.",
      subtitle: "Let AI guide your journey through 5,000 years of civilization",
      btn: "Plan My Journey",
      poweredBy: "Powered by Egyptian Intelligence"
    },
    explore: {
      title: "Explore Egypt",
      subtitle: "Discover verified historical sites, hidden gems, and natural wonders.",
      exploreDetails: "Explore Details",
      cat: { all: "All", ancient: "Ancient", museum: "Museum", nature: "Nature", beach: "Beach", hidden: "Hidden" }
    },
    crafts: {
      title: "Authentic Egyptian Crafts",
      subtitle: "Support local artisans and bring home a piece of Egyptian heritage. All items are verified for authenticity.",
      empty: "No products found in this category.",
      registerBtn: "Register as an Artisan",
      viewDetails: "View Details",
      cat: { all: "All", pottery: "Pottery", papyrus: "Papyrus", textiles: "Textiles", jewelry: "Jewelry", wood: "Wood Crafts", traditional: "Traditional Crafts" },
      prod: {
        1: "Hand-Painted Fayoum Pottery Bowl",
        2: "Authentic Painted Papyrus Scroll",
        3: "Akhmim Handwoven Textile",
        4: "Silver Lotus Flower Pendant",
        5: "Mother of Pearl Inlaid Box",
        6: "Traditional Alabaster Vase",
        7: "Nubian Handwoven Basket",
        8: "Gold Cartouche Pendant"
      }
    },
    planner: {
      planYour: "Plan Your",
      journey: "Egypt Journey",
      paceTitle: "Preferred Pace",
      tryAgain: "Try Again",
      routeMap: "Route Map",
      exploreAll: "Explore All Destinations"
    },
    news: {
      learnMore: "Learn More",
      noArticles: "No articles found"
    },
    passport: {
      status: "Status",
      verified: "Verified",
      badges: {
        pharaoh: { title: "Pharaoh Explorer", desc: "Visited 3+ ancient sites" },
        desert: { title: "Desert Explorer", desc: "Explored a hidden oasis" },
        heritage: { title: "Heritage Hunter", desc: "Collected 5+ digital stamps" },
        culture: { title: "Culture Seeker", desc: "Experienced local Egyptian cuisine (Pending)" },
        nile: { title: "Nile Navigator", desc: "Take a Nile cruise (Pending)" }
      }
    }
  },
  ar: {
    cta: {
      title: "عِش تجربة مصر بذكاء",
      subtitle: "دع الذكاء الاصطناعي يرشد رحلتك عبر 5000 عام من الحضارة",
      btn: "خطط لرحلتي",
      poweredBy: "بدعم من الذكاء المصري"
    },
    explore: {
      title: "استكشف مصر",
      subtitle: "اكتشف مواقع تاريخية موثقة، وجواهر خفية، وعجائب طبيعية.",
      exploreDetails: "عرض التفاصيل",
      cat: { all: "الكل", ancient: "آثار", museum: "متاحف", nature: "طبيعة", beach: "شواطئ", hidden: "أماكن خفية" }
    },
    crafts: {
      title: "حرف يدوية مصرية أصيلة",
      subtitle: "ادعم الحرفيين المحليين واقتنِ قطعة من التراث المصري. جميع العناصر موثقة الأصالة.",
      empty: "لا توجد منتجات في هذه الفئة.",
      registerBtn: "سجل كحرفي",
      viewDetails: "عرض التفاصيل",
      cat: { all: "الكل", pottery: "فخار", papyrus: "بردي", textiles: "نسيج", jewelry: "مجوهرات", wood: "صناعات خشبية", traditional: "حرف تقليدية" },
      prod: {
        1: "وعاء فخار فيومي مرسوم يدوياً",
        2: "لفافة ورق بردي أصلية",
        3: "نسيج أخميم اليدوي",
        4: "قلادة زهرة اللوتس الفضية",
        5: "صندوق مطعم بالصدف",
        6: "مزهرية ألباستر تقليدية",
        7: "سلة نوبية منسوجة يدوياً",
        8: "خرطوشة ذهبية"
      }
    },
    planner: {
      planYour: "خطط",
      journey: "لرحلتك في مصر",
      paceTitle: "الوتيرة المفضلة",
      tryAgain: "حاول مرة أخرى",
      routeMap: "خريطة المسار",
      exploreAll: "استكشف كل الوجهات"
    },
    news: {
      learnMore: "اقرأ المزيد",
      noArticles: "لا توجد مقالات"
    },
    passport: {
      status: "الحالة",
      verified: "موثق",
      badges: {
        pharaoh: { title: "مستكشف الفراعنة", desc: "تمت زيارة أكثر من 3 مواقع أثرية" },
        desert: { title: "مستكشف الصحراء", desc: "تم استكشاف واحة خفية" },
        heritage: { title: "صائد التراث", desc: "تم جمع أكثر من 5 أختام رقمية" },
        culture: { title: "باحث عن الثقافة", desc: "تم تجربة المطبخ المصري (قريباً)" },
        nile: { title: "ملاح النيل", desc: "القيام برحلة نيلية (قريباً)" }
      }
    }
  },
  fr: {
    cta: {
      title: "Vivez l'Égypte, Intelligemment.",
      subtitle: "Laissez l'IA guider votre voyage à travers 5 000 ans de civilisation",
      btn: "Planifier Mon Voyage",
      poweredBy: "Propulsé par l'Intelligence Égyptienne"
    },
    explore: {
      title: "Explorez l'Égypte",
      subtitle: "Découvrez des sites historiques vérifiés, des joyaux cachés et des merveilles naturelles.",
      exploreDetails: "Voir les détails",
      cat: { all: "Tout", ancient: "Ancien", museum: "Musée", nature: "Nature", beach: "Plage", hidden: "Caché" }
    },
    crafts: {
      title: "Artisanat Égyptien Authentique",
      subtitle: "Soutenez les artisans locaux. Tous les articles sont certifiés authentiques.",
      empty: "Aucun produit trouvé.",
      registerBtn: "S'inscrire comme artisan",
      viewDetails: "Voir les détails",
      cat: { all: "Tout", pottery: "Poterie", papyrus: "Papyrus", textiles: "Textiles", jewelry: "Bijoux", wood: "Bois", traditional: "Traditionnel" },
      prod: {
        1: "Bol en poterie du Fayoum",
        2: "Parchemin de papyrus authentique",
        3: "Textile tissé main d'Akhmim",
        4: "Pendentif fleur de lotus en argent",
        5: "Boîte incrustée de nacre",
        6: "Vase traditionnel en albâtre",
        7: "Panier nubien tressé main",
        8: "Pendentif cartouche en or"
      }
    },
    planner: {
      planYour: "Planifiez Votre",
      journey: "Voyage en Égypte",
      paceTitle: "Rythme préféré",
      tryAgain: "Réessayer",
      routeMap: "Carte de l'itinéraire",
      exploreAll: "Explorer toutes les destinations"
    },
    news: {
      learnMore: "En savoir plus",
      noArticles: "Aucun article trouvé"
    },
    passport: {
      status: "Statut",
      verified: "Vérifié",
      badges: {
        pharaoh: { title: "Explorateur Pharaon", desc: "Visité plus de 3 sites antiques" },
        desert: { title: "Explorateur du Désert", desc: "Exploré une oasis cachée" },
        heritage: { title: "Chasseur de Patrimoine", desc: "Collectionné plus de 5 timbres numériques" },
        culture: { title: "Chercheur de Culture", desc: "Testé la cuisine locale (À venir)" },
        nile: { title: "Navigateur du Nil", desc: "Fait une croisière sur le Nil (À venir)" }
      }
    }
  },
  de: {
    cta: {
      title: "Erleben Sie Ägypten, intelligent.",
      subtitle: "Lassen Sie die KI Ihre Reise durch 5.000 Jahre Zivilisation führen",
      btn: "Meine Reise planen",
      poweredBy: "Unterstützt durch ägyptische Intelligenz"
    },
    explore: {
      title: "Entdecke Ägypten",
      subtitle: "Entdecken Sie verifizierte historische Stätten, versteckte Juwelen und Naturwunder.",
      exploreDetails: "Details ansehen",
      cat: { all: "Alle", ancient: "Antike", museum: "Museum", nature: "Natur", beach: "Strand", hidden: "Versteckt" }
    },
    crafts: {
      title: "Authentisches ägyptisches Kunsthandwerk",
      subtitle: "Unterstützen Sie lokale Handwerker. Alle Artikel sind auf Echtheit geprüft.",
      empty: "Keine Produkte in dieser Kategorie gefunden.",
      registerBtn: "Als Handwerker registrieren",
      viewDetails: "Details ansehen",
      cat: { all: "Alle", pottery: "Töpferei", papyrus: "Papyrus", textiles: "Textilien", jewelry: "Schmuck", wood: "Holzkunst", traditional: "Traditionell" },
      prod: {
        1: "Handbemalte Fayoum-Tonschale",
        2: "Authentische bemalte Papyrusrolle",
        3: "Handgewebtes Akhmim-Textil",
        4: "Silberner Lotusblüten-Anhänger",
        5: "Perlmuttverzierte Box",
        6: "Traditionelle Alabastervase",
        7: "Handgeflochtener nubischer Korb",
        8: "Goldener Kartuschen-Anhänger"
      }
    },
    planner: {
      planYour: "Planen Sie Ihre",
      journey: "Ägypten-Reise",
      paceTitle: "Bevorzugtes Tempo",
      tryAgain: "Erneut versuchen",
      routeMap: "Routenkarte",
      exploreAll: "Alle Reiseziele erkunden"
    },
    news: {
      learnMore: "Mehr erfahren",
      noArticles: "Keine Artikel gefunden"
    },
    passport: {
      status: "Status",
      verified: "Verifiziert",
      badges: {
        pharaoh: { title: "Pharao-Entdecker", desc: "3+ antike Stätten besucht" },
        desert: { title: "Wüstenentdecker", desc: "Eine versteckte Oase erkundet" },
        heritage: { title: "Erbe-Jäger", desc: "5+ digitale Stempel gesammelt" },
        culture: { title: "Kultur-Sucher", desc: "Lokale Küche probiert (Ausstehend)" },
        nile: { title: "Nil-Navigator", desc: "Nilkreuzfahrt gemacht (Ausstehend)" }
      }
    }
  },
  it: {
    cta: {
      title: "Vivi l'Egitto, Intelligente.",
      subtitle: "Lascia che l'IA guidi il tuo viaggio attraverso 5.000 anni di civiltà",
      btn: "Pianifica il Mio Viaggio",
      poweredBy: "Alimentato dall'Intelligenza Egiziana"
    },
    explore: {
      title: "Esplora l'Egitto",
      subtitle: "Scopri siti storici verificati, gemme nascoste e meraviglie naturali.",
      exploreDetails: "Esplora Dettagli",
      cat: { all: "Tutto", ancient: "Antico", museum: "Museo", nature: "Natura", beach: "Spiaggia", hidden: "Nascosto" }
    },
    crafts: {
      title: "Artigianato Egiziano Autentico",
      subtitle: "Sostieni gli artigiani locali. Tutti gli articoli sono verificati.",
      empty: "Nessun prodotto trovato.",
      registerBtn: "Registrati come artigiano",
      viewDetails: "Vedi Dettagli",
      cat: { all: "Tutto", pottery: "Ceramica", papyrus: "Papiro", textiles: "Tessili", jewelry: "Gioielli", wood: "Legno", traditional: "Tradizionale" },
      prod: {
        1: "Ciotola in ceramica Fayoum",
        2: "Rotolo di papiro autentico",
        3: "Tessuto a mano di Akhmim",
        4: "Ciondolo fiore di loto in argento",
        5: "Scatola intarsiata di madreperla",
        6: "Vaso in alabastro tradizionale",
        7: "Cesto nubiano intrecciato a mano",
        8: "Ciondolo cartiglio in oro"
      }
    },
    planner: {
      planYour: "Pianifica il Tuo",
      journey: "Viaggio in Egitto",
      paceTitle: "Ritmo Preferito",
      tryAgain: "Riprova",
      routeMap: "Mappa del Percorso",
      exploreAll: "Esplora tutte le destinazioni"
    },
    news: {
      learnMore: "Scopri di più",
      noArticles: "Nessun articolo trovato"
    },
    passport: {
      status: "Stato",
      verified: "Verificato",
      badges: {
        pharaoh: { title: "Esploratore Faraone", desc: "Visitati 3+ siti antichi" },
        desert: { title: "Esploratore del Deserto", desc: "Esplorata un'oasi nascosta" },
        heritage: { title: "Cacciatore di Patrimonio", desc: "Raccolti 5+ francobolli digitali" },
        culture: { title: "Cercatore di Cultura", desc: "Cucina locale (In attesa)" },
        nile: { title: "Navigatore del Nilo", desc: "Crociera sul Nilo (In attesa)" }
      }
    }
  },
  es: {
    cta: {
      title: "Experimenta Egipto, Inteligentemente.",
      subtitle: "Deja que la IA guíe tu viaje a través de 5.000 años de civilización",
      btn: "Planear Mi Viaje",
      poweredBy: "Impulsado por Inteligencia Egipcia"
    },
    explore: {
      title: "Explorar Egipto",
      subtitle: "Descubre sitios históricos verificados, gemas ocultas y maravillas naturales.",
      exploreDetails: "Ver Detalles",
      cat: { all: "Todo", ancient: "Antiguo", museum: "Museo", nature: "Naturaleza", beach: "Playa", hidden: "Oculto" }
    },
    crafts: {
      title: "Artesanía Egipcia Auténtica",
      subtitle: "Apoya a los artesanos locales. Todos los artículos son auténticos certificados.",
      empty: "No se encontraron productos.",
      registerBtn: "Registrarse como Artesano",
      viewDetails: "Ver Detalles",
      cat: { all: "Todo", pottery: "Cerámica", papyrus: "Papiro", textiles: "Textiles", jewelry: "Joyas", wood: "Madera", traditional: "Tradicional" },
      prod: {
        1: "Cuenco de cerámica de Fayoum",
        2: "Rollo de papiro auténtico",
        3: "Textil tejido a mano de Akhmim",
        4: "Colgante flor de loto en plata",
        5: "Caja con incrustaciones de nácar",
        6: "Jarrón de alabastro tradicional",
        7: "Cesta nubia tejida a mano",
        8: "Colgante de cartucho de oro"
      }
    },
    planner: {
      planYour: "Planea Tu",
      journey: "Viaje a Egipto",
      paceTitle: "Ritmo Preferido",
      tryAgain: "Intentar de nuevo",
      routeMap: "Mapa de Ruta",
      exploreAll: "Explorar todos los destinos"
    },
    news: {
      learnMore: "Aprender más",
      noArticles: "No se encontraron artículos"
    },
    passport: {
      status: "Estado",
      verified: "Verificado",
      badges: {
        pharaoh: { title: "Explorador Faraón", desc: "Visitó 3+ sitios antiguos" },
        desert: { title: "Explorador del Desierto", desc: "Exploró un oasis oculto" },
        heritage: { title: "Cazador de Patrimonio", desc: "Recolectó 5+ sellos digitales" },
        culture: { title: "Buscador de Cultura", desc: "Probó comida local (Pendiente)" },
        nile: { title: "Navegante del Nilo", desc: "Crucero por el Nilo (Pendiente)" }
      }
    }
  },
  zh: {
    cta: {
      title: "智能体验埃及。",
      subtitle: "让AI引导您穿越5000年的文明旅程",
      btn: "规划我的旅程",
      poweredBy: "由埃及智能提供支持"
    },
    explore: {
      title: "探索埃及",
      subtitle: "发现经过验证的历史遗迹、隐藏的宝石和自然奇观。",
      exploreDetails: "探索详情",
      cat: { all: "全部", ancient: "古代", museum: "博物馆", nature: "自然", beach: "海滩", hidden: "隐藏" }
    },
    crafts: {
      title: "正宗埃及工艺品",
      subtitle: "支持当地工匠。所有商品均经过正品验证。",
      empty: "未找到产品。",
      registerBtn: "注册为工匠",
      viewDetails: "查看详情",
      cat: { all: "全部", pottery: "陶器", papyrus: "纸莎草", textiles: "纺织品", jewelry: "珠宝", wood: "木工艺品", traditional: "传统工艺" },
      prod: {
        1: "手绘法尤姆陶碗",
        2: "正宗彩绘纸莎草卷轴",
        3: "阿赫米姆手工纺织品",
        4: "银质莲花吊坠",
        5: "珍珠母镶嵌盒",
        6: "传统雪花石膏花瓶",
        7: "努比亚手工编织篮",
        8: "金质椭圆形吊坠"
      }
    },
    planner: {
      planYour: "规划您的",
      journey: "埃及之旅",
      paceTitle: "偏好节奏",
      tryAgain: "重试",
      routeMap: "路线图",
      exploreAll: "探索所有目的地"
    },
    news: {
      learnMore: "了解更多",
      noArticles: "未找到文章"
    },
    passport: {
      status: "状态",
      verified: "已验证",
      badges: {
        pharaoh: { title: "法老探险家", desc: "参观了3个以上古迹" },
        desert: { title: "沙漠探险家", desc: "探索了隐藏的绿洲" },
        heritage: { title: "遗产猎人", desc: "收集了5个以上数字邮票" },
        culture: { title: "文化寻求者", desc: "体验当地美食（待定）" },
        nile: { title: "尼罗河航海家", desc: "尼罗河游轮（待定）" }
      }
    }
  },
  ru: {
    cta: {
      title: "Откройте для себя Египет. Интеллектуально.",
      subtitle: "Позвольте ИИ стать вашим гидом в путешествии через 5000 лет цивилизации",
      btn: "Спланировать путешествие",
      poweredBy: "Создано с помощью египетского интеллекта"
    },
    explore: {
      title: "Исследуйте Египет",
      subtitle: "Откройте для себя проверенные исторические места, скрытые сокровища и чудеса природы.",
      exploreDetails: "Посмотреть детали",
      cat: { all: "Все", ancient: "Древние", museum: "Музеи", nature: "Природа", beach: "Пляжи", hidden: "Скрытые" }
    },
    crafts: {
      title: "Аутентичные египетские ремесла",
      subtitle: "Поддержите местных ремесленников. Подлинность всех товаров проверена.",
      empty: "Товары не найдены.",
      registerBtn: "Зарегистрироваться как ремесленник",
      viewDetails: "Подробнее",
      cat: { all: "Все", pottery: "Керамика", papyrus: "Папирус", textiles: "Текстиль", jewelry: "Ювелирные изделия", wood: "Работа по дереву", traditional: "Традиционные" },
      prod: {
        1: "Расписанная вручную фаюмская керамическая чаша",
        2: "Аутентичный расписной папирус",
        3: "Ткань ручной работы Ахмим",
        4: "Серебряный кулон Цветок Лотоса",
        5: "Шкатулка, инкрустированная перламутром",
        6: "Традиционная алебастровая ваза",
        7: "Нубийская плетеная корзина",
        8: "Золотой кулон-картуш"
      }
    },
    planner: {
      planYour: "Спланируйте свое",
      journey: "путешествие по Египту",
      paceTitle: "Предпочтительный темп",
      tryAgain: "Попробовать снова",
      routeMap: "Карта маршрута",
      exploreAll: "Посмотреть все направления"
    },
    news: {
      learnMore: "Узнать больше",
      noArticles: "Статьи не найдены"
    },
    passport: {
      status: "Статус",
      verified: "Подтвержден",
      badges: {
        pharaoh: { title: "Исследователь фараонов", desc: "Посещено 3+ древних памятников" },
        desert: { title: "Исследователь пустыни", desc: "Исследован скрытый оазис" },
        heritage: { title: "Охотник за наследим", desc: "Собрано 5+ цифровых штампов" },
        culture: { title: "Искатель культуры", desc: "Опыт местной кухни (В ожидании)" },
        nile: { title: "Навигатор Нила", desc: "Круиз по Нилу (В ожидании)" }
      }
    }
  }
};

['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'].forEach(lang => {
  const f = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(f, 'utf8'));
  deepMerge(data, translations[lang]);
  fs.writeFileSync(f, JSON.stringify(data, null, 2));
  console.log('Fixed ' + f);
});

console.log('All remaining translation strings updated!');
