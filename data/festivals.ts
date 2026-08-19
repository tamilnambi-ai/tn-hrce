/**
 * Festival data — Tamil Nadu temple festivals across 2026.
 * Follows the lunar calendar (Tamil months) mapped to Gregorian dates.
 */

export type TamilMonth =
  | 'panguni'      // Mar-Apr (ပង្គုණി)
  | 'chithirai'    // Apr-May (சித்திரै)
  | 'vaigasi'      // May-Jun (வைகாசி)
  | 'aadi'         // Jul-Aug (ஆடி)
  | 'aavani'       // Aug-Sep (ஆவணி)
  | 'purattasi'    // Sep-Oct (புரட்டாசி)
  | 'iyppasi'      // Oct-Nov (ஐப்பசி)
  | 'margazhi'     // Dec-Jan (மார்கழி)
  | 'thai'         // Jan-Feb (தை)
  | 'masi'         // Feb-Mar (மாசி)
  | 'chithirai'    // Apr-May (சித்திரை)
  | 'vaigasi';     // May-Jun (வைகாசி)

export type Tithi = 'pournami' | 'amavasya' | 'other';

export interface Festival {
  id: string;
  templeId: string;
  templeName: string;
  templeNameTa: string;
  city: 'chennai' | 'trichy' | 'madurai' | 'coimbatore' | 'salem' | 'tirunelveli';
  deity: string;
  deityTa: string;

  // Gregorian dates (2026 reference)
  dateFrom: string; // ISO date "2026-MM-DD"
  dateTo: string;   // ISO date (may span multiple days)

  // Lunar calendar
  tamilMonth: TamilMonth;
  tithi: Tithi;
  tithiName: string;     // e.g. "Aadi Pournami"
  tithiNameTa: string;   // Tamil version

  // Description
  description: string;
  descriptionTa: string;
}

const TAMIL_MONTH_LABELS_EN: Record<TamilMonth, string> = {
  panguni:    'Panguni (Mar–Apr)',
  chithirai:  'Chithirai (Apr–May)',
  vaigasi:    'Vaigasi (May–Jun)',
  aadi:       'Aadi (Jul–Aug)',
  aavani:     'Aavani (Aug–Sep)',
  purattasi:  'Purattasi (Sep–Oct)',
  iyppasi:    'Iyppasi (Oct–Nov)',
  margazhi:   'Margazhi (Dec–Jan)',
  thai:       'Thai (Jan–Feb)',
  masi:       'Masi (Feb–Mar)',
};

const TAMIL_MONTH_LABELS_TA: Record<TamilMonth, string> = {
  panguni:    'பங்குனி (மார்-ஏப்)',
  chithirai:  'சித்திரை (ஏப்-மே)',
  vaigasi:    'வைகாசி (மே-ஜூன்)',
  aadi:       'ஆடி (ஜூலை-ஆகஸ்)',
  aavani:     'ஆவணி (ஆகஸ்-செப்)',
  purattasi:  'புரட்டாசி (செப்-அக்)',
  iyppasi:    'ஐப்பசி (அக்-நவ)',
  margazhi:   'மார்கழி (டிச-ஜன)',
  thai:       'தை (ஜன-பிப்)',
  masi:       'மாசி (பிப்-மார்)',
};

const TITHI_LABELS_EN: Record<Tithi, string> = {
  pournami:  'Pournami (Full Moon)',
  amavasya:  'Amavasya (New Moon)',
  other:     'Other',
};

const TITHI_LABELS_TA: Record<Tithi, string> = {
  pournami:  'பௌர்ணமி (முழு நிலவு)',
  amavasya:  'அமாவாசை (புதிய நிலவு)',
  other:     'மற்றவை',
};

// ────────────────────────────────────────────────────────────────────────────
// FESTIVALS DATA — 15 real Tamil Nadu temple festivals across 2026
// ────────────────────────────────────────────────────────────────────────────

