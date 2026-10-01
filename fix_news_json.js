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
    news: {
      badge: "LATEST NEWS",
      title: "EGYPT TOURISM & HERITAGE",
      subtitle: "Stay updated with the latest discoveries, events, and tourism news.",
      filters: {
        all: "ALL",
        archaeology: "ARCHAEOLOGY",
        tourism: "TOURISM",
        heritage: "HERITAGE",
        museums: "MUSEUMS",
        history: "HISTORY"
      },
      items: {
        gem: {
          title: "Grand Egyptian Museum Opens to the World",
          desc: "The Grand Egyptian Museum (GEM) in Giza, the world's largest archaeological museum, officially opened in 2023. It houses over 100,000 artifacts including the complete treasures of Tutankhamun displayed together for the first time in history."
        },
        luxor: {
          title: "New Tomb Discovered in Luxor's Valley of the Kings",
          desc: "Egyptian archaeologists discovered a new tomb in the Valley of the Kings in Luxor, designated KV65. The discovery adds to our understanding of the New Kingdom period and the burial practices of ancient Egyptian nobles."
        },
        tourism2024: {
          title: "Egypt Records 15 Million Tourist Arrivals in 2024",
          desc: "Egypt's tourism sector achieved a record 15 million tourist arrivals in 2024, generating $14.9 billion in revenues. The country aims to attract 30 million tourists annually by 2028 as part of its national tourism development strategy."
        },
        unesco: {
          title: "UNESCO Launches Digital Heritage Preservation Project",
          desc: "A new joint initiative between UNESCO and the Egyptian Ministry of Antiquities will create high-fidelity 3D digital twins of threatened monuments, starting with Islamic Cairo and historic Alexandria."
        },
        alexandria: {
          title: "Bibliotheca Alexandrina Announces New Manuscript Exhibition",
          desc: "The modern Library of Alexandria will host a rare exhibition of newly restored Islamic and Coptic manuscripts, showcasing the incredible diversity of Egypt's intellectual history through the centuries."
        }
      },
      learnMore: "LEARN MORE",
      noArticles: "No articles found"
    }
  },
  ar: {
    news: {
      badge: "أحدث الأخبار",
      title: "السياحة والتراث المصري",
      subtitle: "ابق على اطلاع بأحدث الاكتشافات والفعاليات والأخبار السياحية.",
      filters: {
        all: "الكل",
        archaeology: "علم الآثار",
        tourism: "السياحة",
        heritage: "التراث",
        museums: "المتاحف",
        history: "التاريخ"
      },
      items: {
        gem: {
          title: "المتحف المصري الكبير يفتح أبوابه للعالم",
          desc: "المتحف المصري الكبير في الجيزة، أكبر متحف أثري في العالم، افتتح رسمياً في 2023. يضم أكثر من 100,000 قطعة أثرية بما في ذلك كنوز توت عنخ آمون الكاملة المعروضة معاً لأول مرة في التاريخ."
        },
        luxor: {
          title: "اكتشاف مقبرة جديدة في وادي الملوك بالأقصر",
          desc: "اكتشف علماء الآثار المصريون مقبرة جديدة في وادي الملوك بالأقصر، تحمل اسم KV65. يضيف هذا الاكتشاف فهماً أعمق لعصر الدولة الحديثة وطقوس الدفن لطبقة النبلاء في مصر القديمة."
        },
        tourism2024: {
          title: "مصر تسجل 15 مليون سائح في عام 2024",
          desc: "حقق قطاع السياحة المصري رقماً قياسياً بلغ 15 مليون سائح في 2024، بإيرادات بلغت 14.9 مليار دولار. تهدف البلاد إلى جذب 30 مليون سائح سنوياً بحلول 2028 كجزء من الاستراتيجية الوطنية."
        },
        unesco: {
          title: "اليونسكو تطلق مشروع الحفظ الرقمي للتراث",
          desc: "مبادرة مشتركة جديدة بين اليونسكو ووزارة الآثار المصرية لإنشاء نسخ رقمية ثلاثية الأبعاد عالية الدقة للمعالم المهددة، بدءاً من القاهرة الإسلامية والإسكندرية التاريخية."
        },
        alexandria: {
          title: "مكتبة الإسكندرية تعلن عن معرض جديد للمخطوطات",
          desc: "تستضيف مكتبة الإسكندرية معرضاً نادراً للمخطوطات الإسلامية والقبطية المرممة حديثاً، مما يعرض التنوع المذهل للتاريخ الفكري لمصر عبر القرون."
        }
      },
      learnMore: "اقرأ المزيد",
      noArticles: "لا توجد مقالات"
    }
  },
  fr: {
    news: {
      badge: "DERNIÈRES NOUVELLES",
      title: "TOURISME ET PATRIMOINE EN ÉGYPTE",
      subtitle: "Restez informé des dernières découvertes, événements et actualités touristiques.",
      filters: {
        all: "TOUT",
        archaeology: "ARCHÉOLOGIE",
        tourism: "TOURISME",
        heritage: "PATRIMOINE",
        museums: "MUSÉES",
        history: "HISTOIRE"
      },
      items: {
        gem: {
          title: "Le Grand Musée Égyptien s'ouvre au monde",
          desc: "Le Grand Musée Égyptien (GEM) à Gizeh, le plus grand musée archéologique du monde, a officiellement ouvert en 2023. Il abrite plus de 100 000 artefacts, dont les trésors complets de Toutankhamon exposés ensemble pour la première fois."
        },
        luxor: {
          title: "Nouvelle tombe découverte dans la Vallée des Rois à Louxor",
          desc: "Des archéologues égyptiens ont découvert une nouvelle tombe dans la Vallée des Rois, désignée KV65. Cette découverte enrichit notre compréhension de la période du Nouvel Empire et des pratiques funéraires des nobles."
        },
        tourism2024: {
          title: "L'Égypte enregistre 15 millions de touristes en 2024",
          desc: "Le secteur du tourisme égyptien a atteint un record de 15 millions d'arrivées en 2024, générant 14,9 milliards de dollars de revenus. Le pays vise 30 millions de touristes d'ici 2028."
        },
        unesco: {
          title: "L'UNESCO lance un projet de préservation du patrimoine numérique",
          desc: "Une nouvelle initiative conjointe créera des jumeaux numériques 3D haute fidélité des monuments menacés, en commençant par le Caire islamique et l'Alexandrie historique."
        },
        alexandria: {
          title: "La Bibliotheca Alexandrina annonce une nouvelle exposition de manuscrits",
          desc: "La Bibliothèque d'Alexandrie accueillera une exposition rare de manuscrits islamiques et coptes récemment restaurés, illustrant l'incroyable diversité de l'histoire intellectuelle de l'Égypte."
        }
      },
      learnMore: "EN SAVOIR PLUS",
      noArticles: "Aucun article trouvé"
    }
  },
  de: {
    news: {
      badge: "AKTUELLE NACHRICHTEN",
      title: "ÄGYPTEN TOURISMUS & KULTURERBE",
      subtitle: "Bleiben Sie über die neuesten Entdeckungen, Veranstaltungen und Tourismusnachrichten informiert.",
      filters: {
        all: "ALLE",
        archaeology: "ARCHÄOLOGIE",
        tourism: "TOURISMUS",
        heritage: "KULTURERBE",
        museums: "MUSEEN",
        history: "GESCHICHTE"
      },
      items: {
        gem: {
          title: "Das Große Ägyptische Museum öffnet sich der Welt",
          desc: "Das Große Ägyptische Museum (GEM) in Gizeh, das größte archäologische Museum der Welt, wurde 2023 offiziell eröffnet. Es beherbergt über 100.000 Artefakte, darunter die kompletten Schätze des Tutanchamun."
        },
        luxor: {
          title: "Neues Grab im Tal der Könige in Luxor entdeckt",
          desc: "Ägyptische Archäologen haben ein neues Grab (KV65) im Tal der Könige entdeckt. Die Entdeckung erweitert unser Verständnis der Zeit des Neuen Reiches und der Bestattungspraktiken ägyptischer Adliger."
        },
        tourism2024: {
          title: "Ägypten verzeichnet 15 Millionen Touristenankünfte im Jahr 2024",
          desc: "Der ägyptische Tourismussektor erzielte 2024 einen Rekord von 15 Millionen Touristenankünften mit Einnahmen von 14,9 Milliarden US-Dollar. Das Land strebt bis 2028 jährlich 30 Millionen Touristen an."
        },
        unesco: {
          title: "UNESCO startet Projekt zur digitalen Erhaltung des Kulturerbes",
          desc: "Eine neue gemeinsame Initiative von UNESCO und dem ägyptischen Antikenministerium wird hochpräzise digitale 3D-Zwillinge gefährdeter Denkmäler erstellen."
        },
        alexandria: {
          title: "Bibliotheca Alexandrina kündigt neue Manuskriptausstellung an",
          desc: "Die moderne Bibliothek von Alexandria wird eine seltene Ausstellung kürzlich restaurierter islamischer und koptischer Manuskripte veranstalten."
        }
      },
      learnMore: "MEHR ERFAHREN",
      noArticles: "Keine Artikel gefunden"
    }
  },
  it: {
    news: {
      badge: "ULTIME NOTIZIE",
      title: "TURISMO E PATRIMONIO IN EGITTO",
      subtitle: "Rimani aggiornato con le ultime scoperte, eventi e notizie sul turismo.",
      filters: {
        all: "TUTTO",
        archaeology: "ARCHEOLOGIA",
        tourism: "TURISMO",
        heritage: "PATRIMONIO",
        museums: "MUSEI",
        history: "STORIA"
      },
      items: {
        gem: {
          title: "Il Grande Museo Egizio apre al mondo",
          desc: "Il Grande Museo Egizio (GEM) di Giza, il più grande museo archeologico del mondo, ha aperto ufficialmente nel 2023. Ospita oltre 100.000 manufatti tra cui i tesori completi di Tutankhamon."
        },
        luxor: {
          title: "Nuova tomba scoperta nella Valle dei Re a Luxor",
          desc: "Gli archeologi egiziani hanno scoperto una nuova tomba nella Valle dei Re a Luxor, designata KV65. La scoperta arricchisce la nostra comprensione del periodo del Nuovo Regno."
        },
        tourism2024: {
          title: "L'Egitto registra 15 milioni di arrivi turistici nel 2024",
          desc: "Il settore turistico egiziano ha raggiunto il record di 15 milioni di arrivi nel 2024, generando 14,9 miliardi di dollari. L'obiettivo è di 30 milioni di turisti all'anno entro il 2028."
        },
        unesco: {
          title: "L'UNESCO lancia un progetto di conservazione digitale",
          desc: "Una nuova iniziativa congiunta tra l'UNESCO e il Ministero delle Antichità creerà gemelli digitali 3D ad alta fedeltà di monumenti minacciati."
        },
        alexandria: {
          title: "La Bibliotheca Alexandrina annuncia una nuova mostra",
          desc: "La Biblioteca di Alessandria ospiterà una rara mostra di manoscritti islamici e copti appena restaurati, mostrando l'incredibile diversità della storia intellettuale egiziana."
        }
      },
      learnMore: "SCOPRI DI PIÙ",
      noArticles: "Nessun articolo trovato"
    }
  },
  es: {
    news: {
      badge: "ÚLTIMAS NOTICIAS",
      title: "TURISMO Y PATRIMONIO DE EGIPTO",
      subtitle: "Mantente actualizado con los últimos descubrimientos, eventos y noticias turísticas.",
      filters: {
        all: "TODO",
        archaeology: "ARQUEOLOGÍA",
        tourism: "TURISMO",
        heritage: "PATRIMONIO",
        museums: "MUSEOS",
        history: "HISTORIA"
      },
      items: {
        gem: {
          title: "El Gran Museo Egipcio abre al mundo",
          desc: "El Gran Museo Egipcio (GEM) en Guiza, el museo arqueológico más grande del mundo, abrió oficialmente en 2023. Alberga más de 100.000 artefactos, incluyendo los tesoros completos de Tutankamón."
        },
        luxor: {
          title: "Nueva tumba descubierta en el Valle de los Reyes en Luxor",
          desc: "Arqueólogos egipcios descubrieron una nueva tumba en el Valle de los Reyes, designada KV65. El descubrimiento amplía nuestra comprensión del Imperio Nuevo y las prácticas funerarias."
        },
        tourism2024: {
          title: "Egipto registra 15 millones de turistas en 2024",
          desc: "El sector turístico de Egipto logró un récord de 15 millones de llegadas en 2024, generando 14.900 millones de dólares. El país tiene como objetivo atraer a 30 millones de turistas para 2028."
        },
        unesco: {
          title: "La UNESCO lanza un proyecto de preservación del patrimonio",
          desc: "Una nueva iniciativa conjunta creará gemelos digitales en 3D de alta fidelidad de monumentos amenazados, comenzando con El Cairo Islámico y Alejandría."
        },
        alexandria: {
          title: "La Bibliotheca Alexandrina anuncia nueva exposición de manuscritos",
          desc: "La Biblioteca de Alejandría albergará una rara exposición de manuscritos islámicos y coptos recién restaurados, mostrando la diversidad intelectual de Egipto."
        }
      },
      learnMore: "MÁS INFORMACIÓN",
      noArticles: "No se encontraron artículos"
    }
  },
  zh: {
    news: {
      badge: "最新消息",
      title: "埃及旅游与遗产",
      subtitle: "随时了解最新的考古发现、活动和旅游新闻。",
      filters: {
        all: "全部",
        archaeology: "考古",
        tourism: "旅游",
        heritage: "遗产",
        museums: "博物馆",
        history: "历史"
      },
      items: {
        gem: {
          title: "大埃及博物馆向世界开放",
          desc: "位于吉萨的大埃及博物馆（GEM）是世界上最大的考古博物馆，于2023年正式开放。它收藏了超过10万件文物，包括历史上首次一起展出的图坦卡蒙的完整宝藏。"
        },
        luxor: {
          title: "卢克索帝王谷发现新墓穴",
          desc: "埃及考古学家在卢克索的帝王谷发现了一座编号为KV65的新墓。这一发现加深了我们对新王国时期和古埃及贵族埋葬习俗的了解。"
        },
        tourism2024: {
          title: "2024年埃及入境游客达到1500万人次",
          desc: "埃及旅游业在2024年创下1500万游客入境的纪录，创造了149亿美元的收入。作为国家旅游发展战略的一部分，该国目标到2028年每年吸引3000万游客。"
        },
        unesco: {
          title: "联合国教科文组织启动数字遗产保护项目",
          desc: "联合国教科文组织和埃及文物部之间的一项新联合倡议将为受威胁的古迹创建高保真3D数字孪生，从伊斯兰开罗和历史悠久的亚历山大开始。"
        },
        alexandria: {
          title: "亚历山大图书馆宣布举办选手稿展览",
          desc: "亚历山大现代图书馆将举办罕见的新修复的伊斯兰和科普特手稿展览，展示埃及几个世纪以来令人难以置信的知识历史多样性。"
        }
      },
      learnMore: "了解更多",
      noArticles: "未找到文章"
    }
  },
  ru: {
    news: {
      badge: "ПОСЛЕДНИЕ НОВОСТИ",
      title: "ТУРИЗМ И НАСЛЕДИЕ ЕГИПТА",
      subtitle: "Будьте в курсе последних открытий, событий и новостей туризма.",
      filters: {
        all: "ВСЕ",
        archaeology: "АРХЕОЛОГИЯ",
        tourism: "ТУРИЗМ",
        heritage: "НАСЛЕДИЕ",
        museums: "МУЗЕИ",
        history: "ИСТОРИЯ"
      },
      items: {
        gem: {
          title: "Большой Египетский Музей открыт для мира",
          desc: "Большой Египетский музей (GEM) в Гизе, крупнейший в мире археологический музей, официально открылся в 2023 году. Здесь хранится более 100 000 артефактов, включая сокровища Тутанхамона."
        },
        luxor: {
          title: "Новая гробница обнаружена в Долине Царей в Луксоре",
          desc: "Египетские археологи обнаружили новую гробницу в Долине царей в Луксоре, получившую название KV65. Это открытие улучшает наше понимание периода Нового царства."
        },
        tourism2024: {
          title: "Египет зафиксировал 15 миллионов туристов в 2024 году",
          desc: "В 2024 году туристический сектор Египта достиг рекордных 15 миллионов прибытий, принеся 14,9 миллиарда долларов. К 2028 году страна стремится привлекать 30 миллионов туристов ежегодно."
        },
        unesco: {
          title: "ЮНЕСКО запускает проект по сохранению цифрового наследия",
          desc: "Новая совместная инициатива ЮНЕСКО и Министерства по делам древностей создаст 3D цифровые двойники находящихся под угрозой памятников, начиная с Исламского Каира и Александрии."
        },
        alexandria: {
          title: "Александрийская библиотека объявляет о выставке манускриптов",
          desc: "Современная Александрийская библиотека проведет выставку недавно отреставрированных исламских и коптских манускриптов, демонстрируя интеллектуальную историю Египта."
        }
      },
      learnMore: "ПОДРОБНЕЕ",
      noArticles: "Статьи не найдены"
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

console.log('News translations added successfully.');
