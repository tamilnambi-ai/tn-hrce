'use client';

import { useCallback, useMemo, useState } from 'react';
import type { ChatAnswers, ChatTurn, PostedMessage } from './types';

/**
 * Drives a scripted chat flow. Deterministic: turns are provided as a list,
 * and the runtime walks through them one at a time.
 *
 * A "turn" gets rendered as a bot message with (optionally) an inline input.
 * When the user submits, the answer is recorded, an optional user-message
 * echo is posted, and the runtime advances.
 */
export function useChatFlow({
  turns,
  onComplete,
}: {
  turns: ChatTurn[];
  onComplete?: (answers: ChatAnswers) => void;
}) {
  const [index,   setIndex]   = useState(0);
  const [answers, setAnswers] = useState<ChatAnswers>({});
  const [posted,  setPosted]  = useState<PostedMessage[]>([]);

  const currentTurn: ChatTurn | undefined = turns[index];
  const isComplete = index >= turns.length;

  // Push the current bot message the first time we see this index
  const currentPostedIds = useMemo(() => new Set(posted.map((p) => p.id)), [posted]);
  const pendingBotId = currentTurn ? `bot-${currentTurn.id}` : null;
  const shouldPostBot = pendingBotId && !currentPostedIds.has(pendingBotId);

  const advance = useCallback((value: unknown, echo?: string) => {
    const t = turns[index];
    if (!t) return;
    setAnswers((a) => ({ ...a, [t.id]: value }));
    setPosted((p) => {
      const next = [...p];
      // Ensure bot message is there
      if (!next.find((m) => m.id === `bot-${t.id}`)) {
        next.push({ kind: 'bot', id: `bot-${t.id}`, content: t.message });
      }
      if (echo) next.push({ kind: 'user', id: `user-${t.id}`, content: echo });
      return next;
    });
    setIndex((i) => i + 1);
  }, [index, turns]);

  const skip = useCallback(() => {
    const t = turns[index];
    if (!t) return;
    setAnswers((a) => ({ ...a, [t.id]: null }));
    setPosted((p) => {
      const next = [...p];
      if (!next.find((m) => m.id === `bot-${t.id}`)) {
        next.push({ kind: 'bot', id: `bot-${t.id}`, content: t.message });
      }
      next.push({ kind: 'user', id: `user-${t.id}`, content: '— skipped —' });
      return next;
    });
    setIndex((i) => i + 1);
  }, [index, turns]);

  // Fire completion callback once we've walked past the last turn
  // (using ref-style effect via useMemo trick avoided; caller can key on isComplete)

  return {
    turns,
    index,
    currentTurn,
    isComplete,
    answers,
    posted,
    shouldPostBot,
    advance,
    skip,
    fireComplete: () => onComplete?.(answers),
  };
}
