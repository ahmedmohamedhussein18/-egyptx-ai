import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Landmark, 
  Award,
  ScrollText,
  FileText
} from 'lucide-react';

import MinistryCard, { MinistryItem } from '@/components/MinistryCard';

export const metadata: Metadata = {
  title: 'Egypt Official | EgyptX AI',
  description: 'Official national leadership, ministries, and heritage institutions of the Arab Republic of Egypt.',
};

const MINISTRIES: MinistryItem[] = [
  {
    nameAr: 'وزارة السياحة والآثار',
    nameEn: 'Ministry of Tourism and Antiquities',
    descAr: 'الجهة المسؤولة عن تنمية القطاع السياحي وصون وإدارة الكنوز الأثرية المصرية والمتاحف الوطنية.',
    descEn: 'Responsible for advancing national tourism and safeguarding Egypt’s archaeological treasures and museums.',
    url: 'https://mota.gov.eg',
    tag: 'Tourism & Antiquities',
    image: '/images/official/ministry-tourism.jpg',
    iconName: 'Landmark',
  },
  {
    nameAr: 'وزارة الثقافة',
    nameEn: 'Ministry of Culture',
    descAr: 'ترعى الفنون والآداب والتراث الفكري وحفظ الهوية الثقافية المصرية العريقة.',
    descEn: 'Fosters the arts, literature, theatrical heritage, and cultural identity of the Arab Republic of Egypt.',
    url: 'https://www.moc.gov.eg',
    tag: 'Culture & Arts',
    image: '/images/official/ministry-culture.jpg',
    iconName: 'ScrollText',
  },
  {
    nameAr: 'المجلس الأعلى للآثار',
    nameEn: 'Supreme Council of Antiquities',
    descAr: 'الهيئة المشرفة على إدارة الحفائر والترميم وتأمين وحماية المواقع الأثرية في ربوع مصر.',
    descEn: 'The supreme authority overseeing excavations, restoration, and preservation of Egyptian monuments.',
    url: 'https://egymonuments.gov.eg',
    tag: 'Monuments Protection',
    image: '/images/official/supreme-council.jpg',
    iconName: 'ShieldCheck',
  },
  {
    nameAr: 'هيئة الاستعلامات',
    nameEn: 'State Information Service (SIS)',
    descAr: 'الهيئة الإعلامية الرسمية للدولة المصرية لنشر الحقائق والمعلومات الموثقة دولياً ومحلياً.',
    descEn: 'The official governmental information and media agency representing the Arab Republic of Egypt.',
    url: 'https://www.sis.gov.eg',
    tag: 'Official Information',
    image: '/images/official/egyptian-information.jpg',
    iconName: 'FileText',
  },
];

