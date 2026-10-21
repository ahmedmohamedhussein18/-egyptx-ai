'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plane,
  Hotel,
  Utensils,
  Video,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MapPin,
  Star,
  AlertCircle,
  Play,
  Calendar,
  Compass,
  ArrowRight,
  Globe2,
  CheckCircle2,
  Building,
  Home
} from 'lucide-react';

type TabType = 'all' | 'flights' | 'hotels' | 'restaurants' | 'videos';

interface Airline {
  nameAr: string;
  nameEn: string;
  code: string;
  hub: string;
  descAr: string;
  descEn: string;
  bookingUrl: string;
  badge?: string;
  featured?: boolean;
}

interface HotelPlatform {
  name: string;
  desc: string;
  url: string;
  badge: string;
  icon: typeof Hotel;
}

interface FeaturedHotel {
  nameAr: string;
  nameEn: string;
  location: string;
  city: string;
  rating: string;
  descAr: string;
  descEn: string;
  bookingUrl: string;
  highlight: string;
}

interface RestaurantVenue {
  nameAr: string;
  nameEn: string;
  cuisine: string;
  location: string;
  descAr: string;
  descEn: string;
  bookingUrl: string;
  signatureDish: string;
}

interface VideoFeature {
  id: string;
  titleAr: string;
  titleEn: string;
  source: string;
  descAr: string;
  descEn: string;
  duration: string;
}

const AIRLINES: Airline[] = [
  {
    nameAr: 'مصر للطيران',
    nameEn: 'EgyptAir',
    code: 'MS',
    hub: 'القاهرة (CAI) · مطار سفنكس (SPX) · برج العرب (HBE)',
    descAr: 'الناقل الوطني الرسمي لجمهورية مصر العربية، وعضو تحالف ستار العالمي. شبكة طيران شاملة تربط عواصم العالم بمصر مع رحلات داخلية مباشرة للأقصر وأسوان وشرم الشيخ والغردقة.',
    descEn: 'The official national flag carrier of Egypt and Star Alliance member. Comprehensive global flight network connecting major world hubs directly to Cairo, Luxor, Aswan, Hurghada, and Sharm El Sheikh.',
    bookingUrl: 'https://www.egyptair.com',
    badge: 'الناقل الوطني الرسمي · National Carrier',
    featured: true,
  },
  {
    nameAr: 'طيران الإمارات',
    nameEn: 'Emirates',
    code: 'EK',
    hub: 'دبي (DXB) ⇄ القاهرة (CAI)',
    descAr: 'رحلات يومية منتظمة متعددة على متن طائرات الإيرباص A380 والبوينج 777، توفر وصولاً سلساً ومريحاً من كافة قارات العالم إلى مطار القاهرة الدولي.',
    descEn: 'Multiple daily direct wide-body flights connecting the world seamlessly to Cairo via Dubai with award-winning luxury inflight service.',
    bookingUrl: 'https://www.emirates.com',
    badge: 'رحلات يومية مباشرة',
  },
  {
    nameAr: 'الخطوط الجوية القطرية',
    nameEn: 'Qatar Airways',
    code: 'QR',
    hub: 'الدوحة (DOH) ⇄ القاهرة (CAI) · الإسكندرية (HBE)',
    descAr: 'خدمة راقية ورحلات متعددة يومياً تربط أكثر من 160 وجهة عالمية بالقاهرة والإسكندرية عبر مطار حمد الدولي المصنف عالمياً.',
    descEn: 'Global 5-star service linking over 160 international destinations to Cairo and Alexandria through Hamad International Airport.',
    bookingUrl: 'https://www.qatarairways.com',
    badge: 'طيران خمس نجوم',
  },
  {
    nameAr: 'الخطوط الجوية التركية',
    nameEn: 'Turkish Airlines',
    code: 'TK',
    hub: 'إسطنبول (IST) ⇄ القاهرة، الإسكندرية، شرم الشيخ، الغردقة',
    descAr: 'عضو تحالف ستار العالمي وأكبر شبكة وجهات دولية، توفر رحلات مباشرة ومريحة إلى مطارات القاهرة والإسكندرية ومنتجعات البحر الأحمر.',
    descEn: 'Extensive Star Alliance global network offering direct access to Cairo, Alexandria, Hurghada, and Sharm El Sheikh via Istanbul.',
    bookingUrl: 'https://www.turkishairlines.com',
    badge: 'عضو ستار ألاينس',
  },
];

