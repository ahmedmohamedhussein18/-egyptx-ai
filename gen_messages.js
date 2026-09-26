const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir);
}

const strings = {
  nav: {
    home: { en: "Home", ar: "الرئيسية", fr: "Accueil", de: "Startseite", it: "Home", es: "Inicio", zh: "主页", ru: "Главная" },
    aiPlanner: { en: "AI Planner", ar: "مخطط الذكاء الاصطناعي", fr: "Planificateur IA", de: "KI-Planer", it: "Pianificatore IA", es: "Planificador IA", zh: "人工智能规划师", ru: "ИИ-Планировщик" },
    exploreEgypt: { en: "Explore Egypt", ar: "استكشف مصر", fr: "Explorer l'Égypte", de: "Entdecke Ägypten", it: "Esplora l'Egitto", es: "Explorar Egipto", zh: "探索埃及", ru: "Исследуйте Египет" },
    hiddenEgypt: { en: "Hidden Egypt", ar: "مصر الخفية", fr: "Égypte Cachée", de: "Verstecktes Ägypten", it: "Egitto Nascosto", es: "Egipto Oculto", zh: "隐藏的埃及", ru: "Скрытый Египет" },
    crafts: { en: "Crafts", ar: "الحرف اليدوية", fr: "Artisanat", de: "Handwerk", it: "Artigianato", es: "Artesanías", zh: "工艺品", ru: "Ремесла" },
    touristPassport: { en: "Tourist Passport", ar: "جواز السفر السياحي", fr: "Passeport Touristique", de: "Touristenpass", it: "Passaporto Turistico", es: "Pasaporte Turístico", zh: "旅游护照", ru: "Туристический паспорт" },
    news: { en: "News", ar: "الأخبار", fr: "Actualités", de: "Nachrichten", it: "Notizie", es: "Noticias", zh: "新闻", ru: "Новости" },
    login: { en: "Login", ar: "تسجيل الدخول", fr: "Connexion", de: "Anmelden", it: "Accedi", es: "Iniciar sesión", zh: "登录", ru: "Войти" },
    logout: { en: "Logout", ar: "تسجيل الخروج", fr: "Déconnexion", de: "Abmelden", it: "Esci", es: "Cerrar sesión", zh: "登出", ru: "Выйти" },
    command: { en: "Command", ar: "مركز القيادة", fr: "Commande", de: "Kommandozentrum", it: "Comando", es: "Comando", zh: "指挥中心", ru: "Командный центр" }
  },
  home: {
    title: { en: "EgyptX AI", ar: "إيجيبت إكس الذكاء الاصطناعي", fr: "EgyptX IA", de: "EgyptX KI", it: "EgyptX IA", es: "EgyptX IA", zh: "EgyptX AI", ru: "EgyptX ИИ" },
    subtitle: { en: "The National Smart Tourism Ecosystem", ar: "النظام البيئي الوطني للسياحة الذكية", fr: "L'écosystème National du Tourisme Intelligent", de: "Das nationale smarte Tourismus-Ökosystem", it: "L'Ecosistema Nazionale del Turismo Intelligente", es: "El Ecosistema Nacional de Turismo Inteligente", zh: "国家智能旅游生态系统", ru: "Национальная интеллектуальная туристическая экосистема" },
    slogan: { en: "Discover Egypt. Experience History. Shape the Future.", ar: "اكتشف مصر. عش التاريخ. اصنع المستقبل.", fr: "Découvrez l'Égypte. Vivez l'histoire. Façonnez l'avenir.", de: "Entdecke Ägypten. Erlebe Geschichte. Gestalte die Zukunft.", it: "Scopri l'Egitto. Vivi la Storia. Plasmare il Futuro.", es: "Descubre Egipto. Vive la historia. Da forma al futuro.", zh: "探索埃及。体验历史。塑造未来。", ru: "Откройте для себя Египет. Почувствуйте историю. Создайте будущее." },
    planBtn: { en: "Plan My Journey", ar: "خطط لرحلتي", fr: "Planifier mon voyage", de: "Meine Reise planen", it: "Pianifica il mio viaggio", es: "Planificar mi viaje", zh: "规划我的旅程", ru: "Спланировать мое путешествие" },
    exploreBtn: { en: "Explore Egypt", ar: "استكشف مصر", fr: "Explorer l'Égypte", de: "Entdecke Ägypten", it: "Esplora l'Egitto", es: "Explorar Egipto", zh: "探索埃及", ru: "Исследуйте Египет" },
    virtualEgypt: { en: "Virtual Egypt", ar: "مصر الافتراضية", fr: "Égypte Virtuelle", de: "Virtuelles Ägypten", it: "Egitto Virtuale", es: "Egipto Virtual", zh: "虚拟埃及", ru: "Виртуальный Египет" },
    sitesCount: { en: "50+ Sites", ar: "أكثر من 50 موقعاً", fr: "+50 Sites", de: "50+ Orte", it: "Oltre 50 Siti", es: "Más de 50 sitios", zh: "50多个景点", ru: "Более 50 мест" },
    aiPowered: { en: "AI-Powered", ar: "مدعوم بالذكاء الاصطناعي", fr: "Propulsé par l'IA", de: "KI-gesteuert", it: "Alimentato da IA", es: "Impulsado por IA", zh: "人工智能驱动", ru: "На базе ИИ" },
    realTime: { en: "Real-Time", ar: "في الوقت الحقيقي", fr: "En temps réel", de: "Echtzeit", it: "In Tempo Reale", es: "En tiempo real", zh: "实时", ru: "В реальном времени" }
  },
  planner: {
    title: { en: "Plan Your Egypt Journey", ar: "خطط لرحلتك في مصر", fr: "Planifiez votre voyage en Égypte", de: "Planen Sie Ihre Ägypten-Reise", it: "Pianifica il tuo viaggio in Egitto", es: "Planifica tu viaje a Egipto", zh: "规划您的埃及之旅", ru: "Спланируйте свое путешествие по Египту" },
    prompt: { en: "Tell us about your dream trip...", ar: "أخبرنا عن رحلة أحلامك...", fr: "Parlez-nous de votre voyage de rêve...", de: "Erzählen Sie uns von Ihrer Traumreise...", it: "Raccontaci il tuo viaggio da sogno...", es: "Cuéntanos sobre tu viaje soñado...", zh: "告诉我们您的梦想之旅...", ru: "Расскажите нам о поездке своей мечты..." },
    whereFrom: { en: "Where are you from?", ar: "من أين أنت؟", fr: "D'où venez-vous ?", de: "Woher kommen Sie?", it: "Di dove sei?", es: "¿De dónde eres?", zh: "您来自哪里？", ru: "Откуда вы?" },
    targetGov: { en: "Target Governorate", ar: "المحافظة المستهدفة", fr: "Gouvernorat cible", de: "Zielgouvernement", it: "Governatorato di destinazione", es: "Gobernación objetivo", zh: "目标省份", ru: "Целевая мухафаза" },
    anywhere: { en: "Anywhere in Egypt", ar: "في أي مكان في مصر", fr: "Partout en Égypte", de: "Überall in Ägypten", it: "Ovunque in Egitto", es: "Cualquier lugar en Egipto", zh: "埃及任何地方", ru: "Где угодно в Египте" },
    travelers: { en: "Travelers", ar: "المسافرون", fr: "Voyageurs", de: "Reisende", it: "Viaggiatori", es: "Viajeros", zh: "游客", ru: "Путешественники" },
    pace: { en: "Preferred Pace", ar: "الوتيرة المفضلة", fr: "Rythme préféré", de: "Bevorzugtes Tempo", it: "Ritmo preferito", es: "Ritmo preferido", zh: "喜欢的节奏", ru: "Предпочтительный темп" },
    paceRelaxed: { en: "Relaxed", ar: "مريحة", fr: "Détendu", de: "Entspannt", it: "Rilassato", es: "Relajado", zh: "轻松", ru: "Спокойный" },
    paceBalanced: { en: "Balanced", ar: "متوازنة", fr: "Équilibré", de: "Ausgewogen", it: "Equilibrato", es: "Equilibrado", zh: "平衡", ru: "Сбалансированный" },
    pacePacked: { en: "Packed", ar: "مزدحمة", fr: "Chargé", de: "Vollgepackt", it: "Intenso", es: "Lleno", zh: "紧凑", ru: "Насыщенный" },
    duration: { en: "Trip Duration", ar: "مدة الرحلة", fr: "Durée du voyage", de: "Reisedauer", it: "Durata del viaggio", es: "Duración del viaje", zh: "旅行时间", ru: "Продолжительность поездки" },
    budget: { en: "Budget", ar: "الميزانية", fr: "Budget", de: "Budget", it: "Budget", es: "Presupuesto", zh: "预算", ru: "Бюджет" },
    interests: { en: "What interests you?", ar: "ما الذي يثير اهتمامك؟", fr: "Qu'est-ce qui vous intéresse ?", de: "Was interessiert Sie?", it: "Cosa ti interessa?", es: "¿Qué te interesa?", zh: "您对什么感兴趣？", ru: "Что вас интересует?" },
    style: { en: "Travel Style", ar: "أسلوب السفر", fr: "Style de voyage", de: "Reisestil", it: "Stile di viaggio", es: "Estilo de viaje", zh: "旅行风格", ru: "Стиль путешествия" },
    constraints: { en: "Additional Constraints", ar: "قيود إضافية", fr: "Contraintes supplémentaires", de: "Zusätzliche Einschränkungen", it: "Vincoli aggiuntivi", es: "Restricciones adicionales", zh: "额外限制", ru: "Дополнительные ограничения" },
    accessibility: { en: "Accessibility Needs", ar: "احتياجات الوصول", fr: "Besoins d'accessibilité", de: "Anforderungen an die Barrierefreiheit", it: "Esigenze di accessibilità", es: "Necesidades de accesibilidad", zh: "无障碍需求", ru: "Требования к доступности" },
    avoid: { en: "Places to Avoid", ar: "أماكن لتجنبها", fr: "Endroits à éviter", de: "Zu meidende Orte", it: "Luoghi da evitare", es: "Lugares a evitar", zh: "要避免的地方", ru: "Места, которых следует избегать" },
    lessCrowded: { en: "Prefer less crowded locations", ar: "تفضيل الأماكن الأقل ازدحاماً", fr: "Préférer les endroits moins fréquentés", de: "Weniger überfüllte Orte bevorzugen", it: "Preferisci luoghi meno affollati", es: "Preferir lugares menos concurridos", zh: "倾向于不拥挤的地方", ru: "Предпочитать менее многолюдные места" },
    generateBtn: { en: "Generate My Egypt Journey", ar: "قم بإنشاء رحلتي في مصر", fr: "Générer mon voyage en Égypte", de: "Meine Ägypten-Reise generieren", it: "Genera il mio viaggio in Egitto", es: "Generar mi viaje a Egipto", zh: "生成我的埃及之旅", ru: "Сгенерировать мое путешествие по Египту" },
    loading1: { en: "Analyzing your preferences...", ar: "جاري تحليل تفضيلاتك...", fr: "Analyse de vos préférences...", de: "Analysiere Ihre Präferenzen...", it: "Analisi delle tue preferenze...", es: "Analizando tus preferencias...", zh: "正在分析您的偏好...", ru: "Анализ ваших предпочтений..." },
    loading2: { en: "Building your journey...", ar: "جاري بناء رحلتك...", fr: "Construction de votre voyage...", de: "Erstelle Ihre Reise...", it: "Costruzione del tuo viaggio...", es: "Construyendo tu viaje...", zh: "正在构建您的旅程...", ru: "Создание вашего путешествия..." },
    itineraryTitle: { en: "Your Personalized Itinerary", ar: "مسار رحلتك المخصص", fr: "Votre itinéraire personnalisé", de: "Ihr persönlicher Reiseplan", it: "Il tuo itinerario personalizzato", es: "Tu itinerario personalizado", zh: "您的个性化行程", ru: "Ваш индивидуальный маршрут" },
    day: { en: "Day", ar: "اليوم", fr: "Jour", de: "Tag", it: "Giorno", es: "Día", zh: "第", ru: "День" },
    morning: { en: "Morning", ar: "الصباح", fr: "Matin", de: "Morgen", it: "Mattina", es: "Mañana", zh: "早上", ru: "Утро" },
    afternoon: { en: "Afternoon", ar: "بعد الظهر", fr: "Après-midi", de: "Nachmittag", it: "Pomeriggio", es: "Tarde", zh: "下午", ru: "День" },
    evening: { en: "Evening", ar: "المساء", fr: "Soirée", de: "Abend", it: "Sera", es: "Noche", zh: "晚上", ru: "Вечер" },
    modifyBtn: { en: "Modify Plan", ar: "تعديل الخطة", fr: "Modifier le plan", de: "Plan ändern", it: "Modifica piano", es: "Modificar plan", zh: "修改计划", ru: "Изменить план" }
  },
  explore: {
    title: { en: "Explore Egypt", ar: "استكشف مصر", fr: "Explorer l'Égypte", de: "Entdecke Ägypten", it: "Esplora l'Egitto", es: "Explorar Egipto", zh: "探索埃及", ru: "Исследуйте Египет" },
    subtitle: { en: "From ancient wonders to hidden oases", ar: "من العجائب القديمة إلى الواحات الخفية", fr: "Des merveilles antiques aux oasis cachées", de: "Von antiken Wundern zu versteckten Oasen", it: "Dalle antiche meraviglie alle oasi nascoste", es: "De maravillas antiguas a oasis ocultos", zh: "从古代奇迹到隐藏的绿洲", ru: "От древних чудес до скрытых оазисов" },
    map: { en: "Interactive Map", ar: "خريطة تفاعلية", fr: "Carte interactive", de: "Interaktive Karte", it: "Mappa interattiva", es: "Mapa interactivo", zh: "交互式地图", ru: "Интерактивная карта" },
    noRating: { en: "Rating unavailable", ar: "التقييم غير متوفر", fr: "Note indisponible", de: "Bewertung nicht verfügbar", it: "Valutazione non disponibile", es: "Calificación no disponible", zh: "暂无评分", ru: "Рейтинг недоступен" },
    noCrowd: { en: "Crowd data unavailable", ar: "بيانات الازدحام غير متوفرة", fr: "Données d'affluence indisponibles", de: "Besucherdaten nicht verfügbar", it: "Dati sull'affollamento non disponibili", es: "Datos de afluencia no disponibles", zh: "人群数据不可用", ru: "Данные о толпе недоступны" },
    exploreDest: { en: "Explore Destination", ar: "استكشف الوجهة", fr: "Explorer la destination", de: "Zielort erkunden", it: "Esplora destinazione", es: "Explorar destino", zh: "探索目的地", ru: "Исследовать пункт назначения" }
  },
  passport: {
    title: { en: "My EgyptX Passport", ar: "جواز سفري السياحي", fr: "Mon passeport EgyptX", de: "Mein EgyptX Pass", it: "Il mio passaporto EgyptX", es: "Mi pasaporte EgyptX", zh: "我的 EgyptX 护照", ru: "Мой паспорт EgyptX" },
    journey: { en: "Tourist's Journey", ar: "رحلة السائح", fr: "Le voyage du touriste", de: "Die Reise des Touristen", it: "Il viaggio del turista", es: "El viaje del turista", zh: "游客的旅程", ru: "Путешествие туриста" },
    totalStamps: { en: "Total Stamps", ar: "إجمالي الأختام", fr: "Total des tampons", de: "Gesamtstempel", it: "Totale Timbri", es: "Total de sellos", zh: "邮票总数", ru: "Всего штампов" },
    status: { en: "Status: Verified", ar: "الحالة: موثق", fr: "Statut : Vérifié", de: "Status: Verifiziert", it: "Stato: Verificato", es: "Estado: Verificado", zh: "状态：已验证", ru: "Статус: Подтверждено" },
    visited: { en: "Visited Places", ar: "الأماكن المزارة", fr: "Lieux visités", de: "Besuchte Orte", it: "Luoghi visitati", es: "Lugares visitados", zh: "游览过的地方", ru: "Посещенные места" },
    achievements: { en: "Achievements & Badges", ar: "الإنجازات والشارات", fr: "Réalisations et badges", de: "Erfolge und Abzeichen", it: "Risultati e Distintivi", es: "Logros y Medallas", zh: "成就与徽章", ru: "Достижения и значки" },
    start: { en: "Start exploring to collect your first stamp", ar: "ابدأ الاستكشاف لجمع أول ختم لك", fr: "Commencez à explorer pour collecter votre premier tampon", de: "Beginnen Sie mit der Erkundung, um Ihren ersten Stempel zu sammeln", it: "Inizia a esplorare per collezionare il tuo primo timbro", es: "Empieza a explorar para coleccionar tu primer sello", zh: "开始探索以收集您的第一枚邮票", ru: "Начните исследовать, чтобы получить свою первую печать" },
    planned: { en: "My Planned Trips", ar: "رحلاتي المخططة", fr: "Mes voyages prévus", de: "Meine geplanten Reisen", it: "I miei viaggi pianificati", es: "Mis viajes planeados", zh: "我的计划旅行", ru: "Мои запланированные поездки" }
  },
  emergency: {
    title: { en: "Emergency Assistant", ar: "مساعد الطوارئ", fr: "Assistant d'urgence", de: "Notfallassistent", it: "Assistente di emergenza", es: "Asistente de emergencia", zh: "紧急助手", ru: "Экстренный помощник" },
    hospital: { en: "Find Nearest Hospital", ar: "ابحث عن أقرب مستشفى", fr: "Trouver l'hôpital le plus proche", de: "Nächstes Krankenhaus finden", it: "Trova l'ospedale più vicino", es: "Buscar el hospital más cercano", zh: "寻找最近的医院", ru: "Найти ближайшую больницу" },
    police: { en: "Find Nearest Police Station", ar: "ابحث عن أقرب قسم شرطة", fr: "Trouver le poste de police le plus proche", de: "Nächste Polizeiwache finden", it: "Trova la stazione di polizia più vicina", es: "Buscar la comisaría más cercana", zh: "寻找最近的警察局", ru: "Найти ближайший полицейский участок" },
    disclaimer: { en: "EgyptX AI does not replace official emergency services", ar: "إيجيبت إكس الذكاء الاصطناعي لا يحل محل خدمات الطوارئ الرسمية", fr: "EgyptX IA ne remplace pas les services d'urgence officiels", de: "EgyptX KI ersetzt keine offiziellen Notfalldienste", it: "EgyptX IA non sostituisce i servizi di emergenza ufficiali", es: "EgyptX IA no reemplaza a los servicios de emergencia oficiales", zh: "EgyptX AI 不取代官方紧急服务", ru: "EgyptX ИИ не заменяет официальные экстренные службы" }
  },
  common: {
    loading: { en: "Loading...", ar: "جاري التحميل...", fr: "Chargement...", de: "Wird geladen...", it: "Caricamento...", es: "Cargando...", zh: "加载中...", ru: "Загрузка..." },
    error: { en: "Error", ar: "خطأ", fr: "Erreur", de: "Fehler", it: "Errore", es: "Error", zh: "错误", ru: "Ошибка" },
    wrong: { en: "Something went wrong", ar: "حدث خطأ ما", fr: "Quelque chose a mal tourné", de: "Etwas ist schief gelaufen", it: "Qualcosa è andato storto", es: "Algo salió mal", zh: "发生了一些错误", ru: "Что-то пошло не так" },
    tryAgain: { en: "Try Again", ar: "حاول مرة أخرى", fr: "Réessayer", de: "Erneut versuchen", it: "Riprova", es: "Inténtalo de nuevo", zh: "再试一次", ru: "Попробовать снова" },
    dataUnavailable: { en: "Data unavailable", ar: "البيانات غير متوفرة", fr: "Données indisponibles", de: "Daten nicht verfügbar", it: "Dati non disponibili", es: "Datos no disponibles", zh: "数据不可用", ru: "Данные недоступны" },
    awaitingData: { en: "Awaiting verified data source", ar: "في انتظار مصدر بيانات موثق", fr: "En attente d'une source de données vérifiée", de: "Warte auf verifizierte Datenquelle", it: "In attesa di fonte di dati verificata", es: "Esperando fuente de datos verificada", zh: "等待验证的数据源", ru: "Ожидание проверенного источника данных" },
    back: { en: "Back", ar: "رجوع", fr: "Retour", de: "Zurück", it: "Indietro", es: "Atrás", zh: "返回", ru: "Назад" },
    save: { en: "Save", ar: "حفظ", fr: "Enregistrer", de: "Speichern", it: "Salva", es: "Guardar", zh: "保存", ru: "Сохранить" },
    cancel: { en: "Cancel", ar: "إلغاء", fr: "Annuler", de: "Abbrechen", it: "Annulla", es: "Cancelar", zh: "取消", ru: "Отмена" },
    close: { en: "Close", ar: "إغلاق", fr: "Fermer", de: "Schließen", it: "Chiudi", es: "Cerrar", zh: "关闭", ru: "Закрыть" },
    search: { en: "Search", ar: "بحث", fr: "Rechercher", de: "Suchen", it: "Cerca", es: "Buscar", zh: "搜索", ru: "Поиск" },
    submit: { en: "Submit", ar: "إرسال", fr: "Soumettre", de: "Einreichen", it: "Invia", es: "Enviar", zh: "提交", ru: "Отправить" },
    footer: { en: "The National Smart Tourism Ecosystem", ar: "النظام البيئي الوطني للسياحة الذكية", fr: "L'écosystème National du Tourisme Intelligent", de: "Das nationale smarte Tourismus-Ökosystem", it: "L'Ecosistema Nazionale del Turismo Intelligente", es: "El Ecosistema Nacional de Turismo Inteligente", zh: "国家智能旅游生态系统", ru: "Национальная интеллектуальная туристическая экосистема" }
  },
  aiGuide: {
    title: { en: "AI Vision Guide", ar: "دليل الرؤية الذكي", fr: "Guide de vision IA", de: "KI-Vision-Leitfaden", it: "Guida alla visione IA", es: "Guía de visión IA", zh: "AI视觉指南", ru: "Руководство по ИИ-зрению" },
    snap: { en: "Snap a photo of any monument...", ar: "التقط صورة لأي أثر...", fr: "Prenez une photo de n'importe quel monument...", de: "Machen Sie ein Foto von einem beliebigen Denkmal...", it: "Scatta una foto di qualsiasi monumento...", es: "Toma una foto de cualquier monumento...", zh: "拍摄任何纪念碑的照片...", ru: "Сфотографируйте любой памятник..." },
    identify: { en: "Identify with AI", ar: "التعرف بالذكاء الاصطناعي", fr: "Identifier avec l'IA", de: "Mit KI identifizieren", it: "Identifica con IA", es: "Identificar con IA", zh: "用AI识别", ru: "Определить с помощью ИИ" },
    high: { en: "HIGH CONFIDENCE", ar: "ثقة عالية", fr: "HAUTE CONFIANCE", de: "HOHE ZUVERSICHT", it: "ALTA FIDUCIA", es: "ALTA CONFIANZA", zh: "高置信度", ru: "ВЫСОКАЯ УВЕРЕННОСТЬ" },
    med: { en: "MEDIUM CONFIDENCE", ar: "ثقة متوسطة", fr: "CONFIANCE MOYENNE", de: "MITTLERE ZUVERSICHT", it: "FIDUCIA MEDIA", es: "CONFIANZA MEDIA", zh: "中等置信度", ru: "СРЕДНЯЯ УВЕРЕННОСТЬ" },
    low: { en: "LOW CONFIDENCE", ar: "ثقة منخفضة", fr: "FAIBLE CONFIANCE", de: "GERINGE ZUVERSICHT", it: "BASSA FIDUCIA", es: "BAJA CONFIANZA", zh: "低置信度", ru: "НИЗКАЯ УВЕРЕННОСТЬ" },
    desc: { en: "General AI Description", ar: "الوصف العام للذكاء الاصطناعي", fr: "Description générale de l'IA", de: "Allgemeine KI-Beschreibung", it: "Descrizione generale dell'IA", es: "Descripción general de la IA", zh: "通用AI描述", ru: "Общее описание ИИ" },
    verified: { en: "Verified Location", ar: "موقع موثق", fr: "Emplacement vérifié", de: "Verifizierter Standort", it: "Posizione verificata", es: "Ubicación verificada", zh: "已验证的位置", ru: "Проверенное местоположение" },
    viewFull: { en: "View Full Details", ar: "عرض التفاصيل الكاملة", fr: "Voir tous les détails", de: "Alle Details anzeigen", it: "Visualizza i dettagli completi", es: "Ver detalles completos", zh: "查看完整详情", ru: "Посмотреть полные детали" }
  },
  news: {
    title: { en: "Egypt Tourism News", ar: "أخبار السياحة في مصر", fr: "Actualités du tourisme en Égypte", de: "Ägypten Tourismus Nachrichten", it: "Notizie sul turismo in Egitto", es: "Noticias de turismo en Egipto", zh: "埃及旅游新闻", ru: "Новости туризма Египта" },
    learnMore: { en: "Learn More", ar: "معرفة المزيد", fr: "En savoir plus", de: "Mehr erfahren", it: "Scopri di più", es: "Aprender más", zh: "了解更多", ru: "Узнать больше" },
    source: { en: "Source:", ar: "المصدر:", fr: "Source :", de: "Quelle:", it: "Fonte:", es: "Fuente:", zh: "来源：", ru: "Источник:" }
  },
  memories: {
    title: { en: "My Egypt Memories", ar: "ذكرياتي في مصر", fr: "Mes souvenirs d'Égypte", de: "Meine Ägypten-Erinnerungen", it: "I miei ricordi d'Egitto", es: "Mis recuerdos de Egipto", zh: "我的埃及记忆", ru: "Мои египетские воспоминания" },
    add: { en: "Add Memory", ar: "إضافة ذكرى", fr: "Ajouter un souvenir", de: "Erinnerung hinzufügen", it: "Aggiungi ricordo", es: "Agregar recuerdo", zh: "添加记忆", ru: "Добавить воспоминание" },
    story: { en: "Your Egypt story starts here", ar: "قصتك في مصر تبدأ هنا", fr: "Votre histoire en Égypte commence ici", de: "Ihre Ägypten-Geschichte beginnt hier", it: "La tua storia in Egitto inizia qui", es: "Tu historia en Egipto comienza aquí", zh: "你的埃及故事从这里开始", ru: "Ваша египетская история начинается здесь" },
    upload: { en: "Upload Photo", ar: "رفع صورة", fr: "Télécharger une photo", de: "Foto hochladen", it: "Carica foto", es: "Subir foto", zh: "上传照片", ru: "Загрузить фото" },
    select: { en: "Select Place", ar: "اختر المكان", fr: "Sélectionner le lieu", de: "Ort auswählen", it: "Seleziona luogo", es: "Seleccionar lugar", zh: "选择地点", ru: "Выбрать место" },
    caption: { en: "Caption", ar: "الوصف", fr: "Légende", de: "Bildunterschrift", it: "Didascalia", es: "Leyenda", zh: "标题", ru: "Подпись" }
  },
  expenses: {
    title: { en: "Trip Expenses", ar: "مصروفات الرحلة", fr: "Dépenses de voyage", de: "Reisekosten", it: "Spese di viaggio", es: "Gastos de viaje", zh: "旅行费用", ru: "Расходы на поездку" },
    add: { en: "Add Expense", ar: "إضافة مصروف", fr: "Ajouter une dépense", de: "Ausgabe hinzufügen", it: "Aggiungi spesa", es: "Agregar gasto", zh: "添加费用", ru: "Добавить расход" },
    noExpenses: { en: "No expenses recorded yet", ar: "لم يتم تسجيل أي مصروفات بعد", fr: "Aucune dépense enregistrée pour le moment", de: "Noch keine Ausgaben erfasst", it: "Nessuna spesa registrata ancora", es: "Aún no se han registrado gastos", zh: "暂无费用记录", ru: "Расходы пока не зарегистрированы" }
  }
};

const langs = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'];

langs.forEach(lang => {
  const data = {};
  for (const cat in strings) {
    data[cat] = {};
    for (const key in strings[cat]) {
      data[cat][key] = strings[cat][key][lang];
    }
  }
  fs.writeFileSync(path.join(messagesDir, lang + '.json'), JSON.stringify(data, null, 2), 'utf8');
});

console.log('Generated messages');
