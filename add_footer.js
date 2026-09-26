const fs = require('fs');

const languages = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'];

// Data to add
const additions = {
  en: {
    "footer.title": "EgyptX AI",
    "footer.subtitle": "The National Smart Tourism Ecosystem.",
    "footer.explore": "Explore",
    "footer.home": "Home",
    "footer.aiPlanner": "AI Planner",
    "footer.exploreEgypt": "Explore Egypt",
    "footer.smartSites": "Smart Sites",
    "footer.experience": "Experience",
    "footer.museumAi": "Museum AI",
    "footer.hiddenEgypt": "Hidden Egypt",
    "footer.emergency": "Emergency Assistant",
    "footer.touristPassport": "Tourist Passport",
    "footer.ecosystem": "Ecosystem",
    "footer.commandCenter": "Command Center",
    "footer.businessPortal": "Business Portal",
    "footer.government": "Government",
    "footer.partners": "Partners",
    "footer.discover": "Discover",
    "footer.egyptianCrafts": "Egyptian Crafts",
    "footer.about": "About EgyptX",
    "footer.technology": "Technology",
    "footer.terms": "Terms & Privacy",
    "footer.copy": "© 2026 EgyptX AI. The National Smart Tourism Ecosystem."
  },
  ar: {
    "footer.title": "مصر إكس الذكاء الاصطناعي", "footer.subtitle": "النظام الوطني الذكي للسياحة.", "footer.explore": "استكشف", "footer.home": "الرئيسية", "footer.aiPlanner": "المخطط الذكي", "footer.exploreEgypt": "استكشف مصر", "footer.smartSites": "المواقع الذكية", "footer.experience": "تجربة", "footer.museumAi": "متحف الذكاء الاصطناعي", "footer.hiddenEgypt": "مصر المخفية", "footer.emergency": "مساعد الطوارئ", "footer.touristPassport": "جواز السفر السياحي", "footer.ecosystem": "النظام البيئي", "footer.commandCenter": "مركز القيادة", "footer.businessPortal": "بوابة الأعمال", "footer.government": "الحكومة", "footer.partners": "الشركاء", "footer.discover": "اكتشف", "footer.egyptianCrafts": "الحرف المصرية", "footer.about": "عن مصر إكس", "footer.technology": "التكنولوجيا", "footer.terms": "الشروط والخصوصية", "footer.copy": "© 2026 مصر إكس الذكاء الاصطناعي. النظام الوطني الذكي للسياحة."
  },
  fr: {
    "footer.title": "EgyptX IA", "footer.subtitle": "L'écosystème national du tourisme intelligent.", "footer.explore": "Explorer", "footer.home": "Accueil", "footer.aiPlanner": "Planificateur IA", "footer.exploreEgypt": "Explorer l'Égypte", "footer.smartSites": "Sites Intelligents", "footer.experience": "Expérience", "footer.museumAi": "Musée IA", "footer.hiddenEgypt": "L'Égypte Cachée", "footer.emergency": "Assistant d'Urgence", "footer.touristPassport": "Passeport Touristique", "footer.ecosystem": "Écosystème", "footer.commandCenter": "Centre de Commande", "footer.businessPortal": "Portail Entreprises", "footer.government": "Gouvernement", "footer.partners": "Partenaires", "footer.discover": "Découvrir", "footer.egyptianCrafts": "Artisanat Égyptien", "footer.about": "À propos d'EgyptX", "footer.technology": "Technologie", "footer.terms": "Conditions & Confidentialité", "footer.copy": "© 2026 EgyptX IA. L'écosystème national du tourisme intelligent."
  },
  de: {
    "footer.title": "EgyptX KI", "footer.subtitle": "Das nationale Smart-Tourismus-Ökosystem.", "footer.explore": "Erkunden", "footer.home": "Startseite", "footer.aiPlanner": "KI-Planer", "footer.exploreEgypt": "Ägypten erkunden", "footer.smartSites": "Smart-Stätten", "footer.experience": "Erlebnis", "footer.museumAi": "KI-Museum", "footer.hiddenEgypt": "Verborgenes Ägypten", "footer.emergency": "Notfallassistent", "footer.touristPassport": "Touristenpass", "footer.ecosystem": "Ökosystem", "footer.commandCenter": "Kommandozentrale", "footer.businessPortal": "Unternehmensportal", "footer.government": "Regierung", "footer.partners": "Partner", "footer.discover": "Entdecken", "footer.egyptianCrafts": "Ägyptisches Kunsthandwerk", "footer.about": "Über EgyptX", "footer.technology": "Technologie", "footer.terms": "AGB & Datenschutz", "footer.copy": "© 2026 EgyptX KI. Das nationale Smart-Tourismus-Ökosystem."
  },
  it: {
    "footer.title": "EgyptX IA", "footer.subtitle": "L'Ecosistema Nazionale del Turismo Intelligente.", "footer.explore": "Esplora", "footer.home": "Home", "footer.aiPlanner": "Pianificatore IA", "footer.exploreEgypt": "Esplora l'Egitto", "footer.smartSites": "Siti Intelligenti", "footer.experience": "Esperienza", "footer.museumAi": "Museo IA", "footer.hiddenEgypt": "Egitto Nascosto", "footer.emergency": "Assistente Emergenze", "footer.touristPassport": "Passaporto Turistico", "footer.ecosystem": "Ecosistema", "footer.commandCenter": "Centro di Comando", "footer.businessPortal": "Portale Aziendale", "footer.government": "Governo", "footer.partners": "Partner", "footer.discover": "Scopri", "footer.egyptianCrafts": "Artigianato Egiziano", "footer.about": "Informazioni su EgyptX", "footer.technology": "Tecnologia", "footer.terms": "Termini e Privacy", "footer.copy": "© 2026 EgyptX IA. L'Ecosistema Nazionale del Turismo Intelligente."
  },
  es: {
    "footer.title": "EgyptX IA", "footer.subtitle": "El Ecosistema Nacional de Turismo Inteligente.", "footer.explore": "Explorar", "footer.home": "Inicio", "footer.aiPlanner": "Planificador IA", "footer.exploreEgypt": "Explorar Egipto", "footer.smartSites": "Sitios Inteligentes", "footer.experience": "Experiencia", "footer.museumAi": "Museo IA", "footer.hiddenEgypt": "Egipto Oculto", "footer.emergency": "Asistente de Emergencia", "footer.touristPassport": "Pasaporte Turístico", "footer.ecosystem": "Ecosistema", "footer.commandCenter": "Centro de Mando", "footer.businessPortal": "Portal Empresarial", "footer.government": "Gobierno", "footer.partners": "Socios", "footer.discover": "Descubrir", "footer.egyptianCrafts": "Artesanías Egipcias", "footer.about": "Acerca de EgyptX", "footer.technology": "Tecnología", "footer.terms": "Términos y Privacidad", "footer.copy": "© 2026 EgyptX IA. El Ecosistema Nacional de Turismo Inteligente."
  },
  zh: {
    "footer.title": "EgyptX AI", "footer.subtitle": "国家智能旅游生态系统。", "footer.explore": "探索", "footer.home": "首页", "footer.aiPlanner": "AI规划师", "footer.exploreEgypt": "探索埃及", "footer.smartSites": "智能景点", "footer.experience": "体验", "footer.museumAi": "AI博物馆", "footer.hiddenEgypt": "隐藏的埃及", "footer.emergency": "紧急助手", "footer.touristPassport": "旅游护照", "footer.ecosystem": "生态系统", "footer.commandCenter": "指挥中心", "footer.businessPortal": "商业门户", "footer.government": "政府", "footer.partners": "合作伙伴", "footer.discover": "发现", "footer.egyptianCrafts": "埃及工艺品", "footer.about": "关于EgyptX", "footer.technology": "技术", "footer.terms": "条款与隐私", "footer.copy": "© 2026 EgyptX AI。国家智能旅游生态系统。"
  },
  ru: {
    "footer.title": "EgyptX ИИ", "footer.subtitle": "Национальная умная туристическая экосистема.", "footer.explore": "Исследовать", "footer.home": "Главная", "footer.aiPlanner": "ИИ-планировщик", "footer.exploreEgypt": "Исследовать Египет", "footer.smartSites": "Умные объекты", "footer.experience": "Опыт", "footer.museumAi": "ИИ-музей", "footer.hiddenEgypt": "Скрытый Египет", "footer.emergency": "Экстренный помощник", "footer.touristPassport": "Паспорт туриста", "footer.ecosystem": "Экосистема", "footer.commandCenter": "Командный центр", "footer.businessPortal": "Бизнес-портал", "footer.government": "Правительство", "footer.partners": "Партнеры", "footer.discover": "Открывать", "footer.egyptianCrafts": "Египетские ремесла", "footer.about": "О EgyptX", "footer.technology": "Технологии", "footer.terms": "Условия и конфиденциальность", "footer.copy": "© 2026 EgyptX ИИ. Национальная умная туристическая экосистема."
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

console.log('Added missing footer to all 8 language files.');
