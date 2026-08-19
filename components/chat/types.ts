// Generic chat-runtime types. Any agent/flow inside the app can plug into this.

import type React from 'react';

// A single turn shown as a bot message. When it needs input, that input
// is rendered *inside* the bot's message via `renderInput` — this is what
// gives the flow its conversational feel.
export interface ChatTurn {
  id: string;
  message:    string | React.ReactNode;      // bot text (i18n-resolved by caller)
  optional?:  boolean;                       // shows a "Skip for now" chip
  // Called when the user has supplied input. Return the string(s) to echo
  // back as a user message. Return null to suppress echo.
  renderInput?: (opts: {
    onSubmit: (value: unknown, echo?: string) => void;
    onSkip?: () => void;
  }) => React.ReactNode;
  // Terminal turns (summary, success) skip the input control.
  terminal?: boolean;
  // Hero turns render full-width without the bot bubble wrapper —
  // used for the welcome / kick-off screen.
  hero?: boolean;
}

// A message that has already been posted to the transcript.
export type PostedMessage =
  | { kind: 'bot';  id: string; content: string | React.ReactNode }
  | { kind: 'user'; id: string; content: string };

export interface ChatAnswers { [turnId: string]: unknown }
