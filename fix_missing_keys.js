const fs = require('fs');

// ============================================
// Exact keys missing from FutureEcosystemSection:
// home.ecosystem.title1, home.ecosystem.title2, home.ecosystem.subtitle,
// home.ecosystem.comingSoon, home.ecosystem.features.*
// ============================================

const langs = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'];

// Full translations for missing FutureEcosystemSection keys in all 8 languages
const translations = {
  en: {
    title1: 'Expanding the ',
    title2: 'Ecosystem',
    subtitle: "EgyptX AI is continuously evolving. Here's what's coming next.",
    comingSoon: 'COMING SOON',
    features: {
      vrEgypt:       { title: 'VR Egypt',                   desc: 'Immersive 360° virtual tours of ancient wonders' },
      kidsMode:      { title: 'Kids Mode',                  desc: 'A magical, educational experience for young explorers' },
      emergency:     { title: 'Emergency Assistant',        desc: '24/7 instant multilingual emergency support and location sharing' },
      aiMemories:    { title: 'AI Memories',                desc: 'Auto-generated story of your journey with photos and highlights' },
      treasureHunt:  { title: 'Treasure Hunt',              desc: 'Gamified exploration challenges with real rewards' },
      sustainability:{ title: 'Sustainability Dashboard',   desc: "Tracking Egypt's environmental impact and progress" },
      researchHub:   { title: 'Research Hub',               desc: "AI-powered access to Egypt's historical and archaeological data" },
    }
  },
  ar: {
    title1: 'توسيع ',
    title2: 'المنظومة',
    subtitle: 'يتطور EgyptX AI باستمرار. إليك ما هو قادم.',
    comingSoon: 'قريباً',
    features: {
      vrEgypt:       { title: 'مصر الافتراضية',            desc: 'جولات افتراضية غامرة بزاوية 360° للعجائب القديمة' },
      kidsMode:      { title: 'وضع الأطفال',               desc: 'تجربة تعليمية سحرية للمستكشفين الصغار' },
      emergency:     { title: 'مساعد الطوارئ',             desc: 'دعم طوارئ متعدد اللغات فوري على مدار الساعة مع مشاركة الموقع' },
      aiMemories:    { title: 'ذكريات الذكاء الاصطناعي',  desc: 'قصة رحلتك المُولَّدة تلقائياً بالصور وأبرز اللحظات' },
      treasureHunt:  { title: 'صيد الكنوز',                desc: 'تحديات استكشاف مُلعَّبة مع مكافآت حقيقية' },
      sustainability:{ title: 'لوحة الاستدامة',            desc: 'تتبع التأثير البيئي ومسيرة التقدم في مصر' },
      researchHub:   { title: 'مركز البحث',                desc: 'وصول مدعوم بالذكاء الاصطناعي إلى البيانات التاريخية والأثرية المصرية' },
    }
  },
  fr: {
    title1: "Expansion de l'",
    title2: 'Écosystème',
    subtitle: "EgyptX AI évolue en permanence. Voici ce qui arrive.",
    comingSoon: 'BIENTÔT',
    features: {
      vrEgypt:       { title: 'Égypte VR',                  desc: 'Visites virtuelles immersives à 360° des merveilles antiques' },
      kidsMode:      { title: 'Mode Enfants',               desc: 'Une expérience éducative magique pour les jeunes explorateurs' },
      emergency:     { title: "Assistant d'urgence",        desc: "Support d'urgence multilingue instantané 24h/24 et partage de localisation" },
      aiMemories:    { title: 'Souvenirs IA',               desc: 'Histoire générée automatiquement de votre voyage avec photos et moments forts' },
      treasureHunt:  { title: 'Chasse au trésor',           desc: 'Défis d\'exploration ludiques avec de vraies récompenses' },
      sustainability:{ title: 'Tableau de bord durabilité', desc: "Suivi de l'impact environnemental et des progrès de l'Égypte" },
      researchHub:   { title: 'Pôle de recherche',          desc: "Accès propulsé par l'IA aux données historiques et archéologiques de l'Égypte" },
    }
  },
  de: {
    title1: 'Erweiterung des ',
    title2: 'Ökosystems',
    subtitle: 'EgyptX AI entwickelt sich ständig weiter. Hier ist, was als nächstes kommt.',
    comingSoon: 'DEMNÄCHST',
    features: {
      vrEgypt:       { title: 'VR Ägypten',                 desc: 'Immersive 360°-Virtualtouren antiker Wunder' },
      kidsMode:      { title: 'Kindermodus',                desc: 'Ein magisches, lehrreiches Erlebnis für junge Entdecker' },
      emergency:     { title: 'Notfallassistent',           desc: '24/7 sofortiger mehrsprachiger Notfallsupport und Standortfreigabe' },
      aiMemories:    { title: 'KI-Erinnerungen',            desc: 'Automatisch generierte Geschichte Ihrer Reise mit Fotos und Highlights' },
      treasureHunt:  { title: 'Schatzsuche',                desc: 'Spielerische Erkundungsherausforderungen mit echten Belohnungen' },
      sustainability:{ title: 'Nachhaltigkeits-Dashboard',  desc: 'Verfolgung der Umweltauswirkungen und des Fortschritts Ägyptens' },
      researchHub:   { title: 'Forschungszentrum',          desc: 'KI-gestützter Zugang zu Ägyptens historischen und archäologischen Daten' },
    }
  },
  it: {
    title1: "Espansione dell'",
    title2: 'Ecosistema',
    subtitle: "EgyptX AI è in continua evoluzione. Ecco cosa sta arrivando.",
    comingSoon: 'PROSSIMAMENTE',
    features: {
      vrEgypt:       { title: 'Egitto VR',                  desc: 'Tour virtuali immersivi a 360° delle meraviglie antiche' },
      kidsMode:      { title: 'Modalità Bambini',           desc: 'Un\'esperienza educativa magica per i giovani esploratori' },
      emergency:     { title: 'Assistente di emergenza',    desc: 'Supporto di emergenza multilingue immediato 24/7 con condivisione della posizione' },
      aiMemories:    { title: 'Ricordi AI',                 desc: 'Storia del viaggio generata automaticamente con foto e momenti salienti' },
      treasureHunt:  { title: 'Caccia al tesoro',           desc: 'Sfide di esplorazione gamificate con ricompense reali' },
      sustainability:{ title: 'Dashboard sostenibilità',    desc: "Monitoraggio dell'impatto ambientale e dei progressi dell'Egitto" },
      researchHub:   { title: 'Hub di ricerca',             desc: "Accesso basato sull'IA ai dati storici e archeologici dell'Egitto" },
    }
  },
  es: {
    title1: 'Expansión del ',
    title2: 'Ecosistema',
    subtitle: 'EgyptX AI evoluciona continuamente. Aquí está lo que viene.',
    comingSoon: 'PRÓXIMAMENTE',
    features: {
      vrEgypt:       { title: 'Egipto VR',                  desc: 'Tours virtuales inmersivos a 360° de maravillas antiguas' },
      kidsMode:      { title: 'Modo Niños',                 desc: 'Una experiencia educativa mágica para jóvenes exploradores' },
      emergency:     { title: 'Asistente de emergencia',    desc: 'Soporte de emergencia multilingüe instantáneo 24/7 y compartición de ubicación' },
      aiMemories:    { title: 'Recuerdos IA',               desc: 'Historia generada automáticamente de tu viaje con fotos y momentos destacados' },
      treasureHunt:  { title: 'Búsqueda del tesoro',        desc: 'Desafíos de exploración gamificados con recompensas reales' },
      sustainability:{ title: 'Panel de sostenibilidad',    desc: 'Seguimiento del impacto ambiental y el progreso de Egipto' },
      researchHub:   { title: 'Centro de investigación',    desc: 'Acceso impulsado por IA a datos históricos y arqueológicos de Egipto' },
    }
  },
  zh: {
    title1: '扩展',
    title2: '生态系统',
    subtitle: 'EgyptX AI持续进化。以下是即将推出的内容。',
    comingSoon: '即将推出',
    features: {
      vrEgypt:       { title: 'VR埃及',          desc: '360°沉浸式古代奇迹虚拟之旅' },
      kidsMode:      { title: '儿童模式',         desc: '为年轻探险家打造的神奇教育体验' },
      emergency:     { title: '紧急助手',         desc: '24/7即时多语言紧急支持和位置共享' },
      aiMemories:    { title: 'AI记忆',           desc: '自动生成的旅程故事，附带照片和精彩时刻' },
      treasureHunt:  { title: '寻宝游戏',         desc: '游戏化探索挑战，获得真实奖励' },
      sustainability:{ title: '可持续发展仪表板', desc: '追踪埃及的环境影响和进展' },
      researchHub:   { title: '研究中心',         desc: 'AI驱动访问埃及历史和考古数据' },
    }
  },
  ru: {
    title1: 'Расширение ',
    title2: 'экосистемы',
    subtitle: 'EgyptX AI постоянно развивается. Вот что будет дальше.',
    comingSoon: 'СКОРО',
    features: {
      vrEgypt:       { title: 'VR Египет',                  desc: 'Иммерсивные 360° виртуальные туры по древним чудесам' },
      kidsMode:      { title: 'Режим для детей',            desc: 'Волшебный образовательный опыт для юных исследователей' },
      emergency:     { title: 'Экстренный помощник',        desc: 'Мгновенная многоязычная экстренная поддержка 24/7 с передачей местоположения' },
      aiMemories:    { title: 'ИИ-воспоминания',            desc: 'Автоматически сгенерированная история вашего путешествия с фотографиями и яркими моментами' },
      treasureHunt:  { title: 'Охота за сокровищами',       desc: 'Игровые задания для исследования с реальными наградами' },
      sustainability:{ title: 'Панель устойчивого развития',desc: 'Отслеживание экологического воздействия и прогресса Египта' },
      researchHub:   { title: 'Исследовательский центр',    desc: 'ИИ-доступ к историческим и археологическим данным Египта' },
    }
  }
};

langs.forEach(lang => {
  const f = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(f, 'utf8'));
  data.home = data.home || {};

  // Merge ecosystem features into existing ecosystem key (don't overwrite the other node keys)
  data.home.ecosystem = Object.assign({}, data.home.ecosystem, translations[lang]);

  fs.writeFileSync(f, JSON.stringify(data, null, 2));
  console.log(`Updated ${f}`);
});

console.log('\nAll JSON files updated.');
