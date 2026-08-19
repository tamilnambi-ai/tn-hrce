/**
 * HTML email templates for booking confirmations and donation receipts.
 * Plain-HTML strings — no react-email dependency needed.
 * All amounts should be pre-formatted (e.g. "₹501") before passing in.
 */

// ── Shared helpers ────────────────────────────────────────────────────────────

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;font-size:12px;font-weight:600;
                 text-transform:uppercase;letter-spacing:0.05em;
                 color:#6B7280;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827;">${value}</td>
    </tr>`;
}

function wrapper(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TN HR&amp;CE Portal</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="580" cellpadding="0" cellspacing="0" border="0"
               style="max-width:580px;width:100%;background:#FFFFFF;border-radius:16px;
                      overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          ${body}
          <!-- Footer -->
          <tr><td style="padding:20px 32px;background:#F9FAFB;border-top:1px solid #E5E7EB;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;">
              Tamil Nadu Hindu Religious &amp; Charitable Endowments Department<br/>
              This is an automated message — please do not reply to this email.
            </p>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function header(title: string, subtitle: string) {
  return `
  <tr>
    <td style="background:linear-gradient(135deg,#8B1A1A,#A02818);
               padding:28px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:0.15em;color:#FCD34D;">
        Tamil Nadu HR&amp;CE
      </p>
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#FFFFFF;">${title}</h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">${subtitle}</p>
    </td>
  </tr>`;
}

// ── Booking confirmation ───────────────────────────────────────────────────────

export interface BookingEmailParams {
  referenceId:  string;
  templeName:   string;
  poojaName:    string;
  devoteeName:  string;
  dateValue:    string;
  timeValue?:   string;
  passesValue?: string;
  amountValue:  string;
  bookedAt:     string;
  isGroup?:     boolean; // true = Darshan / Sannathi
}

export function bookingConfirmationEmail(p: BookingEmailParams): string {
  const typeLabel = p.isGroup ? 'Darshan Booking' : 'Pooja Booking';
  const rows = [
    row('Temple',       p.templeName),
    row(p.isGroup ? 'Entrance' : 'Pooja', p.poojaName),
    row('Date',         p.dateValue),
    ...(p.timeValue    ? [row('Time',    p.timeValue)]    : []),
    ...(p.isGroup
      ? [row('Devotee', p.devoteeName), ...(p.passesValue ? [row('Passes', p.passesValue)] : [])]
      : [row('Devotee', p.devoteeName)]),
    row('Amount Paid',  `<span style="font-size:16px;font-weight:800;color:#8B1A1A;">${p.amountValue}</span>`),
    row('Booked On',    p.bookedAt),
  ].join('');

  return wrapper(`
    ${header(`${typeLabel} Confirmed`, 'Your booking is confirmed. Show this at the temple entrance.')}
    <!-- Reference badge -->
    <tr><td style="padding:24px 32px 8px;">
      <div style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;
                  padding:12px 16px;display:inline-block;">
        <p style="margin:0;font-size:11px;font-weight:700;color:#92400E;
                  text-transform:uppercase;letter-spacing:0.1em;">Booking Reference</p>
        <p style="margin:4px 0 0;font-family:monospace;font-size:16px;
                  font-weight:800;color:#1F2937;letter-spacing:0.08em;">${p.referenceId}</p>
      </div>
    </td></tr>
    <!-- Details -->
    <tr><td style="padding:8px 32px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${rows}
      </table>
      <hr style="border:none;border-top:1px dashed #E5E7EB;margin:16px 0;" />
      <p style="margin:0;font-size:11px;color:#9CA3AF;line-height:1.6;">
        Please carry a valid government photo ID that matches the name on this booking.
        Arrive 15 minutes before your booked slot.
      </p>
    </td></tr>
  `);
}

// ── Donation receipt ───────────────────────────────────────────────────────────

export interface DonationEmailParams {
  referenceId:  string;
  donorName:    string;
  templeName:   string;
  purpose:      string;   // e.g. "Gopuram Renovation — Sponsoring: Painting"
  amountValue:  string;
  donatedAt:    string;
  rewardsNote?: string;   // e.g. "Darshan pass + certificate will be sent when work is complete"
}

export function donationReceiptEmail(p: DonationEmailParams): string {
  const rows = [
    row('Donor',      p.donorName),
    row('Temple',     p.templeName),
    row('Purpose',    p.purpose),
    row('Amount',     `<span style="font-size:16px;font-weight:800;color:#059669;">${p.amountValue}</span>`),
    row('Date',       p.donatedAt),
    row('Reference',  `<span style="font-family:monospace;font-weight:700;">${p.referenceId}</span>`),
  ].join('');

  return wrapper(`
    ${header('Donation Received', 'Thank you for supporting Tamil Nadu\'s temple heritage.')}
    <tr><td style="padding:24px 32px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${rows}
      </table>
      ${p.rewardsNote ? `
      <div style="margin-top:16px;background:#ECFDF5;border:1px solid #A7F3D0;
                  border-radius:8px;padding:12px 16px;">
        <p style="margin:0;font-size:12px;color:#065F46;font-weight:600;">🎁 Your rewards</p>
        <p style="margin:4px 0 0;font-size:12px;color:#047857;">${p.rewardsNote}</p>
      </div>` : ''}
      <hr style="border:none;border-top:1px dashed #E5E7EB;margin:16px 0;" />
      <p style="margin:0;font-size:11px;color:#9CA3AF;line-height:1.6;">
        This receipt can be used for your personal records. 80G tax exemption certificates
        are issued directly by the temple trust — contact the temple office for details.
      </p>
    </td></tr>
  `);
}
