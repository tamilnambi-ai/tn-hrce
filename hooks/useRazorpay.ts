'use client';

/**
 * useRazorpay — loads the Razorpay checkout script once and exposes
 * openCheckout(), which creates an order, opens the modal, verifies
 * the payment server-side, and resolves with the final result.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ── Razorpay browser types ────────────────────────────────────────────────────
interface RazorpayPrefill {
  name?:    string;
  email?:   string;
  contact?: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

interface RazorpayOptions {
  key:          string;
  amount:       number | string;   // paise
  currency:     string;
  order_id:     string;
  name:         string;
  description:  string;
  prefill?:     RazorpayPrefill;
  theme?:       { color?: string };
  handler:      (response: RazorpayHandlerResponse) => void;
  modal?:       { ondismiss?: () => void };
}

interface RazorpayInstance {
  open():  void;
  close(): void;
}

declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => RazorpayInstance;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
export interface CheckoutParams {
  /** Amount in ₹ (whole rupees) */
  amount:       number;
  description:  string;
  /** Pre-fill the Razorpay modal */
  prefill?: {
    name?:    string;
    email?:   string;
    contact?: string;
  };
  /**
   * Extra key-value pairs forwarded to /api/payment/verify.
   * Include `type` ("booking" | "donation"), `email`, and all
   * receipt-rendering fields (templeName, poojaName, amountValue, …).
   */
  meta?: Record<string, string | undefined>;
}

export interface CheckoutResult {
  success:      boolean;
  referenceId?: string;
  error?:       string;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useRazorpay() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paying,       setPaying]       = useState(false);
  const loadedRef = useRef(false);

  // Load the Razorpay checkout script once
  useEffect(() => {
    if (loadedRef.current) return;
    if (typeof window === 'undefined') return;

    // Already injected by a prior render
    if (document.querySelector('script[data-razorpay]')) {
      setScriptLoaded(true);
      loadedRef.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.setAttribute('data-razorpay', 'true');
    script.onload  = () => { setScriptLoaded(true); loadedRef.current = true; };
    script.onerror = () => console.error('[useRazorpay] script failed to load');
    document.body.appendChild(script);
  }, []);

  const openCheckout = useCallback(
    async (params: CheckoutParams): Promise<CheckoutResult> => {
      if (!scriptLoaded || !window.Razorpay) {
        return { success: false, error: 'Razorpay checkout not loaded yet' };
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        return { success: false, error: 'NEXT_PUBLIC_RAZORPAY_KEY_ID not set' };
      }

      setPaying(true);

      try {
        // 1 — Create order on the server
        const orderRes = await fetch('/api/payment/create-order', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ amount: params.amount }),
        });

        if (!orderRes.ok) {
          const e = await orderRes.json().catch(() => ({}));
          return { success: false, error: (e as { error?: string }).error ?? 'order_creation_failed' };
        }

        const { orderId, amount, currency } = (await orderRes.json()) as {
          orderId: string; amount: number; currency: string;
        };

        // 2 — Open the checkout modal, wait for user
        return await new Promise<CheckoutResult>((resolve) => {
          const rzp = new window.Razorpay({
            key:         keyId,
            amount,
            currency,
            order_id:    orderId,
            name:        'Tamil Nadu HR&CE Portal',
            description: params.description,
            prefill:     params.prefill,
            theme:       { color: '#8B1A1A' },

            handler: async (response) => {
              // 3 — Verify payment + send email
              try {
                const verifyRes = await fetch('/api/payment/verify', {
                  method:  'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id:   response.razorpay_order_id,
                    razorpay_signature:  response.razorpay_signature,
                    ...(params.meta ?? {}),
                  }),
                });

                if (!verifyRes.ok) {
                  resolve({ success: false, error: 'verification_failed' });
                  return;
                }

                const data = (await verifyRes.json()) as { success: boolean; referenceId: string };
                resolve({ success: data.success, referenceId: data.referenceId });
              } catch {
                resolve({ success: false, error: 'network_error' });
              }
            },

            modal: {
              ondismiss: () => resolve({ success: false, error: 'cancelled' }),
            },
          });

          rzp.open();
        });
      } finally {
        setPaying(false);
      }
    },
    [scriptLoaded]
  );

  return { openCheckout, scriptLoaded, paying };
}
