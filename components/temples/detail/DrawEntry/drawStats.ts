/**
 * Deterministic "live-looking" draw statistics for the front-end demo.
 * Same announcement id always returns the same numbers within a rendering
 * session — no randomness, no wall-clock drift, safe for SSR.
 *
 * When the WordPress backend lands, this file is the single seam to swap
 * for real counts.
 */

export interface DrawStats {
  passesAvailable: number;   // e.g. 500
  entriesSoFar:    number;   // e.g. 4,721
  oddsLabel:       string;   // e.g. "1 in 9"
}

function hash(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function drawStatsFor(announcementId: string): DrawStats {
  const h = hash(announcementId);
  // Passes: 300–800 in steps of 50, feels round and generous
  const passesAvailable = 300 + ((h % 11) * 50);
  // Entries so far: 8× to 22× passes — draw is competitive but not hopeless
  const entriesMultiplier = 8 + ((h >>> 8) % 15);
  const entriesSoFar = passesAvailable * entriesMultiplier + ((h >>> 12) % 137);
  // Odds as a "1 in N" label
  const n = Math.max(1, Math.round(entriesSoFar / passesAvailable));
  return {
    passesAvailable,
    entriesSoFar,
    oddsLabel: `1 in ${n}`,
  };
}

/**
 * Generate a deterministic-looking raffle entry code.
 * Six alphanumeric chars, uppercase, grouped as 3-3 (e.g. "R47-9B2").
 * Uses Date.now so each new entry gets a unique-looking code.
 */
export function generateEntryCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing 0/O/1/I
  const seed = Date.now();
  let code = '';
  let n = seed;
  for (let i = 0; i < 6; i++) {
    code += chars[n % chars.length];
    n = Math.floor(n / chars.length) + ((seed >>> (i * 3)) & 0xff);
  }
  return code.slice(0, 3) + '-' + code.slice(3);
}
