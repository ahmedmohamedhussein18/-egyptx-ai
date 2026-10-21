import React from 'react';
import type { Metadata } from 'next';
import { 
  Music, 
  Film, 
  Palette, 
  BookOpen, 
  Trophy, 
  Landmark, 
  Crown, 
  Moon, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import CultureCard from '@/components/CultureCard';

export const metadata: Metadata = {
  title: 'Egyptian Culture | EgyptX AI',
  description: "Discover Egypt's legendary icons across arts, music, cinema, literature, sports, and world history.",
};

interface IconCard {
  nameAr: string;
  nameEn: string;
  era: string;
  descAr: string;
  descEn: string;
  category: string;
  link: string;
}

interface CultureSection {
  id: string;
  titleAr: string;
  titleEn: string;
  emoji: string;
  icon: any;
  items: IconCard[];
}

const PERSON_IMAGE_MAP: Record<string, string> = {
  // Music & Legends
  'أم كلثوم': '/images/culture/umm-kulthum-new.jpg',
  'عبد الحليم حافظ': '/images/culture/abdel-halim.jpg',
  'محمد عبد الوهاب': '/images/culture/abdel-wahab.jpg',
  'سيد درويش': '/images/culture/sayed-darwish.jpg',

  // Cinema & Theatre
  'عمر الشريف': '/images/culture/omar-sharif.jpg',
  'فاتن حمامة': '/images/culture/faten-hamama.jpg',
  'إسماعيل ياسين': '/images/culture/ismail-yassin.jpg',
  'يوسف شاهين': '/images/culture/youssef-chahine.jpg',

  // Art & Creativity
  'محمود سعيد': '/images/culture/mahmoud-said.jpg',
  'آدم حنين': '/images/culture/adam-henein.jpg',

  // Literature
  'نجيب محفوظ': '/images/culture/naguib-mahfouz.jpg',
  'طه حسين': '/images/culture/taha-hussein.jpg',
  'أحمد شوقي': '/images/culture/ahmed-shawky.jpg',

  // Sports
  'محمد صلاح': '/images/culture/mohamed-salah.jpg',
  'أحمد حسن': '/images/culture/ahmed-hassan.jpg',
  'رامي عاشور': '/images/culture/ramy-ashour.jpg',

  // Historical Figures
  'رمسيس الثاني': '/images/culture/ramesses.jpg',
  'أخناتون': '/images/culture/akhenaten.jpg',
  'نفرتيتي': '/images/culture/nefertiti.jpg',
  'كليوباترا': '/images/culture/cleopatra-new.jpg',
  'كليوباترا السابعة': '/images/culture/cleopatra-new.jpg',

  // Royal Egypt
  'الملك فاروق': '/images/culture/king-farouk.jpg',
  'الملكة نازلي': '/images/culture/queen-nazli.jpg',
  'الخديوي إسماعيل': '/images/culture/khedive-ismail.jpg',

  // Religious & Cultural
  'الإمام الشافعي': '/images/culture/imam-shafii.jpg',
  'د. زاهي حواس': '/images/culture/zahi-hawass.jpg',
};

const CULTURE_SECTIONS: CultureSection[] = [
  {
    id: 'music',
    titleAr: 'الموسيقى وأساطير الغناء',
    titleEn: 'Music & Legends',
    emoji: '',
    icon: Music,
    items: [
      {
        nameAr: 'أم كلثوم',
        nameEn: 'Umm Kulthum',
        era: '1898 – 1975',
        category: 'كوكب الشرق · The Lady of Arabic Song',
        descAr: 'كوكب الشرق وصوت العرب الخالد.',
        descEn: 'The definitive voice of the Arab world.',
        link: 'https://en.wikipedia.org/wiki/Umm_Kulthum',
      },
      {
        nameAr: 'عبد الحليم حافظ',
        nameEn: 'Abdel Halim Hafez',
        era: '1929 – 1977',
        category: 'العندليب الأسمر · The Nightingale',
        descAr: 'العندليب الأسمر وأيقونة الغناء الرومانسي.',
        descEn: 'The legendary "Brown Nightingale" of Arabic music.',
        link: 'https://en.wikipedia.org/wiki/Abdel_Halim_Hafez',
      },
      {
        nameAr: 'محمد عبد الوهاب',
        nameEn: 'Mohamed Abdel Wahab',
        era: '1902 – 1991',
        category: 'موسيقار الأجيال · Maestro of Generations',
        descAr: 'موسيقار الأجيال وملحن النشيد الوطني.',
        descEn: 'Pioneering maestro and national anthem composer.',
        link: 'https://en.wikipedia.org/wiki/Mohammed_Abdel_Wahab',
      },
      {
        nameAr: 'سيد درويش',
        nameEn: 'Sayed Darwish',
        era: '1892 – 1923',
        category: 'فنان الشعب · Father of Popular Music',
        descAr: 'فنان الشعب وباعث النهضة الموسيقية الحديثة.',
        descEn: 'Father of modern popular Egyptian music.',
        link: 'https://en.wikipedia.org/wiki/Sayed_Darwish',
      },
    ],
  },
  {
    id: 'cinema',
    titleAr: 'السينما والمسرح',
    titleEn: 'Cinema & Theatre',
    emoji: '',
    icon: Film,
    items: [
      {
        nameAr: 'عمر الشريف',
        nameEn: 'Omar Sharif',
        era: '1932 – 2015',
        category: 'النجم العالمي · Hollywood Legend',
        descAr: 'أسطورة هوليوود العالمي وبطل لورنس العرب.',
        descEn: 'Hollywood legend and Golden Globe winner.',
        link: 'https://en.wikipedia.org/wiki/Omar_Sharif',
      },
      {
        nameAr: 'فاتن حمامة',
        nameEn: 'Faten Hamama',
        era: '1931 – 2015',
        category: 'سيدة الشاشة العربية · First Lady of Cinema',
        descAr: 'سيدة الشاشة ونجمة القرن للسينما المصرية.',
        descEn: 'First Lady of Arab cinema and timeless star.',
        link: 'https://en.wikipedia.org/wiki/Faten_Hamama',
      },
      {
        nameAr: 'إسماعيل ياسين',
        nameEn: 'Ismail Yassin',
        era: '1912 – 1972',
        category: 'ملك الكوميديا · King of Comedy',
        descAr: 'ملك الكوميديا وصانع البهجة الاستثنائي.',
        descEn: 'King of Comedy and iconic cinematic franchise star.',
        link: 'https://en.wikipedia.org/wiki/Ismail_Yassine',
      },
      {
        nameAr: 'يوسف شاهين',
        nameEn: 'Youssef Chahine',
        era: '1926 – 2008',
        category: 'المخرج العالمي · Visionary Auteur',
        descAr: 'المخرج العالمي الحائز على يوبيل كان الذهبي.',
        descEn: 'Visionary auteur and Cannes Lifetime winner.',
        link: 'https://en.wikipedia.org/wiki/Youssef_Chahine',
      },
    ],
  },
  {
    id: 'art',
    titleAr: 'الفن التشكيلي والإبداع',
    titleEn: 'Art & Creativity',
    emoji: '',
    icon: Palette,
    items: [
      {
        nameAr: 'محمود سعيد',
        nameEn: 'Mahmoud Said',
        era: '1897 – 1964',
        category: 'رائد التصوير المصري المعاصر · Master Painter',
        descAr: 'رائد التصوير الزيتي المصري الحديث.',
        descEn: 'Pioneering master of modern Egyptian painting.',
        link: 'https://en.wikipedia.org/wiki/Mahmoud_Sa%27id',
      },
      {
        nameAr: 'آدم حنين',
        nameEn: 'Adam Henein',
        era: '1929 – 2020',
        category: 'شيخ النحاتين المعاصرين · Renowned Sculptor',
        descAr: 'شيخ النحاتين المعاصرين ومرمم تمثال أبو الهول.',
        descEn: 'Master sculptor and restorer of the Great Sphinx.',
        link: 'https://en.wikipedia.org/wiki/Adam_Henein',
      },
    ],
  },
  {
    id: 'literature',
    titleAr: 'الأدب والفكر الإنساني',
    titleEn: 'Literature & Thought',
    emoji: '',
    icon: BookOpen,
    items: [
      {
        nameAr: 'نجيب محفوظ',
        nameEn: 'Naguib Mahfouz',
        era: '1911 – 2006',
        category: 'حائز نوبل في الأدب · Nobel Laureate',
        descAr: 'أول أديب عربي يفوز بجائزة نوبل للآداب.',
        descEn: 'First Arab Nobel laureate in Literature.',
        link: 'https://en.wikipedia.org/wiki/Naguib_Mahfouz',
      },
      {
        nameAr: 'طه حسين',
        nameEn: 'Taha Hussein',
        era: '1889 – 1973',
        category: 'عميد الأدب العربي · Dean of Arabic Literature',
        descAr: 'عميد الأدب العربي ورائد التنوير ومجانية التعليم.',
        descEn: 'Dean of Arabic Literature and enlightenment pioneer.',
        link: 'https://en.wikipedia.org/wiki/Taha_Hussein',
      },
      {
        nameAr: 'أحمد شوقي',
        nameEn: 'Ahmed Shawqi',
        era: '1868 – 1932',
        category: 'أمير الشعراء · Prince of Poets',
        descAr: 'أمير الشعراء ورائد المسرح الشعري العربي.',
        descEn: 'Prince of Poets and poetic theatre pioneer.',
        link: 'https://en.wikipedia.org/wiki/Ahmed_Shawqi',
      },
    ],
  },
  {
    id: 'sports',
    titleAr: 'أساطير الرياضة المصرية',
    titleEn: 'Egyptian Sports Icons',
    emoji: '',
    icon: Trophy,
    items: [
      {
        nameAr: 'محمد صلاح',
        nameEn: 'Mohamed Salah',
        era: '1992 – الآن',
        category: 'الملك المصري · The Egyptian King',
        descAr: 'الملك المصري وأسطورة كرة القدم العالمية.',
        descEn: 'Global superstar and Premier League champion.',
        link: 'https://en.wikipedia.org/wiki/Mohamed_Salah',
      },
      {
        nameAr: 'أحمد حسن',
        nameEn: 'Ahmed Hassan',
        era: '1975 – الآن',
        category: 'عميد لاعبي العالم الأسبق · Historic Captain',
        descAr: 'قائد منتخب مصر المتوج بـ 4 بطولات أفريقية.',
        descEn: 'Historic captain with 4 AFCON championship titles.',
        link: 'https://en.wikipedia.org/wiki/Ahmed_Hassan_(footballer,_born_1975)',
      },
      {
        nameAr: 'رامي عاشور',
        nameEn: 'Ramy Ashour',
        era: '1987 – الآن',
        category: 'أسطورة الإسكواش العالمية · 3x World Champion',
        descAr: 'بطل العالم للإسكواش ثلاث مرات والملقب بالفنان.',
        descEn: 'Three-time World Squash Champion and sport artist.',
        link: 'https://en.wikipedia.org/wiki/Ramy_Ashour',
      },
    ],
  },
  {
    id: 'history',
    titleAr: 'الشخصيات التاريخية الخالدة',
    titleEn: 'Historical Figures',
    emoji: '️',
    icon: Landmark,
    items: [
      {
        nameAr: 'رمسيس الثاني',
        nameEn: 'Ramesses II (The Great)',
        era: '1303 – 1213 ق.م',
        category: 'فرعون المجد · 19th Dynasty Pharaoh',
        descAr: 'أعظم فراعنة مصر وباني معبد أبو سمبل.',
        descEn: 'Egypt’s greatest builder pharaoh and peace architect.',
        link: 'https://en.wikipedia.org/wiki/Ramesses_II',
      },
      {
        nameAr: 'أخناتون',
        nameEn: 'Akhenaten',
        era: 'حكم 1353 – 1336 ق.م',
        category: 'الملك المصلح · The Monotheist Pharaoh',
        descAr: 'فرعون التوحيد وباني عاصمة تل العمارنة.',
        descEn: 'Visionary pharaoh who pioneered solar monotheism.',
        link: 'https://en.wikipedia.org/wiki/Akhenaten',
      },
      {
        nameAr: 'نفرتيتي',
        nameEn: 'Nefertiti',
        era: '1370 – 1330 ق.م',
        category: 'سيدة البهجة والجمال · Great Royal Wife',
        descAr: 'ملكة الجمال والحكم وصاحبة التمثال الأيقوني.',
        descEn: 'Iconic queen of beauty and royal sovereignty.',
        link: 'https://en.wikipedia.org/wiki/Nefertiti',
      },
      {
        nameAr: 'كليوباترا',
        nameEn: 'Cleopatra VII',
        era: '69 – 30 ق.م',
        category: 'آخر ملوك البطالمة · Queen of Egypt',
        descAr: 'آخر ملكات البطالمة وصاحبة الدبلوماسية الذكية.',
        descEn: 'Legendary last monarch of Ptolemaic Egypt.',
        link: 'https://en.wikipedia.org/wiki/Cleopatra',
      },
    ],
  },
  {
    id: 'royals',
    titleAr: 'مصر الملكية والحديثة',
    titleEn: 'Royal Egypt',
    emoji: '',
    icon: Crown,
    items: [
      {
        nameAr: 'الخديوي إسماعيل',
        nameEn: 'Khedive Ismail',
        era: '1830 – 1895',
        category: 'صانع القاهرة الخديوية · Khedive of Egypt',
        descAr: 'باني القاهرة الخديوية ومفتتح قناة السويس.',
        descEn: 'Creator of modern Cairo and Suez Canal inaugurator.',
        link: 'https://en.wikipedia.org/wiki/Isma%27il_Pasha',
      },
      {
        nameAr: 'الملك فاروق',
        nameEn: 'King Farouk',
        era: '1920 – 1965',
        category: 'ملك مصر والسودان · King of Egypt and Sudan',
        descAr: 'آخر ملوك مصر ممارسة للحكم الفعلي.',
        descEn: 'Last reigning King of cosmopolitan Egypt.',
        link: 'https://en.wikipedia.org/wiki/Farouk_of_Egypt',
      },
      {
        nameAr: 'الملكة نازلي',
        nameEn: 'Queen Nazli',
        era: '1894 – 1978',
        category: 'ملكة مصر وقرينة الملك فؤاد · Queen Consort',
        descAr: 'أول ملكة لمصر الحديثة عام 1922.',
        descEn: 'First queen consort of the modern Kingdom of Egypt.',
        link: 'https://en.wikipedia.org/wiki/Nazli_Sabri',
      },
    ],
  },
  {
    id: 'heritage',
    titleAr: 'التراث الديني والحضاري',
    titleEn: 'Religious & Cultural Heritage',
    emoji: '',
    icon: Moon,
    items: [
      {
        nameAr: 'الإمام الشافعي',
        nameEn: 'Imam Al-Shafi\'i',
        era: '767 – 820 م',
        category: 'إمام الفقه وأحد الأئمة الأربعة · Master Theologian',
        descAr: 'مؤسس المذهب الشافعي وأحد كبار أئمة الفقه.',
        descEn: 'Founder of the Shafi’i Islamic school of jurisprudence.',
        link: 'https://en.wikipedia.org/wiki/Al-Shafi%27i',
      },
      {
        nameAr: 'د. زاهي حواس',
        nameEn: 'Dr. Zahi Hawass',
        era: '1947 – معاصر',
        category: 'عالم المصريات الشهير · World-Renowned Egyptologist',
        descAr: 'أشهر علماء الآثار والمصريات في العالم.',
        descEn: 'World-renowned archaeologist and explorer of Egypt.',
        link: 'https://en.wikipedia.org/wiki/Zahi_Hawass',
      },
      {
        nameAr: 'الأزهر الشريف وشيخ الأزهر',
        nameEn: 'Al-Azhar Al-Sharif & The Grand Imam',
        era: 'تأسس 970 م – مستمر',
        category: 'منارة الوسطية الإسلامية · Global Seat of Moderation',
        descAr: 'أعرق منارة للعلوم الإسلامية والوسطية منذ 970 م.',
        descEn: 'Historic global seat of moderate Islamic scholarship.',
        link: 'https://en.wikipedia.org/wiki/Al-Azhar_University',
      },
    ],
  },
];

export default function EgyptianCulturePage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#030712] text-[#1A2332] dark:text-white pt-28 pb-24 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Ambient background glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#C9A84C]/15 via-[#1B6B93]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-3/4 -left-40 w-96 h-96 bg-[#1B6B93]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-xs font-semibold text-[#E2CB85] uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            National Cultural Heritage · التراث الثقافي الخالد
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C] mb-3">
            Egyptian Culture
          </h1>
          <p className="text-xl sm:text-2xl text-[#C9A84C] font-serif mb-2">
            الثقافة المصرية · رموز التاريخ والفن والإبداع
          </p>
          <p className="text-sm sm:text-base text-gray-400 font-medium">
            Discover Egypt’s legendary icons across arts, music, cinema, literature, sports, and world history.
          </p>

          {/* Quick jump anchors */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {CULTURE_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="px-3 py-1 rounded-full bg-[#F8F3E9] dark:bg-white/5 hover:bg-[#C9A84C]/20 border border-slate-200 dark:border-white/10 hover:border-[#C9A84C]/40 text-xs text-[#1A2332] dark:text-white/80 hover:text-[#C5A059] dark:hover:text-[#E2CB85] transition-all shadow-sm"
              >
                <span>{sec.emoji}</span>{' '}
                <span>{sec.titleEn}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── 8 SECTIONS ──────────────────────────────────────────────────── */}
        <div className="space-y-20">
          {CULTURE_SECTIONS.map((section) => {
            const SectionIcon = section.icon;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <div className="flex items-center justify-between border-b border-[#C9A84C]/25 pb-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-xl text-[#C9A84C]">
                      <SectionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2332] dark:text-white flex items-center gap-2">
                        <span>{section.titleAr}</span>
                        <span className="text-base text-slate-500 dark:text-gray-400 font-serif hidden sm:inline">· {section.titleEn}</span>
                      </h2>
                      <p className="text-xs text-yellow-700 dark:text-[#E2CB85] sm:hidden font-serif">{section.titleEn}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#1A2332] dark:text-gray-400 font-mono bg-[#F8F3E9] dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 shadow-sm">
                    {section.items.length} Icons
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                  {section.items.map((item) => (
                    <CultureCard
                      key={item.nameEn}
                      item={item}
                      personImage={PERSON_IMAGE_MAP[item.nameAr]}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

      </div>
    </main>
  );
}
