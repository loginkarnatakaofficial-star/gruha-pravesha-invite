# Gruha Pravesha — Digital Invitation

Housewarming invitation site for **Smt. Sundaramma & Sri Revannaswamy**, *Suma Neelaya*, Holenarasipura.
Plain HTML + CSS + vanilla JS. No build step. Built by LeadLogic Solutions.

```
index.html     page markup and all SVG artwork (door, toran, diyas, Ganesha emblem, Gau Pravesha scene)
style.css      look and animations
script.js      CONFIG + behaviour (door, petals, countdown, calendar, RSVP, share, music)
assets/
  og-image.jpg  1200×630 WhatsApp / Facebook preview image
  favicon.svg   diya icon
  music.mp3     ← ADD THIS (not included; see Placeholders)
  photos/       ← optional gallery photos
```

---

## 1. Edit the details — `CONFIG` at the top of `script.js`

| Key | What it controls |
|---|---|
| `hostWife`, `hostHusband`, `hostsShort` | Host names shown in the hero and used in calendar/WhatsApp text |
| `houseName` | "Suma Neelaya": appears in the invitation box, venue, calendar and WhatsApp text |
| `venueAddress` | Venue line + calendar location |
| `mapLink` | "Get Directions" button (the client's Google Maps pin) |
| `mapEmbed` | The map shown on the page (see below) |
| `countdownTarget` | Countdown end (`2026-11-20T04:30:00+05:30`) |
| `events` | The 3 programme items used by "Add to Calendar" (IST, with `+05:30`) |
| `whatsappNumber` | Host number with country code, digits only (`918762860047`) |
| `rsvpEndpoint` | Google Sheet web-app URL (section 2). Leave `''` for WhatsApp-only RSVP |
| `music` | Path to the music file. The music button hides itself if the file is missing |
| `showGallery`, `galleryImages` | Turn on the swipeable gallery and list photos |
| `shareTitle`, `shareText` | Text used by the floating Share button |

Text that never changes between events (the blessings, the invitation wording) is written directly in `index.html`.

**Exact map embed.** The on-page map currently shows the Kadavina Kote Badavane area. To show the exact house pin: open the client's pin in Google Maps on a computer, then go to **Share → Embed a map → Copy HTML**. Copy only the `src="…"` URL into `CONFIG.mapEmbed`.

---

## 2. Connect RSVPs to a Google Sheet (optional)

Without this, "Send RSVP" opens WhatsApp to the host with the guest's answers already filled in. With it, answers also land in a Sheet.

1. Create a Google Sheet named "Gruha Pravesha RSVP". In row 1, add: `submittedAt | attending | name | guests | events | message`
2. **Extensions → Apps Script**, then paste:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const d = JSON.parse(e.postData.contents);
  sheet.appendRow([d.submittedAt, d.attending, d.name, d.guests, d.events, d.message]);
  return ContentService.createTextOutput('ok');
}
```

3. **Deploy → New deployment → Web app**. Set **Execute as:** Me and **Who has access:** Anyone. Then Deploy and authorise.
4. Copy the web-app URL (ends in `/exec`) into `CONFIG.rsvpEndpoint`.
5. Test once from your phone and check that a row appears.

---

## 3. Deploy

Any static host works. Upload the whole folder.

- **Netlify:** drag the folder onto app.netlify.com/drop, then go to *Domain settings* to add a custom subdomain (e.g. `suma-neelaya.yourdomain.in`).
- **Vercel:** `vercel` from inside the folder, or import from GitHub.
- **GitHub Pages:** push to a repo, then *Settings → Pages → Deploy from branch*.

**After deploying:** in `index.html`, replace both `[YOUR-DOMAIN]` placeholders in the `og:image` and `og:url` tags with the live address. WhatsApp needs a full `https://` URL to show the preview image. To check the preview, paste the link into the Facebook Sharing Debugger (WhatsApp uses the same tags). WhatsApp caches previews, so test with a fresh link such as `…/?v=2` after changes.

---

## 4. QR code for the printed card

1. Use the final live URL (after the domain is set).
2. Make the QR with any free generator, or run `npx qrcode -o qr.png "https://your-live-url/"`.
3. Print it at least **2.5 cm × 2.5 cm**, dark on light, with a quiet margin around it. Maroon `#561212` on the cream card works; avoid gold or yellow QR codes.
4. Scan-test the printed proof on both an Android and an iPhone before the full print run.

---

## 5. Placeholders still waiting for client input

| Item | Where | Status |
|---|---|---|
| House name | `CONFIG.houseName` | ✅ Suma Neelaya |
| Google Maps pin | `CONFIG.mapLink` | ✅ Set |
| Exact map **embed** for the page | `CONFIG.mapEmbed` | ⏳ Shows the area; replace with the embed URL (section 1) |
| Host WhatsApp | `CONFIG.whatsappNumber` | ✅ +91 87628 60047 |
| Live domain for preview tags | `index.html` `[YOUR-DOMAIN]` ×2 | ⏳ After deploy |
| Music | `assets/music.mp3` | ⏳ Royalty-free nadaswaram/veena loop, about 1 MB MP3 |
| Photos | `assets/photos/` + `CONFIG.galleryImages` | ⏳ Optional; gallery stays hidden until added |
| RSVP destination | `CONFIG.rsvpEndpoint` | ⏳ WhatsApp works now; Sheet optional |
| Invocations also in Kannada? | `index.html` hero | ⏳ Currently English only |
| Muhurtha 4:30–6:15 **AM** | `CONFIG.events` | Card says "ಬೆಳಿಗ್ಗೆ" (morning); confirm with the family |

## Notes
- Music starts only after the guest taps "Tap to Open", because browsers block autoplay.
- `prefers-reduced-motion` is respected: petals and moving motifs turn off and the fades stay.
- All artwork is original inline SVG, with no stock or copyrighted images.
