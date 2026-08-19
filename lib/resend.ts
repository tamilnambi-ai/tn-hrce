/**
 * Server-only: Resend email client instance.
 * Import this only from API routes, never from client components.
 *
 * Lazy: the client is created on first use so build-time static
 * analysis doesn't error when RESEND_API_KEY isn't set yet.
 */
import { Resend } from 'resend';

let _client: Resend | null = null;

export function getResend(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error(
        'Missing RESEND_API_KEY env var. ' +
        'Get one from https://resend.com/api-keys and add it to .env.local.'
      );
    }
    _client = new Resend(key);
  }
  return _client;
}

/**
 * Until you verify a domain in Resend, test sends can only go to the address
 * that owns the Resend account. Replace with your verified domain once live.
 */
export const FROM_EMAIL = 'TN HR&CE Portal <onboarding@resend.dev>';
