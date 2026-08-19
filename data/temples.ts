// ─────────────────────────────────────────────────────────────────────────────
// STATIC TEMPLE DATA  —  Multi-city prototype
// imageUrl: verified Unsplash gopuram/temple photographs.
// Replace with actual temple-specific CDN images when available.
// ─────────────────────────────────────────────────────────────────────────────

export interface Pooja      { name: string; nameTa?: string; time: string }
export interface Festival   { name: string; nameTa?: string; period: string; description: string }

export interface TempleAnnouncement {
  id: string;
  type: 'pass_draw' | 'festival' | 'notice';
  title:       string;  titleTa?:       string;
  subtitle?:   string;  subtitleTa?:    string;
  date:        string;  dateTa?:        string;
  deadline?:   string;  deadlineTa?:    string;   // e.g. "Draw closes in 4 days"
  ctaLabel:    string;  ctaLabelTa?:    string;
  passType?:  'free' | 'paid';
  priceLabel?: string;                             // e.g. "₹501 per pass"
  description?: string; descriptionTa?: string;
  emoji?:      string;                             // small leading glyph
  urgent?:     boolean;                            // gets extra visual push
}

export interface Temple {
  id: string;
  name: string;
  nameTa?: string;   // Tamil name (falls back to name)
  area: string;
  areaTa?: string;   // Tamil area (falls back to area)
  city: string;      // matches City.id in CityContext
  pincode: string;
  imageUrl: string;
  gradientFrom: string;
  gradientTo: string;

  // ── Optional detail-page fields (filled for the demo temple only) ─────────
  deity?:        string;   // primary deity
  deityTa?:      string;
  established?:  string;   // "7th century CE"
  timingSummary?: string;  // "5:00 AM – 12:30 PM · 4:00 PM – 9:30 PM"
  timingNote?:   string;   // "Open all days"
  address?:      string;
  phone?:        string;
  historyEn?:    string[]; // paragraphs
  poojas?:       Pooja[];
  festivals?:    Festival[];
  facilities?:   string[]; // ids: parking | water | prasadam | wheelchair | footwear | restrooms | drinking | cctv
  nearbyIds?:    string[]; // other temple ids

  // Map + distances (Overview section)
  coords?:       { lat: number; lng: number };
  distances?:    { key: string; place: string; placeTa?: string; km: number }[];

  // Time-sensitive announcements — shown in top strip & Events section
  announcements?: TempleAnnouncement[];

  // Search aliases — short names, common misspellings, Tamil forms.
  // Case-insensitive; matched as substring by searchTemples.
  aliases?: string[];
}

// Unsplash photos — verified gopuram / South Indian temple photographs
const U = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;

const PHOTOS = {
  gopuram:        U('photo-1768406091087-7fb0d03f6064'),  // ornate Hindu temple tower, colorful deities
  colorfulWalls:  U('photo-1762966160822-556deeff018d'),  // ornate temple tower with carvings
  templePool:     U('photo-1674981324574-a0ebb0bef50d'),  // temple tank & tower
  grandTower:     U('photo-1705723116788-d11fa6e3f415'),  // tall white temple with statues
  pillaredHall:   U('photo-1671095149873-c982e19e4240'),  // large stone structure with carvings
  statuesWall:    U('photo-1693205118032-9382f7267f55'),  // tall tower with statue near water
  crowdTemple:    U('photo-1595165989697-6c57f7536758'),  // gold temple under blue sky
  tallGopuram:    U('photo-1778385924133-4f9987da2aa7'),  // ornate temple tower bright sky
  colorfulPaint:  U('photo-1638896228901-1555f5e74280'),  // very tall white temple
  ancientStone:   U('photo-1632962237468-0705d7e7b534'),  // large stone structure with horse
  templeEntry:    U('photo-1693139984941-f795cb5391ca'),  // tall tower with clock
  clockTower:     U('photo-1693206657625-43c508182c6d'),  // tall temple tower
  pilgrimsGate:   U('photo-1723263555706-aadc8555f3bb'),  // very tall temple building
};

