'use client';

import { cn } from '@/lib/utils';

/**
 * Standard wrapper for a detail-page section.
 * The `id` on the wrapper is what the sticky nav's scrollspy watches.
 */
export default function SectionShell({
  id,
  title,
  children,
  taTitle = false,
  variant = 'default',
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  taTitle?: boolean;
  variant?: 'default' | 'plain' | 'accent';
}) {
  return (
    <section id={id} data-anchor className="scroll-mt-[140px]">
      <h2 className={cn(
        'text-[20px] md:text-[24px] font-bold tracking-tight mb-4',
        variant === 'accent' ? 'text-white' : 'text-[--color-text-primary]',
        taTitle && 'ta-text'
      )}>
        {title}
      </h2>
      {children}
    </section>
  );
}
