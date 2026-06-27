// Triggered automatically by Netlify whenever a form with data-netlify="true" is submitted.
// Sends two emails via Resend:
//   1. A nicely formatted notification to the couple.
//   2. A thank-you confirmation to the guest (if attending = yes).
//
// Setup: add RESEND_API_KEY to Netlify → Site settings → Environment variables.
// Get a free key at https://resend.com (no credit card, 3 000 emails/month free).

const COUPLE_EMAIL   = 'vkchundi@gmail.com';
const COUPLE_NAME    = 'Vamsikrishna & Meenakshi';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Colour palette matching the wedding site
const MAROON  = '#5A0E0E';
const GOLD    = '#C9962E';
const IVORY   = '#FFF8EE';
const TURMERIC= '#FDE9C8';

function ownerEmail(data) {
  const attending = (data.attending || '').toLowerCase();
  const badge = attending === 'yes'
    ? `<span style="background:#3D6B4F;color:#fff;padding:3px 12px;border-radius:20px;font-size:13px;">✓ Attending</span>`
    : `<span style="background:#8B1A1A;color:#fff;padding:3px 12px;border-radius:20px;font-size:13px;">✗ Not Attending</span>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${IVORY};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,${MAROON},#3D0C0C);padding:28px 36px;text-align:center;">
        <p style="margin:0 0 4px;color:${GOLD};font-size:13px;letter-spacing:2px;text-transform:uppercase;font-family:'Georgia',serif;">New RSVP Received</p>
        <h1 style="margin:0;color:#FDE9C8;font-size:26px;font-weight:normal;font-family:'Georgia',serif;">Vamsi &amp; Meena</h1>
        <p style="margin:6px 0 0;color:rgba(253,233,200,0.7);font-size:13px;">August 16, 2026 &bull; Hindu Temple of The Woodlands</p>
      </td></tr>

      <!-- Status badge -->
      <tr><td style="padding:24px 36px 4px;text-align:center;">${badge}</td></tr>

      <!-- Guest details -->
      <tr><td style="padding:20px 36px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,150,46,0.25);border-radius:8px;overflow:hidden;">
          ${row('Full Name',        data.name    || '—')}
          ${row('Email',            data.email   || '—', true)}
          ${row('Number of Guests', data.guests  || '—')}
          ${row('Attending',        attending === 'yes' ? 'Yes ✓' : 'No ✗')}
          ${data.message ? row('Message', data.message) : ''}
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:${TURMERIC};padding:16px 36px;text-align:center;border-top:1px solid rgba(201,150,46,0.2);">
        <p style="margin:0;font-size:12px;color:#8B1A1A;opacity:0.7;">
          Submitted via <a href="https://vamsiwedsmeena.netlify.app" style="color:${MAROON};">vamsiwedsmeena.netlify.app</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

function row(label, value, isEmail) {
  const val = isEmail
    ? `<a href="mailto:${value}" style="color:${MAROON};">${value}</a>`
    : value;
  return `
    <tr style="border-bottom:1px solid rgba(201,150,46,0.15);">
      <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${GOLD};font-family:Arial,sans-serif;white-space:nowrap;width:38%;">${label}</td>
      <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">${val}</td>
    </tr>`;
}

function guestEmail(name, attending) {
  const firstName = (name || 'Friend').trim().split(' ')[0];
  if (attending !== 'yes') {
    return `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${IVORY};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
      <tr><td style="background:linear-gradient(135deg,${MAROON},#3D0C0C);padding:32px 36px;text-align:center;">
        <h1 style="margin:0 0 6px;color:${GOLD};font-size:28px;font-weight:normal;">Vamsi &amp; Meena</h1>
        <p style="margin:0;color:rgba(253,233,200,0.8);font-size:14px;">August 16, 2026</p>
      </td></tr>
      <tr><td style="padding:36px;text-align:center;">
        <p style="font-size:18px;color:${MAROON};margin:0 0 18px;">Dear ${firstName},</p>
        <p style="font-size:15px;color:#3D0C0C;line-height:1.8;margin:0 0 18px;">
          Thank you for letting us know. We'll truly miss having you there, but we're so grateful for your love and blessings.
        </p>
        <p style="font-size:15px;color:#3D0C0C;line-height:1.8;margin:0;">
          We hope to celebrate with you soon. With lots of love,<br>
          <strong style="color:${MAROON};">Vamsikrishna &amp; Meenakshi 💛</strong>
        </p>
      </td></tr>
      <tr><td style="background:${TURMERIC};padding:16px 36px;text-align:center;border-top:1px solid rgba(201,150,46,0.2);">
        <p style="margin:0;font-size:12px;color:#8B1A1A;opacity:0.7;">Hindu Temple of The Woodlands &bull; Houston, Texas</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
  }

  return `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${IVORY};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,${MAROON},#3D0C0C);padding:32px 36px;text-align:center;">
        <p style="margin:0 0 6px;color:${GOLD};font-size:13px;letter-spacing:2px;text-transform:uppercase;">You're invited</p>
        <h1 style="margin:0 0 6px;color:#FDE9C8;font-size:30px;font-weight:normal;">Vamsi &amp; Meena</h1>
        <p style="margin:0;color:rgba(253,233,200,0.75);font-size:14px;">August 16, 2026 &bull; Hindu Temple of The Woodlands</p>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:36px 40px;">
        <p style="font-size:18px;color:${MAROON};margin:0 0 20px;font-family:'Georgia',serif;">Dear ${firstName},</p>
        <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 16px;">
          Thank you so much for your RSVP — it truly made our day to know you'll be
          joining us as we begin this beautiful new chapter together.
        </p>
        <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 16px;">
          Having you present at our wedding means more than words can express.
          Your love, blessings, and presence are the greatest gifts we could ask for.
        </p>
        <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 28px;">
          With the blessings of Lord Ganesha and Lord Venkateswara, and the love of
          our families and friends, we know it will be a day to remember.
        </p>

        <!-- Event details box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${TURMERIC};border-radius:10px;border:1px solid rgba(201,150,46,0.3);margin-bottom:28px;">
          <tr><td style="padding:22px 24px;">
            <p style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};font-family:Arial,sans-serif;">Event Details</p>
            <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📅 <strong>Sunday, August 16, 2026</strong></p>
            <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">🕗 Ceremony begins at <strong>8:00 AM</strong> &bull; Muhurtham at <strong>9:25 AM</strong></p>
            <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">🍛 Lunch served from <strong>12:00 PM</strong></p>
            <p style="margin:0;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📍 <strong>Hindu Temple of The Woodlands</strong>, Houston, Texas</p>
          </td></tr>
        </table>

        <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 8px;">
          If you have any questions, please reach out to our friend
          <strong>Venukumar Nadimpalli</strong> at
          <a href="tel:+14099806777" style="color:${MAROON};">+1 (409) 980-6777</a>.
        </p>
        <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:28px 0 0;text-align:center;">
          With heartfelt gratitude and so much love,<br>
          <strong style="font-size:18px;color:${MAROON};font-family:'Georgia',serif;">Vamsikrishna &amp; Meenakshi 💛</strong>
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:${TURMERIC};padding:18px 36px;text-align:center;border-top:1px solid rgba(201,150,46,0.2);">
        <p style="margin:0 0 4px;font-size:12px;color:#8B1A1A;opacity:0.7;">
          Visit our wedding website for directions, live stream &amp; more
        </p>
        <a href="https://vamsiwedsmeena.netlify.app" style="font-size:13px;color:${MAROON};font-weight:bold;">vamsiwedsmeena.netlify.app</a>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

exports.handler = async function(event) {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return { statusCode: 200 };
  }

  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 200 };
  }

  const data      = payload.data || {};
  const guestName = data.name    || 'Guest';
  const guestMail = (data.email  || '').trim();
  const attending = (data.attending || '').toLowerCase();

  const send = (to, toName, subject, html) =>
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${COUPLE_NAME} <onboarding@resend.dev>`,
        to: [`${toName} <${to}>`],
        subject,
        html,
      }),
    });

  const tasks = [
    // Notification to the couple
    send(
      COUPLE_EMAIL,
      COUPLE_NAME,
      `New RSVP — ${guestName} (${attending === 'yes' ? 'Attending ✓' : 'Not attending'})`,
      ownerEmail(data)
    ),
  ];

  // Thank-you / we'll-miss-you to the guest
  if (guestMail) {
    const subject = attending === 'yes'
      ? 'Thank You for Your RSVP — We Can\'t Wait to Celebrate With You! 💛'
      : 'Thank You for Letting Us Know — Vamsi & Meena';
    tasks.push(send(guestMail, guestName, subject, guestEmail(guestName, attending)));
  }

  await Promise.all(tasks);
  return { statusCode: 200 };
};