export default function EgyptOfficialPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white pt-28 pb-20 font-sans relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#C9A84C]/15 via-[#1B6B93]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 -left-40 w-96 h-96 bg-[#1B6B93]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-xs font-semibold text-[#E2CB85] uppercase tracking-widest mb-4">
            <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
            Official State Portals · بوابات الدولة الرسمية
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C] mb-4">
            Egypt Official
          </h1>
          <p className="text-lg sm:text-xl text-[#C9A84C] font-serif mb-2">
            مصر الرسمية · القيادة والحكومة والمؤسسات الوطنية
          </p>
          <p className="text-sm sm:text-base text-gray-400 font-medium tracking-wide">
            President · Government · Ministries · National Institutions
          </p>
        </div>

        {/* ── SECTION 1: PRESIDENT OF EGYPT ───────────────────────────────── */}
        <section className="mb-14">
          <div className="relative overflow-hidden rounded-3xl border border-[#C9A84C]/40 hover:border-[#C9A84C] hover:shadow-[0_0_35px_rgba(201,168,76,0.3)] transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-[#0A1628]">
            {/* Egyptian Flag Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#CE1126] via-[#FFFFFF] to-[#000000] z-20" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
              {/* Figure Portrait Column: Clean, prominent, proportional aspect ratio */}
              <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden bg-black/60">
                <img
                  src="/images/official/president-sisi.jpg"
                  alt="President Abdel Fattah El-Sisi"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent lg:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A1628] hidden lg:block" />
              </div>

              {/* Text & Portal Column */}
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-xs font-bold text-[#E2CB85] backdrop-blur-sm">
                    <span>جمهورية مصر العربية</span>
                    <span>·</span>
                    <span>Arab Republic of Egypt</span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md">
                      الرئيس عبد الفتاح السيسي
                    </h2>
                    <p className="text-xl sm:text-2xl text-[#C9A84C] font-semibold mt-1 drop-shadow">
                      President Abdel Fattah El-Sisi
                    </p>
                    <p className="text-sm text-gray-300 font-medium mt-1">
                      رئيس جمهورية مصر العربية · President of the Arab Republic of Egypt
                    </p>
                  </div>

                  {/* Presidential Vision Quote */}
                  <div className="relative bg-black/40 border-l-4 border-[#C9A84C] rounded-r-2xl p-5 backdrop-blur-md">
                    <p className="text-sm sm:text-base text-gray-100 leading-relaxed font-serif italic mb-3">
                      &ldquo;مصر تفتح ذراعيها للعالم أجمع، حاملةً رسالة سلام وتاريخ وحضارة تمتد لآلاف السنين. نواصل العمل بكل عزم على صون تراثنا الإنساني العريق وتطوير مقاصدنا السياحية لتظل مصر دوماً منارة للحضارة والإلهام.&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                      &ldquo;Egypt opens its arms to the whole world, carrying a message of peace, timeless heritage, and civilizational depth. We are determined to safeguard our world heritage and advance our tourism destinations so Egypt remains an eternal beacon of culture and inspiration.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Presidency of Egypt Official Records · الموقع الرسمي لرئاسة الجمهورية</span>
                  </div>

                  <a 
                    href="https://www.presidency.eg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] text-[#030712] text-xs font-bold hover:bg-[#E2CB85] transition-all shadow-md shrink-0"
                  >
                    <span>زيارة الموقع الرئاسي الرسمي</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: MINISTER OF TOURISM & ANTIQUITIES ─────────────────── */}
        <section className="mb-14">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 hover:border-[#C9A84C]/60 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all duration-500 shadow-xl bg-[#0A1628]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
              {/* Minister Portrait Column: Clean, prominent, proportional aspect ratio */}
              <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-full overflow-hidden bg-black/60">
                <img
                  src="/images/official/ahmed-essa.jpg"
                  alt="Sherif Fathy · Minister of Tourism and Antiquities"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent lg:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A1628] hidden lg:block" />
              </div>

              {/* Text & Portal Column */}
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B6B93]/30 border border-[#1B6B93]/50 text-xs font-semibold text-cyan-200 backdrop-blur-sm">
                    <Landmark className="w-3.5 h-3.5" />
                    وزارة السياحة والآثار · Ministry of Tourism and Antiquities
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                      شريف فتحي · وزير السياحة والآثار
                    </h2>
                    <p className="text-lg text-[#C9A84C] font-semibold mt-0.5 drop-shadow">
                      Sherif Fathy · Minister of Tourism and Antiquities
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed drop-shadow">
                    قيادة الاستراتيجية الوطنية للسياحة المستدامة، وتطوير البنية التحتية للمواقع الأثرية الكبرى في الجيزة والأقصر وأسوان، وتسريع رقمنة الخدمات السياحية والتذاكر الإلكترونية وتشغيل المتحف المصري الكبير (GEM) لتقديم تجربة عالمية تليق بمكانة مصر التاريخية.
                  </p>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic drop-shadow">
                    Spearheading the National Sustainable Tourism Strategy, infrastructure modernization across world heritage sites in Giza, Luxor, and Aswan, alongside full digital ticketing and the grand opening of the Grand Egyptian Museum (GEM).
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Ministry of Tourism & Antiquities Official Portal · mota.gov.eg</span>
                  </div>

                  <a
                    href="https://mota.gov.eg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-[#C9A84C] hover:text-[#030712] text-xs font-semibold text-white transition-all shadow-md shrink-0"
                  >
                    <span>دخول البوابة الإلكترونية</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: DR. ZAHI HAWASS ───────────────────────────────────── */}
        <section className="mb-14">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#C9A84C]/60 hover:border-[#C9A84C] hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] transition-all duration-500 shadow-[0_15px_45px_rgba(0,0,0,0.6)] bg-[#0A1628]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
              {/* Dr. Zahi Hawass Portrait Column: Clean, prominent, proportional aspect ratio */}
              <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-full overflow-hidden bg-black/60">
                <img
                  src="/images/official/zahi-hawass-official.jpg"
                  alt="Dr. Zahi Hawass"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent lg:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A1628] hidden lg:block" />
              </div>

              {/* Text & Portal Column */}
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-xs font-bold text-[#E2CB85] backdrop-blur-sm">
                    <Award className="w-3.5 h-3.5 text-[#C9A84C]" />
                    شخصية أثرية عالمية · World-Renowned Egyptologist
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                      د. زاهي حواس
                    </h2>
                    <p className="text-xl text-[#C9A84C] font-semibold drop-shadow">
                      Dr. Zahi Hawass
                    </p>
                    <p className="text-sm text-gray-300 font-medium">
                      عالم الآثار والمصريات الشهير · وزير الآثار الأسبق
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed drop-shadow">
                    يُعد الدكتور زاهي حواس أحد أبرز علماء المصريات في العصر الحديث وأكثرهم تأثيراً على الساحة الدولية. قاد العديد من أهم الحفائر والاكتشافات الأثرية في أهرامات الجيزة، وسقارة، ووادي الملوك، ومن أبرزها مقابر بناة الأهرام، والمدينة الذهبية المفقودة في الأقصر، إلى جانب جهوده الرائدة في استرداد الآثار المصرية ونشر سحر الحضارة الفرعونية حول العالم.
                  </p>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic drop-shadow">
                    Dr. Zahi Hawass is one of the world’s most eminent archaeologists and the leading authority on ancient Egyptian civilization. Having spearheaded groundbreaking excavations at Giza, Saqqara, and the Valley of the Kings, he remains an international icon advocating for the preservation and celebration of Egypt’s cultural heritage.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Official Portal of Dr. Zahi Hawass · drhawass.com</span>
                  </div>

                  <a
                    href="https://www.drhawass.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] text-[#030712] hover:bg-[#E2CB85] text-xs font-bold transition-all shadow-md shrink-0"
                  >
                    <span>الموقع الرسمي للدكتور زاهي حواس</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: KEY MINISTRIES & INSTITUTIONS GRID ────────────────── */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#C9A84C]" />
              الوزارات والمؤسسات الوطنية الرئيسية
            </h2>
            <p className="text-sm text-gray-400">
              Key Ministries & Official State Heritage Authorities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MINISTRIES.map((inst) => (
              <MinistryCard key={inst.nameEn} inst={inst} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
