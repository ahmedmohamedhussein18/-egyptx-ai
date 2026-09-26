const fs = require('fs');

const languages = ['en', 'ar', 'fr', 'de', 'it', 'es', 'zh', 'ru'];

// Data to add
const additions = {
  en: {
    "planner.selectCountry": "Select your country",
    "planner.egTravelers": "e.g., 2 adults, 1 child",
    "planner.egDuration": "e.g., 7 Days",
    "planner.egBudget": "e.g., $2000 total",
    "planner.egInterests": "e.g., Pyramids, diving, local food",
    "planner.egStyle": "e.g., Luxury, backpacking, family",
    "planner.egAccess": "e.g., Wheelchair access needed",
    "planner.egAvoid": "e.g., No long bus rides",
    "planner.errCountry": "Please select a country",
    "planner.errTravelers": "Please enter travelers",
    "planner.errDuration": "Please enter duration",
    "planner.errBudget": "Please enter budget",
    "planner.errInterests": "Please tell us your interests",
    "planner.saved": "Saved!"
  },
  ar: {
    "planner.selectCountry": "اختر بلدك", "planner.egTravelers": "مثال: شخصين وطفل", "planner.egDuration": "مثال: 7 أيام", "planner.egBudget": "مثال: 2000 دولار", "planner.egInterests": "مثال: الأهرامات، الغوص", "planner.egStyle": "مثال: فاخر، عائلي", "planner.egAccess": "مثال: كراسي متحركة", "planner.egAvoid": "مثال: رحلات طويلة", "planner.errCountry": "يرجى اختيار بلد", "planner.errTravelers": "يرجى إدخال المسافرين", "planner.errDuration": "يرجى إدخال المدة", "planner.errBudget": "يرجى إدخال الميزانية", "planner.errInterests": "يرجى إدخال الاهتمامات", "planner.saved": "تم الحفظ!"
  },
  fr: {
    "planner.selectCountry": "Choisissez votre pays", "planner.egTravelers": "ex: 2 adultes", "planner.egDuration": "ex: 7 Jours", "planner.egBudget": "ex: 2000$", "planner.egInterests": "ex: Pyramides", "planner.egStyle": "ex: Luxe", "planner.egAccess": "ex: Fauteuil roulant", "planner.egAvoid": "ex: Pas de bus", "planner.errCountry": "Veuillez choisir", "planner.errTravelers": "Entrez voyageurs", "planner.errDuration": "Entrez durée", "planner.errBudget": "Entrez budget", "planner.errInterests": "Entrez intérêts", "planner.saved": "Enregistré!"
  },
  de: {
    "planner.selectCountry": "Land auswählen", "planner.egTravelers": "z.B. 2 Erw.", "planner.egDuration": "z.B. 7 Tage", "planner.egBudget": "z.B. 2000$", "planner.egInterests": "z.B. Pyramiden", "planner.egStyle": "z.B. Luxus", "planner.egAccess": "z.B. Rollstuhl", "planner.egAvoid": "z.B. Keine Busse", "planner.errCountry": "Bitte Land wählen", "planner.errTravelers": "Reisende eingeben", "planner.errDuration": "Dauer eingeben", "planner.errBudget": "Budget eingeben", "planner.errInterests": "Interessen eingeben", "planner.saved": "Gespeichert!"
  },
  it: {
    "planner.selectCountry": "Seleziona", "planner.egTravelers": "es: 2 adulti", "planner.egDuration": "es: 7 Giorni", "planner.egBudget": "es: 2000$", "planner.egInterests": "es: Piramidi", "planner.egStyle": "es: Lusso", "planner.egAccess": "es: Sedia a rotelle", "planner.egAvoid": "es: Niente bus", "planner.errCountry": "Seleziona paese", "planner.errTravelers": "Inserisci viaggiatori", "planner.errDuration": "Inserisci durata", "planner.errBudget": "Inserisci budget", "planner.errInterests": "Inserisci interessi", "planner.saved": "Salvato!"
  },
  es: {
    "planner.selectCountry": "Selecciona", "planner.egTravelers": "ej: 2 adultos", "planner.egDuration": "ej: 7 Días", "planner.egBudget": "ej: 2000$", "planner.egInterests": "ej: Pirámides", "planner.egStyle": "ej: Lujo", "planner.egAccess": "ej: Silla de ruedas", "planner.egAvoid": "ej: Sin autobuses", "planner.errCountry": "Selecciona país", "planner.errTravelers": "Ingresa viajeros", "planner.errDuration": "Ingresa duración", "planner.errBudget": "Ingresa presupuesto", "planner.errInterests": "Ingresa intereses", "planner.saved": "¡Guardado!"
  },
  zh: {
    "planner.selectCountry": "选择国家", "planner.egTravelers": "例如：2个成年人", "planner.egDuration": "例如：7天", "planner.egBudget": "例如：2000美元", "planner.egInterests": "例如：金字塔", "planner.egStyle": "例如：豪华", "planner.egAccess": "例如：轮椅", "planner.egAvoid": "例如：无长途车", "planner.errCountry": "请选择国家", "planner.errTravelers": "请输入人数", "planner.errDuration": "请输入时长", "planner.errBudget": "请输入预算", "planner.errInterests": "请输入兴趣", "planner.saved": "已保存！"
  },
  ru: {
    "planner.selectCountry": "Выберите страну", "planner.egTravelers": "напр. 2 взрослых", "planner.egDuration": "напр. 7 дней", "planner.egBudget": "напр. 2000$", "planner.egInterests": "напр. Пирамиды", "planner.egStyle": "напр. Люкс", "planner.egAccess": "напр. Коляска", "planner.egAvoid": "напр. Без автобусов", "planner.errCountry": "Выберите страну", "planner.errTravelers": "Введите туристов", "planner.errDuration": "Введите дни", "planner.errBudget": "Введите бюджет", "planner.errInterests": "Введите интересы", "planner.saved": "Сохранено!"
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

console.log('Added missing placeholders to all 8 language files.');
