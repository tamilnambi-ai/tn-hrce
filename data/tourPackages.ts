// ─────────────────────────────────────────────────────────────────────────────
// STATIC TOUR PACKAGE DATA  —  Multi-city, bilingual (EN + TA)
// ─────────────────────────────────────────────────────────────────────────────

export interface TourPackage {
  id: string;
  name:       string; nameTa?:       string;
  city: string;
  duration:   string; durationTa?:   string;
  templeCount: number;
  priceLabel: string; priceLabelTa?: string;
  highlights:   string[];
  highlightsTa?: string[];  // parallel array of Tamil highlights
  imageUrl: string;
  gradientFrom: string;
  gradientTo: string;
}

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=500&fit=crop&q=80&auto=format`;

// Shared duration + price translations (many packages reuse the same value)
const DUR_TA: Record<string, string> = {
  '1 Day':     '1 நாள்',
  '2 Days':    '2 நாட்கள்',
  '3 Days':    '3 நாட்கள்',
  'Half Day':  'அரை நாள்',
};

const priceTa = (en: string) =>
  en.replace('/ person', '/ ஒருவருக்கு');

export const tourPackages: TourPackage[] = [
  // ── Chennai ────────────────────────────────────────────────────────────────
  {
    id: 'sacred-chennai-trail',
    name: 'Sacred Chennai Temples Trail',
    nameTa: 'சென்னை புனித கோயில்கள் சுற்றுலா',
    city: 'chennai',
    duration: '1 Day', durationTa: DUR_TA['1 Day'],
    templeCount: 5,
    priceLabel: '₹799 / person', priceLabelTa: priceTa('₹799 / person'),
    highlights: ['Kapaleeswarar', 'Parthasarathy', 'Vadapalani'],
    highlightsTa: ['கபாலீஸ்வரர்', 'பார்த்தசாரதி', 'வடபழனி'],
    imageUrl: U('photo-1705723116788-d11fa6e3f415'),
    gradientFrom: '#8B3208', gradientTo: '#5A1E05',
  },
  {
    id: 'mylapore-heritage-walk',
    name: 'Mylapore Heritage Walk',
    nameTa: 'மயிலாப்பூர் பாரம்பரிய நடைபயணம்',
    city: 'chennai',
    duration: 'Half Day', durationTa: DUR_TA['Half Day'],
    templeCount: 4,
    priceLabel: '₹399 / person', priceLabelTa: priceTa('₹399 / person'),
    highlights: ['Kapaleeswarar', 'Valeeswarar', 'Mundgakanni Amman'],
    highlightsTa: ['கபாலீஸ்வரர்', 'வாலீஸ்வரர்', 'முண்டகக்கண்ணி அம்மன்'],
    imageUrl: U('photo-1674981324574-a0ebb0bef50d'),
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
  {
    id: 'divine-darshan-chennai',
    name: 'Divine Darshan Package',
    nameTa: 'திவ்ய தரிசன தொகுப்பு',
    city: 'chennai',
    duration: '2 Days', durationTa: DUR_TA['2 Days'],
    templeCount: 8,
    priceLabel: '₹1,499 / person', priceLabelTa: priceTa('₹1,499 / person'),
    highlights: ['Kapaleeswarar', 'Parthasarathy', 'Subramaniya Swamy'],
    highlightsTa: ['கபாலீஸ்வரர்', 'பார்த்தசாரதி', 'சுப்ரமணிய சுவாமி'],
    imageUrl: U('photo-1778385924133-4f9987da2aa7'),
    gradientFrom: '#3A1A80', gradientTo: '#220E50',
  },

  // ── Trichy ─────────────────────────────────────────────────────────────────
  {
    id: 'srirangam-pilgrimage',
    name: 'Srirangam Pilgrimage Tour',
    nameTa: 'ஸ்ரீரங்கம் யாத்திரை சுற்றுலா',
    city: 'trichy',
    duration: '1 Day', durationTa: DUR_TA['1 Day'],
    templeCount: 3,
    priceLabel: '₹649 / person', priceLabelTa: priceTa('₹649 / person'),
    highlights: ['Ranganathaswamy', 'Jambukeswarar', 'Uchipillaiyar'],
    highlightsTa: ['ரங்கநாதசுவாமி', 'ஜம்புகேஸ்வரர்', 'உச்சிப்பிள்ளையார்'],
    imageUrl: U('photo-1768406091087-7fb0d03f6064'),
    gradientFrom: '#8B3208', gradientTo: '#5A1E05',
  },
  {
    id: 'trichy-rock-fort-trail',
    name: 'Rock Fort & Sacred Temples',
    nameTa: 'மலைக்கோட்டை & புனித கோயில்கள்',
    city: 'trichy',
    duration: 'Half Day', durationTa: DUR_TA['Half Day'],
    templeCount: 2,
    priceLabel: '₹349 / person', priceLabelTa: priceTa('₹349 / person'),
    highlights: ['Rock Fort Temple', 'Samayapuram Mariamman'],
    highlightsTa: ['மலைக்கோட்டை கோயில்', 'சமயபுரம் மாரியம்மன்'],
    imageUrl: U('photo-1671095149873-c982e19e4240'),
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
  {
    id: 'trichy-divine-circuit',
    name: 'Trichy Divine Circuit',
    nameTa: 'திருச்சி திவ்ய சுற்றுலா',
    city: 'trichy',
    duration: '2 Days', durationTa: DUR_TA['2 Days'],
    templeCount: 6,
    priceLabel: '₹1,299 / person', priceLabelTa: priceTa('₹1,299 / person'),
    highlights: ['Ranganathaswamy', 'Jambukeswarar', 'Samayapuram'],
    highlightsTa: ['ரங்கநாதசுவாமி', 'ஜம்புகேஸ்வரர்', 'சமயபுரம்'],
    imageUrl: U('photo-1705723116788-d11fa6e3f415'),
    gradientFrom: '#7A1A60', gradientTo: '#4A0E3A',
  },

  // ── Madurai ────────────────────────────────────────────────────────────────
  {
    id: 'meenakshi-temple-tour',
    name: 'Meenakshi Amman Temple Tour',
    nameTa: 'மீனாட்சி அம்மன் கோயில் சுற்றுலா',
    city: 'madurai',
    duration: '1 Day', durationTa: DUR_TA['1 Day'],
    templeCount: 3,
    priceLabel: '₹699 / person', priceLabelTa: priceTa('₹699 / person'),
    highlights: ['Meenakshi Amman', 'Koodal Azhagar', 'Vandiyur Mariamman'],
    highlightsTa: ['மீனாட்சி அம்மன்', 'கூடல் அழகர்', 'வண்டியூர் மாரியம்மன்'],
    imageUrl: U('photo-1762966160822-556deeff018d'),
    gradientFrom: '#A04010', gradientTo: '#6A2808',
  },
  {
    id: 'madurai-heritage-trail',
    name: 'Madurai Heritage Trail',
    nameTa: 'மதுரை பாரம்பரிய சுற்றுலா',
    city: 'madurai',
    duration: 'Half Day', durationTa: DUR_TA['Half Day'],
    templeCount: 2,
    priceLabel: '₹449 / person', priceLabelTa: priceTa('₹449 / person'),
    highlights: ['Meenakshi Amman', 'Thiruparankundram Murugan'],
    highlightsTa: ['மீனாட்சி அம்மன்', 'திருப்பரங்குன்றம் முருகன்'],
    imageUrl: U('photo-1595165989697-6c57f7536758'),
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
  {
    id: 'madurai-complete-darshan',
    name: 'Madurai Complete Darshan',
    nameTa: 'மதுரை முழு தரிசனம்',
    city: 'madurai',
    duration: '2 Days', durationTa: DUR_TA['2 Days'],
    templeCount: 6,
    priceLabel: '₹1,599 / person', priceLabelTa: priceTa('₹1,599 / person'),
    highlights: ['Meenakshi Amman', 'Alagar Koil', 'Pazhamudhircholai'],
    highlightsTa: ['மீனாட்சி அம்மன்', 'அழகர் கோயில்', 'பழமுதிர்சோலை'],
    imageUrl: U('photo-1638896228901-1555f5e74280'),
    gradientFrom: '#7A1A60', gradientTo: '#4A0E3A',
  },

  // ── Coimbatore ─────────────────────────────────────────────────────────────
  {
    id: 'coimbatore-hill-temples',
    name: 'Coimbatore Hill Temples Tour',
    nameTa: 'கோவை மலைக்கோயில்கள் சுற்றுலா',
    city: 'coimbatore',
    duration: '1 Day', durationTa: DUR_TA['1 Day'],
    templeCount: 3,
    priceLabel: '₹599 / person', priceLabelTa: priceTa('₹599 / person'),
    highlights: ['Marudamalai Murugan', 'Eachanari Vinayagar', 'Perur Pateeswarar'],
    highlightsTa: ['மருதமலை முருகன்', 'ஈச்சனாரி வினாயகர்', 'பேரூர் பட்டீஸ்வரர்'],
    imageUrl: U('photo-1778385924133-4f9987da2aa7'),
    gradientFrom: '#904808', gradientTo: '#5A2C05',
  },
  {
    id: 'coimbatore-sacred-circuit',
    name: 'Coimbatore Sacred Circuit',
    nameTa: 'கோவை புனித சுற்றுலா',
    city: 'coimbatore',
    duration: '2 Days', durationTa: DUR_TA['2 Days'],
    templeCount: 5,
    priceLabel: '₹1,199 / person', priceLabelTa: priceTa('₹1,199 / person'),
    highlights: ['Perur Pateeswarar', 'Marudamalai', 'Eachanari'],
    highlightsTa: ['பேரூர் பட்டீஸ்வரர்', 'மருதமலை', 'ஈச்சனாரி'],
    imageUrl: U('photo-1768406091087-7fb0d03f6064'),
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
  {
    id: 'coimbatore-quick-darshan',
    name: 'Quick Darshan — City Temples',
    nameTa: 'விரைவு தரிசனம் — நகர கோயில்கள்',
    city: 'coimbatore',
    duration: 'Half Day', durationTa: DUR_TA['Half Day'],
    templeCount: 2,
    priceLabel: '₹299 / person', priceLabelTa: priceTa('₹299 / person'),
    highlights: ['Eachanari Vinayagar', 'Koniamman Temple'],
    highlightsTa: ['ஈச்சனாரி வினாயகர்', 'கோனியம்மன் கோயில்'],
    imageUrl: U('photo-1674981324574-a0ebb0bef50d'),
    gradientFrom: '#8B1A1A', gradientTo: '#5A1010',
  },

  // ── Salem ──────────────────────────────────────────────────────────────────
  {
    id: 'salem-temple-trail',
    name: 'Salem Sacred Temples Trail',
    nameTa: 'சேலம் புனித கோயில்கள் சுற்றுலா',
    city: 'salem',
    duration: '1 Day', durationTa: DUR_TA['1 Day'],
    templeCount: 3,
    priceLabel: '₹499 / person', priceLabelTa: priceTa('₹499 / person'),
    highlights: ['Sugavaneswarar', 'Kottai Mariamman', 'Periasamy Koil'],
    highlightsTa: ['சுகவனேஸ்வரர்', 'கோட்டை மாரியம்மன்', 'பெரியசாமி கோயில்'],
    imageUrl: U('photo-1762966160822-556deeff018d'),
    gradientFrom: '#8B1A1A', gradientTo: '#5A1010',
  },
  {
    id: 'salem-quick-visit',
    name: 'Salem City Temple Darshan',
    nameTa: 'சேலம் நகர கோயில் தரிசனம்',
    city: 'salem',
    duration: 'Half Day', durationTa: DUR_TA['Half Day'],
    templeCount: 2,
    priceLabel: '₹249 / person', priceLabelTa: priceTa('₹249 / person'),
    highlights: ['Sugavaneswarar', 'Kottai Mariamman'],
    highlightsTa: ['சுகவனேஸ்வரர்', 'கோட்டை மாரியம்மன்'],
    imageUrl: U('photo-1705723116788-d11fa6e3f415'),
    gradientFrom: '#C8680A', gradientTo: '#8B3208',
  },

  // ── Tirunelveli ────────────────────────────────────────────────────────────
  {
    id: 'tirunelveli-pilgrimage',
    name: 'Tirunelveli Sacred Pilgrimage',
    nameTa: 'திருநெல்வேலி புனித யாத்திரை',
    city: 'tirunelveli',
    duration: '1 Day', durationTa: DUR_TA['1 Day'],
    templeCount: 3,
    priceLabel: '₹599 / person', priceLabelTa: priceTa('₹599 / person'),
    highlights: ['Nellaiappar', 'Krishnaswami', 'Pothigai Murugan'],
    highlightsTa: ['நெல்லையப்பர்', 'கிருஷ்ணசுவாமி', 'பொதிகை முருகன்'],
    imageUrl: U('photo-1671095149873-c982e19e4240'),
    gradientFrom: '#8B3208', gradientTo: '#5A1E05',
  },
  {
    id: 'tirunelveli-2day',
    name: 'Tirunelveli Divine 2-Day Tour',
    nameTa: 'திருநெல்வேலி திவ்ய 2-நாள் சுற்றுலா',
    city: 'tirunelveli',
    duration: '2 Days', durationTa: DUR_TA['2 Days'],
    templeCount: 4,
    priceLabel: '₹1,099 / person', priceLabelTa: priceTa('₹1,099 / person'),
    highlights: ['Nellaiappar', 'Pothigai Murugan', 'Agasthiar Temple'],
    highlightsTa: ['நெல்லையப்பர்', 'பொதிகை முருகன்', 'அகஸ்தியர் கோயில்'],
    imageUrl: U('photo-1595165989697-6c57f7536758'),
    gradientFrom: '#1A5840', gradientTo: '#0A3025',
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────
export function packagesByCity(cityId: string, limit = 3): TourPackage[] {
  return tourPackages.filter((p) => p.city === cityId).slice(0, limit);
}