const HOTEL_PLATFORMS: HotelPlatform[] = [
  {
    name: 'Booking.com Egypt',
    desc: 'Compare thousands of verified hotels, Nile cruise ships, and luxury boutique resorts across all 27 governorates.',
    url: 'https://www.booking.com/country/eg.html',
    badge: 'Largest Selection',
    icon: Building,
  },
  {
    name: 'Airbnb Egypt',
    desc: 'Unique Egyptian homes, heritage Zamalek apartments, Nile-view penthouses, and desert eco-lodges.',
    url: 'https://www.airbnb.com/egypt',
    badge: 'Homes & Villas',
    icon: Home,
  },
  {
    name: 'Hotels.com Egypt',
    desc: 'Trusted hotel booking with member rewards, flexible cancellations, and curated Cairo & Red Sea stays.',
    url: 'https://www.hotels.com',
    badge: 'Member Rewards',
    icon: Hotel,
  },
];

const FEATURED_HOTELS: FeaturedHotel[] = [
  {
    nameAr: 'فندق ماريوت القاهرة وكازينو عمر الخيام',
    nameEn: 'Cairo Marriott Hotel & Omar Khayyam Casino',
    location: 'جزيرة الزمالك، القاهرة',
    city: 'Cairo',
    rating: '5-Star Historic Royal Palace',
    descAr: 'قصر الجزيرة الملكي التاريخي الذي شيّده الخديوي إسماعيل عام 1869 لاستضافة الإمبراطورة أوجيني إبان افتتاح قناة السويس. محاط بستة أفدنة من الحدائق الغناء المطلة على النيل.',
    descEn: 'Built in 1869 by Khedive Ismail to host Empress Eugénie for the Suez Canal inauguration. A 19th-century royal palace in Zamalek set amidst six acres of lush palace gardens along the Nile.',
    bookingUrl: 'https://www.marriott.com/en-us/hotels/caimn-cairo-marriott-hotel-and-omar-khayyam-casino/overview/',
    highlight: 'Palace Heritage 1869',
  },
  {
    nameAr: 'فندق فورسيزونز القاهرة في نايل بلازا',
    nameEn: 'Four Seasons Hotel Cairo at Nile Plaza',
    location: 'جاردن سيتي، كورنيش النيل، القاهرة',
    city: 'Cairo',
    rating: '5-Star Ultra Luxury',
    descAr: 'أرقى تجارب الإقامة الفاخرة على ضفاف النيل مباشرة في حي جاردن سيتي الدبلوماسي، مع إطلالات بانورامية على مجرى النيل وجزيرة الزمالك وتجارب ضيافة عالمية.',
    descEn: 'Prestigious waterfront sanctuary in the diplomatic Garden City district, featuring panoramic Nile-view terraces, a world-class luxury spa, and award-winning international dining.',
    bookingUrl: 'https://www.fourseasons.com/caironp/',
    highlight: 'Nile Panorama',
  },
  {
    nameAr: 'سوفيتيل ليجند أولد كاتاراكت أسوان',
    nameEn: 'Sofitel Legend Old Cataract Aswan',
    location: 'ضفاف النيل وصخور الجرانيت، أسوان',
    city: 'Aswan',
    rating: '5-Star Historic Victorian Palace',
    descAr: 'تحفة معمارية فيكتورية خالدة تطل على جزيرة الفنتين وشلالات النيل الأولى. المقر التاريخي الذي أقامت فيه أجاثا كريستي وكتبت روايتها "موت فوق النيل"، ونزل فيه ملوك ورؤساء العالم.',
    descEn: 'Legendary 19th-century Victorian palace on the pink granite banks of the Nile in Aswan. Where Agatha Christie penned Death on the Nile, and world monarchs rested.',
    bookingUrl: 'https://all.accor.com/hotel/1666/index.en.shtml',
    highlight: 'Agatha Christie Legend',
  },
  {
    nameAr: 'فندق ماريوت مينا هاوس القاهرة',
    nameEn: 'Marriott Mena House, Cairo',
    location: 'هضبة الأهرامات، الجيزة',
    city: 'Giza',
    rating: '5-Star Pyramids View',
    descAr: 'استراحة ملكية تاريخية أنشئت عام 1869 عند سفح أهرامات الجيزة الخالدة مباشرة. إطلالات ساحرة على هرم خوفو ومساحات خضراء شاسعة وتاريخ عريق استضاف قادة العالم.',
    descEn: 'Historic royal lodge dating back to 1869, set directly in the shadow of the Great Pyramids of Giza amid 40 acres of fragrant jasmine gardens and historic legacy.',
    bookingUrl: 'https://www.marriott.com/en-us/hotels/caimm-marriott-mena-house-cairo/overview/',
    highlight: 'Direct Pyramids View',
  },
];

