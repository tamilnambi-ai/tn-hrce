// ─────────────────────────────────────────────────────────────────────────────
// Renovation projects — demo dataset for /temples/renovation
// Prototype content; real data comes from WordPress later.
// ─────────────────────────────────────────────────────────────────────────────

export type RenovationType =
  | 'gopuram'
  | 'sanctum'
  | 'prakaram'
  | 'mandapam'
  | 'roof'
  | 'murals';

export interface Renovation {
  id:              string;
  templeId?:       string;           // Link to data/temples.ts entry when available
  templeName:      string;
  templeNameTa?:   string;
  area:            string;
  areaTa?:         string;
  city:            'chennai' | 'trichy' | 'madurai' | 'coimbatore' | 'salem' | 'tirunelveli';
  type:            RenovationType;
  description:     string;
  descriptionTa?:  string;
  raised:          number;           // ₹ raised so far
  goal:            number;           // ₹ target
  imageUrl:        string;
}

export const RENOVATIONS: Renovation[] = [
  // ── Chennai ──
  {
    id: 'ren-kapal-gopuram',
    templeId: 'kapaleeswarar',
    templeName: 'Arulmigu Kapaleeswarar Temple',
    templeNameTa: 'அருள்மிகு கபாலீஸ்வரர் திருக்கோயில்',
    area: 'Mylapore', areaTa: 'மயிலாப்பூர்',
    city: 'chennai',
    type: 'gopuram',
    description: 'Restoration of the east gopuram — stucco figures, colour work and structural bracing to preserve 8th-century architecture.',
    descriptionTa: 'கிழக்கு கோபுரம் புதுப்பிப்பு — சுதை உருவங்கள், வர்ணப் பணி மற்றும் கட்டமைப்பு பலப்படுத்தல்.',
    raised: 420000, goal: 1500000,
    imageUrl: 'https://picsum.photos/seed/ren-kapal/800/500',
  },
  {
    id: 'ren-parthasarathy-prakaram',
    templeId: 'parthasarathy',
    templeName: 'Sri Parthasarathy Temple',
    templeNameTa: 'ஸ்ரீ பார்த்தசாரதி திருக்கோயில்',
    area: 'Triplicane', areaTa: 'திருவல்லிக்கேணி',
    city: 'chennai',
    type: 'prakaram',
    description: 'Repaving and lighting for the outer prakaram, plus repairs to the tank steps used during Brahmotsavam.',
    descriptionTa: 'வெளிப் பிராகாரம் மறுசீரமைப்பு மற்றும் தேர்த்திருவிழா படிக்கட்டு பழுது.',
    raised: 285000, goal: 800000,
    imageUrl: 'https://picsum.photos/seed/ren-partha/800/500',
  },
  {
    id: 'ren-vadapalani-mandapam',
    templeName: 'Sri Vadapalani Andavar Temple',
    templeNameTa: 'ஸ்ரீ வடபழனி ஆண்டவர் திருக்கோயில்',
    area: 'Vadapalani', areaTa: 'வடபழனி',
    city: 'chennai',
    type: 'mandapam',
    description: 'Kalyana Mandapam re-roofing and marriage-hall floor renewal to serve devotees for the next decade.',
    descriptionTa: 'கல்யாண மண்டப மேற்கூரை புதுப்பிப்பு மற்றும் தளம் புதுப்பிப்பு.',
    raised: 610000, goal: 700000,
    imageUrl: 'https://picsum.photos/seed/ren-vada/800/500',
  },
  {
    id: 'ren-tiruvottiyur-roof',
    templeName: 'Sri Thyagaraja Swamy Temple',
    templeNameTa: 'ஸ்ரீ தியாகராஜ சுவாமி திருக்கோயில்',
    area: 'Tiruvottiyur', areaTa: 'திருவொற்றியூர்',
    city: 'chennai',
    type: 'roof',
    description: 'Terrace waterproofing and structural roof beam replacement to stop monsoon seepage into the sanctum.',
    descriptionTa: 'மேல்தள நீர்ப்புகா பணி மற்றும் விட்டங்கள் மாற்றம்.',
    raised: 95000, goal: 550000,
    imageUrl: 'https://picsum.photos/seed/ren-thyag/800/500',
  },

  // ── Madurai ──
  {
    id: 'ren-meenakshi-murals',
    templeName: 'Arulmigu Meenakshi Amman Temple',
    templeNameTa: 'அருள்மிகு மீனாட்சி அம்மன் திருக்கோயில்',
    area: 'Madurai Central', areaTa: 'மதுரை மத்திய',
    city: 'madurai',
    type: 'murals',
    description: 'Conservation of 17th-century Nayak-era murals in the Ayirakkal Mandapam using reversible traditional pigments.',
    descriptionTa: 'ஆயிரக்கால் மண்டப சுவரோவியப் பாதுகாப்பு.',
    raised: 1250000, goal: 2500000,
    imageUrl: 'https://picsum.photos/seed/ren-meenakshi/800/500',
  },
  {
    id: 'ren-koodal-sanctum',
    templeName: 'Sri Koodal Azhagar Temple',
    templeNameTa: 'ஸ்ரீ கூடல் அழகர் திருக்கோயில்',
    area: 'Madurai West', areaTa: 'மதுரை மேற்கு',
    city: 'madurai',
    type: 'sanctum',
    description: 'Sanctum sanctorum floor and wall re-plastering with lime mortar, following heritage conservation guidelines.',
    descriptionTa: 'கருவறை தளம் மற்றும் சுவர் சுண்ணாம்பு பூச்சு.',
    raised: 180000, goal: 900000,
    imageUrl: 'https://picsum.photos/seed/ren-koodal/800/500',
  },

  // ── Trichy ──
  {
    id: 'ren-rockfort-gopuram',
    templeName: 'Sri Thayumanaswamy Temple',
    templeNameTa: 'ஸ்ரீ தாயுமானசுவாமி திருக்கோயில்',
    area: 'Rockfort', areaTa: 'மலைக்கோட்டை',
    city: 'trichy',
    type: 'gopuram',
    description: 'Rajagopuram stucco restoration and repainting of the deity figures with traditional natural pigments.',
    descriptionTa: 'ராஜகோபுர சுதை புதுப்பிப்பு மற்றும் வர்ணம்.',
    raised: 720000, goal: 1200000,
    imageUrl: 'https://picsum.photos/seed/ren-rockfort/800/500',
  },
  {
    id: 'ren-jambukeswarar-prakaram',
    templeName: 'Sri Jambukeswarar Temple',
    templeNameTa: 'ஸ்ரீ ஜம்புகேஸ்வரர் திருக்கோயில்',
    area: 'Thiruvanaikaval', areaTa: 'திருவானைக்காவல்',
    city: 'trichy',
    type: 'prakaram',
    description: 'Restoration of the water spring inside the Akhilandeswari sannathi and adjacent prakaram tile work.',
    descriptionTa: 'அகிலாண்டேஸ்வரி சன்னதி நீரூற்று புதுப்பிப்பு.',
    raised: 340000, goal: 600000,
    imageUrl: 'https://picsum.photos/seed/ren-jambu/800/500',
  },

  // ── Coimbatore ──
  {
    id: 'ren-perur-mandapam',
    templeName: 'Sri Patteeswarar Temple',
    templeNameTa: 'ஸ்ரீ பட்டீஸ்வரர் திருக்கோயில்',
    area: 'Perur', areaTa: 'பேரூர்',
    city: 'coimbatore',
    type: 'mandapam',
    description: 'Kanaka Sabhai (thousand pillar hall) stone pillar cleaning, joint sealing and floor level restoration.',
    descriptionTa: 'ஆயிரம் கால் மண்டப தூண் புதுப்பிப்பு.',
    raised: 155000, goal: 950000,
    imageUrl: 'https://picsum.photos/seed/ren-perur/800/500',
  },

  // ── Tirunelveli ──
  {
    id: 'ren-nellai-roof',
    templeName: 'Sri Nellaiyappar Temple',
    templeNameTa: 'ஸ்ரீ நெல்லையப்பர் திருக்கோயில்',
    area: 'Tirunelveli Town', areaTa: 'திருநெல்வேலி நகரம்',
    city: 'tirunelveli',
    type: 'roof',
    description: 'Copper roofing renewal over the Vasantha Mandapam and heritage timber truss inspection and treatment.',
    descriptionTa: 'வசந்த மண்டப செம்பு மேற்கூரை மற்றும் மர கூரை பழுது.',
    raised: 470000, goal: 1100000,
    imageUrl: 'https://picsum.photos/seed/ren-nellai/800/500',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Work items (sponsorable sub-tasks per renovation)
// ─────────────────────────────────────────────────────────────────────────────

export type WorkItemMode = 'full' | 'bulk';

export interface WorkItem {
  id:           string;
  name:         string;
  nameTa?:      string;
  mode:         WorkItemMode;
  /** Total cost of the item (full) OR unitCost × totalUnits (bulk) */
  cost:         number;
  /** ₹ raised toward this item (both modes) */
  raised:       number;
  /** Bulk only */
  unit?:        string;
  unitTa?:      string;
  unitCost?:    number;
  totalUnits?:  number;
  unitsRaised?: number;
}

/** Item template banks by renovation type. Reused across projects. */
type Template = Omit<WorkItem, 'id' | 'raised' | 'unitsRaised' | 'cost'> & {
  costShare?: number;              // fraction of the project goal (full items)
  unitTargetShare?: number;        // fraction of project goal used to derive totalUnits (bulk)
};

const TEMPLATES: Record<RenovationType, Template[]> = {
  gopuram: [
    { name: 'Stucco figure restoration',   nameTa: 'சுதை உருவ புதுப்பிப்பு', mode: 'full', costShare: 0.35 },
    { name: 'Kalasam gold plating',        nameTa: 'கலசம் தங்க முலாம்',      mode: 'full', costShare: 0.20 },
    { name: 'Traditional pigment painting',nameTa: 'இயற்கை வண்ணப் பூச்சு',   mode: 'full', costShare: 0.15 },
    { name: 'Cement bag',                  nameTa: 'சிமெண்ட் மூட்டை',        mode: 'bulk', unit: 'bag',    unitTa: 'மூட்டை', unitCost: 500,  unitTargetShare: 0.15 },
    { name: 'Brick bundle',                nameTa: 'செங்கல் கட்டு',            mode: 'bulk', unit: 'bundle', unitTa: 'கட்டு',  unitCost: 2000, unitTargetShare: 0.15 },
  ],
  sanctum: [
    { name: 'Lime mortar plastering',      nameTa: 'சுண்ணாம்பு பூச்சு',       mode: 'full', costShare: 0.35 },
    { name: 'Granite floor renewal',       nameTa: 'கிரானைட் தள புதுப்பிப்பு', mode: 'full', costShare: 0.25 },
    { name: 'Skilled sthapathi labour',    nameTa: 'ஸ்தபதி கூலி',              mode: 'full', costShare: 0.15 },
    { name: 'Cement bag',                  nameTa: 'சிமெண்ட் மூட்டை',         mode: 'bulk', unit: 'bag',   unitTa: 'மூட்டை', unitCost: 500, unitTargetShare: 0.15 },
    { name: 'Lime tin',                    nameTa: 'சுண்ணாம்பு டப்பா',         mode: 'bulk', unit: 'tin',   unitTa: 'டப்பா',  unitCost: 900, unitTargetShare: 0.10 },
  ],
  prakaram: [
    { name: 'Tank step re-cutting',        nameTa: 'குள படிக்கட்டு மாற்று',   mode: 'full', costShare: 0.30 },
    { name: 'Prakaram lighting upgrade',   nameTa: 'பிராகாரம் விளக்கு',       mode: 'full', costShare: 0.25 },
    { name: 'Skilled masonry labour',      nameTa: 'கல்வேலை கூலி',            mode: 'full', costShare: 0.15 },
    { name: 'Granite paving slab',         nameTa: 'கிரானைட் தள கல்',         mode: 'bulk', unit: 'slab',  unitTa: 'கல்',   unitCost: 1200, unitTargetShare: 0.20 },
    { name: 'Cement bag',                  nameTa: 'சிமெண்ட் மூட்டை',         mode: 'bulk', unit: 'bag',   unitTa: 'மூட்டை', unitCost: 500,  unitTargetShare: 0.10 },
  ],
  mandapam: [
    { name: 'Stone pillar cleaning + resealing', nameTa: 'கல் தூண் சுத்திகரிப்பு', mode: 'full', costShare: 0.30 },
    { name: 'Timber ceiling truss repair',       nameTa: 'மர கூரை சட்ட பழுது',     mode: 'full', costShare: 0.25 },
    { name: 'Traditional lime finish',           nameTa: 'சுண்ணாம்பு முடிப்பு',    mode: 'full', costShare: 0.15 },
    { name: 'Teakwood plank',                    nameTa: 'தேக்கு பலகை',            mode: 'bulk', unit: 'plank', unitTa: 'பலகை', unitCost: 2500, unitTargetShare: 0.20 },
    { name: 'Cement bag',                        nameTa: 'சிமெண்ட் மூட்டை',        mode: 'bulk', unit: 'bag',   unitTa: 'மூட்டை', unitCost: 500,  unitTargetShare: 0.10 },
  ],
  roof: [
    { name: 'Copper sheet roofing',        nameTa: 'செம்பு தாள் வேய்தல்',    mode: 'full', costShare: 0.40 },
    { name: 'Waterproofing membrane',      nameTa: 'நீர்ப்புகா மென்படலம்',    mode: 'full', costShare: 0.20 },
    { name: 'Skilled roofing labour',      nameTa: 'கூரை கூலி',                mode: 'full', costShare: 0.15 },
    { name: 'Teakwood truss beam',         nameTa: 'தேக்கு விட்டம்',           mode: 'bulk', unit: 'beam',  unitTa: 'விட்டம்', unitCost: 4500, unitTargetShare: 0.15 },
    { name: 'Cement bag',                  nameTa: 'சிமெண்ட் மூட்டை',         mode: 'bulk', unit: 'bag',   unitTa: 'மூட்டை',  unitCost: 500,  unitTargetShare: 0.10 },
  ],
  murals: [
    { name: 'Conservation of one panel',   nameTa: 'ஒரு சுவரோவியப் பாதுகாப்பு', mode: 'full', costShare: 0.35 },
    { name: 'Reversible pigment kit',      nameTa: 'மீளக்கூடிய வண்ண தொகுப்பு',  mode: 'full', costShare: 0.20 },
    { name: 'Conservator sthapathi labour',nameTa: 'ஸ்தபதி கூலி',                mode: 'full', costShare: 0.20 },
    { name: 'Preservation frame',          nameTa: 'பாதுகாப்பு சட்டம்',         mode: 'bulk', unit: 'frame', unitTa: 'சட்டம்', unitCost: 3000, unitTargetShare: 0.15 },
    { name: 'Cotton wash cloth pack',      nameTa: 'பருத்தி துணி தொகுப்பு',    mode: 'bulk', unit: 'pack',  unitTa: 'தொகுப்பு', unitCost: 800, unitTargetShare: 0.10 },
  ],
};

// Deterministic pseudo-fill so demo numbers stay stable across renders.
function seededFraction(seed: string, salt: string): number {
  const s = [...(seed + salt)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const profiles = [0.05, 0.15, 0.30, 0.50, 0.65, 0.80, 0.92, 1.0];
  return profiles[s % profiles.length];
}

/** Concrete work items for a given renovation. Same result across renders. */
export function workItemsFor(renId: string): WorkItem[] {
  const ren = RENOVATIONS.find((r) => r.id === renId);
  if (!ren) return [];
  const tpl = TEMPLATES[ren.type] ?? [];
  return tpl.map((t, i) => {
    const id = `${ren.id}-item-${i}`;
    if (t.mode === 'full') {
      const cost = Math.round(ren.goal * (t.costShare ?? 0.2) / 500) * 500;
      const raised = Math.round(cost * seededFraction(ren.id, id) / 100) * 100;
      return { id, name: t.name, nameTa: t.nameTa, mode: 'full', cost, raised };
    }
    const totalCost = Math.round(ren.goal * (t.unitTargetShare ?? 0.15));
    const totalUnits = Math.max(1, Math.ceil(totalCost / (t.unitCost ?? 1)));
    const unitsRaised = Math.floor(totalUnits * seededFraction(ren.id, id));
    const cost = totalUnits * (t.unitCost ?? 0);
    const raised = unitsRaised * (t.unitCost ?? 0);
    return {
      id, name: t.name, nameTa: t.nameTa, mode: 'bulk', cost, raised,
      unit: t.unit, unitTa: t.unitTa, unitCost: t.unitCost, totalUnits, unitsRaised,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Reward tiers (donor perks)
// ─────────────────────────────────────────────────────────────────────────────

export type RewardKey = 'certificate' | 'darshanPass' | 'namedArchana';

export interface Reward {
  key:       RewardKey;
  threshold: number;     // minimum amount (₹) that unlocks it
}

export const REWARDS: Reward[] = [
  { key: 'certificate',  threshold: 0     },
  { key: 'darshanPass',  threshold: 5000  },
  { key: 'namedArchana', threshold: 25000 },
];

export function rewardsFor(amount: number): Reward[] {
  return REWARDS.filter((r) => amount >= r.threshold);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Cities that have at least one active renovation, in the display order below. */
const CITY_ORDER = ['chennai', 'trichy', 'madurai', 'coimbatore', 'salem', 'tirunelveli'] as const;

export function citiesWithRenovations(): { id: Renovation['city']; count: number }[] {
  const counts = new Map<Renovation['city'], number>();
  RENOVATIONS.forEach((r) => counts.set(r.city, (counts.get(r.city) ?? 0) + 1));
  return CITY_ORDER
    .filter((id) => counts.has(id))
    .map((id) => ({ id, count: counts.get(id)! }));
}

export function renovationsByCity(cityId: Renovation['city'] | 'all'): Renovation[] {
  return cityId === 'all' ? RENOVATIONS : RENOVATIONS.filter((r) => r.city === cityId);
}

export function renovationById(id: string): Renovation | undefined {
  return RENOVATIONS.find((r) => r.id === id);
}

/** Format ₹ as short Indian units — 1234567 → "₹12.3L", 950 → "₹950". */
export function formatInrShort(n: number): string {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1) + 'Cr';
  if (n >= 100000)   return '₹' + (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1) + 'L';
  if (n >= 1000)     return '₹' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
  return '₹' + n.toLocaleString('en-IN');
}
