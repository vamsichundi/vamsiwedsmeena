# Auto Thank-You Email When a Guest RSVPs

Your wedding site's RSVP form already uses **Netlify Forms** (`data-netlify="true"`),
and it collects the guest's **name**, **email**, and whether they're **attending**.
That's everything we need.

The plan:

```
Guest submits RSVP  →  Netlify catches it  →  Zapier sees the new submission
                                            →  Gmail sends the guest a thank-you email
```

Netlify on its own can email YOU (the couple) when someone RSVPs, but it can't
auto-reply to the guest. Zapier (free tier is enough for a wedding's volume) bridges that gap.

---

## Part 1 — Deploy the site on Netlify (if not already)

1. Go to https://app.netlify.com and sign up / log in (free).
2. Drag-and-drop your site folder onto the Netlify dashboard, **or** connect your
   GitHub repo. Either works.
3. Once deployed, open your site and submit a **test RSVP**.
4. In Netlify: **Site → Forms**. You should see a form named **`rsvp`** with your
   test submission inside. If you see it, the form is wired correctly.

> If the form doesn't appear: make sure the deployed HTML still contains
> `<form name="rsvp" data-netlify="true" ...>` and the hidden
> `<input type="hidden" name="form-name" value="rsvp">`. Both are already in your file.

---

## Part 2 — (Optional) Get notified yourself

In Netlify: **Site → Forms → Settings & usage → Form notifications →
Add notification → Email notification.** Enter your own email. Now you'll get an
email every time someone RSVPs. (This is separate from the guest thank-you.)

---

## Part 3 — Auto thank-you email to the guest (Zapier)

1. Go to https://zapier.com and sign up / log in (free plan is fine).
2. Click **Create → Zap**.
3. **Trigger:**
   - App: **Netlify**
   - Event: **New Form Submission**
   - Connect your Netlify account when prompted.
   - Choose your **site** and the form **`rsvp`**.
   - Click **Test trigger** — it should pull in your test submission with fields
     like `name`, `email`, `attending`, `guests`, `message`.
4. **Action:**
   - App: **Gmail** (or Outlook, or "Email by Zapier")
   - Event: **Send Email**
   - Connect your Gmail account.
   - Fill in the fields:
     - **To:** select the `email` field from the Netlify step (this is the guest's email)
     - **From Name:** `Vamsikrishna & Meenakshi`
     - **Subject:** `Thank You for Your RSVP — We Can't Wait to Celebrate With You! 💛`
     - **Body:** paste the email text below (use the `name` field from Netlify
       where it says `[Guest Name]`)
5. Click **Test action** — Zapier sends a real test email. Check your inbox.
6. **Publish** the Zap. Done! Every future RSVP now triggers the thank-you automatically.

### (Recommended) Only thank people who are actually attending

Between the Trigger and the Gmail action, add a **Filter** step:
- Condition: `attending` **(Text) Exactly matches** `yes`

This way, people who select "Regretfully Decline" won't get a "can't wait to see you" note.
You could add a second, separate path with a kinder "we'll miss you" message for declines if you like.

---

## Email body to paste into Zapier

Subject:
```
Thank You for Your RSVP — We Can't Wait to Celebrate With You! 💛
```

Body (replace `[Guest Name]` with the Netlify **name** field):
```
Dear [Guest Name],

Thank you so much for your RSVP — it truly made our day to know you'll be
joining us as we begin this beautiful new chapter together.

Having you present at our wedding means more to us than words can express.
Your love, blessings, and presence are the greatest gifts we could ask for,
and we feel so grateful to be surrounded by the people who matter most.

We're counting down the days until we can celebrate with you — sharing in the
music, the rituals, the laughter, and the joy of the occasion. With the
blessings of Lord Ganesha and Lord Venkateswara, and the love of our families
and friends, we know it will be a day to remember.

Here are the key details for the day:
📅 Sunday, August 16, 2026
🕗 Wedding ceremony begins at 8:00 AM
🍛 Lunch served from 12:00 PM
📍 Hindu Temple of The Woodlands, Houston, Texas

If you have any questions or need help with travel, accommodation, or anything
at all, please don't hesitate to reach out to us or to our friend
Venukumar Nadimpalli at +1 (409) 980-6777.

With heartfelt gratitude and so much love,
Vamsikrishna & Meenakshi 💛
```

---

## No-Zapier alternative: Make.com or Netlify + EmailOctopus

- **Make.com** works the same way (Netlify "Watch Form Submissions" → Email module)
  and has a generous free tier.
- If you'd rather not use any third-party tool, you can use a **Netlify Function**
  + an email API (Resend, SendGrid, or Mailgun — all have free tiers) to send the
  reply server-side. This is more technical; the Zapier route above is far simpler
  and recommended for a wedding site.

---

## Quick checklist

- [ ] Site deployed on Netlify
- [ ] Test RSVP shows up under Site → Forms → `rsvp`
- [ ] (Optional) Email notification to yourselves set up
- [ ] Zapier Zap: Netlify "New Form Submission" → Gmail "Send Email"
- [ ] Filter added so only `attending = yes` gets the thank-you
- [ ] Test email received and looks right
- [ ] Zap published

That's it — guests will now get a warm thank-you the moment they RSVP. 💛
