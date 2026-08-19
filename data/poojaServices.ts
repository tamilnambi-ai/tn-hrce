// ─────────────────────────────────────────────────────────────────────────────
// Bookable pooja services shown in the Book Pooja/Darshan modal.
// Mirrors the shape shown on hrce.tn.gov.in for a typical temple listing.
// ─────────────────────────────────────────────────────────────────────────────

export type PoojaGroup = 'abishegam' | 'sannathi' | 'special';

export interface PoojaService {
  id: string;
  name:      string;
  nameTa?:   string;
  group:     PoojaGroup;
  price:     number;        // ₹
  dateFrom:  string;        // ISO date
  dateTo:    string;        // ISO date
  time?:     string;        // human label; blank if not slotted
  note?:     string;        // e.g. "Includes queue skip"
  noteTa?:   string;
}

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
export const formatInr = inr;

/** 14 services from the reference screenshot (Aug – Sep 2026). */
export const KAPALEESWARAR_SERVICES: PoojaService[] = [
  { id: 'kalasam-ruthra',       name: '1 Kalasam Ruthra Abishegam',   nameTa: 'ஒரு கலசம் ருத்திர அபிஷேகம்',       group: 'abishegam', price:  550, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'annamalaiyar',         name: 'Annamalaiyar Abishegam',       nameTa: 'அண்ணாமலையார் அபிஷேகம்',            group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'arunagirnathar',       name: 'Arunagirnathar Abishegam',     nameTa: 'அருணகிரிநாதர் அபிஷேகம்',           group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'bairavar',             name: 'Bairavar Abishegam Fee',       nameTa: 'பைரவர் அபிஷேகம்',                  group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'dakshanamoorthi',      name: 'Dakshanamoorthi Abishegam',    nameTa: 'தட்சிணாமூர்த்தி அபிஷேகம்',        group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'durgai',               name: 'Durgai Abishegam',             nameTa: 'துர்கை அபிஷேகம்',                  group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'kapaleeswarar-abhi',   name: 'Kapaleeswarar Abishegam',      nameTa: 'கபாலீஸ்வரர் அபிஷேகம்',              group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'karpagambal-abhi',     name: 'Karpagambal Abishegam',        nameTa: 'கற்பகாம்பாள் அபிஷேகம்',              group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'narthana-vinayagar',   name: 'Narthana Vinayagar Abhishegam',nameTa: 'நர்த்தன விநாயகர் அபிஷேகம்',         group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'palani-andavar',       name: 'Palani Andavar Abishegam',     nameTa: 'பழனி ஆண்டவர் அபிஷேகம்',            group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'singaravelar',         name: 'Singaravelar Abishegam',       nameTa: 'சிங்காரவேலர் அபிஷேகம்',              group: 'abishegam', price:  900, dateFrom: '2026-08-20', dateTo: '2026-09-15' },
  { id: 'kapaleeswarar-sannathi', name: 'Kapaleeswarar Sannathi Special Entrance', nameTa: 'கபாலீஸ்வரர் சன்னதி சிறப்பு நுழைவு', group: 'sannathi', price: 50, dateFrom: '2026-08-17', dateTo: '2026-09-05', note: 'Skip the general queue', noteTa: 'பொது வரிசையை தவிர்' },
  { id: 'karpagambal-sannathi', name: 'Karpagambal Sannathi Special Entrance',   nameTa: 'கற்பகாம்பாள் சன்னதி சிறப்பு நுழைவு',   group: 'sannathi', price: 50, dateFrom: '2026-08-17', dateTo: '2026-09-05', note: 'Skip the general queue', noteTa: 'பொது வரிசையை தவிர்' },
  { id: 'golden-chariot',       name: 'Golden Chariot',               nameTa: 'தங்க தேர்',                          group: 'special',   price: 1501, dateFrom: '2026-08-20', dateTo: '2026-09-15', note: 'Ceremonial ride around the temple', noteTa: 'கோயிலைச் சுற்றி விழா ஊர்வலம்' },
];

/** Look up services for a given temple id. */
export function poojaServicesForTemple(templeId: string): PoojaService[] {
  if (templeId === 'kapaleeswarar') return KAPALEESWARAR_SERVICES;
  return [];   // other temples get an empty list for now
}

