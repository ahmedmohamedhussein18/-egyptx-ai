const fs = require('fs');

// Deep merge helper
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

// All translations per language for the broken home.* keys
const fixes = {
  ar: {
    home: {
      fourPillars: {
        title: "الركائز الأساسية الأربعة",
        subtitle: "تجربة رقمية سلسة من التخطيط حتى الذكريات",
        aiPlanning: {
          title: "التخطيط بالذكاء الاصطناعي",
          desc: "توليد خطط رحلات مخصصة خلال ثوانٍ بناءً على حجم الزحام والطقس وتفضيلاتك.",
          action: "خطط لرحلة"
        },
        smartSites: {
          title: "المواقع الذكية",
          desc: "استكشاف مُعزَّز بتقنية AR وترجمة فورية للهيروغليفية بالذكاء الاصطناعي.",
          action: "مسح المواقع"
        },
        vrEgypt: {
          title: "مصر الافتراضية",
          desc: "وصول افتراضي للمقابر والمعالم المقيّدة حول العالم.",
          action: "دخول الواقع الافتراضي"
        },
        aiMemories: {
          title: "ذكريات الذكاء الاصطناعي",
          desc: "تنظيم صور رحلتك وتحسينها تلقائياً بالذكاء الاصطناعي.",
          action: "عرض الذكريات"
        }
      },
      smartTourism: {
        title: "نظرة عامة على السياحة الذكية",
        subtitle: "إحداث ثورة في طريقة تجربة العالم لمصر",
        aiPowered: {
          title: "السياحة المدعومة بالذكاء الاصطناعي",
          desc: "تخطيط رحلات مخصص بالذكاء الاصطناعي يفهم تفضيلاتك ووتيرتك وشغفك لصياغة المغامرة المصرية المثالية.",
          tag: "تعلم الآلة"
        },
        smartHeritage: {
          title: "التراث الذكي",
          desc: "الحفاظ الرقمي وتجارب AR المُعززة في أعرق المواقع الأثرية والمعالم المصرية.",
          tag: "التوأم الرقمي"
        },
        distribution: {
          title: "التوزيع الذكي للسياحة",
          desc: "إدارة الحشود بالذكاء الاصطناعي وتوجيه ذكي يضمن سياحة مستدامة مع تعظيم تجربة الزوار.",
          tag: "تحليلات في الوقت الفعلي"
        }
      },
      ecosystem: {
        tourists: "السياح",
        businesses: "الأعمال",
        data: "البيانات",
        heritage: "التراث",
        stats: {
          systems: "7 أنظمة متكاملة",
          realTime: "تدفق بيانات في الوقت الفعلي",
          insights: "رؤى مدعومة بالذكاء الاصطناعي",
          coverage: "تغطية وطنية شاملة"
        }
      },
      mobility: {
        title: "التنقل الذكي",
        subtitle: "منظومة نقل متكاملة",
        comingSoon: "قريباً",
        integration: "التكامل قيد التنفيذ",
        notifyPlaceholder: "أدخل بريدك الإلكتروني للإشعار",
        notifyBtn: "أشعرني",
        added: "تمت الإضافة للقائمة!",
        airport: {
          title: "نقل المطارات",
          desc: "نقل سلس من مطارات القاهرة وسفنكس والأقصر الدولية."
        },
        city: {
          title: "النقل الحضري",
          desc: "مركبات ذكية عند الطلب لتنقل آمن وموثّق داخل المدن."
        },
        buses: {
          title: "حافلات السياحة",
          desc: "حافلات صديقة للبيئة بين المحافظات تربط كبرى المناطق والمعالم."
        },
        nile: {
          title: "رحلات النيل",
          desc: "حجز متكامل لرحلات بحرية ذكية وموثّقة على النيل."
        }
      }
    }
  },
  fr: {
    home: {
      fourPillars: {
        title: "Les Quatre Piliers Fondamentaux",
        subtitle: "Une expérience numérique fluide de la planification aux souvenirs",
        aiPlanning: {
          title: "Planification IA",
          desc: "Génération d'itinéraires personnalisés en secondes selon vos préférences, budget et style de voyage.",
          action: "Planifier un Voyage"
        },
        smartSites: {
          title: "Sites Intelligents",
          desc: "Exploration assistée par AR et traduction instantanée des hiéroglyphes par IA.",
          action: "Scanner les Sites"
        },
        vrEgypt: {
          title: "Égypte VR",
          desc: "Accès virtuel aux tombes et monuments restreints dans le monde entier.",
          action: "Entrer en VR"
        },
        aiMemories: {
          title: "Souvenirs IA",
          desc: "Organisez et améliorez automatiquement les photos de votre voyage.",
          action: "Voir les Souvenirs"
        }
      },
      smartTourism: {
        title: "Aperçu du Tourisme Intelligent",
        subtitle: "Révolutionner la façon dont le monde découvre l'Égypte",
        aiPowered: {
          title: "Tourisme propulsé par l'IA",
          desc: "Planification de voyage IA personnalisée qui comprend vos préférences, votre rythme et vos passions pour créer l'aventure égyptienne parfaite.",
          tag: "Apprentissage automatique"
        },
        smartHeritage: {
          title: "Patrimoine Intelligent",
          desc: "Préservation numérique et expériences AR aux sites archéologiques et monuments les plus précieux d'Égypte.",
          tag: "Jumeau Numérique"
        },
        distribution: {
          title: "Distribution Touristique Intelligente",
          desc: "Gestion des foules par IA et routage intelligent garantissant un tourisme durable tout en maximisant l'expérience des visiteurs.",
          tag: "Analyses en Temps Réel"
        }
      },
      ecosystem: {
        tourists: "Touristes",
        businesses: "Entreprises",
        data: "Données",
        heritage: "Patrimoine",
        stats: {
          systems: "7 Systèmes Intégrés",
          realTime: "Flux de Données en Temps Réel",
          insights: "Analyses IA",
          coverage: "Couverture Nationale"
        }
      },
      mobility: {
        title: "Mobilité Intelligente",
        subtitle: "Écosystème de transport connecté",
        comingSoon: "Bientôt Disponible",
        integration: "Intégration en Cours",
        notifyPlaceholder: "Entrez votre e-mail pour être notifié",
        notifyBtn: "Me Notifier",
        added: "Ajouté à la liste !",
        airport: {
          title: "Transferts Aéroport",
          desc: "Transferts fluides depuis les aéroports internationaux du Caire, Sphinx et Louxor."
        },
        city: {
          title: "Transport Urbain",
          desc: "Véhicules intelligents à la demande pour des déplacements sûrs et vérifiés en ville."
        },
        buses: {
          title: "Bus Touristiques",
          desc: "Bus écologiques interurbains reliant les principales gouvernorats et attractions."
        },
        nile: {
          title: "Croisières sur le Nil",
          desc: "Réservation intégrée pour des croisières intelligentes et authentifiées sur le Nil."
        }
      }
    }
  },
  de: {
    home: {
      fourPillars: {
        title: "Die Vier Grundpfeiler",
        subtitle: "Ein nahtloses digitales Erlebnis von der Planung bis zu den Erinnerungen",
        aiPlanning: {
          title: "KI-Planung",
          desc: "Personalisierte Reiserouten in Sekunden basierend auf Ihren Präferenzen, Budget und Reisestil.",
          action: "Reise planen"
        },
        smartSites: {
          title: "Smarte Stätten",
          desc: "AR-gestützte Erkundung und sofortige KI-Übersetzung von Hieroglyphen.",
          action: "Stätten scannen"
        },
        vrEgypt: {
          title: "VR Ägypten",
          desc: "Virtueller Zugang zu gesperrten Gräbern und Denkmälern weltweit.",
          action: "In VR eintreten"
        },
        aiMemories: {
          title: "KI-Erinnerungen",
          desc: "Reisefotografien automatisch organisieren und aufwerten.",
          action: "Erinnerungen ansehen"
        }
      },
      smartTourism: {
        title: "Smart-Tourismus-Übersicht",
        subtitle: "Revolutionierung der Art und Weise, wie die Welt Ägypten erlebt",
        aiPowered: {
          title: "KI-gestützter Tourismus",
          desc: "Personalisierte KI-Reiseplanung, die Ihre Präferenzen, Ihr Tempo und Ihre Leidenschaften versteht, um das perfekte ägyptische Abenteuer zu gestalten.",
          tag: "Maschinelles Lernen"
        },
        smartHeritage: {
          title: "Smartes Erbe",
          desc: "Digitale Konservierung und AR-erweiterte Erlebnisse an Ägyptens wertvollsten archäologischen Stätten.",
          tag: "Digitaler Zwilling"
        },
        distribution: {
          title: "Intelligente Tourismusverteilung",
          desc: "KI-gesteuerte Besucherlenkung und intelligentes Routing für nachhaltigen Tourismus.",
          tag: "Echtzeit-Analysen"
        }
      },
      ecosystem: {
        tourists: "Touristen",
        businesses: "Unternehmen",
        data: "Daten",
        heritage: "Kulturerbe",
        stats: {
          systems: "7 Integrierte Systeme",
          realTime: "Echtzeit-Datenstrom",
          insights: "KI-Erkenntnisse",
          coverage: "Landesweite Abdeckung"
        }
      },
      mobility: {
        title: "Intelligente Mobilität",
        subtitle: "Vernetztes Transportökosystem",
        comingSoon: "Demnächst",
        integration: "Integration in Arbeit",
        notifyPlaceholder: "E-Mail für Benachrichtigungen eingeben",
        notifyBtn: "Benachrichtigen",
        added: "Zur Liste hinzugefügt!",
        airport: {
          title: "Flughafentransfers",
          desc: "Nahtlose Transfers von den internationalen Flughäfen Kairo, Sphinx und Luxor."
        },
        city: {
          title: "Stadtverkehr",
          desc: "Intelligente On-Demand-Fahrzeuge für sichere innerstädtische Fahrten."
        },
        buses: {
          title: "Touristenbusse",
          desc: "Umweltfreundliche Überlandbusse zwischen Gouvernoraten und Sehenswürdigkeiten."
        },
        nile: {
          title: "Nilkreuzfahrten",
          desc: "Integrierte Buchung für authentifizierte smarte Kreuzfahrten auf dem Nil."
        }
      }
    }
  },
  it: {
    home: {
      fourPillars: {
        title: "I Quattro Pilastri Fondamentali",
        subtitle: "Un'esperienza digitale senza interruzioni dalla pianificazione ai ricordi",
        aiPlanning: {
          title: "Pianificazione IA",
          desc: "Itinerari personalizzati in pochi secondi basati su preferenze, budget e stile di viaggio.",
          action: "Pianifica un Viaggio"
        },
        smartSites: {
          title: "Siti Intelligenti",
          desc: "Esplorazione con AR e traduzione istantanea dei geroglifici tramite IA.",
          action: "Scansiona i Siti"
        },
        vrEgypt: {
          title: "Egitto VR",
          desc: "Accesso virtuale a tombe e monumenti riservati in tutto il mondo.",
          action: "Entra in VR"
        },
        aiMemories: {
          title: "Ricordi IA",
          desc: "Organizza e migliora automaticamente le foto del tuo viaggio.",
          action: "Vedi i Ricordi"
        }
      },
      smartTourism: {
        title: "Panoramica del Turismo Intelligente",
        subtitle: "Rivoluzionare il modo in cui il mondo vive l'Egitto",
        aiPowered: {
          title: "Turismo Alimentato dall'IA",
          desc: "Pianificazione di viaggi IA personalizzata che comprende le tue preferenze per creare l'avventura egiziana perfetta.",
          tag: "Apprendimento Automatico"
        },
        smartHeritage: {
          title: "Patrimonio Intelligente",
          desc: "Conservazione digitale ed esperienze AR nei siti archeologici più preziosi d'Egitto.",
          tag: "Gemello Digitale"
        },
        distribution: {
          title: "Distribuzione Turistica Intelligente",
          desc: "Gestione della folla tramite IA e instradamento intelligente per un turismo sostenibile.",
          tag: "Analisi in Tempo Reale"
        }
      },
      ecosystem: {
        tourists: "Turisti",
        businesses: "Imprese",
        data: "Dati",
        heritage: "Patrimonio",
        stats: {
          systems: "7 Sistemi Integrati",
          realTime: "Flusso di Dati in Tempo Reale",
          insights: "Analisi IA",
          coverage: "Copertura Nazionale"
        }
      },
      mobility: {
        title: "Mobilità Intelligente",
        subtitle: "Ecosistema di trasporto connesso",
        comingSoon: "Prossimamente",
        integration: "Integrazione in Corso",
        notifyPlaceholder: "Inserisci email per essere notificato",
        notifyBtn: "Avvisami",
        added: "Aggiunto alla lista!",
        airport: {
          title: "Trasferimenti Aeroportuali",
          desc: "Trasferimenti fluidi dagli aeroporti internazionali del Cairo, Sphinx e Luxor."
        },
        city: {
          title: "Trasporto Urbano",
          desc: "Veicoli intelligenti su richiesta per spostamenti sicuri in città."
        },
        buses: {
          title: "Bus Turistici",
          desc: "Autobus ecologici interurbani che collegano i principali governatorati e attrazioni."
        },
        nile: {
          title: "Crociere sul Nilo",
          desc: "Prenotazione integrata per crociere intelligenti e autenticate sul Nilo."
        }
      }
    }
  },
  es: {
    home: {
      fourPillars: {
        title: "Los Cuatro Pilares Fundamentales",
        subtitle: "Una experiencia digital fluida desde la planificación hasta los recuerdos",
        aiPlanning: {
          title: "Planificación con IA",
          desc: "Itinerarios personalizados en segundos según tus preferencias, presupuesto y estilo de viaje.",
          action: "Planear un Viaje"
        },
        smartSites: {
          title: "Sitios Inteligentes",
          desc: "Exploración con AR y traducción instantánea de jeroglíficos mediante IA.",
          action: "Escanear Sitios"
        },
        vrEgypt: {
          title: "Egipto VR",
          desc: "Acceso virtual a tumbas y monumentos restringidos en todo el mundo.",
          action: "Entrar en VR"
        },
        aiMemories: {
          title: "Recuerdos IA",
          desc: "Organiza y mejora automáticamente las fotos de tu viaje.",
          action: "Ver Recuerdos"
        }
      },
      smartTourism: {
        title: "Resumen del Turismo Inteligente",
        subtitle: "Revolucionando cómo el mundo experimenta Egipto",
        aiPowered: {
          title: "Turismo Impulsado por IA",
          desc: "Planificación de viajes IA personalizada que entiende tus preferencias para crear la aventura egipcia perfecta.",
          tag: "Aprendizaje Automático"
        },
        smartHeritage: {
          title: "Patrimonio Inteligente",
          desc: "Preservación digital y experiencias AR en los sitios arqueológicos más valiosos de Egipto.",
          tag: "Gemelo Digital"
        },
        distribution: {
          title: "Distribución Turística Inteligente",
          desc: "Gestión de multitudes con IA y enrutamiento inteligente para un turismo sostenible.",
          tag: "Análisis en Tiempo Real"
        }
      },
      ecosystem: {
        tourists: "Turistas",
        businesses: "Empresas",
        data: "Datos",
        heritage: "Patrimonio",
        stats: {
          systems: "7 Sistemas Integrados",
          realTime: "Flujo de Datos en Tiempo Real",
          insights: "Perspectivas de IA",
          coverage: "Cobertura Nacional"
        }
      },
      mobility: {
        title: "Movilidad Inteligente",
        subtitle: "Ecosistema de transporte conectado",
        comingSoon: "Próximamente",
        integration: "Integración en Progreso",
        notifyPlaceholder: "Ingresa email para ser notificado",
        notifyBtn: "Notificarme",
        added: "¡Añadido a la lista!",
        airport: {
          title: "Traslados al Aeropuerto",
          desc: "Traslados fluidos desde los aeropuertos internacionales de El Cairo, Sphinx y Luxor."
        },
        city: {
          title: "Transporte Urbano",
          desc: "Vehículos inteligentes bajo demanda para viajes seguros dentro de la ciudad."
        },
        buses: {
          title: "Autobuses Turísticos",
          desc: "Autobuses ecológicos interurbanos que conectan principales gobernaciones y atracciones."
        },
        nile: {
          title: "Cruceros por el Nilo",
          desc: "Reserva integrada para cruceros inteligentes y autenticados por el Nilo."
        }
      }
    }
  },
  zh: {
    home: {
      fourPillars: {
        title: "四大核心支柱",
        subtitle: "从规划到回忆的无缝数字体验",
        aiPlanning: {
          title: "AI规划",
          desc: "根据偏好、预算和旅行风格，在几秒内生成个性化行程。",
          action: "规划旅程"
        },
        smartSites: {
          title: "智慧景点",
          desc: "AR增强探索和AI即时翻译象形文字。",
          action: "扫描景点"
        },
        vrEgypt: {
          title: "VR埃及",
          desc: "虚拟访问全球受限制的陵墓和古迹。",
          action: "进入VR"
        },
        aiMemories: {
          title: "AI记忆",
          desc: "自动整理和优化您的旅行照片。",
          action: "查看回忆"
        }
      },
      smartTourism: {
        title: "智慧旅游概览",
        subtitle: "彻底改变世界体验埃及的方式",
        aiPowered: {
          title: "AI驱动旅游",
          desc: "个性化AI旅行规划，理解您的偏好、节奏和激情，打造完美埃及之旅。",
          tag: "机器学习"
        },
        smartHeritage: {
          title: "智慧遗产",
          desc: "在埃及最珍贵的考古遗址进行数字保护和AR增强体验。",
          tag: "数字孪生"
        },
        distribution: {
          title: "智能旅游分配",
          desc: "AI驱动的人群管理和智能路线规划，确保可持续旅游并最大化游客体验。",
          tag: "实时分析"
        }
      },
      ecosystem: {
        tourists: "游客",
        businesses: "企业",
        data: "数据",
        heritage: "遗产",
        stats: {
          systems: "7个集成系统",
          realTime: "实时数据流",
          insights: "AI洞察",
          coverage: "全国覆盖"
        }
      },
      mobility: {
        title: "智能出行",
        subtitle: "互联交通生态系统",
        comingSoon: "即将推出",
        integration: "集成进行中",
        notifyPlaceholder: "输入邮箱获取通知",
        notifyBtn: "通知我",
        added: "已添加到列表！",
        airport: {
          title: "机场接送",
          desc: "无缝对接开罗、斯芬克斯和卢克索国际机场。"
        },
        city: {
          title: "城市交通",
          desc: "按需智能车辆，提供安全可靠的市内出行。"
        },
        buses: {
          title: "旅游巴士",
          desc: "环保城际巴士，连接各省和主要景点。"
        },
        nile: {
          title: "尼罗河游轮",
          desc: "集成预订经认证的智能尼罗河游轮。"
        }
      }
    }
  },
  ru: {
    home: {
      fourPillars: {
        title: "Четыре Основных Столпа",
        subtitle: "Бесшовный цифровой опыт от планирования до воспоминаний",
        aiPlanning: {
          title: "Планирование с ИИ",
          desc: "Персонализированные маршруты за секунды на основе ваших предпочтений, бюджета и стиля путешествия.",
          action: "Спланировать Поездку"
        },
        smartSites: {
          title: "Умные Объекты",
          desc: "AR-исследование и мгновенный перевод иероглифов с помощью ИИ.",
          action: "Сканировать Объекты"
        },
        vrEgypt: {
          title: "VR Египет",
          desc: "Виртуальный доступ к закрытым гробницам и памятникам по всему миру.",
          action: "Войти в VR"
        },
        aiMemories: {
          title: "ИИ-воспоминания",
          desc: "Автоматически организовывайте и улучшайте фотографии вашего путешествия.",
          action: "Просмотреть Воспоминания"
        }
      },
      smartTourism: {
        title: "Обзор Умного Туризма",
        subtitle: "Революция в том, как мир воспринимает Египет",
        aiPowered: {
          title: "Туризм на основе ИИ",
          desc: "Персонализированное планирование путешествий с ИИ, понимающим ваши предпочтения для создания идеального египетского приключения.",
          tag: "Машинное Обучение"
        },
        smartHeritage: {
          title: "Умное Наследие",
          desc: "Цифровое сохранение и AR-улучшенный опыт на ценнейших археологических объектах Египта.",
          tag: "Цифровой Двойник"
        },
        distribution: {
          title: "Интеллектуальное Распределение Туризма",
          desc: "Управление потоками туристов с ИИ и умная маршрутизация для устойчивого туризма.",
          tag: "Аналитика в Реальном Времени"
        }
      },
      ecosystem: {
        tourists: "Туристы",
        businesses: "Бизнес",
        data: "Данные",
        heritage: "Наследие",
        stats: {
          systems: "7 Интегрированных Систем",
          realTime: "Поток Данных в Реальном Времени",
          insights: "ИИ-аналитика",
          coverage: "Общенациональный Охват"
        }
      },
      mobility: {
        title: "Умная Мобильность",
        subtitle: "Подключённая транспортная экосистема",
        comingSoon: "Скоро",
        integration: "Интеграция в процессе",
        notifyPlaceholder: "Введите email для уведомления",
        notifyBtn: "Уведомить меня",
        added: "Добавлено в список!",
        airport: {
          title: "Трансферы из Аэропорта",
          desc: "Бесшовные трансферы из международных аэропортов Каира, Сфинкса и Луксора."
        },
        city: {
          title: "Городской Транспорт",
          desc: "Умные автомобили по запросу для безопасных поездок по городу."
        },
        buses: {
          title: "Туристические Автобусы",
          desc: "Экологичные межгородские автобусы, соединяющие основные мухафазы и достопримечательности."
        },
        nile: {
          title: "Круизы по Нилу",
          desc: "Интегрированное бронирование аутентифицированных умных круизов по Нилу."
        }
      }
    }
  }
};

['ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'].forEach(lang => {
  const f = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(f, 'utf8'));
  deepMerge(data, fixes[lang]);
  fs.writeFileSync(f, JSON.stringify(data, null, 2));
  console.log('Fixed ' + f);
});

console.log('\nAll non-English JSON files updated with real translations.');