export const FESTIVALS: Festival[] = [
  {
    id: 'kap-aadi-pournami',
    templeId: 'kapaleeswarar',
    templeName: 'Kapaleeswarar Temple',
    templeNameTa: 'கபாலீசுவரர் கோயில்',
    city: 'chennai',
    deity: 'Shiva',
    deityTa: 'சிவன்',
    dateFrom: '2026-08-12',
    dateTo: '2026-08-14',
    tamilMonth: 'aadi',
    tithi: 'pournami',
    tithiName: 'Aadi Pournami',
    tithiNameTa: 'ஆடி பௌர்ணமி',
    description:
      'Aadi Pournami celebrates the full moon in the month of Aadi. Thousands of devotees gather for special abhishekam and darshan. This festival marks the transit of the Sun into the Leo zodiac.',
    descriptionTa:
      'ஆடி பௌர்ணமி என்பது ஆடி மாসத்தின் பௌர்ணமி. ஆயிரக்கணக்கான பக்தர்கள் சிறப்பு அபிஷேக தரிசனத்திற்கு கூடி வருகின்றனர்.',
  },
  {
    id: 'meenakshi-chithirai',
    templeId: 'meenakshi',
    templeName: 'Meenakshi Temple',
    templeNameTa: 'மீனாட்சி அம்மன் கோயில்',
    city: 'madurai',
    deity: 'Devi (Meenakshi)',
    deityTa: 'அம்மன் (மீனாட்சி)',
    dateFrom: '2026-04-14',
    dateTo: '2026-04-29',
    tamilMonth: 'chithirai',
    tithi: 'other',
    tithiName: 'Chithirai Festival',
    tithiNameTa: 'சித்திரை திருவிழா',
    description:
      'The grand Chithirai Festival celebrates the celestial wedding of Meenakshi and Shiva. The temple city comes alive with processions, cultural programs, and thousands of devotees from across the world.',
    descriptionTa:
      'சித்திரை திருவிழா மீனாட்சி மற்றும் சிவனின் திருமணத்தை கொண்டாடுகிறது. கோயிল் நகரம் ஊர்வலம், கலாச்சாரத் திட்டங்கள் மற்றும் உலகெங்கிலும் இருந்து வரும் ஆயிரக்கணக்கான பக்தர்களாக கொண்டாடப்படுகிறது.',
  },
  {
    id: 'parthasarathy-vaigasi',
    templeId: 'parthasarathy',
    templeName: 'Parthasarathy Temple',
    templeNameTa: 'பார்த்தசாரதி கோயில்',
    city: 'chennai',
    deity: 'Krishna',
    deityTa: 'கிருஷ்ணன்',
    dateFrom: '2026-05-28',
    dateTo: '2026-05-30',
    tamilMonth: 'vaigasi',
    tithi: 'other',
    tithiName: 'Vaigasi Festival',
    tithiNameTa: 'வைகாசி திருவிழா',
    description:
      'Vaigasi Festival celebrates Krishna in the summer month. Special rituals, flower decorations, and continuous devotional singing mark this celebration.',
    descriptionTa:
      'வைகாசி திருவிழா கோடை மாசத்தில் கிருஷ்ணனை கொண்டாடுகிறது. சிறப்பு சடங்குகள், ফুலों் அலங்கரணம் மற்றும் தொடர்ச்சியான பக்தி பாடல்கள் இந்த கொண்டாட்டத்தை சிறப்புபடுத்துகின்றன.',
  },
  {
    id: 'rockfort-margazhi-amavasya',
    templeId: 'rockfort-trichy',
    templeName: 'Rockfort Uchanailingam Temple',
    templeNameTa: 'ராக்கஃபோர்ட் உச்சநைலிங்கம் கோயில்',
    city: 'trichy',
    deity: 'Shiva',
    deityTa: 'சிவன்',
    dateFrom: '2026-01-02',
    dateTo: '2026-01-03',
    tamilMonth: 'margazhi',
    tithi: 'amavasya',
    tithiName: 'Margazhi Amavasya',
    tithiNameTa: 'மார்கழி அமாவாசை',
    description:
      'Margazhi Amavasya (New Moon) in the winter month brings special significance. Devotees perform offerings and seek blessings for the coming year.',
    descriptionTa:
      'மார்கழி அமாவாசை (புதிய நிலவு) குளிர்காலத்தில் சிறப்பு முக்கியத்துவம் தருகிறது. பக்தர்கள் வரும் ஆண்டிற்கு வாழ்த்துக்கள் செய்கின்றனர்.',
  },
  {
    id: 'vadapalani-thai',
    templeId: 'vadapalani',
    templeName: 'Vadapalani Murugan Temple',
    templeNameTa: 'வடபழனி முருகன் கோயில்',
    city: 'chennai',
    deity: 'Muruga',
    deityTa: 'முருகன்',
    dateFrom: '2026-02-06',
    dateTo: '2026-02-08',
    tamilMonth: 'thai',
    tithi: 'other',
    tithiName: 'Thai Pusam',
    tithiNameTa: 'தை புஷ்ய நக்ஷத்திரம்',
    description:
      'Thai Pusam festival celebrates Muruga in the Thai month. Devotees light oil lamps and perform special pujas. The temple is beautifully decorated with flowers.',
    descriptionTa:
      'தை புஷ்ய திரு நாள் முருகனை கொண்டாடுகிறது. பக்தர்கள் விளக்குகளை ஏற்றி சிறப்பு பூஜைகளை செய்கின்றனர். கோயில் ஃபூலுக்களால் அனேகமாக அலங்கரிக்கப்பட்டுள்ளது.',
  },
  {
    id: 'arunachaleswara-masi',
    templeId: 'arunachaleswara',
    templeName: 'Arunachaleswara Temple',
    templeNameTa: 'அருணாசலேசுவரர் கோயில்',
    city: 'salem',
    deity: 'Shiva',
    deityTa: 'சிவன்',
    dateFrom: '2026-02-27',
    dateTo: '2026-03-01',
    tamilMonth: 'masi',
    tithi: 'pournami',
    tithiName: 'Masi Pournami',
    tithiNameTa: 'மாசி பௌர்ணமி',
    description:
      'Masi Pournami marks the full moon in Masi month. The sacred mountain Arunachala is circumambulated by thousands of devotees in this auspicious ritual.',
    descriptionTa:
      'மாசி பௌர்ணமி என்பது மாசி மாசத்தின் பௌர்ணமி. புனிதமான அருணாசல மலை ஆயிரக்கணக்கான பக்தர்களால் சுற்றப்படுகிறது.',
  },
  {
    id: 'nataraj-chidambaram-thai-pusam',
    templeId: 'chidambaram',
    templeName: 'Nataraja Temple',
    templeNameTa: 'நடராஜ கோயில்',
    city: 'tirunelveli',
    deity: 'Shiva',
    deityTa: 'சிவன்',
    dateFrom: '2026-02-06',
    dateTo: '2026-02-08',
    tamilMonth: 'thai',
    tithi: 'other',
    tithiName: 'Thai Pusam',
    tithiNameTa: 'தை புஷ்ய நக்ஷத்திரம்',
    description:
      'Thai Pusam festival at Chidambaram celebrates the cosmic dance (Natya) of Shiva. The sanctum sanctorum glows with golden light and incense fills the air.',
    descriptionTa:
      'சிதம்பரத்தில் தை புஷ்ய திரு நாள் சிவனின் பிரபஞ்ச நৃத்யத்தை கொண்டாடுகிறது.',
  },
  {
    id: 'kanyakumari-thai-pongal',
    templeId: 'kanyakumari-devi',
    templeName: 'Kanyakumari Temple',
    templeNameTa: 'கன்னியாகுமரி கோயில்',
    city: 'tirunelveli',
    deity: 'Devi',
    deityTa: 'அம்மன்',
    dateFrom: '2026-01-14',
    dateTo: '2026-01-16',
    tamilMonth: 'thai',
    tithi: 'other',
    tithiName: 'Thai Pongal',
    tithiNameTa: 'தை பொங்கல்',
    description:
      'Thai Pongal at the southernmost temple celebrates the harvest season. Pilgrim gatherings at the confluence of three oceans create a spiritual atmosphere.',
    descriptionTa:
      'கன்னியாகுமரி கோயிலில் தை பொங்கல் அறுவடை பருவத்தை கொண்டாடுகிறது. மூன்று கடல்களின் சங்கமமும் ஒரு ஆன்மீக சூழலை உருவாக்குகிறது.',
  },
  {
    id: 'meenakshi-aadi-special',
    templeId: 'meenakshi',
    templeName: 'Meenakshi Temple',
    templeNameTa: 'மீனாட்சி அம்மன் கோயில்',
    city: 'madurai',
    deity: 'Devi (Meenakshi)',
    deityTa: 'அம்மன் (மீனாட்சி)',
    dateFrom: '2026-08-15',
    dateTo: '2026-08-17',
    tamilMonth: 'aadi',
    tithi: 'pournami',
    tithiName: 'Aadi Amavasya',
    tithiNameTa: 'ஆடி அமாவாசை',
    description:
      'Special rituals honoring Meenakshi during the Aadi month. The temple witnesses elaborate flower offerings and continuous chanting of sacred hymns.',
    descriptionTa:
      'ஆடி மாசத்தில் மீனாட்சி விசேஷ பூஜைகள். ஃபூல் மாலைகளும் பக்தி பாடல்களும் கோயிலை உண்மையாக்குகின்றன.',
  },
  {
    id: 'tyagaraja-panguni',
    templeId: 'tyagaraja-temple',
    templeName: 'Tyagaraja Temple',
    templeNameTa: 'த்யாகராஜ கோயில்',
    city: 'trichy',
    deity: 'Shiva',
    deityTa: 'சிவன்',
    dateFrom: '2026-03-25',
    dateTo: '2026-03-27',
    tamilMonth: 'panguni',
    tithi: 'other',
    tithiName: 'Panguni Festival',
    tithiNameTa: 'பங்குனி திருவிழா',
    description:
      'Panguni Festival in spring celebrates renewal and fertility. Devotees offer special prayers and partake in temple-distributed prasadam.',
    descriptionTa:
      'பங்குனி திருவிழா வசந்த ऋতுவில் புনரெழுப்பு மற்றும் வளர்ச்சியை கொண்டாடுகிறது. பக்தர்கள் சிறப்பு பிரার்த்தனைகள் செய்கின்றனர்.',
  },
  {
    id: 'ranganatha-purattasi',
    templeId: 'srirangam',
    templeName: 'Sri Ranganatha Temple',
    templeNameTa: 'ஸ்ரீ ரங்கநாதர் கோயில்',
    city: 'trichy',
    deity: 'Vishnu',
    deityTa: 'விஷ்ணு',
    dateFrom: '2026-09-15',
    dateTo: '2026-09-20',
    tamilMonth: 'purattasi',
    tithi: 'other',
    tithiName: 'Purattasi Festival',
    tithiNameTa: 'புரட்டாசி திருவிழா',
    description:
      'Purattasi Festival celebrates Ranganatha with elaborate processions and special abhishekams. The temple tanks are filled and deity is taken in ceremonial processions.',
    descriptionTa:
      'புரட்டாசி திருவிழா ரங்கநாதரை கொண்டாடுகிறது. கோயில் தொட்டிகள் நீரால் நிரப்பப்படும் மற்றும் தேவதை ஊர்வலத்தில் கொண்டு செல்லப்படுகிறது.',
  },
  {
    id: 'kamakshi-iyppasi',
    templeId: 'kamakshi',
    templeName: 'Kamakshi Temple',
    templeNameTa: 'கமாட்சி கோயில்',
    city: 'salem',
    deity: 'Devi',
    deityTa: 'அம்மன்',
    dateFrom: '2026-10-25',
    dateTo: '2026-10-28',
    tamilMonth: 'iyppasi',
    tithi: 'other',
    tithiName: 'Iyppasi Festival',
    tithiNameTa: 'ஐப்பசி திருவிழா',
    description:
      'Iyppasi Festival honors the divine mother Kamakshi. The temple hosts special devi pujas and devotional music performances throughout the festival period.',
    descriptionTa:
      'ஐப்பசி திருவிழா கமாட்சி அம்மனை சிறப்பிக்கிறது. கோயில் சிறப்பு தேவி பூஜைகளை நடத்துகிறது.',
  },
  {
    id: 'siva-margazhi-arjuna',
    templeId: 'arunachaleswara',
    templeName: 'Arunachaleswara Temple',
    templeNameTa: 'அருணாசலேசுவரர் கோயில்',
    city: 'salem',
    deity: 'Shiva',
    deityTa: 'சிவன்',
    dateFrom: '2026-12-20',
    dateTo: '2026-12-23',
    tamilMonth: 'margazhi',
    tithi: 'other',
    tithiName: 'Margazhi Festival',
    tithiNameTa: 'மார்கழி திருவிழா',
    description:
      'Margazhi Festival in winter celebrates Shiva with special abhishekams and the famous Margazhi deepams (oil lamps) lighting up the temple.',
    descriptionTa:
      'மார்கழி திருவிழா குளிர்காலத்தில் சிவனை கொண்டாடுகிறது. புகழ்பெற்ற மார்கழி விளக்குகள் கோயிலை ஒளிரச் செய்கின்றன.',
  },
  {
    id: 'varadharaja-vaigasi',
    templeId: 'varadharaja',
    templeName: 'Varadharaja Temple',
    templeNameTa: 'வரதராஜ கோயில்',
    city: 'coimbatore',
    deity: 'Vishnu',
    deityTa: 'விஷ்ணு',
    dateFrom: '2026-06-10',
    dateTo: '2026-06-12',
    tamilMonth: 'vaigasi',
    tithi: 'other',
    tithiName: 'Vaigasi Festival',
    tithiNameTa: 'வைகாசி திருவிழா',
    description:
      'Vaigasi Festival celebrates Varadharaja (the wish-granting deity) with special offerings and the famous flower festival decorations.',
    descriptionTa:
      'வைகாசி திருவிழா வரதராஜரை கொண்டாடுகிறது. ஃபூல் திருவிழா அலங்கரணங்கள் கோயிலை அருமையாக்குகின்றன.',
  },
  {
    id: 'murugan-aavani',
    templeId: 'murugan-temple',
    templeName: 'Murugan Temple Palani',
    templeNameTa: 'முருகன் கோயில் பழனி',
    city: 'salem',
    deity: 'Muruga',
    deityTa: 'முருகன்',
    dateFrom: '2026-08-29',
    dateTo: '2026-09-01',
    tamilMonth: 'aavani',
    tithi: 'other',
    tithiName: 'Aavani Festival',
    tithiNameTa: 'ஆவணி திருவிழா',
    description:
      'Aavani Festival celebrates Lord Muruga with hill processions and special Kavadi worship. Devotees perform sacred rituals honoring the youthful deity.',
    descriptionTa:
      'ஆவணி திருவிழா முருகனை கொண்டாடுகிறது. பக்தர்கள் கவடி வழிபாடு செய்கின்றனர் மற்றும் பர்வத ஊர்வலம் நடக்கிறது.',
  },
];

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

