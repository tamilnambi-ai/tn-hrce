'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import type { Temple, TempleAnnouncement } from '@/data/temples';
import ChatShell from '@/components/chat/ChatShell';
import { useChatFlow } from '@/components/chat/useChatFlow';
import { buildDrawFlow, type DrawAnswers } from './drawFlow';
import RaffleTicket from './RaffleTicket';
import { drawStatsFor } from './drawStats';
import { cn } from '@/lib/utils';

/**
 * "Enter the Draw" modal.
 *
 * Single-pane layout (narrower than the Book Pooja modal — no service
 * picker), rendering the shared ChatShell with a 5-turn flow. On completion,
 * swaps to the RaffleTicket success screen.
 */
export default function DrawEntryModal({
  open,
  onClose,
  temple,
  announcement,
}: {
  open: boolean;
  onClose: () => void;
  temple: Temple;
  announcement: TempleAnnouncement | null;
}) {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const taClass = ta ? 'ta-text' : '';

  const [entryCode, setEntryCode] = useState<string | null>(null);

  const built = useMemo(() => {
    if (!announcement) return null;
    return buildDrawFlow({
      announcement,
      lang,
      onFinish: (code) => setEntryCode(code),
    });
  }, [announcement, lang]);

  const flow = useChatFlow({ turns: built?.turns ?? [] });

  // Reset when modal closes / re-opens
  useEffect(() => {
    if (!open) setEntryCode(null);
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !announcement || !built) return null;

  const templeName = ta ? (temple.nameTa ?? temple.name) : temple.name;
  const eventName  = ta ? (announcement.titleTa    ?? announcement.title)    : announcement.title;
  const dateLabel  = ta ? (announcement.dateTa     ?? announcement.date)     : announcement.date;
  const deadline   = ta ? (announcement.deadlineTa ?? announcement.deadline) : announcement.deadline;
  const stats = drawStatsFor(announcement.id);

  const answers = built.answers as DrawAnswers;
  const submittedAt = new Date().toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="draw-entry-title"
      className="fixed inset-0 z-[95] flex items-center justify-center p-2 md:p-4"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          'relative flex flex-col w-full max-w-[560px] h-[92vh] md:h-[720px]',
          'bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] overflow-hidden'
        )}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label={t(lang, 'bookPooja.closeModal')}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-[--color-site-name] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header — event banner (hidden after success to give the ticket room) */}
        {!entryCode && (
          <div
            className="relative px-4 py-3 border-b border-[--color-border] overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, #8B1A1A 0%, #a02020 100%)',
            }}
          >
            <div className="flex items-center gap-2 pr-10">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-[18px]">
                {announcement.emoji ?? '🪔'}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn('flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.22em] text-amber-200', taClass)}>
                  <Sparkles className="w-3 h-3" />
                  {ta ? 'அனுமதி குலுக்கல்' : 'Pass Draw'}
                </div>
                <h2 id="draw-entry-title" className={cn('text-[14px] font-bold text-white leading-tight truncate mt-0.5', taClass)}>
                  {eventName}
                </h2>
                <div className={cn('flex items-center gap-3 text-[11px] text-white/80 mt-0.5', taClass)}>
                  <span className="font-semibold">{dateLabel}</span>
                  {deadline && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 min-h-0 flex flex-col bg-white">
          {entryCode && announcement ? (
            <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 flex items-start justify-center">
              <RaffleTicket
                ta={ta}
                templeName={templeName}
                eventName={eventName}
                entryCode={entryCode}
                entrantName={answers.devoteeName ?? '—'}
                drawDate={dateLabel}
                submittedAt={submittedAt}
                stats={{
                  entriesSoFar: stats.entriesSoFar + 1, // include this entry
                  oddsLabel:    stats.oddsLabel,
                }}
                labels={{
                  congrats:       ta ? 'நுழைவு உறுதி செய்யப்பட்டது' : 'You\'re in the draw',
                  subline:        ta
                    ? 'வெற்றி பெற்றால், நிகழ்வுக்கு 48 மணி நேரம் முன் SMS மற்றும் மின்னஞ்சல் மூலம் தெரிவிக்கப்படும்.'
                    : 'If you win, we\'ll notify you by SMS and email 48 hours before the event. Keep this code safe.',
                  entryNoLabel:   ta ? 'நுழைவு எண்' : 'Entry No.',
                  eventLabel:     ta ? 'நிகழ்வு'    : 'Event',
                  forLabel:       ta ? 'நபர்'       : 'For',
                  submittedLabel: ta ? 'பதிவு நேரம்' : 'Submitted',
                  yourPosition:   ta ? 'உங்கள் இடம்'   : 'Your position',
                  yourOdds:       ta ? 'வெற்றி வாய்ப்பு' : 'Win chance',
                  notifyHint:     ta
                    ? 'வெற்றி பெற்றால் SMS + மின்னஞ்சல் மூலம் அறிவிக்கப்படும்.'
                    : 'Winners notified by SMS + email.',
                  copy:           ta ? 'நகல்' : 'Copy',
                  share:          ta ? 'பகிர்' : 'Share',
                  copied:         ta ? 'நகலெடுக்கப்பட்டது ✓' : 'Copied ✓',
                  close:          ta ? 'மூடு' : 'Done',
                }}
                onClose={onClose}
              />
            </div>
          ) : (
            <ChatShell
              posted={flow.posted}
              currentTurn={flow.currentTurn}
              onSubmit={flow.advance}
              onSkip={flow.skip}
              totalTurns={built.turns.length}
              currentIndex={flow.index}
              isComplete={flow.isComplete}
              bilingualClass={taClass}
              progressLabel={t(lang, 'bookPooja.progress', {
                n: Math.min(flow.index + 1, built.turns.length),
                total: built.turns.length,
              })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
