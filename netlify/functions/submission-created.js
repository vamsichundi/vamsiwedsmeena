// Triggered automatically by Netlify whenever the "rsvp" form is submitted.
// Sends:
//   1. Notification email to the couple
//   2. Acknowledgment email to the guest (wording varies by attending status)
//
// Required Netlify environment variables:
//   GMAIL_USER         — your Gmail address (vkchundi@gmail.com)
//   GMAIL_APP_PASSWORD — 16-char App Password from myaccount.google.com/apppasswords

import nodemailer from 'nodemailer';

const COUPLE_EMAIL = 'vkchundi@gmail.com';
const SITE_URL = 'https://vamsiwedsmeena.netlify.app';

function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function notificationHtml({ name, email, attending, guests, message }) {
  const badge =
    attending === 'yes'  ? 'background:#3D6B4F;color:#fff;' :
    attending === 'maybe'? 'background:#B8860B;color:#fff;' :
                           'background:#8B1A1A;color:#fff;';
  const label =
    attending === 'yes'  ? '✓ Attending' :
    attending === 'maybe'? '? Maybe'     : '✗ Declining';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFF8EE;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <tr><td style="background:linear-gradient(135deg,#5A0E0E,#3D0C0C);padding:28px 36px;text-align:center;">
    <p style="margin:0 0 4px;color:#C9962E;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">New RSVP Received</p>
    <h1 style="margin:0;color:#FDE9C8;font-size:26px;font-weight:normal;">Vamsi &amp; Meena</h1>
    <p style="margin:6px 0 0;color:rgba(253,233,200,.7);font-size:13px;font-family:Arial,sans-serif;">August 16, 2026 &bull; Hindu Temple of The Woodlands</p>
  </td></tr>
  <tr><td style="padding:22px 36px 8px;text-align:center;font-family:Arial,sans-serif;">
    <span style="padding:4px 16px;border-radius:20px;font-size:13px;${badge}">${label}</span>
  </td></tr>
  <tr><td style="padding:16px 36px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,150,46,.25);border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;width:36%;border-bottom:1px solid rgba(201,150,46,.15);">Full Name</td>
        <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">${name}</td>
      </tr>
      <tr>
        <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">Email</td>
        <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">${email}</td>
      </tr>
      <tr>
        <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">Guests</td>
        <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">${guests}</td>
      </tr>
      <tr>
        <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;">Message</td>
        <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">${message || '—'}</td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="background:#FDE9C8;padding:14px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <a href="${SITE_URL}" style="font-size:12px;color:#5A0E0E;">${SITE_URL}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function guestHtml({ name, attending }) {
  const firstName = name.trim().split(' ')[0];

  if (attending === 'no') {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFF8EE;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <tr><td style="background:linear-gradient(135deg,#5A0E0E,#3D0C0C);padding:32px 36px;text-align:center;">
    <h1 style="margin:0 0 6px;color:#FDE9C8;font-size:28px;font-weight:normal;">Vamsi &amp; Meena</h1>
    <p style="margin:0;color:rgba(253,233,200,.75);font-size:14px;font-family:Arial,sans-serif;">August 16, 2026 &bull; Hindu Temple of The Woodlands</p>
  </td></tr>
  <tr><td style="padding:36px 40px;">
    <p style="font-size:18px;color:#5A0E0E;margin:0 0 20px;">Dear ${firstName},</p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 16px;font-family:Arial,sans-serif;">
      Thank you for letting us know. We completely understand and will truly miss having you with us on our special day.
    </p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0;font-family:Arial,sans-serif;">
      Your love and blessings mean the world to us. We hope to celebrate with you soon! 💛
    </p>
    <p style="font-size:15px;color:#3D0C0C;text-align:center;margin:32px 0 0;font-family:Arial,sans-serif;">
      With love,<br><strong style="font-size:18px;color:#5A0E0E;">Vamsikrishna &amp; Meenakshi</strong>
    </p>
  </td></tr>
  <tr><td style="background:#FDE9C8;padding:16px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <a href="${SITE_URL}" style="font-size:13px;color:#5A0E0A;font-weight:bold;">${SITE_URL}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
  }

  if (attending === 'maybe') {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFF8EE;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <tr><td style="background:linear-gradient(135deg,#5A0E0E,#3D0C0C);padding:32px 36px;text-align:center;">
    <h1 style="margin:0 0 6px;color:#FDE9C8;font-size:28px;font-weight:normal;">Vamsi &amp; Meena</h1>
    <p style="margin:0;color:rgba(253,233,200,.75);font-size:14px;font-family:Arial,sans-serif;">August 16, 2026 &bull; Hindu Temple of The Woodlands</p>
  </td></tr>
  <tr><td style="padding:36px 40px;">
    <p style="font-size:18px;color:#5A0E0E;margin:0 0 20px;">Dear ${firstName},</p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 16px;font-family:Arial,sans-serif;">
      Thank you for responding! We've noted your RSVP as a "Maybe" and completely understand that plans can change.
    </p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 28px;font-family:Arial,sans-serif;">
      Please do let us know as soon as you can so we can plan accordingly. We truly hope you're able to join us! 🙏
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDE9C8;border-radius:10px;border:1px solid rgba(201,150,46,.3);margin-bottom:28px;">
      <tr><td style="padding:22px 24px;">
        <p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;">Save the Date</p>
        <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📅 <strong>Sunday, August 16, 2026</strong></p>
        <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">🕗 Ceremony at <strong>8:00 AM</strong> &bull; Muhurtham at <strong>9:25 AM</strong></p>
        <p style="margin:0;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📍 <strong>Hindu Temple of The Woodlands</strong>, Spring, TX 77373</p>
      </td></tr>
    </table>
    <p style="font-size:15px;color:#3D0C0C;text-align:center;margin:0;font-family:Arial,sans-serif;">
      With love,<br><strong style="font-size:18px;color:#5A0E0E;">Vamsikrishna &amp; Meenakshi 💛</strong>
    </p>
  </td></tr>
  <tr><td style="background:#FDE9C8;padding:16px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <a href="${SITE_URL}" style="font-size:13px;color:#5A0E0E;font-weight:bold;">${SITE_URL}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
  }

  // attending === 'yes'
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFF8EE;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <tr><td style="background:linear-gradient(135deg,#5A0E0E,#3D0C0C);padding:32px 36px;text-align:center;">
    <p style="margin:0 0 6px;color:#C9962E;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">You're coming! 🎉</p>
    <h1 style="margin:0 0 6px;color:#FDE9C8;font-size:30px;font-weight:normal;">Vamsi &amp; Meena</h1>
    <p style="margin:0;color:rgba(253,233,200,.75);font-size:14px;font-family:Arial,sans-serif;">August 16, 2026 &bull; Hindu Temple of The Woodlands</p>
  </td></tr>
  <tr><td style="padding:36px 40px;">
    <p style="font-size:18px;color:#5A0E0E;margin:0 0 20px;">Dear ${firstName},</p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 16px;font-family:Arial,sans-serif;">
      Thank you so much for your RSVP — it truly made our day to know you'll be joining us as we begin this beautiful new chapter together.
    </p>
    <p style="font-size:15px;color:#3D0C0C;line-height:1.9;margin:0 0 28px;font-family:Arial,sans-serif;">
      With the blessings of Lord Ganesha and Lord Venkateswara, and the love of our families and friends, we know it will be a day to remember.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDE9C8;border-radius:10px;border:1px solid rgba(201,150,46,.3);margin-bottom:28px;">
      <tr><td style="padding:22px 24px;">
        <p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;">Event Details</p>
        <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📅 <strong>Sunday, August 16, 2026</strong></p>
        <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">🕗 Ceremony at <strong>8:00 AM</strong> &bull; Muhurtham at <strong>9:25 AM</strong></p>
        <p style="margin:0 0 8px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">🍛 Lunch from <strong>12:00 PM</strong></p>
        <p style="margin:0;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📍 <strong>Hindu Temple of The Woodlands</strong>, Spring, TX 77373</p>
      </td></tr>
    </table>
    <p style="font-size:14px;color:#3D0C0C;line-height:1.8;margin:0 0 28px;font-family:Arial,sans-serif;">
      For any questions, please reach out to our coordinator <strong>Venukumar Nadimpalli</strong> at
      <a href="tel:+14099806777" style="color:#5A0E0E;">+1 (409) 980-6777</a>.
    </p>
    <p style="font-size:15px;color:#3D0C0C;text-align:center;margin:0;font-family:Arial,sans-serif;">
      With heartfelt gratitude,<br>
      <strong style="font-size:18px;color:#5A0E0E;">Vamsikrishna &amp; Meenakshi 💛</strong>
    </p>
  </td></tr>
  <tr><td style="background:#FDE9C8;padding:16px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <p style="margin:0 0 4px;font-size:12px;color:#8B1A1A;font-family:Arial,sans-serif;">Visit the wedding website for directions, live stream &amp; more</p>
    <a href="${SITE_URL}" style="font-size:13px;color:#5A0E0E;font-weight:bold;">${SITE_URL}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export const handler = async (event) => {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD env var not set');
    }

    const { payload } = JSON.parse(event.body);
    const data = payload.data || {};
    const name      = data.name      || 'Guest';
    const email     = data.email     || '';
    const attending = (data.attending || 'yes').toLowerCase();
    const guests    = data.guests    || '1';
    const message   = data.message   || '';

    const transporter = createTransport();
    const from = `"Vamsi & Meena Wedding" <${process.env.GMAIL_USER}>`;

    // 1. Notify the couple
    await transporter.sendMail({
      from,
      to: COUPLE_EMAIL,
      subject: `New RSVP — ${name} (${attending})`,
      html: notificationHtml({ name, email, attending, guests, message }),
    });

    // 2. Acknowledge the guest
    if (email) {
      const subjectMap = {
        yes:   `Thank You for Your RSVP — We Can't Wait to Celebrate With You! 💛`,
        maybe: `We Got Your RSVP — Hope to See You There! 💛`,
        no:    `Thank You for Letting Us Know 💛`,
      };
      await transporter.sendMail({
        from,
        to: email,
        subject: subjectMap[attending] || subjectMap.yes,
        html: guestHtml({ name, attending }),
      });
    }

    return { statusCode: 200, body: 'Emails sent' };
  } catch (err) {
    console.error('submission-created error:', err.message);
    return { statusCode: 500, body: err.message };
  }
};
