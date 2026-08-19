/**
 * Server-only: Razorpay Node SDK instance.
 * Import this only from API routes, never from client components.
 *
 * Lazy: the instance is created on first use so build-time static
 * analysis doesn't error when the env vars aren't set yet.
 */
import Razorpay from 'razorpay';

let _instance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!_instance) {
    const key_id     = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error(
        'Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env vars. ' +
        'Copy .env.local.example → .env.local and fill in your test keys.'
      );
    }
    _instance = new Razorpay({ key_id, key_secret });
  }
  return _instance;
}