const RESTAURANTS: RestaurantVenue[] = [
  {
    nameAr: 'أبو السيد',
    nameEn: 'Abou El Sid',
    cuisine: 'Authentic Traditional Egyptian',
    location: 'Zamalek & Sheikh Zayed, Cairo',
    descAr: 'المعيار الذهبي للمطبخ المصري الأصيل. أجواء شرقية دافئة تعيد زمن القاهرة في أربعينيات القرن الماضي، مع أشهى أطباق الملوخية في الطواجن النحاسية والحمام المحشي وطواجن البامية.',
    descEn: 'The quintessential benchmark for authentic Egyptian dining. Vintage 1940s oriental salon atmosphere with signature copper-pot molokhia, stuffed pigeon, and slow-cooked veal tagines.',
    bookingUrl: 'https://www.facebook.com/AbouElSidOfficial/',
    signatureDish: 'Molokhia & Stuffed Pigeon (حمام محشي وملوخية)',
  },
  {
    nameAr: 'مقهى ومطعم نجيب محفوظ',
    nameEn: 'Naguib Mahfouz Café',
    cuisine: 'Historic Egyptian & Oriental Grills',
    location: 'Khan El-Khalili Bazaar, Islamic Cairo',
    descAr: 'يقع في قلب خان الخليلي وتديره فنادق أوبروي العالمية تكريماً لأديب نوبل نجيب محفوظ. يقدم تجربة عشاء تاريخية مع عزف حي على آلة العود والمأكولات المصرية الفاخرة والشاي بالنعناع.',
    descEn: 'Operated by Oberoi Hotels inside historic Khan El-Khalili in honor of Nobel Laureate Naguib Mahfouz. Live oriental lute music, Egyptian mezze, gourmet mixed grills, and mint tea.',
    bookingUrl: 'https://www.oberoihotels.com/hotels-in-cairo/restaurants/naguib-mahfouz-cafe/',
    signatureDish: 'Royal Mixed Grill & Um Ali (مشاوي ملكية وأم علي)',
  },
  {
    nameAr: 'كشري أبو طارق',
    nameEn: 'Koshary Abou Tarek',
    cuisine: 'The Legendary Egyptian National Dish',
    location: 'Downtown Cairo (Champollion Street)',
    descAr: 'الرمز الأكثر شهرة عالمياً للطبق الوطني المصري. طبقات متقنة من الأرز والعدس والمعكرونة مع الحمص والبصل المقرمش وصلصة الطماطم الغنية والشطة والدقة السرية.',
    descEn: 'The globally renowned temple of Egypt’s national dish: layered lentils, rice, pasta, chickpeas, crispy onions, spiced garlic sauce, and savory tomato reduction.',
    bookingUrl: 'https://aboutarek.com',
    signatureDish: 'Special Koshary Abou Tarek (كشري أبو طارق المخصوص)',
  },
  {
    nameAr: 'أندريا المريوطية',
    nameEn: 'Andrea Mariouteya',
    cuisine: 'Wood-Fired Rotisserie & Country Mezze',
    location: 'New Giza / Giza',
    descAr: 'وجهة تاريخية عريقة تشتهر منذ عقود بالدجاج المشوي على الفحم والمتبل بالخلطة السرية، مع الخبز البلدي الطازج الخارج تواً من الأفران الطينية والمقبلات الريفية الغنية.',
    descEn: 'Beloved countryside dining institution famed for charcoal-roasted marinated cockerel, freshly puffed rustic baladi bread from clay ovens, and authentic tahini mezze.',
    bookingUrl: 'https://www.facebook.com/AndreaMariouteyaOfficial/',
    signatureDish: 'Charcoal Grilled Chicken & Baladi Bread (دجاج مشوي على الفحم)',
  },
  {
    nameAr: 'زوبة',
    nameEn: 'Zooba',
    cuisine: 'Contemporary Gourmet Egyptian Street Food',
    location: 'Zamalek, New Cairo, Citystars',
    descAr: 'رؤية عصرية ومبتكرة لأطعمة الشارع المصري بجودة عالية ومكونات طبيعية. فلافل طازجة ومبتكرة، حواوشي لحم بلدي، وسلطات مصرية بنكهات متجددة.',
    descEn: 'Award-winning artisanal celebration of Egyptian street food: farm-fresh taameya, artisanal gourmet hawawshi, hibiscus iced tea, and modern Egyptian street classics.',
    bookingUrl: 'https://zoobaeats.com',
    signatureDish: 'Artisanal Taameya & Spicy Hawawshi (طعمية بالسمسم وحواوشي بلدي)',
  },
];

