# RSVP Email Setup via Zapier

When a guest submits the RSVP form, two formatted HTML emails get sent automatically:

1. **Notification to you** — a branded card showing the guest's details at a glance
2. **Thank-you to the guest** — a warm confirmation with event details (attending only)

```
Guest submits RSVP  →  Netlify catches it  →  Zapier fires
                                            →  Gmail: notification to couple
                                            →  Gmail: thank-you to guest
```

---

## Step 1 — Confirm the form is live

Open your deployed site, submit a test RSVP, then go to:
**Netlify → Forms** — you should see a form named `rsvp` with the submission inside.

---

## Step 2 — Create the Zapier Zap

Go to [zapier.com](https://zapier.com) → **Create → Zap**

### Trigger
- App: **Netlify**
- Event: **New Form Submission**
- Site: your site
- Form: **rsvp**
- Click **Test trigger** — it should load a real submission

---

### Action 1 — Notification email to you

- App: **Gmail**
- Event: **Send Email**
- **To:** `vkchundi@gmail.com`
- **From Name:** `Vamsi & Meena Wedding`
- **Subject:** `New RSVP — {{name}} ({{attending}})`
- **Body Type:** `HTML`
- **Body:** paste the HTML below

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
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
    <span style="background:#3D6B4F;color:#fff;padding:4px 16px;border-radius:20px;font-size:13px;">&#10003; {{attending}}</span>
  </td></tr>

  <tr><td style="padding:16px 36px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,150,46,.25);border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;width:36%;border-bottom:1px solid rgba(201,150,46,.15);">Full Name</td>
        <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">{{name}}</td>
      </tr>
      <tr>
        <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">Email</td>
        <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">{{email}}</td>
      </tr>
      <tr>
        <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">Guests</td>
        <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;border-bottom:1px solid rgba(201,150,46,.15);">{{guests}}</td>
      </tr>
      <tr>
        <td style="padding:11px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C9962E;font-family:Arial,sans-serif;">Message</td>
        <td style="padding:11px 16px;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">{{message}}</td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="background:#FDE9C8;padding:14px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <a href="https://vamsiwedsmeena.netlify.app" style="font-size:12px;color:#5A0E0E;">vamsiwedsmeena.netlify.app</a>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>
```

---

### Filter (between Action 1 and Action 2)

Add a **Filter** step so the thank-you only goes to guests who are attending:

- **Only continue if…** `Attending` **Exactly matches** `yes`

---

### Action 2 — Thank-you email to the guest

- App: **Gmail**
- Event: **Send Email**
- **To:** `{{email}}` *(the Netlify field)*
- **From Name:** `Vamsikrishna & Meenakshi`
- **Subject:** `Thank You for Your RSVP — We Can't Wait to Celebrate With You! 💛`
- **Body Type:** `HTML`
- **Body:** paste the HTML below

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0eb;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFF8EE;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">

  <tr><td style="background:linear-gradient(135deg,#5A0E0E,#3D0C0C);padding:32px 36px;text-align:center;">
    <p style="margin:0 0 6px;color:#C9962E;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">You're coming!</p>
    <h1 style="margin:0 0 6px;color:#FDE9C8;font-size:30px;font-weight:normal;">Vamsi &amp; Meena</h1>
    <p style="margin:0;color:rgba(253,233,200,.75);font-size:14px;font-family:Arial,sans-serif;">August 16, 2026 &bull; Hindu Temple of The Woodlands</p>
  </td></tr>

  <tr><td style="padding:36px 40px;">
    <p style="font-size:18px;color:#5A0E0E;margin:0 0 20px;">Dear {{name}},</p>
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
        <p style="margin:0;font-size:14px;color:#3D0C0C;font-family:Arial,sans-serif;">📍 <strong>Hindu Temple of The Woodlands</strong>, Houston, TX</p>
      </td></tr>
    </table>

    <p style="font-size:14px;color:#3D0C0C;line-height:1.8;margin:0 0 28px;font-family:Arial,sans-serif;">
      For any questions, please reach out to our friend <strong>Venukumar Nadimpalli</strong> at
      <a href="tel:+14099806777" style="color:#5A0E0E;">+1 (409) 980-6777</a>.
    </p>

    <p style="font-size:15px;color:#3D0C0C;text-align:center;margin:0;font-family:Arial,sans-serif;">
      With heartfelt gratitude,<br>
      <strong style="font-size:18px;color:#5A0E0E;">Vamsikrishna &amp; Meenakshi 💛</strong>
    </p>
  </td></tr>

  <tr><td style="background:#FDE9C8;padding:16px 36px;text-align:center;border-top:1px solid rgba(201,150,46,.2);">
    <p style="margin:0 0 4px;font-size:12px;color:#8B1A1A;font-family:Arial,sans-serif;">Visit the wedding website for directions, live stream &amp; more</p>
    <a href="https://vamsiwedsmeena.netlify.app" style="font-size:13px;color:#5A0E0E;font-weight:bold;">vamsiwedsmeena.netlify.app</a>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>
```

---

## Checklist

- [ ] Test RSVP shows up in Netlify → Forms → `rsvp`
- [ ] Zapier Zap created with Netlify trigger
- [ ] Action 1: owner notification email tested and received
- [ ] Filter added: `attending` exactly matches `yes`
- [ ] Action 2: guest thank-you email tested and received
- [ ] Zap published (turned ON)