// ── Chennai temples ───────────────────────────────────────────────────────────
const chennaiTemples: Temple[] = [
  {
    id: 'kapaleeswarar',
    name: 'Arulmigu Kapaleeswarar Temple',
    nameTa: 'அருள்மிகு கபாலீஸ்வரர் திருக்கோயில்',
    area: 'Mylapore', areaTa: 'மயிலாப்பூர்', city: 'chennai', pincode: '600004',
    imageUrl: PHOTOS.gopuram,
    gradientFrom: '#C8680A', gradientTo: '#8B3208',
    aliases: [
      'kapali', 'kabali', 'kapali kovil', 'kapali koil',
      'kapaleeswar', 'kabaleeswarar', 'kabaleeshwar',
      'mylapore temple', 'mylapore kovil',
      'கபாலி', 'கபாலீ', 'கபாலி கோயில்', 'கபாலீஸ்வரர்',
    ],

    deity:        'Lord Shiva (Kapaleeswarar)',
    deityTa:      'சிவப் பெருமான் (கபாலீஸ்வரர்)',
    established:  '7th century CE',
    timingSummary:'5:00 AM – 12:30 PM · 4:00 PM – 9:30 PM',
    timingNote:   'Open all days',
    address:      'Kapaleeswarar Sannadhi Street, Mylapore, Chennai — 600004',
    phone:        '+91 44 2464 1670',
    historyEn: [
      'Kapaleeswarar Temple is one of the oldest and most revered Shiva temples in Chennai, dedicated to Lord Shiva in the form of Kapaleeswarar and his consort Karpagambal. The temple traces its origins to the 7th century CE, when it stood by the shore near the modern-day Santhome. The Portuguese demolished the original structure in the 16th century, and the current temple was rebuilt by the Vijayanagara kings in the same century.',
      'The temple\'s architecture is a striking example of the Dravidian style, dominated by a 37-metre-tall gopuram covered in colourful stucco figures depicting scenes from the Puranas. Inside, one finds the sanctum of Kapaleeswarar, the Karpagambal shrine, a large temple tank (Kapaleeswarar Kulam), and numerous smaller shrines. The temple is especially famous for the Arupathimoovar festival, which draws lakhs of devotees each year.',
    ],
    poojas: [
      { name: 'Ushathkalam',    nameTa: 'உஷத்காலம்',    time: '5:30 AM' },
      { name: 'Kalasandhi',     nameTa: 'காலசந்தி',     time: '8:00 AM' },
      { name: 'Uchikalam',      nameTa: 'உச்சிக்காலம்',  time: '12:00 PM' },
      { name: 'Sayarakshai',    nameTa: 'சாயரக்ஷை',     time: '6:00 PM' },
      { name: 'Ardhajamam',     nameTa: 'அர்த்தஜாமம்',   time: '9:00 PM' },
    ],
    festivals: [
      {
        name: 'Panguni Uthiram (Brahmotsavam)',
        nameTa: 'பங்குனி உத்திரம் (பிரம்மோற்சவம்)',
        period: 'Mar – Apr · 10 days',
        description: 'The grand ten-day annual festival culminating in the Arupathimoovar procession, when idols of the 63 Nayanmar saints are carried through the four Mada streets of Mylapore.',
      },
      {
        name: 'Aadi Pooram',
        nameTa: 'ஆடிப் பூரம்',
        period: 'July – August',
        description: 'Celebrating the divine birth of Andal, with special abhishekam and floral decorations for Karpagambal.',
      },
      {
        name: 'Skanda Sashti',
        nameTa: 'கந்த சஷ்டி',
        period: 'October – November',
        description: 'Six-day festival celebrating Lord Murugan\'s victory over the demon Surapadman, with soorasamharam performed on the sixth day.',
      },
      {
        name: 'Vaikasi Visakam',
        nameTa: 'வைகாசி விசாகம்',
        period: 'May – June',
        description: 'Marking the birth star of Lord Murugan, celebrated with special deepa aradhana and processions in the temple prakaram.',
      },
    ],
    facilities: ['parking','drinking','prasadam','footwear','wheelchair','restrooms','cctv','water'],
    nearbyIds: ['kolavizhiamman','valeeswarar','mundgakanni-amman','thiruvalluvar'],
    coords: { lat: 13.0339, lng: 80.2619 },
    distances: [
      { key: 'airport',  place: 'Chennai International Airport', placeTa: 'சென்னை பன்னாட்டு விமான நிலையம்', km: 18 },
      { key: 'railway',  place: 'Chennai Central Station',       placeTa: 'சென்னை மத்திய இரயில் நிலையம்',   km:  7 },
      { key: 'egmore',   place: 'Egmore Station',                placeTa: 'எழும்பூர் இரயில் நிலையம்',        km:  5 },
      { key: 'tnagar',   place: 'T. Nagar',                      placeTa: 'தி. நகர்',                        km:  4 },
      { key: 'marina',   place: 'Marina Beach',                  placeTa: 'மெரினா கடற்கரை',                  km:  3 },
      { key: 'guindy',   place: 'Guindy',                        placeTa: 'கிண்டி',                          km: 10 },
    ],
  },
  {
    id: 'kolavizhiamman',
    name: 'Arulmigu Kolavizhiamman Temple',
    nameTa: 'அருள்மிகு கோலவிழி அம்மன் திருக்கோயில்',
    area: 'Mylapore', areaTa: 'மயிலாப்பூர்', city: 'chennai', pincode: '600004',
    imageUrl: PHOTOS.colorfulWalls,
    gradientFrom: '#8B1A1A', gradientTo: '#5A1010',
  },
  {
    id: 'agasthiyar',
    name: 'Arulmigu Agasthiyar Temple',
    nameTa: 'அருள்மிகு அகஸ்தியர் திருக்கோயில்',
    area: 'Thiyagaraya Nagar', areaTa: 'தியாகராய நகர்', city: 'chennai', pincode: '600017',
    imageUrl: PHOTOS.templePool,
    gradientFrom: '#8B5E0A', gradientTo: '#5A3808',
  },
  {
    id: 'valeeswarar',
    name: 'Arulmigu Valeeswarar Temple',
    nameTa: 'அருள்மிகு வாலீஸ்வரர் திருக்கோயில்',
    area: 'Mylapore', areaTa: 'மயிலாப்பூர்', city: 'chennai', pincode: '600004',
    imageUrl: PHOTOS.pillaredHall,
    gradientFrom: '#3A5E1A', gradientTo: '#1E3A0A',
  },
  {
    id: 'parthasarathy',
    name: 'Arulmigu Parthasarathy Swamy Temple',
    nameTa: 'அருள்மிகு பார்த்தசாரதி சுவாமி திருக்கோயில்',
    area: 'Triplicane', areaTa: 'திருவல்லிக்கேணி', city: 'chennai', pincode: '600005',
    imageUrl: PHOTOS.grandTower,
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
    aliases: [
      'parthasarathy', 'parthasarathi', 'partha sarathy',
      'parthasarathy kovil', 'parthasarathy koil', 'parthasarathy temple',
      'triplicane temple', 'triplicane kovil', 'thiruvallikeni temple',
      'krishna temple triplicane',
      'பார்த்தசாரதி', 'பார்த்தசாரதி கோயில்', 'திருவல்லிக்கேணி கோயில்',
    ],

    deity:        'Lord Vishnu (Sri Parthasarathy — Krishna as Arjuna\'s charioteer)',
    deityTa:      'ஸ்ரீ பார்த்தசாரதி பெருமாள் (அர்ச்சுனனின் தேரோட்டியாக கிருஷ்ணர்)',
    established:  '8th century CE',
    timingSummary:'5:30 AM – 12:00 PM · 4:00 PM – 9:00 PM',
    timingNote:   'Open all days',
    address:      'Singarachari Street, Triplicane, Chennai — 600005',
    phone:        '+91 44 2844 2462',
    historyEn: [
      'Sri Parthasarathy Swamy Temple in Triplicane is one of the oldest temples in Chennai and among the 108 Divya Desams — the sacred abodes of Lord Vishnu revered by the Alwar saints. The temple was originally built by the Pallava king Narasimhavarman I in the 8th century CE and later expanded by the Chola, Pandya and Vijayanagara rulers. The very name "Thiruvallikeni" derives from the lily pond (alli-keni) that once fronted the temple, referenced in the Divya Prabandham hymns of Peyalvar and Thirumangai Alvar.',
      'Uniquely, the temple houses five forms of Vishnu in a single complex — Sri Parthasarathy (Krishna as Arjuna\'s charioteer), Sri Narasimha, Sri Rama, Sri Ranganatha and Sri Varaha — each with its own sanctum. The presiding deity carries scars from the Kurukshetra battle on his face, a detail rarely seen in Vishnu iconography and central to the temple\'s living tradition. The main gopuram, rebuilt in the Vijayanagara style, rises over five tiers and dominates the Triplicane skyline.',
    ],
    poojas: [
      { name: 'Viswaroopa Sevai', nameTa: 'விஸ்வரூப சேவை', time: '6:00 AM' },
      { name: 'Kalasandhi',       nameTa: 'காலசந்தி',       time: '8:30 AM' },
      { name: 'Uchi Kalam',       nameTa: 'உச்சிக்காலம்',   time: '11:30 AM' },
      { name: 'Sayarakshai',      nameTa: 'சாயரக்ஷை',       time: '6:30 PM' },
      { name: 'Arthajama',        nameTa: 'அர்த்தஜாமம்',     time: '8:45 PM' },
    ],
    festivals: [
      {
        name: 'Chithirai Brahmotsavam',
        nameTa: 'சித்திரை பிரம்மோற்சவம்',
        period: 'Apr – May · 12 days',
        description: 'The temple\'s grand annual festival, a twelve-day utsavam culminating in the Ther (chariot) festival, when the towering wooden temple car is drawn through the four Mada streets of Triplicane by thousands of devotees.',
      },
      {
        name: 'Vaikunta Ekadasi',
        nameTa: 'வைகுண்ட ஏகாதசி',
        period: 'December – January',
        description: 'The most sacred day for Vaishnavites, when the Paramapada Vasal (Gateway to Vaikunta) is opened at dawn and devotees pass through the sanctum in a single-file darshan believed to grant liberation.',
      },
      {
        name: 'Sri Krishna Jayanthi',
        nameTa: 'ஸ்ரீ கிருஷ்ண ஜயந்தி',
        period: 'August – September',
        description: 'Celebrating the birth of Lord Krishna with special abhishekam, uri-adi (pot-breaking) in the temple prakaram, and midnight aradhana for Parthasarathy Perumal.',
      },
      {
        name: 'Theppotsavam (Float Festival)',
        nameTa: 'தெப்போற்சவம்',
        period: 'February – March · 3 days',
        description: 'The utsava murthis are taken in ceremonial procession to the temple tank and floated on a decorated raft over three evenings, with lamps and Divya Prabandham recitation lining the ghats.',
      },
    ],
    facilities: ['parking','drinking','prasadam','footwear','wheelchair','restrooms','cctv','water'],
    nearbyIds: ['kapaleeswarar','mundgakanni-amman','valeeswarar','thiruvalluvar'],
    coords: { lat: 13.0569, lng: 80.2757 },
    distances: [
      { key: 'airport',  place: 'Chennai International Airport', placeTa: 'சென்னை பன்னாட்டு விமான நிலையம்', km: 20 },
      { key: 'railway',  place: 'Chennai Central Station',       placeTa: 'சென்னை மத்திய இரயில் நிலையம்',   km:  5 },
      { key: 'egmore',   place: 'Egmore Station',                placeTa: 'எழும்பூர் இரயில் நிலையம்',        km:  3 },
      { key: 'marina',   place: 'Marina Beach',                  placeTa: 'மெரினா கடற்கரை',                  km:  1 },
      { key: 'mylapore', place: 'Mylapore',                      placeTa: 'மயிலாப்பூர்',                     km:  4 },
      { key: 'tnagar',   place: 'T. Nagar',                      placeTa: 'தி. நகர்',                        km:  6 },
    ],
    announcements: [
      {
        id: 'vaikunta-ekadasi-2025-draw',
        type: 'pass_draw',
        emoji: '🪔',
        title: 'Vaikunta Ekadasi',       titleTa: 'வைகுண்ட ஏகாதசி',
        subtitle: 'Free Paramapada Vasal darshan passes via lucky draw',
        subtitleTa: 'பரமபத வாசல் தரிசனம் — இலவச அனுமதி குலுக்கல்',
        date: 'Sat, 10 Jan',             dateTa: 'சனி, 10 மார்கழி',
        deadline: 'Draw closes in 5 days',
        deadlineTa: '5 நாட்களில் குலுக்கல் முடியும்',
        ctaLabel: 'Enter the Draw',
        ctaLabelTa: 'குலுக்கலில் பங்கேற்க',
        passType: 'free',
        description:
          'A limited number of complimentary passes for the pre-dawn Paramapada Vasal darshan on Vaikunta Ekadasi will be issued by random draw. Register your name and Aadhaar; winners will be notified 48 hours before the event.',
        descriptionTa:
          'வைகுண்ட ஏகாதசி அன்று அதிகாலை பரமபத வாசல் தரிசனத்திற்கான வரையறுக்கப்பட்ட இலவச அனுமதிகள் திடீர் குலுக்கல் மூலம் வழங்கப்படும். உங்கள் பெயர் மற்றும் ஆதார் எண்ணுடன் பதிவு செய்யுங்கள்; வெற்றியாளர்கள் நிகழ்வுக்கு 48 மணி நேரம் முன் அறிவிக்கப்படுவார்கள்.',
        urgent: true,
      },
      {
        id: 'brahmotsavam-2025-pass',
        type: 'pass_draw',
        emoji: '🎟️',
        title: 'Chithirai Brahmotsavam Ther',
        titleTa: 'சித்திரை பிரம்மோற்சவம் தேர்',
        subtitle: 'Priority chariot-day darshan pass',
        subtitleTa: 'தேர் தினத்திற்கான முன்னுரிமை தரிசன அனுமதி',
        date: 'Wed, 17 Apr',             dateTa: 'புதன், 17 சித்திரை',
        deadline: 'Limited quantity',
        deadlineTa: 'வரையறுக்கப்பட்ட எண்ணிக்கை',
        ctaLabel: 'Buy Pass',
        ctaLabelTa: 'அனுமதி வாங்க',
        passType: 'paid',
        priceLabel: '₹501 per pass',
        description:
          'Skip the general queue on Ther (chariot) day of the Brahmotsavam. Priority darshan pass includes reserved viewing near the sanctum before the chariot procession begins. Pass proceeds contribute to the temple upkeep fund.',
        descriptionTa:
          'பிரம்மோற்சவ தேர் தினத்தில் பொது வரிசையை தவிர்க்கவும். முன்னுரிமை தரிசன அனுமதி தேர் ஊர்வலம் தொடங்கும் முன் சன்னதிக்கு அருகில் இட ஒதுக்கீட்டை உள்ளடக்கியது. வருவாய் கோயில் பராமரிப்பு நிதிக்கு பங்களிக்கும்.',
      },
    ],
  },
  {
    id: 'vadapalani-andavar',
    name: 'Arulmigu Vadapalani Andavar Temple',
    nameTa: 'அருள்மிகு வடபழனி ஆண்டவர் திருக்கோயில்',
    area: 'Vadapalani', areaTa: 'வடபழனி', city: 'chennai', pincode: '600026',
    imageUrl: PHOTOS.tallGopuram,
    gradientFrom: '#A04010', gradientTo: '#6A2808',
  },
  {
    id: 'angala-parameswari',
    name: 'Arulmigu Angala Parameswari Temple',
    area: 'Vadapalani', city: 'chennai', pincode: '600026',
    imageUrl: PHOTOS.crowdTemple,
    gradientFrom: '#7A1A60', gradientTo: '#4A0E3A',
  },
  {
    id: 'kasiwishvanathan',
    name: 'Arulmigu Kasiwishvanathan Temple',
    area: 'Paraigimalai', city: 'chennai', pincode: '600016',
    imageUrl: PHOTOS.statuesWall,
    gradientFrom: '#3A1A80', gradientTo: '#220E50',
  },
  {
    id: 'bharathwajeswar',
    name: 'Arulmigu Bharathwajeswar Temple',
    area: 'Puliyur', city: 'chennai', pincode: '600024',
    imageUrl: PHOTOS.colorfulPaint,
    gradientFrom: '#1A5840', gradientTo: '#0A3025',
  },
  {
    id: 'karabathira-samy',
    name: 'Arulmigu Karabathira Samy Temple',
    area: 'Vysarpadi', city: 'chennai', pincode: '600039',
    imageUrl: PHOTOS.ancientStone,
    gradientFrom: '#905010', gradientTo: '#5A3008',
  },
  {
    id: 'kulanthai-kumara-swamy',
    name: 'Arulmigu Kulanthai Muthu Kumara Swamy Temple',
    area: 'Alwarpettai', city: 'chennai', pincode: '600004',
    imageUrl: PHOTOS.gopuram,
    gradientFrom: '#A03018', gradientTo: '#680E08',
  },
  {
    id: 'aathimoolaperumal',
    name: 'Arulmigu Aathimoolaperumal Temple',
    area: 'Vadapalani', city: 'chennai', pincode: '600026',
    imageUrl: PHOTOS.templeEntry,
    gradientFrom: '#185880', gradientTo: '#0A3050',
  },
  {
    id: 'devi-thirumani-amman',
    name: 'Arulmigu Devi Thirumani Amman Temple',
    area: 'Anna Nagar', city: 'chennai', pincode: '600040',
    imageUrl: PHOTOS.pilgrimsGate,
    gradientFrom: '#801868', gradientTo: '#501040',
  },
  {
    id: 'devi-periya-palayathamman',
    name: 'Arulmigu Devi Periya Palayathamman Temple',
    area: 'Arumbakkam', city: 'chennai', pincode: '600106',
    imageUrl: PHOTOS.pillaredHall,
    gradientFrom: '#701028', gradientTo: '#480A18',
  },
  {
    id: 'masilmaneeswarar',
    name: 'Arulmigu Masilmaneeswarar Temple',
    area: 'Thirumullaivoyal', city: 'chennai', pincode: '600062',
    imageUrl: PHOTOS.clockTower,
    gradientFrom: '#286820', gradientTo: '#184010',
  },
  {
    id: 'subramaniya-swamy',
    name: 'Arulmigu Subramaniya Swamy Temple',
    area: 'Ambattur', city: 'chennai', pincode: '600053',
    imageUrl: PHOTOS.gopuram,
    gradientFrom: '#904808', gradientTo: '#5A2C05',
  },
  {
    id: 'mundgakanni-amman',
    name: 'Arulmigu Mundgakanni Amman Temple',
    area: 'Mylapore', city: 'chennai', pincode: '600004',
    imageUrl: PHOTOS.colorfulWalls,
    gradientFrom: '#881828', gradientTo: '#580E18',
  },
  {
    id: 'thiruvalluvar',
    name: 'Arulmigu Thiruvalluvar Temple',
    area: 'Mylapore', city: 'chennai', pincode: '600004',
    imageUrl: PHOTOS.pillaredHall,
    gradientFrom: '#684010', gradientTo: '#402808',
  },
  {
    id: 'anjaneyar-nanganallur',
    name: 'Arulmigu Adivyadhihara Bagtha Anjaneyar Temple',
    area: 'Nanganallur', city: 'chennai', pincode: '600061',
    imageUrl: PHOTOS.grandTower,
    gradientFrom: '#185098', gradientTo: '#0A3060',
  },
  {
    id: 'virubacheeswarar',
    name: 'Arulmigu Virubacheeswarar Temple',
    area: 'Mylapore', city: 'chennai', pincode: '600004',
    imageUrl: PHOTOS.tallGopuram,
    gradientFrom: '#784010', gradientTo: '#4A2808',
  },
];