// ── Time slots (Sannathi Special Entrance only) ──────────────────────────────
export interface TimeSlot {
  id:        string;   // stable id, e.g. 'slot-0600'
  timeLabel: string;   // '6:00 – 6:30 AM'
  capacity:  number;
  filled:    number;
}

// Six 30-min windows across the temple's open hours.
const SLOT_DEFS: { id: string; timeLabel: string }[] = [
  { id: 'slot-0600', timeLabel: '6:00 – 6:30 AM'   },
  { id: 'slot-0800', timeLabel: '8:00 – 8:30 AM'   },
  { id: 'slot-1130', timeLabel: '11:30 – 12:00 PM' },
  { id: 'slot-1630', timeLabel: '4:30 – 5:00 PM'   },
  { id: 'slot-1830', timeLabel: '6:30 – 7:00 PM'   },
  { id: 'slot-2030', timeLabel: '8:30 – 9:00 PM'   },
];

// Deterministic pseudo-fill so the same date shows the same numbers.
// Mix engineered so the demo shows a variety: near-empty, mid, near-full, full.
function deterministicFill(dateIso: string, slotId: string, capacity: number): number {
  const seed = [...(dateIso + slotId)].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  // Choose a fill "profile" for variety
  const profiles = [0.15, 0.30, 0.45, 0.62, 0.78, 0.92, 1.0];
  return Math.min(capacity, Math.round(capacity * profiles[seed % profiles.length]));
}

/** Build slots for a given ISO date. All slots have capacity 100. */
export function slotsForDate(dateIso: string): TimeSlot[] {
  return SLOT_DEFS.map((s) => ({
    id:        s.id,
    timeLabel: s.timeLabel,
    capacity:  100,
    filled:    deterministicFill(dateIso, s.id, 100),
  }));
}

// ── Booking rules (shown on summary card + confirmation ticket) ──────────────
export interface BookingRule { key: string; en: string; ta: string }

export const BOOKING_RULES: BookingRule[] = [
  { key: 'arrive',   en: 'Arrive 30 minutes before your booked pooja time.',                                          ta: 'உங்கள் பூஜை நேரத்திற்கு 30 நிமிடங்கள் முன்னதாக வாருங்கள்.' },
  { key: 'id',       en: 'Carry a valid photo ID (same as booked) — Aadhaar, PAN, DL, or Passport.',                  ta: 'செல்லுபடியாகும் புகைப்பட அடையாள ஆவணம் (பதிவு செய்ததே) கொண்டு வாருங்கள் — ஆதார், பான், ஓட்டுநர் உரிமம் அல்லது பாஸ்போர்ட்.' },
  { key: 'dress',    en: 'Traditional dress recommended. No shorts, sleeveless or beachwear inside the temple.',        ta: 'பாரம்பரிய உடை பரிந்துரைக்கப்படுகிறது. கோயிலுக்குள் சாதாரண குட்டை உடை, கை இல்லாத அல்லது கடற்கரை உடை அணிய வேண்டாம்.' },
  { key: 'footwear', en: 'Footwear is not permitted inside. A free footwear stand is available at the entrance.',      ta: 'உள்ளே செருப்புகள் அனுமதிக்கப்படாது. நுழைவாயிலில் இலவச செருப்பு பாதுகாப்பு வசதி உள்ளது.' },
  { key: 'phone',    en: 'Keep mobile phones on silent. Photography inside the sanctum is prohibited.',                ta: 'மொபைல் போன்களை அமைதிபட்ட நிலையில் வைக்கவும். மூலவர் சன்னதிக்குள் புகைப்படம் எடுக்க தடை.' },
  { key: 'entry',    en: 'Show this ticket + your ID at the special entry counter to be admitted.',                    ta: 'சிறப்பு நுழைவு கவுண்டரில் இந்த அனுமதிச் சீட்டு மற்றும் அடையாள ஆவணம் காட்டி உள்ளே செல்லவும்.' },
  { key: 'refund',   en: 'Passes are non-transferable and non-refundable once confirmed.',                             ta: 'உறுதி செய்யப்பட்டப் பிறகு அனுமதிச் சீட்டுகள் மாற்றவும் திருப்பவும் முடியாது.' },
];

/** Group + sort helpers used by the modal. */
export function groupServices(list: PoojaService[]) {
  const groups: Record<PoojaGroup, PoojaService[]> = { abishegam: [], sannathi: [], special: [] };
  for (const s of list) groups[s.group].push(s);
  return groups;
}
