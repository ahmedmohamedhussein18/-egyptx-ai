import {
  Compass,
  Map,
  Palette,
  MapPin,
  Headphones,
  Glasses,
  Scan,
  Languages,
  Bookmark,
  Newspaper,
  Film,
  Play,
  ShoppingBag,
  Building2,
  Building,
  Calendar,
  type LucideIcon
} from 'lucide-react';

export interface NavDropdownItem {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  titleKey?: string;
  subtitleKey?: string;
  badgeKey?: string;
}

export interface NavSection {
  labelKey: string;
  defaultLabel: string;
  headerTitle: string;
  href: string;
  items: NavDropdownItem[];
}

export const EXPLORE_NAV_ITEMS: NavDropdownItem[] = [
  {
    title: 'Explore Egypt',
    subtitle: 'Ancient wonders & iconic monuments',
    titleKey: 'nav.items.exploreEgypt.title',
    subtitleKey: 'nav.items.exploreEgypt.subtitle',
    href: '/explore',
    icon: Compass,
  },
  {
    title: 'Hidden Egypt',
    subtitle: 'Undiscovered desert secrets & oases',
    titleKey: 'nav.items.hiddenEgypt.title',
    subtitleKey: 'nav.items.hiddenEgypt.subtitle',
    href: '/hidden-egypt',
    icon: Map,
  },
  {
    title: 'Egyptian Culture',
    subtitle: 'Arts, music, literature & heritage',
    titleKey: 'nav.items.culture.title',
    subtitleKey: 'nav.items.culture.subtitle',
    href: '/egyptian-culture',
    icon: Palette,
  },
];

export const EXPERIENCES_NAV_ITEMS: NavDropdownItem[] = [
  {
    title: 'AI Planner',
    subtitle: 'Smart custom itineraries & flow',
    titleKey: 'nav.items.aiPlanner.title',
    subtitleKey: 'nav.items.aiPlanner.subtitle',
    badgeKey: 'nav.badges.ai',
    href: '/planner',
    icon: MapPin,
    badge: 'AI',
  },
  {
    title: 'AI Guide',
    subtitle: 'Conversational audio heritage guide',
    titleKey: 'nav.items.aiGuide.title',
    subtitleKey: 'nav.items.aiGuide.subtitle',
    badgeKey: 'nav.badges.live',
    href: '/ai-guide',
    icon: Headphones,
    badge: 'Live',
  },
  {
    title: 'VR Egypt',
    subtitle: '360 degree virtual monument portals',
    titleKey: 'nav.items.vrEgypt.title',
    subtitleKey: 'nav.items.vrEgypt.subtitle',
    href: '/vr-egypt',
    icon: Glasses,
  },
  {
    title: 'Hieroglyph Scanner',
    subtitle: 'Epigraphic visual symbol translator',
    titleKey: 'nav.items.hieroglyphScanner.title',
    subtitleKey: 'nav.items.hieroglyphScanner.subtitle',
    badgeKey: 'nav.badges.new',
    href: '/hieroglyph-scanner',
    icon: Scan,
    badge: 'New',
  },
  {
    title: 'EgyptSpeak',
    subtitle: 'Authentic colloquial dialect engine',
    titleKey: 'nav.items.slang.title',
    subtitleKey: 'nav.items.slang.subtitle',
    href: '/slang',
    icon: Languages,
  },
  {
    title: 'Memory Core',
    subtitle: 'Expedition travel journal & logs',
    titleKey: 'nav.items.memoryCore.title',
    subtitleKey: 'nav.items.memoryCore.subtitle',
    href: '/memory-core',
    icon: Bookmark,
  },
];

export const LIFE_NAV_ITEMS: NavDropdownItem[] = [
  {
    title: 'Journal',
    subtitle: 'Editorial stories & essays',
    titleKey: 'nav.items.journal.title',
    subtitleKey: 'nav.items.journal.subtitle',
    href: '/news',
    icon: Newspaper,
  },
  {
    title: 'Cinema',
    subtitle: 'Cinematic visual features',
    titleKey: 'nav.items.cinema.title',
    subtitleKey: 'nav.items.cinema.subtitle',
    href: '/videos',
    icon: Film,
  },
  {
    title: 'Shorts',
    subtitle: 'Vertical creator vignettes',
    titleKey: 'nav.items.shorts.title',
    subtitleKey: 'nav.items.shorts.subtitle',
    badgeKey: 'nav.badges.curated',
    href: '/reels',
    icon: Play,
    badge: 'Curated',
  },
  {
    title: 'Shop',
    subtitle: 'Handcrafted authentic artifacts',
    titleKey: 'nav.items.shop.title',
    subtitleKey: 'nav.items.shop.subtitle',
    href: '/crafts',
    icon: ShoppingBag,
  },
];

export const OFFICIAL_NAV_ITEMS: NavDropdownItem[] = [
  {
    title: 'Egypt Official',
    subtitle: 'Presidency & sovereign heritage',
    titleKey: 'nav.items.egyptOfficial.title',
    subtitleKey: 'nav.items.egyptOfficial.subtitle',
    href: '/egypt-official',
    icon: Building2,
  },
  {
    title: 'National Projects',
    subtitle: 'Grand Egyptian Museum & renewals',
    titleKey: 'nav.items.nationalProjects.title',
    subtitleKey: 'nav.items.nationalProjects.subtitle',
    badgeKey: 'nav.badges.renaissance',
    href: '/national-projects',
    icon: Building,
    badge: 'Renaissance',
  },
  {
    title: 'Concierge Bookings',
    subtitle: 'Flights, palaces & private reservations',
    titleKey: 'nav.items.bookings.title',
    subtitleKey: 'nav.items.bookings.subtitle',
    href: '/bookings',
    icon: Calendar,
  },
];

export const NAV_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'it', label: 'Italiano', short: 'IT' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'zh', label: '中文', short: 'ZH' },
  { code: 'ru', label: 'Русский', short: 'RU' },
];