export function getTamilMonthLabel(month: TamilMonth, lang: 'en' | 'ta'): string {
  const labels = lang === 'ta' ? TAMIL_MONTH_LABELS_TA : TAMIL_MONTH_LABELS_EN;
  return labels[month] || month;
}

export function getTithiLabel(tithi: Tithi, lang: 'en' | 'ta'): string {
  const labels = lang === 'ta' ? TITHI_LABELS_TA : TITHI_LABELS_EN;
  return labels[tithi] || tithi;
}

export function getTithiEmoji(tithi: Tithi): string {
  if (tithi === 'pournami') return '☾'; // Full moon
  if (tithi === 'amavasya') return '◑'; // New moon
  return '◐';
}

export function festivalsByTamilMonth(month: TamilMonth): Festival[] {
  return FESTIVALS.filter((f) => f.tamilMonth === month).sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
  );
}

export function festivalsByTithi(tithi: Tithi): Festival[] {
  return FESTIVALS.filter((f) => f.tithi === tithi).sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
  );
}

export function festivalsByCity(city: string): Festival[] {
  if (city === 'all') return FESTIVALS;
  return FESTIVALS.filter((f) => f.city === city).sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
  );
}

export function festivalsByDeity(deity: string): Festival[] {
  return FESTIVALS.filter((f) => f.deity === deity).sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
  );
}

