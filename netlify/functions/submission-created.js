// Triggered by Netlify whenever the "rsvp" form is submitted.
// Requires: RESEND_API_KEY set in Netlify → Site configuration → Environment variables.
// Get a free key at https://resend.com (no credit card, 3 000 emails/month).
//
// NOTE: Without a verified sending domain, Resend only delivers to the email
// address you used when signing up. Add your domain at resend.com/domains
// to unlock delivery to guests.

import https from 'https';

const COUPLE_EMAIL = 'vkchundi@gmail.com';
const COUPLE_NAME  = 'Vamsikrishna & Meenakshi';
const SITE_URL     = 'https://vamsiwedsmeena.netlify.app';

const MAROON   = '#5A0E0E';
const GOLD     = '#C9962E';
const IVORY    = '#FFF8EE';
const TURMERIC = '#FDE9C8';

/* ── send via Resend REST API (Node https, no npm needed) ── */
function sendEmail({ to, toName, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.error('[rsvp-notify] RESEND_API_KEY not set'); return Promise.resolve(); }

  const body = JSON.stringify({
    from: `${COUPLE_NAME} <onboarding@resend.dev>`,
    to:   [`${toName} <${to}>`],
    reply_to: COUPLE_EMAIL,
    subject,
    html,
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.resend.com',
      path:     '/emails',
      method:   'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('[rsvp-notify] sent to', to, '- status', res.statusCode);
          resolve();
        } else {
          console.error('[rsvp-notify] Resend error', res.statusCode, data);
          resolve(); // don't crash the function
        }
      });
    });
    req.on('error', err => { console.error('[rsvp-notify] request error', err); resolve(); });
    req.write(body);
    req.end();
  });
}

