import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getResend, FROM_EMAIL } from '@/lib/resend';
import { bookingConfirmationEmail, donationReceiptEmail } from '@/lib/emailTemplates';
import type { BookingEmailParams, DonationEmailParams } from '@/lib/emailTemplates';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, string>;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, type, email } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'missing_payment_fields' }, { status: 400 });
    }

    // ── Signature verification ──────────────────────────────────────────────
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'server_config_error' }, { status: 500 });
    }

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
    }

    // Use the Razorpay payment ID as our reference
    const referenceId = razorpay_payment_id;
    const now = new Date().toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: 'Asia/Kolkata',
    });

    // ── Send email ──────────────────────────────────────────────────────────
    if (email) {
      try {
        let html: string;
        let subject: string;

        if (type === 'donation') {
          const params: DonationEmailParams = {
            referenceId,
            donorName:   body.donorName   ?? 'Devotee',
            templeName:  body.templeName  ?? 'Tamil Nadu Temple',
            purpose:     body.purpose     ?? 'Temple Upkeep',
            amountValue: body.amountValue ?? '—',
            donatedAt:   now,
            rewardsNote: body.rewardsNote,
          };
          html    = donationReceiptEmail(params);
          subject = 'Donation Received — TN HR&CE Portal';
        } else {
          // booking (pooja or darshan)
          const params: BookingEmailParams = {
            referenceId,
            templeName:   body.templeName   ?? 'Tamil Nadu Temple',
            poojaName:    body.poojaName    ?? 'Pooja',
            devoteeName:  body.devoteeName  ?? 'Devotee',
            dateValue:    body.dateValue    ?? '—',
            timeValue:    body.timeValue,
            passesValue:  body.passesValue,
            amountValue:  body.amountValue  ?? '—',
            bookedAt:     now,
            isGroup:      body.isGroup === 'true',
          };
          html    = bookingConfirmationEmail(params);
          subject = 'Booking Confirmed — TN HR&CE Portal';
        }

        await getResend().emails.send({ from: FROM_EMAIL, to: [email], subject, html });
      } catch (emailErr) {
        // Log but don't fail the payment — money already moved
        console.error('[verify] email send failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true, referenceId });
  } catch (err) {
    console.error('[verify]', err);
    return NextResponse.json({ error: 'verification_failed' }, { status: 500 });
  }
}
