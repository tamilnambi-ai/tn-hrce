'use client';

import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatTurn, PostedMessage } from './types';

/**
 * Generic chat container. Renders posted messages + the active turn's
 * inline input control (if any). Auto-scrolls to bottom on new messages.
 */
export default function ChatShell({
  header,
  posted,
  currentTurn,
  onSubmit,
  onSkip,
  totalTurns,
  currentIndex,
  isComplete,
  bilingualClass,
  progressLabel,
}: {
  header?: React.ReactNode;
  posted: PostedMessage[];
  currentTurn?: ChatTurn;
  onSubmit: (value: unknown, echo?: string) => void;
  onSkip: () => void;
  totalTurns: number;
  currentIndex: number;
  isComplete: boolean;
  bilingualClass?: string;
  progressLabel?: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [posted.length, currentTurn?.id]);

  // Progress dots
  const dots = Array.from({ length: totalTurns }).map((_, i) => (
    <span
      key={i}
      className={cn(
        'inline-block rounded-full transition-all',
        i < currentIndex ? 'w-1.5 h-1.5 bg-[--color-site-name]'
          : i === currentIndex ? 'w-3 h-1.5 bg-[--color-site-name]'
          : 'w-1.5 h-1.5 bg-neutral-300'
      )}
    />
  ));

  // The pending bot message for the current turn (not yet in `posted`)
  const showPendingBot = currentTurn && !posted.find((p) => p.id === `bot-${currentTurn.id}`);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Top strip: header + progress. Extra right padding leaves room
          for an absolutely-positioned modal close button (see BookPoojaModal). */}
      <div className="flex-shrink-0 px-5 pr-14 py-3 border-b border-[--color-border] flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">{header}</div>
        {!isComplete && totalTurns > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">{dots}</div>
            {progressLabel && (
              <span className={cn('text-[11px] font-semibold text-[--color-text-secondary]', bilingualClass)}>
                {progressLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Scrollable transcript */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3 bg-neutral-50/40">
        {posted.map((m) => (
          <Bubble key={m.id} kind={m.kind} bilingualClass={bilingualClass}>
            {m.content}
          </Bubble>
        ))}

        {showPendingBot && (
          currentTurn.hero ? (
            // Hero turn — render the message JSX full-width, no avatar/bubble
            <div>{currentTurn.message}</div>
          ) : (
            <Bubble kind="bot" bilingualClass={bilingualClass}>
              {currentTurn.message}
            </Bubble>
          )
        )}

        {/* Inline input for the current turn */}
        {!isComplete && currentTurn?.renderInput && (
          <div className={currentTurn.hero ? '' : 'pl-11'}>
            {currentTurn.renderInput({ onSubmit, onSkip })}
          </div>
        )}

        {/* Terminal turn (summary/success) — no input, just the message */}
        {!isComplete && currentTurn?.terminal && (
          <div className="h-2" />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function Bubble({
  kind,
  children,
  bilingualClass,
}: {
  kind: 'bot' | 'user';
  children: React.ReactNode;
  bilingualClass?: string;
}) {
  const isBot = kind === 'bot';
  return (
    <div className={cn('flex items-start gap-2', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-[--color-site-name] flex items-center justify-center flex-shrink-0 text-white">
          <Bot className="w-4 h-4" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed',
          isBot
            ? 'bg-white border border-[--color-border] text-[--color-text-primary] rounded-tl-sm'
            : 'bg-[--color-site-name] text-white rounded-tr-sm',
          bilingualClass
        )}
      >
        {children}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-600">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