const VIDEOS: VideoFeature[] = [
  {
    id: '0M9adks0rGU',
    titleAr: 'العرض الذهبي للفراعنة · موكب المومياوات الملكية',
    titleEn: "The Pharaohs' Golden Parade (Official Ceremony)",
    source: 'وزارة السياحة والآثار · Experience Egypt',
    descAr: 'الحدث الأسطوري العالمي لنقل 22 مومياء ملكية فرعونية مهيبة من المتحف المصري بالتحرير إلى المتحف القومي للحضارة المصرية بالفسطاط في مشهد أبهر العالم.',
    descEn: 'The historic royal procession that captivated millions worldwide, transporting 22 ancient Egyptian royal mummies from Tahrir Square to the National Museum of Egyptian Civilization.',
    duration: 'Official National Broadcast',
  },
  {
    id: 'sL36V1FFhhU',
    titleAr: 'الافتتاح الأسطوري لطريق الكباش بالأقصر',
    titleEn: 'The Grand Opening of the Sphinx Avenue in Luxor',
    source: 'الهيئة المصرية العامة للتنشيط السياحي · Experience Egypt',
    descAr: 'الاحتفالية الكبرى لإعادة إحياء وتدشين طريق الكباش الأثري بطول 2.7 كم الرابط بين معبدي الأقصر والكرنك، وإحياء عيد الأوبت الفرعوني القديم في حفل مهيب.',
    descEn: 'The grand international celebration marking the restoration of the 3,000-year-old Avenue of Sphinxes connecting Luxor Temple and Karnak Temple across ancient Thebes.',
    duration: 'Official Ceremony Feature',
  },
  {
    id: 'XjkGrZOecps',
    titleAr: 'المتحف المصري الكبير · أيقونة الحضارة الإنسانية',
    titleEn: 'The Grand Egyptian Museum (Official Showcase)',
    source: 'Grand Egyptian Museum · المتحف المصري الكبير',
    descAr: 'جولة تعريفية مهيبة داخل أكبر متحف أثري في العالم مكرس لحضارة واحدة، يضم المجموعة الكاملة لكنوز الملك توت عنخ آمون والبهو العظيم وتمثال رمسيس الثاني.',
    descEn: 'An official visual journey inside the world’s largest archaeological museum dedicated to a single civilization, housing the complete treasure hoard of King Tutankhamun.',
    duration: 'Official GEM Presentation',
  },
  {
    id: '2n5w03mH5Jk',
    titleAr: 'لمحات من طريق الكباش التاريخي · عاصمة الفراعنة',
    titleEn: 'A Glimpse of the Luxor Sphinx Avenue',
    source: 'Experience Egypt Official Channel',
    descAr: 'استعراض بصري سينمائي يسلط الضوء على تماثيل أبي الهول الكباشية والمسار الاحتفالي المقدس لملوك الفراعنة في مدينة الشمس الأقصر.',
    descEn: 'A cinematic showcase exploring the sacred avenue of rams and sphinxes, following the path of Pharaohs through the religious heart of Upper Egypt.',
    duration: 'Cinematic Short Feature',
  },
];

