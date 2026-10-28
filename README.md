# Gruha Pravesha invitation: Suma Neelaya

A one-page housewarming invitation that opens on a phone when guests scan the QR code on the printed card.

```
index.html        the page
style.css         colours, fonts, layout and animations
script.js         CONFIG (all the event details) and the page logic
assets/           drawings (SVG), the WhatsApp preview image, favicon
```

There is no build step. Upload the files to a website host as they are.

---

## 1. See it on your computer

Double-click `index.html` and it opens in your browser. Everything works this way except the Google Map, which needs the page to be online or served locally:

```bash
python -m http.server 5520
```

Then open http://localhost:5520.

---

## 2. Change the details (the `CONFIG` block)

Open `script.js`. Everything you might change is at the top, inside `const CONFIG = { ... }`:

| Setting | What it is |
|---|---|
| `houseName` | "Suma Neelaya" |
| `hosts` | Names, monogram letters, village line (`\n` starts a new line) |
| `dateShort`, `dateLong` | The date as shown on the page |
| `countdownTo` | When the countdown ends: `2026-11-20T04:30:00+05:30` |
| `events` | The programme: times, titles, and start/end used by "Add to Calendar" |
| `venue.lat`, `venue.lng` | The house's exact location. Both the map and the **Get Directions** button use it. |
| `venue.mapLink` | The shareable Google Maps link, added to calendar entries |
| `whatsapp` | `918762860047` (91 = India; digits only, no spaces or +) |
| `rsvpEndpoint` | Your Google Sheet link (see step 3). Leave it as `""` to receive RSVPs on WhatsApp only. |
| `music` | Path to a music file. If no file is there, a soft tanpura drone plays instead. |
| `showKannada` | `true` shows the Kannada invocation lines; `false` hides them |
| `siteUrl` | Your final web address, used by the Share button |
| `gallery` | Photos. Leave it empty `[]` and the gallery section stays hidden. |

To reuse this for another client, change `CONFIG` and the few fixed lines in `index.html` (blessings, invitation wording, "awaiting your presence" list).

---

## 3. Collect RSVPs in a Google Sheet (optional)

Out of the box, the RSVP button opens WhatsApp with the guest's answers already typed, addressed to the host's number. To also save every RSVP in a Google Sheet:

1. Create a new Google Sheet and name it, for example, "Suma Neelaya RSVPs".
2. Choose **Extensions → Apps Script**, delete what is there, and paste this:

   ```js
   function doPost(e) {
     const ss = SpreadsheetApp.getActiveSpreadsheet();
     const sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');
     if (sheet.getLastRow() === 0) {
       sheet.appendRow(['Received', 'Name', 'Attending', 'Guests', 'Events', 'Message']);
     }
     const p = e.parameter;
     // Stop anything a guest types from running as a spreadsheet formula
     const safe = (v) => { v = String(v || ''); return /^[=+\-@]/.test(v) ? "'" + v : v; };
     sheet.appendRow([new Date(), safe(p.name), safe(p.attending), safe(p.guests), safe(p.events), safe(p.message)]);
     return ContentService.createTextOutput('ok');
   }
   ```
3. Click **Deploy → New deployment**. Choose type **Web app**, set *Execute as* to **Me** and *Who has access* to **Anyone**, then click **Deploy** and approve the permissions.
4. Copy the **Web app URL** (it ends in `/exec`) and paste it into `rsvpEndpoint` in `script.js`.

The form then saves to the Sheet, and a separate **RSVP on WhatsApp** button appears under it.

---

## 4. Put it online

### Vercel (the setup this project uses)

The project is ready for Vercel:
- `vercel.json` makes the iPhone "Add to Calendar" files open in Apple Calendar.
- `.vercelignore` keeps the README and other working files off the live site.

**First time (about 5 minutes):**

1. Create a free account at https://vercel.com/signup. Choose the **Hobby** plan.
2. Open a terminal inside this project folder. In File Explorer, open the folder, click the address bar, type `cmd` and press Enter.
3. Run:

   ```bash
   npx vercel login
   ```

   A browser window opens. Sign in, then come back to the terminal.
4. Run:

   ```bash
   npx vercel --prod
   ```

   Answer the questions like this:
   - *Set up and deploy?* → **Y**
   - *Which scope?* → press Enter
   - *Link to existing project?* → **N**
   - *Project name?* → type `suma-neelaya` and press Enter
   - *In which directory is your code located?* → press Enter (`./`)
   - *Want to modify these settings?* → **N**