export function getTamilMonths(): Array<{ value: TamilMonth; label: string; labelTa: string }> {
  return [
    { value: 'panguni', label: TAMIL_MONTH_LABELS_EN.panguni, labelTa: TAMIL_MONTH_LABELS_TA.panguni },
    { value: 'chithirai', label: TAMIL_MONTH_LABELS_EN.chithirai, labelTa: TAMIL_MONTH_LABELS_TA.chithirai },
    { value: 'vaigasi', label: TAMIL_MONTH_LABELS_EN.vaigasi, labelTa: TAMIL_MONTH_LABELS_TA.vaigasi },
    { value: 'aadi', label: TAMIL_MONTH_LABELS_EN.aadi, labelTa: TAMIL_MONTH_LABELS_TA.aadi },
    { value: 'aavani', label: TAMIL_MONTH_LABELS_EN.aavani, labelTa: TAMIL_MONTH_LABELS_TA.aavani },
    { value: 'purattasi', label: TAMIL_MONTH_LABELS_EN.purattasi, labelTa: TAMIL_MONTH_LABELS_TA.purattasi },
    { value: 'iyppasi', label: TAMIL_MONTH_LABELS_EN.iyppasi, labelTa: TAMIL_MONTH_LABELS_TA.iyppasi },
    { value: 'margazhi', label: TAMIL_MONTH_LABELS_EN.margazhi, labelTa: TAMIL_MONTH_LABELS_TA.margazhi },
    { value: 'thai', label: TAMIL_MONTH_LABELS_EN.thai, labelTa: TAMIL_MONTH_LABELS_TA.thai },
    { value: 'masi', label: TAMIL_MONTH_LABELS_EN.masi, labelTa: TAMIL_MONTH_LABELS_TA.masi },
  ];
}

export function getUniqueDeitiesInFestivals(): Array<{ label: string; labelTa: string }> {
  const deities = new Map<string, { label: string; labelTa: string }>();
  FESTIVALS.forEach((f) => {
    if (!deities.has(f.deity)) {
      deities.set(f.deity, { label: f.deity, labelTa: f.deityTa });
    }
  });
  return Array.from(deities.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export function getCitiesWithFestivals(): Array<{ id: string; label: string; labelTa: string }> {
  const cities: Record<string, { label: string; labelTa: string }> = {
    chennai: { label: 'Chennai', labelTa: 'சென்னை' },
    trichy: { label: 'Trichy', labelTa: 'திருச்சி' },
    madurai: { label: 'Madurai', labelTa: 'மதுரை' },
    coimbatore: { label: 'Coimbatore', labelTa: 'கோவை' },
    salem: { label: 'Salem', labelTa: 'சேலம்' },
    tirunelveli: { label: 'Tirunelveli', labelTa: 'திருநெல்வேலி' },
  };

  const citiesInData = new Set(FESTIVALS.map((f) => f.city));
  return Array.from(citiesInData)
    .map((city) => ({ id: city, ...cities[city] }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