export default function BookingsContent() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#C9A84C]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-[#1B6B93]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        {/* Header Hero */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E2CB85] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Official Travel & Reservation Gateway · بوابة الحجوزات الرسمية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C]">
              Book Your Egypt Experience
            </span>
            <span className="block text-2xl sm:text-3xl font-bold text-[#E2CB85]/90 mt-2 font-arabic">
              احجز تجربتك المصرية
            </span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Connect seamlessly to official airline carriers, world-class luxury hotels, legendary authentic dining,
            and immerse yourself in official Egyptian tourism cinematic reels.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Services / الكل', icon: Globe2 },
              { id: 'flights', label: 'Flights / طيران', icon: Plane },
              { id: 'hotels', label: 'Hotels / فنادق', icon: Hotel },
              { id: 'restaurants', label: 'Restaurants / مطاعم', icon: Utensils },
              { id: 'videos', label: 'Reels & Videos / فيديوهات', icon: Video },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] shadow-[0_0_20px_rgba(201,168,76,0.35)] scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 hover:border-[#C9A84C]/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* ── SECTION 1: FLIGHTS TO EGYPT ── */}
        {(activeTab === 'all' || activeTab === 'flights') && (
          <section id="flights" className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E2CB85]">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    Flights to Egypt <span className="text-[#C9A84C]">·</span> رحلات الطيران
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60">
                    Official booking channels with national flag carriers and premier international airlines
                  </p>
                </div>
              </div>

              {/* Direct EgyptAir Portal Link */}
              <a
                href="https://www.egyptair.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A84C]/20 hover:bg-[#C9A84C]/30 border border-[#C9A84C]/60 text-[#E2CB85] text-xs sm:text-sm font-bold transition-all shadow-[0_0_15px_rgba(201,168,76,0.15)] group"
              >
                <span>EgyptAir Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Disclaimer Banner */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200/90 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-amber-300">
                  Official External Redirection Notice · إخلاء مسؤولية الحجوزات
                </p>
                <p className="text-amber-200/80">
                  EgyptX AI redirects users directly to official airline websites. We do not process payments or ticket modifications, and are not responsible for fare changes or partner policies.
                </p>
                <p className="text-amber-200/70 font-arabic text-xs">
                  تنويه: توجّه EgyptX AI المستخدمين مباشرة إلى المواقع الرسمية لشركات الطيران، ولسنا طرفاً في المعاملات المالية أو تسعير التذاكر.
                </p>
              </div>
            </div>

            {/* Airlines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {AIRLINES.map((airline) => (
                <div
                  key={airline.nameEn}
                  className={`relative p-6 rounded-2xl bg-[#0A1628]/80 backdrop-blur-xl border transition-all duration-300 hover:shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between ${
                    airline.featured
                      ? 'border-[#C9A84C]/60 shadow-[0_0_30px_rgba(201,168,76,0.12)] bg-gradient-to-br from-[#0A1628] via-[#0D1F38] to-[#0A1628]'
                      : 'border-white/10 hover:border-[#C9A84C]/40'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-xs font-bold text-[#E2CB85]">
                          {airline.code}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{airline.nameEn}</h3>
                            <span className="text-sm font-semibold text-[#E2CB85] font-arabic">({airline.nameAr})</span>
                          </div>
                          <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#C9A84C]" />
                            <span>{airline.hub}</span>
                          </p>
                        </div>
                      </div>

                      {airline.badge && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E2CB85] shrink-0">
                          {airline.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                      {airline.descEn}
                    </p>
                    <p className="text-xs text-[#E2CB85]/80 font-arabic leading-relaxed border-t border-white/5 pt-2">
                      {airline.descAr}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-white/40 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Official Portal</span>
                    </span>

                    <a
                      href={airline.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(201,168,76,0.3)] group"
                    >
                      <span>Book Now · احجز الآن</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SECTION 2: HOTELS IN EGYPT ── */}
        {(activeTab === 'all' || activeTab === 'hotels') && (
          <section id="hotels" className="space-y-6 pt-6">
            <div className="border-b border-white/10 pb-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#1B6B93]/20 border border-[#1B6B93]/40 text-[#48CAE4]">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  Hotels & Luxury Stays <span className="text-[#C9A84C]">·</span> فنادق وإقامات مصر
                </h2>
                <p className="text-xs sm:text-sm text-white/60">
                  Global booking aggregators and legendary Egyptian royal palace hotels
                </p>
              </div>
            </div>

            {/* Aggregator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOTEL_PLATFORMS.map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#0A1628]/60 backdrop-blur-xl border border-white/10 hover:border-[#C9A84C]/50 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E2CB85]">
                        <PlatformIcon className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#E2CB85] border border-white/10">
                        {platform.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#E2CB85] transition-colors">
                      {platform.name}
                    </h3>
                    <p className="text-xs text-white/65 leading-relaxed">
                      {platform.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#E2CB85]">
                    <span>Search Egypt Stays</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
            </div>

            {/* Featured Historic & Luxury Hotels */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#C9A84C] fill-[#C9A84C]" />
                  <span>Featured Egyptian Luxury & Palace Hotels</span>
                  <span className="text-xs text-white/50 font-arabic font-normal">فنادق وقصور مصر الفاخرة</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {FEATURED_HOTELS.map((hotel) => (
                  <div
                    key={hotel.nameEn}
                    className="p-6 rounded-2xl bg-[#0A1628]/90 backdrop-blur-xl border border-[#C9A84C]/30 hover:border-[#C9A84C] shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A84C]/20 text-[#E2CB85] border border-[#C9A84C]/30">
                              {hotel.highlight}
                            </span>
                            <span className="text-xs text-emerald-400 font-medium">
                              {hotel.rating}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-white mt-1 group-hover:text-[#E2CB85] transition-colors">
                            {hotel.nameEn}
                          </h4>
                          <p className="text-sm font-semibold text-[#E2CB85] font-arabic">
                            {hotel.nameAr}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-white/50 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
                        <span>{hotel.location}</span>
                      </p>

                      <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                        {hotel.descEn}
                      </p>
                      <p className="text-xs text-[#E2CB85]/80 font-arabic leading-relaxed border-t border-white/5 pt-2">
                        {hotel.descAr}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-white/40">
                        Official Direct Website
                      </span>
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#C9A84C] hover:text-[#030712] text-[#E2CB85] text-xs font-bold transition-all border border-[#C9A84C]/40 group-hover:shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                      >
                        <span>Book Stay · احجز الإقامة</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 3: RESTAURANTS & EXPERIENCES ── */}
        {(activeTab === 'all' || activeTab === 'restaurants') && (
          <section id="restaurants" className="space-y-6 pt-6">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    Restaurants & Culinary <span className="text-[#C9A84C]">·</span> المطاعم والمطبخ المصري
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60">
                    Table reservations and authentic cultural culinary landmarks
                  </p>
                </div>
              </div>

              {/* Table reservation links */}
              <div className="flex items-center gap-2">
                <a
                  href="https://www.thefork.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>TheFork</span>
                  <ExternalLink className="w-3 h-3 text-[#C9A84C]" />
                </a>
                <a
                  href="https://www.opentable.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>OpenTable</span>
                  <ExternalLink className="w-3 h-3 text-[#C9A84C]" />
                </a>
              </div>
            </div>

            {/* Restaurant cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {RESTAURANTS.map((place) => (
                <div
                  key={place.nameEn}
                  className="p-5 rounded-2xl bg-[#0A1628]/80 backdrop-blur-xl border border-white/10 hover:border-[#C9A84C]/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
                >
                  <div className="space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A84C]/15 text-[#E2CB85] border border-[#C9A84C]/30">
                        {place.cuisine}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1.5 group-hover:text-[#E2CB85] transition-colors">
                        {place.nameEn}
                      </h4>
                      <p className="text-sm font-semibold text-[#E2CB85] font-arabic">
                        {place.nameAr}
                      </p>
                    </div>

                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C9A84C]" />
                      <span>{place.location}</span>
                    </p>

                    <p className="text-xs text-white/70 leading-relaxed">
                      {place.descEn}
                    </p>
                    <p className="text-xs text-[#E2CB85]/80 font-arabic leading-relaxed border-t border-white/5 pt-2">
                      {place.descAr}
                    </p>

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-white/80">
                      <span className="text-[#C9A84C] font-semibold">Signature: </span>
                      <span>{place.signatureDish}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-white/40">Verified Culinary Gem</span>
                    <a
                      href={place.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_10px_rgba(201,168,76,0.2)]"
                    >
                      <span>Reserve Table · حجز طاولة</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SECTION 4: REELS & VIDEOS ("Egypt Through a Lens") ── */}
        {(activeTab === 'all' || activeTab === 'videos') && (
          <section id="videos" className="space-y-6 pt-6">
            <div className="border-b border-white/10 pb-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  Egypt Through a Lens <span className="text-[#C9A84C]">·</span> مصر من عدسة
                </h2>
                <p className="text-xs sm:text-sm text-white/60">
                  Official cinematic spectacles and national tourism authority broadcasts
                </p>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="rounded-2xl bg-[#0A1628]/90 backdrop-blur-xl border border-[#C9A84C]/30 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-[#C9A84C] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* YouTube Iframe Container (16:9 ratio) */}
                  <div className="relative w-full aspect-video bg-black/60 border-b border-white/10">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
                      title={video.titleEn}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>

                  {/* Video Meta Info */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E2CB85]">
                        {video.source}
                      </span>
                      <span className="text-[11px] text-white/50 flex items-center gap-1">
                        <Play className="w-3 h-3 text-[#C9A84C]" />
                        <span>{video.duration}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {video.titleEn}
                      </h3>
                      <p className="text-sm font-semibold text-[#E2CB85] font-arabic mt-0.5">
                        {video.titleAr}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      {video.descEn}
                    </p>
                    <p className="text-xs text-[#E2CB85]/80 font-arabic leading-relaxed border-t border-white/5 pt-2">
                      {video.descAr}
                    </p>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-white/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Experience Egypt Official</span>
                      </span>

                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 hover:border-red-500 text-red-200 hover:text-white text-xs font-bold transition-all"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch on YouTube</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Call to Action */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#0A1628] via-[#122C38] to-[#0A1628] border border-[#C9A84C]/30 text-center space-y-4 shadow-[0_0_40px_rgba(201,168,76,0.1)]">
          <div className="inline-flex items-center gap-2 p-2 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E2CB85]">
            <Compass className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Need an AI-Curated Custom Itinerary?
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            EgyptX AI crafts personalized multi-day itineraries with crowd-aware scheduling, heritage sites, and private transport.
          </p>
          <div className="pt-2">
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-bold text-sm shadow-[0_0_20px_rgba(201,168,76,0.35)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Launch AI Trip Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
