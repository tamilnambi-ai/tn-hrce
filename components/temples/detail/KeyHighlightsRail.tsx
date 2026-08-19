'use client';

import DonationCard from './DonationCard';

/**
 * Right rail on the temple detail page.
 *
 * Currently a single sticky donation panel — the accommodation card was
 * promoted into a full section in the page body, and the "Key Highlights"
 * heading was removed so the donation card aligns to the top of the left
 * column.
 */
export default function KeyHighlightsRail({ templeName }: { templeName: string }) {
  return (
    <div className="sticky top-[144px]">
      <DonationCard templeName={templeName} />
    </div>
  );
}
