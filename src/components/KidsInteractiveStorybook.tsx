'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  RotateCcw,
  Compass,
  Star,
  Award,
  Crown,
  Lightbulb,
  Globe2,
  Check,
  Languages
} from 'lucide-react';

// ==========================================
// 1. TYPES & DATA DEFINITIONS
// ==========================================

export type GuardianId = 'horus' | 'anubis' | 'bastet';
export type QuestId = 'pyramid' | 'abusimbel' | 'ankh';
export type SupportedLang = 'en' | 'ar' | 'zh' | 'fr' | 'it' | 'es' | 'ru';

export const SUPPORTED_LANGS: { id: SupportedLang; name: string; flag: string; dir: 'ltr' | 'rtl'; bcp47: string }[] = [
  { id: 'ar', name: 'العربية', flag: '🇪🇬', dir: 'rtl', bcp47: 'ar-EG' },
  { id: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr', bcp47: 'en-US' },
  { id: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr', bcp47: 'fr-FR' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹', dir: 'ltr', bcp47: 'it-IT' },
  { id: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr', bcp47: 'es-ES' },
  { id: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr', bcp47: 'ru-RU' },
  { id: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr', bcp47: 'zh-CN' },
];

// CRITICAL EXACT IMAGE MAPPING (9 COMBINATIONS)
export const STORY_IMAGE_MAP: Record<string, string> = {
  'horus-pyramid': '/images/kids-stories/horus_pyramid.jpg',
  'horus-abusimbel': '/images/kids-stories/horus_abusimbel.jpg',
  'horus-ankh': '/images/kids-stories/horus_ankh.jpg',
  'anubis-pyramid': '/images/kids-stories/anubis_pyramid.jpg',
  'anubis-abusimbel': '/images/kids-stories/anubis_abusimbel.jpg',
  'anubis-ankh': '/images/kids-stories/Baby Anubis and the Glowing Ankh.png',
  'bastet-pyramid': "/images/kids-stories/Bastet's Golden Pyramid Adventure.png",
  'bastet-abusimbel': '/images/kids-stories/Bastet Before the Moonlit Abu Simbel.png',
  'bastet-ankh': '/images/kids-stories/Playful Bastet and the Glowing Ankh.png',
};

// ==========================================
// 2. MULTILINGUAL METADATA DICTIONARY
// ==========================================

export const GUARDIANS_META: Record<GuardianId, Record<SupportedLang, { name: string; title: string; motto: string }>> = {
  horus: {
    ar: { name: 'حورس الصقر الذهبي', title: 'سيد السماء وحامي العدالة', motto: 'شجاعة لا تنكسر وعين ترى أبعد من النجوم' },
    en: { name: 'Horus the Golden Falcon', title: 'Lord of the Sky & Justice', motto: 'Unbroken courage and an eye that sees beyond the stars' },
    fr: { name: 'Horus le Faucon Doré', title: 'Seigneur du Ciel et de la Justice', motto: 'Un courage inébranlable et un regard au-delà des étoiles' },
    it: { name: 'Horus il Falco Dorato', title: 'Signore del Cielo e della Giustizia', motto: 'Un coraggio incrollabile e uno sguardo oltre le stelle' },
    es: { name: 'Horus el Halcón Dorado', title: 'Señor del Cielo y la Justicia', motto: 'Un coraje inquebrantable y ojos que ven más allá de las estrellas' },
    ru: { name: 'Гор Золотой Сокол', title: 'Владыка Небес и Справедливости', motto: 'Непоколебимое мужество и взор, видящий дальше звезд' },
    zh: { name: '金鹰荷鲁斯', title: '天空与正义之主', motto: '无畏的勇气，以及能看穿群星的明亮双眼' },
  },
  anubis: {
    ar: { name: 'أنوبيس حارس الأسرار', title: 'مرشد الدروب الخفية وحامي الميزان', motto: 'هدوء الحكماء وبصيرة تضيء أعماق الممرات المظلمة' },
    en: { name: 'Anubis the Secret Keeper', title: 'Guide of Hidden Paths & Balances', motto: 'The quiet wisdom that illuminates the deepest corridors' },
    fr: { name: 'Anubis le Gardien des Secrets', title: 'Guide des Voies Cachées et de la Vérité', motto: 'La sagesse silencieuse qui éclaire les couloirs les plus sombres' },
    it: { name: 'Anubi il Custode dei Segreti', title: 'Guida dei Sentieri Nascosti e della Bilancia', motto: 'La quieta saggezza che rischiara i corridoi più profondi' },
    es: { name: 'Anubis el Guardián de Secretos', title: 'Guía de Caminos Ocultos y la Justicia', motto: 'La sabia serenidad que ilumina los pasadizos más oscuros' },
    ru: { name: 'Анубис Хранитель Тайн', title: 'Проводник Скрытых Путей и Весов Истины', motto: 'Спокойная мудрость, освещающая самые темные коридоры' },
    zh: { name: '阿努比斯秘密守护者', title: '指引隐秘通道与正义天平的神祇', motto: '宁静的智慧，照亮最深邃幽暗的石廊' },
  },
  bastet: {
    ar: { name: 'باستيت قطة النور', title: 'حامية الديار وناشرة الفرح ودفء الشمس', motto: 'رشاقة سحرية وقلب ينشر المحبة في كل مكان' },
    en: { name: 'Bastet the Cat Goddess', title: 'Protector of Joy, Home & Sunlight', motto: 'Magical agility and a heart that radiates warmth everywhere' },
    fr: { name: 'Bastet la Déesse Chatte', title: 'Protectrice du Foyer et de la Joie', motto: 'Une agilité féline et un cœur rayonnant de douceur' },
    it: { name: 'Bastet la Dea Gatta', title: 'Protettrice del Focolare e del Sole', motto: 'Un’agilità magica e un cuore che diffonde gioia ovunque' },
    es: { name: 'Bastet la Diosa Gata', title: 'Protectora del Hogar, la Alegría y el Sol', motto: 'Agilidad mágica y un corazón que irradia amor por doquier' },
    ru: { name: 'Бастет Богиня-Кошка', title: 'Покровительница Дома, Солнца и Радости', motto: 'Волшебная грация и сердце, согревающее всё вокруг' },
    zh: { name: '猫女神贝丝蒂', title: '温暖家园与纯真快乐的守护女神', motto: '神奇轻盈的步伐，为世间带来欢笑与明媚阳光' },
  },
};

export const QUESTS_META: Record<QuestId, Record<SupportedLang, { title: string; location: string; goal: string }>> = {
  pyramid: {
    ar: { title: 'سر الهرم الأكبر وغرفة النجوم', location: 'هضبة الجيزة', goal: 'فك رموز الكهنة القدماء داخل حجرة الملك' },
    en: { title: 'The Great Pyramid Secret', location: 'Giza Plateau', goal: 'Decipher the star chamber riddles inside Khufu’s monument' },
    fr: { title: 'Le Secret de la Grande Pyramide', location: 'Plateau de Gizeh', goal: 'Percer l’énigme stellaire gravée au cœur du monument de Khéops' },
    it: { title: 'Il Segreto della Grande Piramide', location: 'Altopiano di Giza', goal: 'Risolvere l’antico enigma stellare nella camera del Re' },
    es: { title: 'El Secreto de la Gran Pirámide', location: 'Meseta de Guiza', goal: 'Descifrar los enigmas astronómicos en la cámara real' },
    ru: { title: 'Тайна Великой Пирамиды', location: 'Плато Гиза', goal: 'Разгадать древние звездные послания в покое фараона' },
    zh: { title: '大金字塔与星辰密室', location: '吉萨高原', goal: '解开法老星辰密室中的古老象形谜题' },
  },
  abusimbel: {
    ar: { title: 'شمس معبد أبو سمبل الذهبية', location: 'أسوان والنوبة', goal: 'اكتشاف سر تعامد أشعة الشمس على تماثيل الملوك' },
    en: { title: 'The Sun Temple of Abu Simbel', location: 'Aswan & Nubia', goal: 'Witness the miraculous solar illumination of the sacred colossi' },
    fr: { title: 'Le Temple Solaire d’Abou Simbel', location: 'Assouan et Nubie', goal: 'Découvrir le secret de l’illumination solaire des colosses royaux' },
    it: { title: 'Il Tempio del Sole di Abu Simbel', location: 'Aswan e Nubia', goal: 'Assistere al magico raggio di sole che illumina i colossi reali' },
    es: { title: 'El Templo Solar de Abu Simbel', location: 'Asuán y Nubia', goal: 'Descubrir el misterio de la alineación solar en los colosos' },
    ru: { title: 'Солнечный Храм Абу-Симбел', location: 'Асуан и Нубия', goal: 'Увидеть чудесное озарение ликов древних владык солнечным лучом' },
    zh: { title: '阿布辛贝太阳神庙', location: '阿斯旺与努比亚', goal: '探索每年两次阳光直射圣殿神像的神秘天象' },
  },
  ankh: {
    ar: { title: 'لغز مفتاح الحياة الذهبي', location: 'الأقصر والواحات', goal: 'العثور على مفتاح الحياة الأسطوري الذي يفيض بالبركة' },
    en: { title: 'The Golden Ankh Mystery', location: 'Luxor & Oases', goal: 'Find the legendary sacred key that brings life and green springs' },
    fr: { title: 'Le Mystère de l’Ânkh Dorée', location: 'Louxor et Oasis', goal: 'Retrouver la clé de vie légendaire source d’abondance éternelle' },
    it: { title: 'Il Mistero dell’Ankh Dorato', location: 'Luxor e le Oasi', goal: 'Trovare la mitica chiave sacra che dona vita e fertilità' },
    es: { title: 'El Misterio del Ankh Dorado', location: 'Lúxor y los Oasis', goal: 'Encontrar la legendaria llave de la vida y prosperidad eterna' },
    ru: { title: 'Тайна Золотого Анха', location: 'Луксор и Оазисы', goal: 'Отыскать священный ключ жизни, дарующий плодородие и процветание' },
    zh: { title: '金色生命之钥之谜', location: '卢克索与绿洲', goal: '探寻象征繁荣生机与永恒福泽的黄金安卡生命之符' },
  },
};

// ==========================================
// 3. STORY GENERATOR (7 PAGES × 7 LANGUAGES)
// ==========================================

export interface StoryPageContent {
  pageNumber: number;
  chapterTitle: string;
  storyText: string;
  wisdomQuote: string;
  funFact: string;
  badge: string;
}

export function getStoryPages(
  childName: string,
  guardianId: GuardianId,
  questId: QuestId,
  lang: SupportedLang
): StoryPageContent[] {
  const g = GUARDIANS_META[guardianId][lang];
  const q = QUESTS_META[questId][lang];
  const hero = childName.trim() || (lang === 'ar' ? 'البطل الصغير' : 'Little Explorer');

  const templates: Record<SupportedLang, StoryPageContent[]> = {
    ar: [
      {
        pageNumber: 1,
        chapterTitle: `الفصل الأول: النداء السحري نحو ${q.location}`,
        storyText: `في عصر يوم دافئ، بينما كانت شمس مصر تلامس الأفق بنور ذهبي ساحر، وجد ${hero} برديّة قديمة تلمع بين حبات الرمال الناعمة. احتوت البردية على خريطة سرية تقود نحو ${q.title}! شعر ${hero} بأن قلبه يخفق فرحاً وشغفاً، مستعداً لخوض أعظم مغامرة في أرض الأجداد.`,
        wisdomQuote: 'كل مغامرة أسطورية تبدأ بفضول صادق وخطوة أولى نحو المجهول.',
        funFact: 'كان الفراعنة يصنعون ورق البردي من نبات ينمو على ضفاف النيل، وكتبوا عليه أسرار علومهم وأشعارهم.',
        badge: 'مستكشف البرديات 📜',
      },
      {
        pageNumber: 2,
        chapterTitle: `الفصل الثاني: ظهور ${g.name}`,
        storyText: `وفجأة، شق الأفق نور ساطع وظهر ${g.name} بكامل هيبته وسحره الفريد. ابتسم لـ ${hero} وقال بصوت دافئ يملأ القلب طمأنينة: "أهلاً بك يا ${hero}، لقد اختارتك أرض مصر لأنك تمتلك قلباً شجاعاً وروحاً محبة للاستكشاف!" وقدم له تميمة مقدسة تشع ببريق الأمل.`,
        wisdomQuote: g.motto,
        funFact: `${g.title}، وكان يحظى بمحبة وتقدير فائقين في المعابد المصرية القديمة.`,
        badge: 'حليف الحارس 🛡️',
      },
      {
        pageNumber: 3,
        chapterTitle: 'الفصل الثالث: لغز الكهنة على الصخور',
        storyText: `وصلا إلى مشارف ${q.title}، حيث واجهتهما بوابة حجرية شاهقة حُفر عليها لغز هيروغليفي ساطع: "أنا أسير بلا أقدام، وأهب الحياة لكل وادٍ، فما أكون؟" فكر ${hero} بذكاء وابتسم قائلاً: "إنه نهر النيل الخالد!" وفي الحال، توهجت النقوش بنور فيروزي وانفتحت البوابة بسلاسة!`,
        wisdomQuote: 'قوة العقل وحسن الملاحظة يفتحان أعتى الأبواب الحجرية.',
        funFact: 'كان المصريون القدماء يطلقون على نهر النيل اسم "حعبي" إله الخصب والخير الوفير.',
        badge: 'فاحص الألغاز 💡',
      },
      {
        pageNumber: 4,
        chapterTitle: 'الفصل الرابع: الإبحار في النيل الخالد',
        storyText: `ركب ${hero} و${g.name} قارباً شراعياً مذهباً يعبر أمواج النيل الرقراقة. كانت أسراب الطيور المغردة تحلق فوقهما، بينما روى ${g.name} قصص البنائين والمهندسين الذين شيدوا هذه المعالم بدقة فلكية سبقت عصرها بآلاف السنين.`,
        wisdomQuote: 'النيل صديق وفيّ، يحفظ في طمي مياهه حكايات الملوك والعلماء.',
        funFact: 'كانت المراكب الخشبية تُصنع بدون مسامير حديدية، بل كانت تُربط بحبال سميكة بطريقة محكمة تزداد قوة بالماء.',
        badge: 'قبطان النيل ⛵',
      },
      {
        pageNumber: 5,
        chapterTitle: `الفصل الخامس: داخل الحجرة السرية لـ ${q.title}`,
        storyText: `دخلا الغرفة الخفية في قلب المعبد؛ كانت الجدران مرصعة بأحجار اللازورد والذهب الخالص. في المنتصف، تبلور شعاع ضوئي يحرس السر الأكبر. قال ${g.name}: "يا ${hero}، لقد وصلت إلى هنا بفضل صدقك وعزمك النبيل."`,
        wisdomQuote: 'الكنوز الحقيقية ليست قطع الذهب، بل المعرفة التي تضيء دروب البشر.',
        funFact: 'استخدم الفراعنة حجر اللازورد الأزرق الملكي لتزيين مقابر الملوك دلالة على قدسية السماء.',
        badge: 'حارس الغرفة السرية 🗝️',
      },
      {
        pageNumber: 6,
        chapterTitle: 'الفصل السادس: ميزان القلب النقي (ماعت)',
        storyText: `ظهر ميزان العدالة "ماعت" متألقاً بنور فضي. طُلب من ${hero} أن يضع أثمن ما يملكه على كفة الميزان؛ فوضع رغبته الصادقة في مساعدة الآخرين وحماية آثار وطنه. استقرت كفتا الميزان في توازن تام، وانطلقت نغمات موسيقية ساحرة ملأت المكان!`,
        wisdomQuote: 'القلب الصادق المحب للخير أثقل في ميزان الحياة من كل أموال الدنيا.',
        funFact: 'كانت "ماعت" تمثل ميزان الكون وقيم الصدق والعدل والنظام الأخلاقي في مصر القديمة.',
        badge: 'القلب النبيل 💖',
      },
      {
        pageNumber: 7,
        chapterTitle: 'الفصل السابع: التتويج بلقب حامي آثار مصر الأبدي',
        storyText: `أشرقت شمس النصر وتوج ${g.name} بطلنا الصغير ${hero} بقلادة الشرف الملكية ووسام الجعران المذهب! هتفت المعالم والطيور فخراً بالبطل الشجاع: "عاش ${hero} حامي أسرار مصر!" وعاد إلى بيته فخوراً بحضارة وطنه الخالدة التي لا تموت.`,
        wisdomQuote: 'أنت الآن سفير لتاريخ عظيم، احفظ تراث أجدادك في قلبك إلى الأبد.',
        funFact: 'الجعران المجنح كان تميمة الحظ والتجدد والأمل الدائم في مصر القديمة.',
        badge: 'وسام البطل الأسطوري 👑',
      },
    ],

    en: [
      {
        pageNumber: 1,
        chapterTitle: `Chapter 1: The Magic Call to ${q.location}`,
        storyText: `On a glowing afternoon with Egyptian sun casting amber reflections over ancient sands, ${hero} found a mysterious luminous papyrus scroll. It bore a secret trail leading straight to ${q.title}! ${hero}’s heart leaped with excitement, ready to embark on an unforgettable quest.`,
        wisdomQuote: 'Every legendary quest begins with pure curiosity and a courageous first step.',
        funFact: 'Ancient Egyptians invented papyrus from reeds along the Nile, writing their poetry and architectural secrets upon it.',
        badge: 'Scroll Explorer 📜',
      },
      {
        pageNumber: 2,
        chapterTitle: `Chapter 2: Appearance of ${g.name}`,
        storyText: `Suddenly, radiant golden beams parted the skies as ${g.name} descended with divine grace. Smiling warmly at ${hero}, the guardian spoke: "Welcome, brave ${hero}! Ancient Egypt chose you because your heart is pure and eager to learn." A magical talisman was placed in ${hero}’s hand.`,
        wisdomQuote: g.motto,
        funFact: `${g.title}, revered across magnificent ancient temples for millenniums.`,
        badge: 'Guardian’s Ally 🛡️',
      },
      {
        pageNumber: 3,
        chapterTitle: 'Chapter 3: The Ancient Stone Riddle',
        storyText: `Arriving at the threshold of ${q.title}, they met a colossal portal glowing with sacred glyphs: "I run forever without feet, and give life to every valley—what am I?" ${hero} smiled and said proudly: "The eternal River Nile!" Instantly, the inscriptions shone turquoise and swung open!`,
        wisdomQuote: 'Sharp observation and love for nature can unlock the heaviest doors.',
        funFact: 'Egyptians called the Nile "Hapi", celebrating the miraculous annual inundation that fertilized the land.',
        badge: 'Riddle Solver 💡',
      },
      {
        pageNumber: 4,
        chapterTitle: 'Chapter 4: Sailing the Timeless Nile',
        storyText: `Aboard an enchanted golden felucca, ${hero} and ${g.name} glided over azure ripples. Graceful ibis birds flew overhead as ${g.name} recounted how master architects built celestial monuments with pinpoint astronomical precision.`,
        wisdomQuote: 'The Nile is a faithful friend that whispers centuries of wisdom to those who listen.',
        funFact: 'Ancient Egyptian wooden boats were built without metal nails, skillfully tied with ropes that expanded when wet to stay watertight.',
        badge: 'Nile Captain ⛵',
      },
      {
        pageNumber: 5,
        chapterTitle: `Chapter 5: Inside the Secret Chamber of ${q.title}`,
        storyText: `Stepping into the innermost vault, surrounded by lapis lazuli and shimmering electrum, a suspended cosmic orb illuminated the chamber. ${g.name} whispered: "Look, ${hero}, this ancient sanctuary has preserved its harmony waiting for someone noble like you."`,
        wisdomQuote: 'True treasures are not gold and gems, but knowledge that brings light to humanity.',
        funFact: 'Lapis lazuli was imported through ancient trade routes because its deep blue resembled the sacred starlit night sky.',
        badge: 'Vault Keeper 🗝️',
      },
      {
        pageNumber: 6,
        chapterTitle: 'Chapter 6: The Trial of the Pure Heart',
        storyText: `The shimmering Scales of Ma'at appeared. Asked to present the truest treasure, ${hero} placed a sincere wish to protect nature and share knowledge with all children. The scales balanced in perfect harmony, radiating warm rainbow hues!`,
        wisdomQuote: 'A loving, unselfish heart outweighs all worldly riches upon the cosmic scale.',
        funFact: 'Ma\'at was the ancient concept of truth, justice, cosmic balance, and harmony with people and nature.',
        badge: 'Noble Heart 💖',
      },
      {
        pageNumber: 7,
        chapterTitle: 'Chapter 7: Coronation as Egypt’s Guardian',
        storyText: `Triumphant sunbeams broke through the sanctuary as ${g.name} crowned ${hero} with the golden winged scarab badge! The ancient temples echoed: "All hail ${hero}, forever guardian of Egypt’s wonders!" Returning home, ${hero} held a heart ablaze with pride in Egypt’s heritage.`,
        wisdomQuote: 'You are now an ambassador of timeless history; carry this flame wherever you go.',
        funFact: 'The winged scarab symbolized resurrection, bright dawn, and endless hope in ancient Egypt.',
        badge: 'Legendary Hero Medal 👑',
      },
    ],

    fr: [
      {
        pageNumber: 1,
        chapterTitle: `Chapitre 1: L'Appel Magique vers ${q.location}`,
        storyText: `Par un après-midi doré caressé par le vent du désert, ${hero} découvrit un mystérieux papyrus scintillant. Il révélait un passage secret vers ${q.title}! Le cœur de ${hero} bondit de joie, impatient de vivre la plus belle des aventures égyptiennes.`,
        wisdomQuote: 'Chaque grande aventure commence par un cœur curieux et un pas courageux vers l’inconnu.',
        funFact: 'Les Égyptiens anciens fabriquaient le papyrus à partir de roseaux du Nil pour y inscrire leurs secrets.',
        badge: 'Explorateur de Papyrus 📜',
      },
      {
        pageNumber: 2,
        chapterTitle: `Chapitre 2: L'Apparition de ${g.name}`,
        storyText: `Soudain, un éclat lumineux illumina le ciel et ${g.name} apparut dans toute sa majesté. D'une voix bienveillante, le gardien murmura : "Bienvenue, vaillant ${hero}! L'Égypte t'a choisi pour la pureté de ton cœur et ta soif d'apprendre."`,
        wisdomQuote: g.motto,
        funFact: `${g.title}, vénéré à travers les temples millénaires de l’Égypte antique.`,
        badge: 'Allié du Gardien 🛡️',
      },
      {
        pageNumber: 3,
        chapterTitle: 'Chapitre 3: L’Énigme de la Porte de Pierre',
        storyText: `Arrivés devant ${q.title}, une immense porte ornée de hiéroglyphes luisants barra le chemin : "Je cours sans jambes et nourris chaque vallée, qui suis-je ?" ${hero} sourit et déclara : "Le Nil sacré !" Aussitôt, la porte s'ouvrit dans une lueur turquoise.`,
        wisdomQuote: 'L’intelligence et l’écoute de la nature ouvrent les portes les plus impénétrables.',
        funFact: 'Le Nil était célébré chaque année pour ses crues bienfaisantes fertilisant la terre noire d’Égypte.',
        badge: 'Résolveur d’Énigmes 💡',
      },
      {
        pageNumber: 4,
        chapterTitle: 'Chapitre 4: Navigation sur le Nil Sacré',
        storyText: `À bord d'une felouque dorée, ${hero} et ${g.name} glissèrent sur les eaux paisibles du Nil. Des oiseaux sacrés survolaient le navire tandis que ${g.name} racontait le génie des astronomes et architectes pharaoniques.`,
        wisdomQuote: 'Le Nil est un ami fidèle qui confie la mémoire des rois à qui sait écouter.',
        funFact: 'Les barques solaires étaient assemblées sans clous métalliques grâce à des cordages ingénieux.',
        badge: 'Capitaine du Nil ⛵',
      },
      {
        pageNumber: 5,
        chapterTitle: `Chapitre 5: Au Cœur de la Chambre Secrète de ${q.title}`,
        storyText: `Pénétrant dans la chambre secrète parée de lapis-lazuli et d'or fin, un orbe céleste flottait dans l'air. ${g.name} dit doucement : "${hero}, ce sanctuaire millénaire t'attendait pour réveiller sa lumière bienveillante."`,
        wisdomQuote: 'Le vrai trésor n’est pas fait d’or, mais de savoir qui éclaire le monde.',
        funFact: 'Le lapis-lazuli était considéré comme la pierre sacrée symbolisant la voûte céleste constellée.',
        badge: 'Gardien de la Crypte 🗝️',
      },
      {
        pageNumber: 6,
        chapterTitle: 'Chapitre 6: L’Épreuve du Cœur Pur',
        storyText: `La balance étincelante de Maât apparut dans un halo d'argent. ${hero} y déposa son désir sincère d'aimer, de partager et de protéger les merveilles de la terre. Les deux plateaux s'équilibrèrent dans une harmonie parfaite !`,
        wisdomQuote: 'Un cœur généreux et sincère pèse plus lourd que toutes les richesses de l’univers.',
        funFact: 'La déesse Maât incarnait la justice, la vérité et l’ordre cosmique dans la pensée égyptienne.',
        badge: 'Cœur Noble 💖',
      },
      {
        pageNumber: 7,
        chapterTitle: 'Chapitre 7: Le Couronnement du Jeune Protecteur',
        storyText: `Sous les ovations des étoiles, ${g.name} remit à ${hero} la médaille d'or du scarabée ailé ! "Gloire à ${hero}, protecteur des mystères d’Égypte !" De retour chez lui, ${hero} garda pour toujours la fierté de cette civilisation immortelle.`,
        wisdomQuote: 'Tu es désormais l’ambassadeur d’une histoire éternelle ; protège-la avec fierté.',
        funFact: 'Le scarabée ailé symbolisait la renaissance, la lumière du matin et l’espoir perpétuel.',
        badge: 'Médaille du Héros Légendaire 👑',
      },
    ],

    it: [
      {
        pageNumber: 1,
        chapterTitle: `Capitolo 1: La Chiamata Magica verso ${q.location}`,
        storyText: `In un caldo pomeriggio d'Egitto con la sabbia baciata da raggi dorati, ${hero} trovò un antico papiro splendente. Conteneva una mappa segreta verso ${q.title}! Il cuore di ${hero} batté forte di felicità, pronto per la grande avventura.`,
        wisdomQuote: 'Ogni grande viaggio inizia con un cuore curioso e un primo passo coraggioso.',
        funFact: 'Gli antichi egizi ricavavano il papiro dalle piante lungo il Nilo per scrivere le loro formule magiche.',
        badge: 'Esploratore di Papiri 📜',
      },
      {
        pageNumber: 2,
        chapterTitle: `Capitolo 2: L'Apparizione di ${g.name}`,
        storyText: `Improvvisamente, un fascio di luce squarciò il cielo e ${g.name} apparve maestoso. Sorridendo a ${hero}, disse con voce rassicurante: "Benvenuto, coraggioso ${hero}! L'Egitto ti ha scelto per la tua nobiltà d'animo."`,
        wisdomQuote: g.motto,
        funFact: `${g.title}, venerato da millenni nei più imponenti templi lungo il Nilo.`,
        badge: 'Alleato del Guardiano 🛡️',
      },
      {
        pageNumber: 3,
        chapterTitle: 'Capitolo 3: L’Enigma dell’Antico Portale',
        storyText: `Giunti davanti a ${q.title}, un portale scolpito brillò di geroglifici: "Scorro senza piedi e porto vita a ogni valle: chi sono?" ${hero} rispose prontamente: "L'eterno fiume Nilo!" Il portale si schiuse in un bagliore turchese!`,
        wisdomQuote: 'L’ingegno e l’armonia con la natura aprono anche le porte più pesanti.',
        funFact: 'Gli egizi chiamavano il Nilo "Hapi", celebrando le sue acque che rendevano fertile la terra.',
        badge: 'Risolutore di Enigmi 💡',
      },
      {
        pageNumber: 4,
        chapterTitle: 'Capitolo 4: Navigando lungo il Nilo Sacro',
        storyText: `A bordo di una feluca dorata, ${hero} e ${g.name} solcarono le calme acque fluviali mentre uccelli ibis volavano leggeri. ${g.name} narrò come gli architetti costruirono templi allineati alle stelle.`,
        wisdomQuote: 'Il Nilo è un amico fedele che custodisce i segreti della storia millenaria.',
        funFact: 'Le imbarcazioni faraoniche venivano costruite con assi di legno unite da corde speciali senza chiodi metallici.',
        badge: 'Capitano del Nilo ⛵',
      },
      {
        pageNumber: 5,
        chapterTitle: `Capitolo 5: Nel Cuore della Stanza Segreta di ${q.title}`,
        storyText: `Entrati nella camera più nascosta, decorata con lapislazzuli e oro, un globo di luce sospeso brillava soavemente. ${g.name} sussurrò: "${hero}, questo antico santuario ha atteso a lungo la tua luce generosa."`,
        wisdomQuote: 'La vera ricchezza non è l’oro, ma la conoscenza che porta pace nel mondo.',
        funFact: 'I lapislazzuli venivano scelti dai faraoni perché il loro blu intenso ricordava il cielo notturno.',
        badge: 'Custode della Cripta 🗝️',
      },
      {
        pageNumber: 6,
        chapterTitle: 'Capitolo 6: La Prova del Cuore Puro',
        storyText: `Apparve la Bilancia di Ma'at lucente d'argento. ${hero} vi depose il proprio desiderio sincero di proteggere il pianeta e amare la propria famiglia. I piatti della bilancia rimasero in perfetto equilibrio tra mille arcobaleni!`,
        wisdomQuote: 'Un cuore puro e generoso pesa più di tutti i tesori della Terra.',
        funFact: 'Ma\'at rappresentava la giustizia, l’equilibrio cosmico e l’onestà nell’antico Egitto.',
        badge: 'Cuore Nobile 💖',
      },
      {
        pageNumber: 7,
        chapterTitle: 'Capitolo 7: L’Incoronazione come Guardiano d’Egitto',
        storyText: `Tra gli applausi celesti, ${g.name} conferì a ${hero} la medaglia d’oro dello scarabeo alato! "Gloria a ${hero}, custode dei tesori d'Egitto!" Tornato a casa, ${hero} conservò nel cuore l'orgoglio per questa civiltà eterna.`,
        wisdomQuote: 'Ora sei un custode ufficiale della storia; custodiscine la fiamma per sempre.',
        funFact: 'Lo scarabeo alato era simbolo di rinascita, nuova luce del mattino e speranza infinita.',
        badge: 'Medaglia dell’Eroe 👑',
      },
    ],

    es: [
      {
        pageNumber: 1,
        chapterTitle: `Capítulo 1: La Llamada Mágica hacia ${q.location}`,
        storyText: `En una tarde dorada con el sol iluminando las arenas sagradas de Egipto, ${hero} encontró un antiguo papiro resplandeciente. ¡Señalaba una ruta oculta hacia ${q.title}! El corazón de ${hero} latió con emoción, listo para vivir una aventura inolvidable.`,
        wisdomQuote: 'Toda gran aventura comienza con curiosidad sincera y un primer paso valiente.',
        funFact: 'Los antiguos egipcios creaban papiro a partir de juncos del Nilo para registrar sus conocimientos.',
        badge: 'Explorador de Papiros 📜',
      },
      {
        pageNumber: 2,
        chapterTitle: `Capítulo 2: La Aparición de ${g.name}`,
        storyText: `De pronto, un resplandor dorado iluminó el cielo y ${g.name} descendió con gracia divina. Mirando a ${hero}, exclamó con ternura: "¡Bienvenido, noble ${hero}! Egipto te ha elegido por la pureza de tu corazón y tu espíritu intrépido."`,
        wisdomQuote: g.motto,
        funFact: `${g.title}, adorado durante miles de años en los grandes templos egipcios.`,
        badge: 'Aliado del Guardián 🛡️',
      },
      {
        pageNumber: 3,
        chapterTitle: 'Capítulo 3: El Enigma del Portal de Piedra',
        storyText: `Llegaron a la entrada de ${q.title}, donde un gran portal mostraba jeroglíficos brillantes: "Corro sin pies y doy vida a cada valle: ¿quién soy?" ${hero} sonrió y respondió con seguridad: "¡El eterno río Nilo!" Al instante, el portal se abrió suavemente.`,
        wisdomQuote: 'La sabiduría y el respeto a la naturaleza abren las puertas más difíciles.',
        funFact: 'Los egipcios llamaban al Nilo "Hapi", honrando las aguas que fertilizaban los campos del país.',
        badge: 'Descifrador de Enigmas 💡',
      },
      {
        pageNumber: 4,
        chapterTitle: 'Capítulo 4: Navegando por el Nilo Sagrado',
        storyText: `A bordo de una falúa dorada, ${hero} y ${g.name} surcaron las aguas tranquilas mientras aves sagradas volaban cerca. ${g.name} relató cómo los antiguos maestros alinearon sus templos con las estrellas del firmamento.`,
        wisdomQuote: 'El Nilo es un amigo leal que susurra historias milenarias a quienes saben escuchar.',
        funFact: 'Los barcos egipcios se construían uniendo maderas con cuerdas especiales sin usar clavos de hierro.',
        badge: 'Capitán del Nilo ⛵',
      },
      {
        pageNumber: 5,
        chapterTitle: `Capítulo 5: En el Corazón de la Cámara Secreta de ${q.title}`,
        storyText: `Al entrar en la cámara sagrada decorada con lapislázuli y oro puro, una esfera cósmica flotaba en el centro. ${g.name} susurró: "${hero}, este santuario guardó su luz esperando la llegada de un corazón bondadoso como el tuyo."`,
        wisdomQuote: 'El mayor tesoro no es el oro, sino el conocimiento que ilumina al mundo.',
        funFact: 'El lapislázuli azul era muy cotizado porque recordaba el cielo estrellado de los dioses.',
        badge: 'Guardián de la Cámara 🗝️',
      },
      {
        pageNumber: 6,
        chapterTitle: 'Capítulo 6: La Prueba del Corazón Puro',
        storyText: `Apareció la Balanza de Ma'at resplandeciendo en plata. ${hero} colocó en el platillo su deseo sincero de cuidar el planeta y compartir alegría con sus amigos. ¡La balanza quedó en perfecto equilibrio emanando luz de colores!`,
        wisdomQuote: 'Un corazón bondadoso pesa más en la vida que todas las riquezas del universo.',
        funFact: 'Ma\'at representaba la verdad, la armonía universal y la justicia ética en Egipto.',
        badge: 'Corazón Noble 💖',
      },
      {
        pageNumber: 7,
        chapterTitle: 'Capítulo 7: Coronación como Héroe de Egipto',
        storyText: `¡${g.name} colocó sobre el pecho de ${hero} la medalla del escarabajo dorado! Todos los templos resonaron con alegría: "¡Viva ${hero}, guardián de los tesoros de Egipto!" Al volver a casa, ${hero} llevó consigo un orgullo eterno por esta gran historia.`,
        wisdomQuote: 'Ahora eres guardián oficial de la historia; mantén vivo este legado con honor.',
        funFact: 'El escarabajo alado simbolizaba el renacimiento, el nuevo amanecer y la esperanza infinita.',
        badge: 'Medalla del Héroe Legendario 👑',
      },
    ],

    ru: [
      {
        pageNumber: 1,
        chapterTitle: `Глава 1: Волшебный призыв в ${q.location}`,
        storyText: `Теплым египетским днем, когда золотые лучи заката озаряли пески, ${hero} нашел загадочный светящийся папирус. На нем была тайная карта, ведущая к ${q.title}! Сердце ${hero} забилось от восторга в предвкушении великого приключения.`,
        wisdomQuote: 'Любое легендарное путешествие начинается с доброго любопытства и смелого шага.',
        funFact: 'Древние египтяне делали папирус из тростника, растущего вдоль Нила, сохраняя мудрость веков.',
        badge: 'Исследователь Папирусов 📜',
      },
      {
        pageNumber: 2,
        chapterTitle: `Глава 2: Появление ${g.name}`,
        storyText: `Внезапно небеса озарились сиянием, и перед ${hero} предстал величественный ${g.name}. С теплой улыбкой защитник произнес: "Приветствую тебя, отважный ${hero}! Земля фараонов выбрала тебя за чистое сердце и жажду знаний!"`,
        wisdomQuote: g.motto,
        funFact: `${g.title}, почитаемый в древних святилищах на протяжении тысячелетий.`,
        badge: 'Союзник Стража 🛡️',
      },
      {
        pageNumber: 3,
        chapterTitle: 'Глава 3: Древняя загадка каменных врат',
        storyText: `Подойдя к ${q.title}, они увидели врата с иероглифами: "Я теку без ног и дарю жизнь каждой долине. Кто я?" ${hero} с улыбкой ответил: "Это священный Нил!" Иероглифы вспыхнули бирюзой, и врата распахнулись!`,
        wisdomQuote: 'Острый ум и любовь к природе открывают даже самые неприступные двери.',
        funFact: 'Египтяне называли Нил словом "Хапи", восхваляя ежегодные разливы, дарившие богатый урожай.',
        badge: 'Хранитель Разгадок 💡',
      },
      {
        pageNumber: 4,
        chapterTitle: 'Глава 4: Плавание по священному Нилу',
        storyText: `На волшебной золотой фелуке ${hero} и ${g.name} скользили по бирюзовой глади реки. Стаи птиц кружили в вышине, пока ${g.name} рассказывал о строителях, воздвигавших храмы с точностью звезд.`,
        wisdomQuote: 'Нил — верный друг, открывающий тайны прошлого тем, кто умеет слушать.',
        funFact: 'Древние лодки собирались без железных гвоздей — доски скреплялись особыми канатами.',
        badge: 'Капитан Нила ⛵',
      },
      {
        pageNumber: 5,
        chapterTitle: `Глава 5: В сердце тайной комнаты ${q.title}`,
        storyText: `Они вошли в потайную комнату, украшенную золотом и лазуритом. В центре сияла парящая звездная сфера. ${g.name} прошептал: "${hero}, святилище ждало именно твоего доброго света!"`,
        wisdomQuote: 'Истинное сокровище — это не золото, а знания, несущие свет людям.',
        funFact: 'Синий лазурит ценился фараонами как символ звездного ночного неба богов.',
        badge: 'Хранитель Покоев 🗝️',
      },
      {
        pageNumber: 6,
        chapterTitle: 'Глава 6: Испытание чистого сердца',
        storyText: `Появились сияющие весы Маат. ${hero} положил на чашу свое искреннее желание помогать близким и беречь историю. Чаши весов застыли в идеальном равновесии, озарившись радужными лучами!`,
        wisdomQuote: 'Искреннее и доброе сердце весит больше всех земных сокровищ.',
        funFact: 'Богиня Маат олицетворяла справедливость, истину и космический порядок.',
        badge: 'Благородное Сердце 💖',
      },
      {
        pageNumber: 7,
        chapterTitle: 'Глава 7: Триумф и посвящение в герои',
        storyText: `Под сиянием звезд ${g.name} вручил ${hero} золотой медальон крылатого скарабея! "Слава ${hero}, защитнику чудес Египта!" Возвращаясь домой, ${hero} навсегда сохранил в душе гордость за великую историю.`,
        wisdomQuote: 'Теперь ты хранитель древнего наследия; неси этот свет с честью.',
        funFact: 'Крылатый скарабей символизировал возрождение, утренний рассвет и бесконечную надежду.',
        badge: 'Медаль Легендарного Героя 👑',
      },
    ],

    zh: [
      {
        pageNumber: 1,
        chapterTitle: `第一章：前往${q.location}的神奇召唤`,
        storyText: `在一个微风和煦的午后，当夕阳为古老的埃及沙漠披上金色轻纱，${hero}发现了一卷发光的神秘莎草纸。上面绘有一幅通往${q.title}的隐秘地图！${hero}心中充满好奇与期待，准备踏上一场难忘的历史大冒险。`,
        wisdomQuote: '每一次传奇的探险，都始于纯真的好奇与迈向未知的第一步。',
        funFact: '古埃及人利用尼罗河畔生长的莎草制作纸张，并在上面书写璀璨的历史与诗歌。',
        badge: '莎草纸探险家 📜',
      },
      {
        pageNumber: 2,
        chapterTitle: `第二章：神圣守护者${g.name}降临`,
        storyText: `刹那间，天空中金光璀璨，威武仁慈的${g.name}展翅而降。神祇注视着${hero}，微笑着说：“勇敢的${hero}，古埃及大地选择你，因为你拥有一颗纯洁的心灵与对知识的热忱！”并递给小英雄一枚发光的守护护身符。`,
        wisdomQuote: g.motto,
        funFact: `${g.title}，在古埃及神庙中受到千家万户的虔诚崇敬。`,
        badge: '守护者之友 🛡️',
      },
      {
        pageNumber: 3,
        chapterTitle: '第三章：古老石门的神秘字谜',
        storyText: `来到${q.title}门前，一座刻满发光象形文字的巨门赫然耸立：“我无足却能奔流，为大地灌注生机——我是谁？”${hero}聪慧地微笑道：“是孕育文明的尼罗河！”文字随即泛起清澈的绿松石光芒，巨门缓缓开启！`,
        wisdomQuote: '智慧的思索与对大自然的观察，能解开世间最坚固的石锁。',
        funFact: '古埃及人将尼罗河水神化为“哈匹”，感谢它年复一年滋养沿岸肥沃的黑土地。',
        badge: '字谜破解大师 💡',
      },
      {
        pageNumber: 4,
        chapterTitle: '第四章：泛舟于永恒的尼罗河',
        storyText: `登上泛着金光的帆船，${hero}与${g.name}在蔚蓝水面上破浪前行。圣洁的朱鹭在头顶盘旋，${g.name}娓娓道来当年建筑大师与天文学家如何借由星辰运转建造出奇迹般的殿堂。`,
        wisdomQuote: '尼罗河是忠实的朋友，在潺潺水声中向倾听者诉说千年的智慧。',
        funFact: '古埃及的大型木船不用铁钉，而是用坚韧的绳索紧密编织，遇水后膨胀更为紧固密封。',
        badge: '尼罗河金牌船长 ⛵',
      },
      {
        pageNumber: 5,
        chapterTitle: `第五章：步入${q.title}的星辰密室`,
        storyText: `踏入密室，四周镶嵌着青金石与耀眼纯金，正中央一颗星辰光球缓缓漂浮运转。${g.name}轻声说：“${hero}，这座神圣殿堂一直在等待如你这般善良的孩子点亮它的永恒光芒。”`,
        wisdomQuote: '真正的宝藏不是金银，而是照亮人类心灵与未来的崇高智慧。',
        funFact: '古埃及贵族视深蓝色的青金石为至宝，因其宛若布满繁星的神圣夜空。',
        badge: '密室守门人 🗝️',
      },
      {
        pageNumber: 6,
        chapterTitle: '第六章：玛阿特真理之心的考验',
        storyText: `象征真理与平衡的“玛阿特神秤”闪耀着银色圣光。${hero}将渴望守护地球、珍爱家人与探索世界的赤子之心放在天平上；两端瞬间达到天衣无缝的完美平衡，彩虹光芒洒满殿堂！`,
        wisdomQuote: '一颗充满爱与善良的心，在生命的天平上远重于世间的一切财富。',
        funFact: '“玛阿特”在古埃及代表正义、真理、道德法则与宇宙和谐秩序。',
        badge: '崇高之心 💖',
      },
      {
        pageNumber: 7,
        chapterTitle: '第七章：荣膺古埃及传奇小小守护者',
        storyText: `晨曦破晓，${g.name}亲手为${hero}佩戴上金色的飞翼圣甲虫勋章！神庙与群鸟齐声欢呼：“致敬${hero}，守护文明遗迹的小小英雄！”带着荣耀与自豪，${hero}踏上归途，永远铭记这片古老土地的荣光。`,
        wisdomQuote: '你现在是古老历史的小小守护者，愿你永远葆有这份自豪与探索热情。',
        funFact: '飞翼圣甲虫是古埃及重生、清晨朝阳与永恒希望的最著名神圣象征。',
        badge: '传奇小英雄金质奖章 👑',
      },
    ],
  };

  return templates[lang] || templates['en'];
}

// ==========================================
// 4. MAIN COMPONENT
// ==========================================

export default function KidsInteractiveStorybook() {
  const { locale } = useLanguage();

  // Active Storybook Language (syncs with global locale, allows on-the-fly override)
  const currentLang: SupportedLang = useMemo(() => {
    const loc = (locale || 'ar').toLowerCase();
    if (loc.startsWith('ar')) return 'ar';
    if (loc.startsWith('zh')) return 'zh';
    if (loc.startsWith('fr')) return 'fr';
    if (loc.startsWith('it')) return 'it';
    if (loc.startsWith('es')) return 'es';
    if (loc.startsWith('ru')) return 'ru';
    return 'en';
  }, [locale]);

  const [activeStoryLang, setActiveStoryLang] = useState<SupportedLang>(currentLang);

  // Sync when global locale changes
  useEffect(() => {
    setActiveStoryLang(currentLang);
  }, [currentLang]);

  // Story configuration
  const [childName, setChildName] = useState('أحمد');
  const [selectedGuardian, setSelectedGuardian] = useState<GuardianId>('horus');
  const [selectedQuest, setSelectedQuest] = useState<QuestId>('pyramid');

  // Reader UI states
  const [isStoryStarted, setIsStoryStarted] = useState(false);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Audio References for isolated ElevenLabs Kids Voice
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);

  // Exact image mapping key
  const storyKey = `${selectedGuardian}-${selectedQuest}`;
  const currentStoryImage = STORY_IMAGE_MAP[storyKey] || '/images/kids-stories/horus_pyramid.jpg';

  // Generate 7-page content in active story language
  const storyPages = useMemo(() => {
    return getStoryPages(childName, selectedGuardian, selectedQuest, activeStoryLang);
  }, [childName, selectedGuardian, selectedQuest, activeStoryLang]);

  const currentPage = storyPages[currentPageIdx] || storyPages[0];
  const guardianMeta = GUARDIANS_META[selectedGuardian][activeStoryLang];
  const questMeta = QUESTS_META[selectedQuest][activeStoryLang];
  const currentLangObj = SUPPORTED_LANGS.find((l) => l.id === activeStoryLang) || SUPPORTED_LANGS[0];

  // ==========================================
  // TEXT-TO-SPEECH (TTS) - ISOLATED ELEVENLABS WITH FALLBACK
  // ==========================================
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
        audioBlobUrlRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fallbackToNativeSpeech = (textToRead: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setIsAudioLoading(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = currentLangObj.bcp47;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    // Intelligent voice selector prioritizing native & female tones
    const voices = window.speechSynthesis.getVoices();
    let bestVoice: SpeechSynthesisVoice | null = null;

    if (activeStoryLang === 'ar') {
      bestVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().includes('ar') &&
            (v.name.toLowerCase().includes('sarah') ||
              v.name.toLowerCase().includes('salma') ||
              v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('zeina'))
        ) ||
        voices.find((v) => v.lang.toLowerCase().includes('ar-eg')) ||
        voices.find((v) => v.lang.toLowerCase().includes('ar')) ||
        null;
    } else {
      bestVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith(activeStoryLang)) ||
        voices.find((v) => v.lang.toLowerCase().includes(activeStoryLang)) ||
        null;
    }

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsAudioLoading(false);
    };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsAudioLoading(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleReadAloud = async () => {
    // If currently speaking or loading, stop immediately
    if (isSpeaking || isAudioLoading) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsAudioLoading(false);
      return;
    }

    const textToRead = `${currentPage.chapterTitle}. ${currentPage.storyText} ${currentPage.wisdomQuote}`;
    setIsAudioLoading(true);

    try {
      // 1. ISOLATED ELEVENLABS API CALL (Voice ID: n7Wi4g1bhpw4Bs8HK5ph, model: eleven_multilingual_v2)
      const res = await fetch('/api/kids-story-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRead,
          voiceId: 'n7Wi4g1bhpw4Bs8HK5ph',
          modelId: 'eleven_multilingual_v2',
          lang: activeStoryLang,
        }),
      });

      if (!res.ok) {
        throw new Error(`ElevenLabs TTS HTTP ${res.status}`);
      }

      const audioBlob = await res.blob();
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
      }
      const audioUrl = URL.createObjectURL(audioBlob);
      audioBlobUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setIsAudioLoading(false);
      };
      audio.onended = () => {
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        fallbackToNativeSpeech(textToRead);
      };

      await audio.play();
    } catch (err) {
      console.warn('ElevenLabs Kids Voice fallback to Web Speech:', err);
      fallbackToNativeSpeech(textToRead);
    }
  };

  const stopActiveAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsAudioLoading(false);
  };

  const handleNextPage = () => {
    if (currentPageIdx < storyPages.length - 1) {
      stopActiveAudio();
      setDirection('forward');
      setCurrentPageIdx((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      stopActiveAudio();
      setDirection('backward');
      setCurrentPageIdx((prev) => prev - 1);
    }
  };

  const handleResetStory = () => {
    stopActiveAudio();
    setCurrentPageIdx(0);
    setIsStoryStarted(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStoryStarted) return;
      if (currentLangObj.dir === 'rtl') {
        if (e.key === 'ArrowLeft') handleNextPage();
        if (e.key === 'ArrowRight') handlePrevPage();
      } else {
        if (e.key === 'ArrowRight') handleNextPage();
        if (e.key === 'ArrowLeft') handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoryStarted, currentPageIdx, currentLangObj.dir]);

  return (
    <div
      className="w-full max-w-5xl mx-auto my-10 font-sans text-white select-none"
      dir={currentLangObj.dir}
    >
      {/* ── TOP SECTION: MAGICAL HEADER & LANGUAGE SELECTOR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C9A84C] to-amber-300 flex items-center justify-center text-black font-extrabold shadow-[0_0_20px_rgba(201,168,76,0.5)]">
            ✨
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C]">
              {activeStoryLang === 'ar' ? 'كتاب القصص الفرعوني التفاعلي' : 'Interactive Pharaoh Storybook'}
            </h2>
            <p className="text-xs text-gray-300">
              {activeStoryLang === 'ar'
                ? 'مغامرة سحرية متعددة اللغات مع حراس مصر الأسطوريين'
                : 'A magical multilingual journey with Egypt’s legendary guardians'}
            </p>
          </div>
        </div>

        {/* Story Language Quick Toggle (7 Languages) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0A1224] border border-[#C9A84C]/40 rounded-2xl shadow-inner overflow-x-auto max-w-full">
          <Languages className="w-4 h-4 text-[#C9A84C] ml-1 shrink-0" />
          {SUPPORTED_LANGS.map((langItem) => {
            const isActive = activeStoryLang === langItem.id;
            return (
              <button
                key={langItem.id}
                onClick={() => {
                  stopActiveAudio();
                  setActiveStoryLang(langItem.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#0A1628] shadow-md scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={langItem.name}
              >
                <span>{langItem.flag}</span>
                <span className="hidden md:inline">{langItem.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SELECTION CONFIGURATION SCREEN (IF NOT STARTED) ── */}
      {!isStoryStarted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-b from-[#111C38]/95 via-[#0C152B]/95 to-[#070D1F] border-2 border-[#C9A84C]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* 1. Child Name Input */}
          <div className="mb-7">
            <label className="block text-sm font-bold text-[#E2CB85] mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9A84C]" />
              <span>
                {activeStoryLang === 'ar' ? 'اسم البطل الصغير:' : 'Young Hero Name:'}
              </span>
            </label>
            <div className="relative max-w-md">
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                maxLength={24}
                placeholder={activeStoryLang === 'ar' ? 'اكتب اسمك هنا...' : 'Enter your name...'}
                className="w-full bg-[#070D1F] border-2 border-[#C9A84C]/40 focus:border-[#C9A84C] rounded-2xl px-5 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
              />
              <span className="absolute end-4 top-1/2 -translate-y-1/2 text-lg">
                👑
              </span>
            </div>
          </div>

          {/* 2. Guardian Selector (3 choices) */}
          <div className="mb-7">
            <label className="block text-sm font-bold text-[#E2CB85] mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#C9A84C]" />
              <span>
                {activeStoryLang === 'ar'
                  ? '1. اختر الحارس الأسطوري (Magical Guardian):'
                  : '1. Choose your Magical Guardian:'}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['horus', 'anubis', 'bastet'] as GuardianId[]).map((gId) => {
                const meta = GUARDIANS_META[gId][activeStoryLang];
                const isSelected = selectedGuardian === gId;
                const icon = gId === 'horus' ? '🦅' : gId === 'anubis' ? '🐺' : '🐱';
                return (
                  <button
                    key={gId}
                    type="button"
                    onClick={() => setSelectedGuardian(gId)}
                    className={`p-4 rounded-2xl border-2 text-start transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#C9A84C] bg-gradient-to-br from-[#C9A84C]/25 to-blue-900/20 shadow-[0_0_25px_rgba(201,168,76,0.35)] scale-[1.02]'
                        : 'border-white/10 bg-white/5 hover:border-[#C9A84C]/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-black/40 border border-white/10">
                        {icon}
                      </span>
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-[#C9A84C] text-[#0A1628] flex items-center justify-center text-xs font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#C9A84C] transition-colors">
                        {meta.name}
                      </h4>
                      <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                        {meta.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Quest Selector (3 choices) */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-[#E2CB85] mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C9A84C]" />
              <span>
                {activeStoryLang === 'ar'
                  ? '2. اختر المهمة السرية (Secret Quest):'
                  : '2. Choose your Secret Quest:'}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['pyramid', 'abusimbel', 'ankh'] as QuestId[]).map((qId) => {
                const meta = QUESTS_META[qId][activeStoryLang];
                const isSelected = selectedQuest === qId;
                const icon = qId === 'pyramid' ? '🏛️' : qId === 'abusimbel' ? '☀️' : '🗝️';
                return (
                  <button
                    key={qId}
                    type="button"
                    onClick={() => setSelectedQuest(qId)}
                    className={`p-4 rounded-2xl border-2 text-start transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#C9A84C] bg-gradient-to-br from-[#C9A84C]/25 to-amber-900/20 shadow-[0_0_25px_rgba(201,168,76,0.35)] scale-[1.02]'
                        : 'border-white/10 bg-white/5 hover:border-[#C9A84C]/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-black/40 border border-white/10">
                        {icon}
                      </span>
                      <span className="text-xs text-gray-400 bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                        {meta.location}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#C9A84C] transition-colors">
                        {meta.title}
                      </h4>
                      <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                        {meta.goal}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Image Thumbnail Before Launching */}
          <div className="mb-8 p-4 rounded-2xl bg-black/40 border border-[#C9A84C]/30 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#C9A84C]/50 shadow-md">
              <Image
                src={currentStoryImage}
                alt="Story Thumbnail"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs text-[#E2CB85] font-bold block">
                {activeStoryLang === 'ar' ? 'القصة المختارة جاهزة:' : 'Selected Story Ready:'}
              </span>
              <p className="text-xs text-gray-300">
                {guardianMeta.name} &bull; {questMeta.title} (7 {activeStoryLang === 'ar' ? 'فصول' : 'Pages'})
              </p>
            </div>
          </div>

          {/* Launch Button */}
          <div className="text-center">
            <button
              onClick={() => {
                setCurrentPageIdx(0);
                setIsStoryStarted(true);
              }}
              className="w-full sm:w-auto min-w-[300px] px-8 py-4 bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] hover:scale-105 active:scale-95 text-[#0A1628] font-extrabold text-base rounded-2xl shadow-[0_0_35px_rgba(201,168,76,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <BookOpen className="w-5 h-5 fill-current" />
              <span>
                {activeStoryLang === 'ar'
                  ? 'افتح الكتاب الرقمي وابدأ القصة (7 فصول) ➔'
                  : 'Open the Digital Book & Read (7 Pages) ➔'}
              </span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* ── 3D INTERACTIVE STORYBOOK VIEWER ── */
        <div className="relative">
          {/* Top Control Bar on Book Spread */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetStory}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-gray-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{activeStoryLang === 'ar' ? 'تغيير القصة' : 'Change Story'}</span>
              </button>
              <span className="text-xs text-gray-400 border-r border-white/20 pr-3 mr-1 hidden sm:inline">
                {activeStoryLang === 'ar' ? 'البطل:' : 'Hero:'}{' '}
                <b className="text-[#C9A84C]">{childName || 'Explorer'}</b> &bull;{' '}
                {guardianMeta.name}
              </span>
            </div>

            {/* Read Aloud Button & Voice Indicator */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReadAloud}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                  isSpeaking
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : isAudioLoading
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                    : 'bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#E2CB85] hover:bg-[#C9A84C] hover:text-[#0A1628]'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {isAudioLoading
                    ? activeStoryLang === 'ar'
                      ? 'جاري تحضير الصوت...'
                      : 'Loading Voice...'
                    : isSpeaking
                    ? activeStoryLang === 'ar'
                      ? 'إيقاف السرد ⏹️'
                      : 'Stop Narration ⏹️'
                    : activeStoryLang === 'ar'
                    ? 'اقرأ لي بصوت عالٍ 🔊'
                    : 'Read Aloud 🔊'}
                </span>
              </button>

              <div className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-[#E2CB85]">
                {activeStoryLang === 'ar'
                  ? `الصفحة ${currentPage.pageNumber} من 7`
                  : `Page ${currentPage.pageNumber} of 7`}
              </div>
            </div>
          </div>

          {/* 3D BOOK FRAME WITH LEATHER & GOLD BORDER */}
          <div className="relative rounded-3xl p-3 sm:p-6 md:p-8 bg-gradient-to-b from-[#24170F] via-[#1A120B] to-[#0D0805] border-[3px] border-[#C9A84C]/60 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
            
            {/* Gilded Top Spine Edge */}
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] opacity-80" />
            <div className="absolute -top-10 -end-10 w-44 h-44 bg-[#C9A84C]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Book Open Spread (Side-by-Side on Desktop, Stacked on Mobile) */}
            <div className="relative bg-[#0E1528] rounded-2xl border border-[#C9A84C]/30 overflow-hidden shadow-2xl">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage.pageNumber}-${activeStoryLang}`}
                  initial={{
                    opacity: 0,
                    x: direction === 'forward' ? 30 : -30,
                    scale: 0.98,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: direction === 'forward' ? -30 : 30,
                    scale: 0.98,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]"
                >
                  {/* SPREAD SIDE 1: FULL-HEIGHT LOCAL STORY IMAGE COVER (5 Cols) */}
                  <div className="lg:col-span-5 relative min-h-[440px] lg:min-h-full h-full w-full overflow-hidden border-b lg:border-b-0 lg:border-e border-[#C9A84C]/25 bg-black">
                    {/* Full Height & Width Image */}
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={currentStoryImage}
                        alt={`${guardianMeta.name} - ${questMeta.title}`}
                        fill
                        priority
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                        sizes="(max-width: 1024px) 100vw, 500px"
                      />
                      {/* Atmospheric Vignette & Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070D1F] via-black/25 to-black/60 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
                    </div>

                    {/* Floating Overlays on the Full Height Image */}
                    <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between">
                      {/* Top Bar on Full Image */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#C9A84C]/60 text-xs font-bold text-[#E2CB85] shadow-lg">
                          {currentPage.badge}
                        </span>
                        <span className="text-xs font-mono text-gray-200 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                          {currentPage.pageNumber} / 7
                        </span>
                      </div>

                      {/* Bottom Educational Fun Fact Floating Card */}
                      <div className="mt-auto p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-[#C9A84C]/50 shadow-2xl text-xs">
                        <div className="flex items-center gap-1.5 text-[#E2CB85] font-bold mb-1.5">
                          <Lightbulb className="w-4 h-4 text-[#C9A84C]" />
                          <span>
                            {activeStoryLang === 'ar' ? 'معلومة فرعونية ذكية:' : 'Pharaonic Fun Fact:'}
                          </span>
                        </div>
                        <p className="text-gray-200 leading-relaxed text-[11px] sm:text-xs">
                          {currentPage.funFact}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SPREAD SIDE 2: STORY TEXT & NAVIGATION (7 Cols) */}
                  <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#070D1F] relative">
                    
                    {/* Chapter Heading */}
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
                        <div>
                          <span className="text-[11px] font-mono text-[#C9A84C] tracking-wider uppercase">
                            {questMeta.location} &bull; {guardianMeta.name}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                            {currentPage.chapterTitle}
                          </h3>
                        </div>
                        <div className="text-end">
                          <span className="text-xs text-gray-400">
                            {activeStoryLang === 'ar' ? 'الفصل' : 'Chapter'}
                          </span>
                          <div className="text-xl font-bold text-[#E2CB85]">
                            {currentPage.pageNumber}/7
                          </div>
                        </div>
                      </div>

                      {/* Main Prose Text */}
                      <div className="prose prose-invert max-w-none">
                        <p className="text-base sm:text-lg text-gray-100 leading-relaxed sm:leading-loose text-justify font-normal selection:bg-[#C9A84C] selection:text-black">
                          {currentPage.storyText}
                        </p>
                      </div>

                      {/* Guardian Wisdom Quote Box */}
                      <div className="mt-6 p-4 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-start gap-3">
                        <span className="text-2xl shrink-0 mt-0.5">📜</span>
                        <div>
                          <span className="text-xs font-bold text-[#E2CB85] block mb-1">
                            {activeStoryLang === 'ar'
                              ? `حكمة ${guardianMeta.name}:`
                              : `Wisdom of ${guardianMeta.name}:`}
                          </span>
                          <p className="text-xs sm:text-sm text-gray-200 italic leading-relaxed">
                            &ldquo;{currentPage.wisdomQuote}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation & Progress Dots */}
                    <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      {/* 7 Progress Dots */}
                      <div className="flex items-center gap-1.5 order-2 sm:order-1">
                        {storyPages.map((p, idx) => (
                          <button
                            key={p.pageNumber}
                            onClick={() => {
                              stopActiveAudio();
                              setDirection(idx > currentPageIdx ? 'forward' : 'backward');
                              setCurrentPageIdx(idx);
                            }}
                            className={`h-2.5 rounded-full transition-all cursor-pointer ${
                              idx === currentPageIdx
                                ? 'w-8 bg-gradient-to-r from-[#C9A84C] to-[#E2CB85]'
                                : idx < currentPageIdx
                                ? 'w-2.5 bg-emerald-500/70'
                                : 'w-2.5 bg-white/20 hover:bg-white/40'
                            }`}
                            title={`Page ${p.pageNumber}`}
                          />
                        ))}
                      </div>

                      {/* Flip Buttons */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPageIdx === 0}
                          className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {currentLangObj.dir === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                          <span>{activeStoryLang === 'ar' ? 'السابق' : 'Previous'}</span>
                        </button>

                        {currentPageIdx < storyPages.length - 1 ? (
                          <button
                            onClick={handleNextPage}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] hover:scale-105 active:scale-95 text-[#0A1628] text-xs font-extrabold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{activeStoryLang === 'ar' ? 'التالي' : 'Next'}</span>
                            {currentLangObj.dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        ) : (
                          <button
                            onClick={handleResetStory}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:scale-105 active:scale-95 text-[#0A1628] text-xs font-extrabold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>
                              {activeStoryLang === 'ar'
                                ? 'مبروك النصر! ابدأ قصة جديدة 👑'
                                : 'Victory! Read New Adventure 👑'}
                            </span>
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

          </div>

          {/* Book Bottom Shadow */}
          <div className="h-4 w-11/12 mx-auto bg-black/60 rounded-full blur-md" />
        </div>
      )}

    </div>
  );
}