/* ── HTML email: notification to the couple ── */
function ownerHtml(data) {
  const attending = (data.attending || '').toLowerCase();
  const badge = attending === 'yes'
    ? `<span style="background:#3D6B4F;color:#fff;padding:4px 14px;border-radius:20px;font-size:13px;">✓ Attending</span>`
    : `<span style="background:#8B1A1A;color:#fff;padding:4px 14px;border-radius:20px;font-size:13px;">✗ Not Attending</span>`;

  const rows = [
    ['Full Name',        data.name   || '—'],
    ['Email',            data.email  || '—'],
    ['Number of Guests', data.guests || '—'],
    ['Attending',        attending === 'yes' ? 'Yes ✓' : 'No ✗'],
    ...(data.message ? [['Message', data.message]] : []),
  ].map(([label, val]) => `
    <tr>
      <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${GOLD};font-family:Arial,sans-serif;width:36%;border-bottom:1px solid rgba(201,150,46,0.15);">${label}</td>
      <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,0.15);">${val}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${IVORY};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <tr><td style="background:linear-gradient(135deg,${MAROON},#3D0C0C);padding:28px 36px;text-align:center;">
    <p style="margin:0 0 4px;color:${GOLD};font-size:12px;letter-spacing:2px;text-transform:uppercase;">New RSVP Received</p>
    <h1 style="margin:0;color:#FDE9C8;font-size:26px;font-weight:normal;">Vamsi &amp; Meena</h1>
    <p style="margin:6px 0 0;color:rgba(253,233,200,.7);font-size:13px;">August 16, 2026 · Hindu Temple of The Woodlands</p>
  </td></tr>
  <tr><td style="padding:22px 36px 6px;text-align:center;">${badge}</td></tr>
  <tr><td style="padding:16px 36px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,150,46,.25);border-radius:8px;overflow:hidden;">
      ${rows}
    </table>
  </td></tr>
  <tr><td style="background:${TURMERIC};padding:14px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <a href="${SITE_URL}" style="font-size:12px;color:${MAROON};">${SITE_URL}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── HTML email: thank-you / we'll-miss-you to the guest ── */
function guestHtml(name, attending) {
  const firstName = (name || 'Friend').trim().split(' ')[0];

  if (attending !== 'yes') {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${IVORY};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <tr><td style="background:linear-gradient(135deg,${MAROON},#3D0C0C);padding:32px 36px;text-align:center;">
    <h1 style="margin:0 0 6px;color:${GOLD};font-size:28px;font-weight:normal;">Vamsi &amp; Meena</h1>
    <p style="margin:0;color:rgba(253,233,200,.8);font-size:14px;">August 16, 2026</p>
  </td></tr>
  <tr><td style="padding:36px 40px;text-align:center;">
    <p style="font-size:18px;color:${MAROON};margin:0 0 18px;">Dear ${firstName},</p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 18px;">Thank you for letting us know. We'll truly miss having you there, but we're so grateful for your love and blessings from afar.</p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0;">With lots of love,<br><strong style="color:${MAROON};">Vamsikrishna &amp; Meenakshi 💛</strong></p>
  </td></tr>
  <tr><td style="background:${TURMERIC};padding:14px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <p style="margin:0;font-size:12px;color:#8B1A1A;opacity:.7;">Hindu Temple of The Woodlands · Houston, Texas</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
  }

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${IVORY};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <tr><td style="background:linear-gradient(135deg,${MAROON},#3D0C0C);padding:32px 36px;text-align:center;">
    <p style="margin:0 0 6px;color:${GOLD};font-size:12px;letter-spacing:2px;text-transform:uppercase;">You're coming!</p>
    <h1 style="margin:0 0 6px;color:#FDE9C8;font-size:30px;font-weight:normal;">Vamsi &amp; Meena</h1>
    <p style="margin:0;color:rgba(253,233,200,.75);font-size:14px;">August 16, 2026 · Hindu Temple of The Woodlands</p>
  </td></tr>
  <tr><td style="padding:36px 40px;">
    <p style="font-size:18px;color:${MAROON};margin:0 0 20px;">Dear ${firstName},</p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 16px;">Thank you so much for your RSVP — it truly made our day to know you'll be joining us as we begin this beautiful new chapter together.</p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 28px;">With the blessings of Lord Ganesha and Lord Venkateswara, and the love of our families and friends, we know it will be a day to remember.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${TURMERIC};border-radius:10px;border:1px solid rgba(201,150,46,.3);margin-bottom:28px;">
      <tr><td style="padding:22px 24px;">
        <p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};font-family:Arial,sans-serif;">Event Details</p>
        <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📅 <strong>Sunday, August 16, 2026</strong></p>
        <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">🕗 Ceremony at <strong>8:00 AM</strong> · Muhurtham at <strong>9:25 AM</strong></p>
        <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">🍛 Lunch from <strong>12:00 PM</strong></p>
        <p style="margin:0;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📍 <strong>Hindu Temple of The Woodlands</strong>, Houston, TX</p>
      </td></tr>
    </table>
    <p style="font-size:14px;color:#3D0C0C;line-height:1.8;margin:0 0 24px;">For any questions, please reach out to our friend <strong>Venukumar Nadimpalli</strong> at <a href="tel:+14099806777" style="color:${MAROON};">+1 (409) 980-6777</a>.</p>
    <p style="font-size:15px;color:#3D0C0C;text-align:center;margin:0;">With heartfelt gratitude,<br><strong style="font-size:18px;color:${MAROON};">Vamsikrishna &amp; Meenakshi 💛</strong></p>
  </td></tr>
  <tr><td style="background:${TURMERIC};padding:16px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <p style="margin:0 0 4px;font-size:12px;color:#8B1A1A;opacity:.7;">Visit the wedding website for directions, live stream &amp; more</p>
    <a href="${SITE_URL}" style="font-size:13px;color:${MAROON};font-weight:bold;">${SITE_URL}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── Lambda handler ── */
export const handler = async function(event) {
  console.log('[rsvp-notify] function fired, body length:', (event.body || '').length);

  let payload;
  try {
    const parsed = JSON.parse(event.body || '{}');
    payload = parsed.payload || {};
  } catch (e) {
    console.error('[rsvp-notify] JSON parse error:', e.message);
    return { statusCode: 200 };
  }

  const data      = payload.data      || {};
  const guestName = (data.name        || 'Guest').trim();
  const guestMail = (data.email       || '').trim();
  const attending = (data.attending   || '').toLowerCase();

  console.log('[rsvp-notify] guest:', guestName, '| attending:', attending, '| email:', guestMail || '(none)');

  const tasks = [
    sendEmail({
      to:      COUPLE_EMAIL,
      toName:  COUPLE_NAME,
      subject: `New RSVP — ${guestName} (${attending === 'yes' ? 'Attending ✓' : 'Not attending'})`,
      html:    ownerHtml(data),
    }),
  ];

  if (guestMail) {
    tasks.push(sendEmail({
      to:      guestMail,
      toName:  guestName,
      subject: attending === 'yes'
        ? "Thank You for Your RSVP — We Can't Wait to Celebrate With You! 💛"
        : 'Thank You for Letting Us Know — Vamsi & Meena',
      html:    guestHtml(guestName, attending),
    }));
  }

  await Promise.all(tasks);
  console.log('[rsvp-notify] done');
  return { statusCode: 200 };
};