5. When it finishes, it prints your live address, for example `https://suma-neelaya.vercel.app`.

**To update the site later:** open the terminal in this folder again and run `npx vercel --prod`. The address stays the same.

If the name `suma-neelaya` is already taken, Vercel adds something to it. You can change the address under **Project → Settings → Domains** on vercel.com.

### Netlify (alternative)

1. Go to https://app.netlify.com/drop.
2. Drag the whole project folder onto the page.
3. Rename the site under **Site configuration**. The `_headers` file handles the calendar files there.

**After it is online, do this once.** WhatsApp needs full links for the preview card. In `index.html`, change:

```html
<meta property="og:image" content="assets/og-image.jpg">
<meta property="og:url" content="">
```

to your real address, for example:

```html
<meta property="og:image" content="https://suma-neelaya.vercel.app/assets/og-image.jpg">
<meta property="og:url" content="https://suma-neelaya.vercel.app/">
```

Set the same address as `siteUrl` in `script.js`, then upload again.

---

## 5. Make the QR code for the printed card

1. Open a free QR generator, for example https://www.qrcode-monkey.com or https://qr.io.
2. Paste the final site address.
3. Choose maroon (`#6E1018`) on white or cream. Keep the contrast strong so older phones can scan it.
4. Download it as **SVG** or **PNG at 1000px or more**, and print it at least **2.5 cm × 2.5 cm**.
5. Before printing the cards, test it with two or three different phones.

Use a plain (static) QR code that holds the address directly, not a "dynamic" one that runs through a third-party redirect.

---

## 6. Checklist before launch

**Still waiting for the client**

- [ ] **Muhurtha time.** The card says "morning 4:30 to 6:15". The site shows **4:30 – 6:15 AM**, and the countdown ends at 4:30 AM IST. Confirm this with the client.
- [ ] **House name spelling.** The site uses **"Suma Neelaya"**, as sent. Check whether the client prefers "Suma Nilaya".
- [x] **Map.** The pin is set to 12.808560, 76.231682 (`venue.lat` / `venue.lng` in `script.js`). The small map shows that exact spot, and **Get Directions** opens Google Maps with the driving route from the guest's location to the house.
- [ ] **Kannada lines.** The invocations currently show in both Kannada and English. Confirm this, or set `showKannada: false`.
- [ ] **Music.** No music file is included yet, so a soft tanpura drone plays. To use a real track, add a royalty-free nadaswaram or veena instrumental (MP3, about 1 MB) as `assets/music.mp3`.
- [ ] **Photos.** If the client sends photos of the house or family, put them in `assets/photos/` (JPG, about 1600px wide, under 300 KB each) and list them in `gallery`.
- [ ] **Where RSVPs go.** RSVPs currently go to WhatsApp at +91 87628 60047. To also save them to a Google Sheet, follow step 3.

**Before printing the QR code**

- [ ] Change `og:image`, `og:url` and `siteUrl` to the live address (step 4).
- [ ] Paste the link into a WhatsApp chat and check that the preview card shows.
- [ ] Send yourself a test RSVP.
- [ ] Tap **Add to Calendar** on a phone and check that the times are right.

---

## How "Add to Calendar" works

- **Android and computers:** Google Calendar opens with the event already filled in: title, time (India time), place and a directions link. The guest just taps **Save**.
- **iPhone, iPad and Mac:** the Apple Calendar **Add Event** screen opens, using the ready-made files in `assets/calendar/`. The event comes with two reminders, one the day before and one 1 hour before.

**If you change an event time in `CONFIG`,** the iPhone files must be updated too. Ask Claude to "regenerate the calendar files", or set `calendarFiles: false` in `script.js` so iPhones build the file on the spot instead.

The `_headers` file tells Netlify to serve these files as calendar files. Keep it in the folder when you upload.

## Notes

- **Calendar end times.** The card gives no end time for Lakshmi Pooja or lunch. The calendar files block 1 hour for the pooja and 1½ hours for lunch. These end times are not shown anywhere on the page.
- **Reduced motion.** Guests whose phones are set to reduce motion don't see falling petals or footprints. The page fades in gently instead.
- **Music.** Music only starts after the guest taps the door, because phones block sound that plays on its own.
