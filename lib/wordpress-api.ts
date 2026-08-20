/**
 * lib/wordpress-api.ts
 *
 * Fetches live content from the WordPress REST API.
 * Falls back to static data automatically if WordPress is unreachable
 * (e.g. LocalWP not running, or during Vercel build without WP online).
 *
 * Set NEXT_PUBLIC_WP_API_URL in .env.local to point at your WordPress install.
 */

import { temples  as staticTemples  } from '@/data/temples';
import { events   as staticEvents   } from '@/data/events';
import { tourPackages as staticPackages } from '@/data/tourPackages';
import type { Temple }       from '@/data/temples';
import type { TempleEvent }  from '@/data/events';
import type { TourPackage }  from '@/data/tourPackages';

const WP_API =
  process.env.NEXT_PUBLIC_WP_API_URL ?? 'http://hrce.local/wp-json/wp/v2';

// ── shared fetch helper ────────────────────────────────────────────────────
async function wpFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_API}${path}`, {
    next: { revalidate: 3600 },   // ISR: re-fetch at most once per hour
  });
  if (!res.ok) throw new Error(`WordPress API ${res.status} — ${path}`);
  return res.json() as Promise<T>;
}

// ── Unsplash fallback pool (when WP featured image is not set) ────────────
// Verified gopuram / South Indian temple photos from Unsplash
const UNSPLASH_POOL = [
  'photo-1768406091087-7fb0d03f6064',  // ornate Hindu gopuram, colorful deities
  'photo-1762966160822-556deeff018d',  // ornate temple tower with carvings
  'photo-1778385924133-4f9987da2aa7',  // temple tower against bright sky
  'photo-1705723116788-d11fa6e3f415',  // tall white temple with statues
  'photo-1693205118032-9382f7267f55',  // tall tower with statue near water
  'photo-1674981324574-a0ebb0bef50d',  // temple tank & tower
  'photo-1671095149873-c982e19e4240',  // large stone structure with carvings
  'photo-1595165989697-6c57f7536758',  // gold temple under blue sky
  'photo-1638896228901-1555f5e74280',  // very tall white temple
  'photo-1632962237468-0705d7e7b534',  // stone temple with horse carving
  'photo-1693139984941-f795cb5391ca',  // tall temple tower with clock
  'photo-1693206657625-43c508182c6d',  // tall temple tower
  'photo-1723263555706-aadc8555f3bb',  // very tall temple building
];

const unsplashFallback = (index: number, w = 800, h = 600) => {
  const id = UNSPLASH_POOL[index % UNSPLASH_POOL.length];
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
};

// ── raw WP response shapes ─────────────────────────────────────────────────
interface WPTemple {
  id:                  number;
  slug:                string;
  title:               { rendered: string };
  featured_media:      number;
  acf: {
    city:              string;
    deity:             string;
    area:              string;
    description:       string;
  };
}

interface WPEvent {
  slug:                string;
  title:               { rendered: string };
  featured_image_url:  string | null;
  acf: {
    hrce_event_temple:      string;
    hrce_event_area:        string;
    hrce_event_date_label:  string;
    hrce_event_time_label:  string;
    hrce_event_badge:       string;
    hrce_event_description: string;
  };
}

interface WPPackage {
  slug:                string;
  title:               { rendered: string };
  featured_image_url:  string | null;
  acf: {
    hrce_pkg_duration:     string;
    hrce_pkg_temple_count: string;
    hrce_pkg_price_label:  string;
    hrce_pkg_highlights:   string[];  // array of names, pre-flattened in plugin
  };
}

// ── public API ─────────────────────────────────────────────────────────────

export async function fetchTemples(limit = 20): Promise<Temple[]> {
  try {
    const posts = await wpFetch<WPTemple[]>(
      `/temples?per_page=${limit}&orderby=date&order=desc`
    );
    return posts.map((p, i) => ({
      id:           p.slug,
      name:         p.title.rendered,
      area:         p.acf?.area         ?? '',
      city:         p.acf?.city         ?? 'Chennai',
      pincode:      '', // Not in our CPT yet
      imageUrl:     unsplashFallback(i),
      gradientFrom: '#8B1A1A',
      gradientTo:   '#5A1010',
    }));
  } catch (err) {
    console.warn('[HRCE] WordPress unavailable — using static temple data:', err);
    return staticTemples.slice(0, limit);
  }
}

export async function fetchTempleBySlug(slug: string): Promise<Temple | null> {
  try {
    const posts = await wpFetch<WPTemple[]>(
      `/temples?slug=${slug}&per_page=1`
    );
    if (!posts || posts.length === 0) return null;

    const p = posts[0];
    return {
      id:           p.slug,
      name:         p.title.rendered,
      area:         p.acf?.area         ?? '',
      city:         p.acf?.city         ?? 'Chennai',
      pincode:      '', // Not in our CPT yet
      imageUrl:     unsplashFallback(0),
      gradientFrom: '#8B1A1A',
      gradientTo:   '#5A1010',
    };
  } catch (err) {
    console.warn('[HRCE] WordPress unavailable for temple slug:', slug, err);
    return null;
  }
}

export async function fetchEvents(limit = 3): Promise<TempleEvent[]> {
  try {
    const posts = await wpFetch<WPEvent[]>(
      `/hrce_event?per_page=${limit}&orderby=menu_order&order=asc`
    );
    return posts.map((p, i) => ({
      id:               p.slug,
      title:            p.title.rendered,
      templeShortName:  p.acf?.hrce_event_temple      ?? '',
      area:             p.acf?.hrce_event_area         ?? '',
      city:             (p.acf as { hrce_event_city?: string })?.hrce_event_city ?? 'chennai',
      dateLabel:        p.acf?.hrce_event_date_label   ?? '',
      timeLabel:        p.acf?.hrce_event_time_label   ?? '',
      description:      p.acf?.hrce_event_description  ?? '',
      badgeLabel:       p.acf?.hrce_event_badge        ?? '',
      imageUrl:         p.featured_image_url ?? unsplashFallback(i + 5, 800),
      gradientFrom:     '#1A3E6B',
      gradientTo:       '#0A2040',
    }));
  } catch (err) {
    console.warn('[HRCE] WordPress unavailable — using static event data:', err);
    return staticEvents.slice(0, limit);
  }
}

export async function fetchPackages(limit = 3): Promise<TourPackage[]> {
  try {
    const posts = await wpFetch<WPPackage[]>(
      `/hrce_package?per_page=${limit}&orderby=menu_order&order=asc`
    );
    return posts.map((p, i) => ({
      id:           p.slug,
      name:         p.title.rendered,
      city:         (p.acf as { hrce_pkg_city?: string })?.hrce_pkg_city ?? 'chennai',
      duration:     p.acf?.hrce_pkg_duration     ?? '',
      templeCount:  Number(p.acf?.hrce_pkg_temple_count ?? 0),
      priceLabel:   p.acf?.hrce_pkg_price_label  ?? '',
      highlights:   Array.isArray(p.acf?.hrce_pkg_highlights)
                    ? p.acf.hrce_pkg_highlights
                    : [],
      imageUrl:     p.featured_image_url ?? unsplashFallback(i + 10, 800),
      gradientFrom: '#8B3208',
      gradientTo:   '#5A1E05',
    }));
  } catch (err) {
    console.warn('[HRCE] WordPress unavailable — using static package data:', err);
    return staticPackages.slice(0, limit);
  }
}