// ── Trichy temples ────────────────────────────────────────────────────────────
const trichyTemples: Temple[] = [
  {
    id: 'ranganathaswamy',
    name: 'Arulmigu Ranganathaswamy Temple',
    nameTa: 'அருள்மிகு ரங்கநாதசுவாமி திருக்கோயில்',
    area: 'Srirangam', areaTa: 'ஸ்ரீரங்கம்', city: 'trichy', pincode: '620006',
    imageUrl: PHOTOS.grandTower,
    gradientFrom: '#8B3208', gradientTo: '#5A1E05',
  },
  {
    id: 'thayumanaswami',
    name: 'Arulmigu Thayumanaswami Temple',
    nameTa: 'அருள்மிகு தாயுமானசுவாமி திருக்கோயில்',
    area: 'Rock Fort', areaTa: 'மலைக்கோட்டை', city: 'trichy', pincode: '620001',
    imageUrl: PHOTOS.ancientStone,
    gradientFrom: '#8B1A1A', gradientTo: '#5A1010',
  },
  {
    id: 'jambukeswarar',
    name: 'Arulmigu Jambukeswarar Temple',
    nameTa: 'அருள்மிகு ஜம்புகேஸ்வரர் திருக்கோயில்',
    area: 'Thiruvanaikaval', areaTa: 'திருவானைக்காவல்', city: 'trichy', pincode: '620005',
    imageUrl: PHOTOS.templePool,
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
  {
    id: 'samayapuram-mariamman',
    name: 'Arulmigu Samayapuram Mariamman Temple',
    nameTa: 'அருள்மிகு சமயபுரம் மாரியம்மன் திருக்கோயில்',
    area: 'Samayapuram', areaTa: 'சமயபுரம்', city: 'trichy', pincode: '621112',
    imageUrl: PHOTOS.crowdTemple,
    gradientFrom: '#7A1A60', gradientTo: '#4A0E3A',
  },
  {
    id: 'uchipillaiyar',
    name: 'Arulmigu Uchipillaiyar Temple',
    nameTa: 'அருள்மிகு உச்சிப்பிள்ளையார் திருக்கோயில்',
    area: 'Rock Fort', areaTa: 'மலைக்கோட்டை', city: 'trichy', pincode: '620001',
    imageUrl: PHOTOS.tallGopuram,
    gradientFrom: '#904808', gradientTo: '#5A2C05',
  },
  {
    id: 'mahalakshmi-srirangam',
    name: 'Arulmigu Sri Mahalakshmi Temple',
    nameTa: 'அருள்மிகு ஸ்ரீ மகாலட்சுமி திருக்கோயில்',
    area: 'Srirangam', areaTa: 'ஸ்ரீரங்கம்', city: 'trichy', pincode: '620006',
    imageUrl: PHOTOS.gopuram,
    gradientFrom: '#C8680A', gradientTo: '#8B3208',
  },
];

// ── Madurai temples ───────────────────────────────────────────────────────────
const maduraiTemples: Temple[] = [
  {
    id: 'meenakshi-amman',
    name: 'Arulmigu Meenakshi Amman Temple',
    nameTa: 'அருள்மிகு மீனாட்சி அம்மன் திருக்கோயில்',
    area: 'Madurai City', areaTa: 'மதுரை நகரம்', city: 'madurai', pincode: '625001',
    imageUrl: PHOTOS.gopuram,
    gradientFrom: '#A04010', gradientTo: '#6A2808',
  },
  {
    id: 'koodal-azhagar',
    name: 'Arulmigu Koodal Azhagar Temple',
    nameTa: 'அருள்மிகு கூடல் அழகர் திருக்கோயில்',
    area: 'Madurai City', areaTa: 'மதுரை நகரம்', city: 'madurai', pincode: '625001',
    imageUrl: PHOTOS.grandTower,
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
  {
    id: 'thiruparankundram',
    name: 'Arulmigu Thiruparankundram Murugan Temple',
    nameTa: 'அருள்மிகு திருப்பரங்குன்றம் முருகன் திருக்கோயில்',
    area: 'Thiruparankundram', areaTa: 'திருப்பரங்குன்றம்', city: 'madurai', pincode: '625005',
    imageUrl: PHOTOS.pillaredHall,
    gradientFrom: '#7A1A60', gradientTo: '#4A0E3A',
  },
  {
    id: 'alagar-koil',
    name: 'Arulmigu Kallazhagar Temple',
    nameTa: 'அருள்மிகு கள்ளழகர் திருக்கோயில்',
    area: 'Alagar Koil', areaTa: 'அழகர் கோயில்', city: 'madurai', pincode: '625301',
    imageUrl: PHOTOS.templePool,
    gradientFrom: '#286820', gradientTo: '#184010',
  },
  {
    id: 'pazhamudhircholai',
    name: 'Arulmigu Pazhamudhircholai Murugan Temple',
    nameTa: 'அருள்மிகு பழமுதிர்சோலை முருகன் திருக்கோயில்',
    area: 'Pazhamudhircholai', areaTa: 'பழமுதிர்சோலை', city: 'madurai', pincode: '625301',
    imageUrl: PHOTOS.colorfulPaint,
    gradientFrom: '#3A1A80', gradientTo: '#220E50',
  },
  {
    id: 'vandiyur-mariamman',
    name: 'Arulmigu Vandiyur Mariamman Temple',
    nameTa: 'அருள்மிகு வண்டியூர் மாரியம்மன் திருக்கோயில்',
    area: 'Vandiyur', areaTa: 'வண்டியூர்', city: 'madurai', pincode: '625020',
    imageUrl: PHOTOS.crowdTemple,
    gradientFrom: '#8B1A1A', gradientTo: '#5A1010',
  },
];

// ── Coimbatore temples ────────────────────────────────────────────────────────
const coimbatoreTemples: Temple[] = [
  {
    id: 'perur-pateeswarar',
    name: 'Arulmigu Perur Pateeswarar Temple',
    nameTa: 'அருள்மிகு பேரூர் பட்டீஸ்வரர் திருக்கோயில்',
    area: 'Perur', areaTa: 'பேரூர்', city: 'coimbatore', pincode: '641010',
    imageUrl: PHOTOS.ancientStone,
    gradientFrom: '#8B3208', gradientTo: '#5A1E05',
  },
  {
    id: 'marudamalai-murugan',
    name: 'Arulmigu Marudamalai Murugan Temple',
    nameTa: 'அருள்மிகு மருதமலை முருகன் திருக்கோயில்',
    area: 'Marudamalai', areaTa: 'மருதமலை', city: 'coimbatore', pincode: '641046',
    imageUrl: PHOTOS.tallGopuram,
    gradientFrom: '#904808', gradientTo: '#5A2C05',
  },
  {
    id: 'eachanari-vinayagar',
    name: 'Arulmigu Eachanari Vinayagar Temple',
    nameTa: 'அருள்மிகு ஈச்சனாரி வினாயகர் திருக்கோயில்',
    area: 'Eachanari', areaTa: 'ஈச்சனாரி', city: 'coimbatore', pincode: '641021',
    imageUrl: PHOTOS.gopuram,
    gradientFrom: '#C8680A', gradientTo: '#8B3208',
  },
  {
    id: 'arulmigu-koniamman',
    name: 'Arulmigu Koniamman Temple',
    nameTa: 'அருள்மிகு கோனியம்மன் திருக்கோயில்',
    area: 'Singanallur', areaTa: 'சிங்காநல்லூர்', city: 'coimbatore', pincode: '641005',
    imageUrl: PHOTOS.colorfulWalls,
    gradientFrom: '#7A1A60', gradientTo: '#4A0E3A',
  },
  {
    id: 'pachamalai-arulmigu',
    name: 'Arulmigu Pachamalai Murugan Temple',
    nameTa: 'அருள்மிகு பச்சைமலை முருகன் திருக்கோயில்',
    area: 'Pachamalai', areaTa: 'பச்சைமலை', city: 'coimbatore', pincode: '641050',
    imageUrl: PHOTOS.crowdTemple,
    gradientFrom: '#1A5840', gradientTo: '#0A3025',
  },
  {
    id: 'sangameswarar-coimbatore',
    name: 'Arulmigu Sangameswarar Temple',
    nameTa: 'அருள்மிகு சங்கமேஸ்வரர் திருக்கோயில்',
    area: 'R.S. Puram', areaTa: 'ஆர்.எஸ். புரம்', city: 'coimbatore', pincode: '641002',
    imageUrl: PHOTOS.templeEntry,
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
];

// ── Salem temples ─────────────────────────────────────────────────────────────
const salemTemples: Temple[] = [
  {
    id: 'sugavaneswarar',
    name: 'Arulmigu Sugavaneswarar Temple',
    nameTa: 'அருள்மிகு சுகவனேஸ்வரர் திருக்கோயில்',
    area: 'Salem City', areaTa: 'சேலம் நகரம்', city: 'salem', pincode: '636001',
    imageUrl: PHOTOS.gopuram,
    gradientFrom: '#8B1A1A', gradientTo: '#5A1010',
  },
  {
    id: 'kottai-mariamman',
    name: 'Arulmigu Kottai Mariamman Temple',
    nameTa: 'அருள்மிகு கோட்டை மாரியம்மன் திருக்கோயில்',
    area: 'Salem City', areaTa: 'சேலம் நகரம்', city: 'salem', pincode: '636001',
    imageUrl: PHOTOS.crowdTemple,
    gradientFrom: '#7A1A60', gradientTo: '#4A0E3A',
  },
  {
    id: 'periasamy-kovil',
    name: 'Arulmigu Periasamy Koil',
    nameTa: 'அருள்மிகு பெரியசாமி கோயில்',
    area: 'Shevapet', areaTa: 'சேவப்பேட்டை', city: 'salem', pincode: '636002',
    imageUrl: PHOTOS.ancientStone,
    gradientFrom: '#904808', gradientTo: '#5A2C05',
  },
  {
    id: 'thumbal-naganathar',
    name: 'Arulmigu Thumbal Naganathar Temple',
    nameTa: 'அருள்மிகு தும்பல் நாகநாதர் திருக்கோயில்',
    area: 'Thumbal', areaTa: 'தும்பல்', city: 'salem', pincode: '636010',
    imageUrl: PHOTOS.pillaredHall,
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
];

// ── Tirunelveli temples ───────────────────────────────────────────────────────
const tirunelveliTemples: Temple[] = [
  {
    id: 'nellaiappar',
    name: 'Arulmigu Nellaiappar Temple',
    nameTa: 'அருள்மிகு நெல்லையப்பர் திருக்கோயில்',
    area: 'Tirunelveli Town', areaTa: 'திருநெல்வேலி நகரம்', city: 'tirunelveli', pincode: '627001',
    imageUrl: PHOTOS.grandTower,
    gradientFrom: '#8B3208', gradientTo: '#5A1E05',
  },
  {
    id: 'krishnapuram-palace-koil',
    name: 'Arulmigu Krishnaswami Temple',
    nameTa: 'அருள்மிகு கிருஷ்ணசுவாமி திருக்கோயில்',
    area: 'Krishnapuram', areaTa: 'கிருஷ்ணபுரம்', city: 'tirunelveli', pincode: '627011',
    imageUrl: PHOTOS.templePool,
    gradientFrom: '#1A3E6B', gradientTo: '#0A2040',
  },
  {
    id: 'pothigai-murugan',
    name: 'Arulmigu Pothigai Murugan Temple',
    nameTa: 'அருள்மிகு பொதிகை முருகன் திருக்கோயில்',
    area: 'Ambasamudram', areaTa: 'அம்பாசமுத்திரம்', city: 'tirunelveli', pincode: '627401',
    imageUrl: PHOTOS.tallGopuram,
    gradientFrom: '#904808', gradientTo: '#5A2C05',
  },
  {
    id: 'kallidaikurichi-agasthiar',
    name: 'Arulmigu Agasthiar Temple',
    nameTa: 'அருள்மிகு அகஸ்தியர் திருக்கோயில்',
    area: 'Kallidaikurichi', areaTa: 'கள்ளிடைக்குறிச்சி', city: 'tirunelveli', pincode: '627416',
    imageUrl: PHOTOS.colorfulPaint,
    gradientFrom: '#286820', gradientTo: '#184010',
  },
];

// ── Combined export ───────────────────────────────────────────────────────────
export const temples: Temple[] = [
  ...chennaiTemples,
  ...trichyTemples,
  ...maduraiTemples,
  ...coimbatoreTemples,
  ...salemTemples,
  ...tirunelveliTemples,
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function templeById(id: string): Temple | undefined {
  return temples.find((t) => t.id === id);
}

export function templesByIds(ids: string[]): Temple[] {
  return ids.map(templeById).filter((t): t is Temple => Boolean(t));
}

export function templesByCity(cityId: string, limit = 6): Temple[] {
  return temples.filter((t) => t.city === cityId).slice(0, limit);
}

export function searchTemples(query: string, cityId?: string): Temple[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const pool = cityId ? temples.filter((t) => t.city === cityId) : temples;
  return pool.filter((t) => {
    if (t.name.toLowerCase().includes(q)) return true;
    if (t.nameTa && t.nameTa.toLowerCase().includes(q)) return true;
    if (t.area.toLowerCase().includes(q)) return true;
    if (t.areaTa && t.areaTa.toLowerCase().includes(q)) return true;
    if (t.city.toLowerCase().includes(q)) return true;
    if (t.pincode.includes(q)) return true;
    if (t.aliases && t.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });
}
