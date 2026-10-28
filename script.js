/* =========================================================
   Gruha Pravesha invitation — LeadLogic Solutions
   Edit CONFIG to reuse this site for another client.
   ========================================================= */
const CONFIG = {
  // --- people & home ---
  hostWife: 'Smt. Sundaramma',
  hostHusband: 'Sri Revannaswamy',
  hostsShort: 'Sundaramma & Revannaswamy',
  houseName: 'Suma Neelaya',

  // --- venue ---
  venueAddress: 'Kadavina Kote Badavane, Hassan Road, Holenarasipura Taluk, Hassan District, Karnataka',
  mapLink: 'https://maps.app.goo.gl/AUvdPEzLLdMAYQXd9?g_st=aw',           // "Get Directions" — exact pin from the client
  // Map shown on the page. For the exact pin: Google Maps → Share → Embed a map → copy the src="…" value here.
  mapEmbed: 'https://maps.google.com/maps?q=Kadavina%20Kote%20Badavane%2C%20Holenarasipura%2C%20Hassan&z=15&output=embed',

  // --- timings (IST) ---
  countdownTarget: '2026-11-20T04:30:00+05:30',
  events: [
    { id: 'muhurtha',      title: 'Gruha Pravesha Muhurtha', start: '2026-11-20T04:30:00+05:30', end: '2026-11-20T06:15:00+05:30' },
    { id: 'lakshmi-pooja', title: 'Lakshmi Pooja',           start: '2026-11-20T09:00:00+05:30', end: null },
    { id: 'lunch',         title: 'Lunch (Bhojana)',         start: '2026-11-20T13:00:00+05:30', end: null }
  ],
  dateLabel: '20 Nov 2026',

  // --- RSVP ---
  whatsappNumber: '918762860047',       // country code + number, digits only
  rsvpEndpoint: '',                     // Google Apps Script web-app URL (see README). Empty = WhatsApp only.

  // --- media ---
  music: 'assets/music.mp3',            // looped instrumental, ~1 MB. Button hides itself if the file is missing.
  showGallery: false,
  galleryImages: [                      // e.g. { src: 'assets/photos/home-1.jpg', alt: 'Front of Suma Neelaya' }
  ],

  // --- sharing ---
  shareTitle: 'Gruha Pravesha — Sundaramma & Revannaswamy',
  shareText: 'You are invited to our housewarming on 20 November 2026'
};

(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- fill CONFIG text ---------- */
  $$('[data-cfg]').forEach(el => { const v = CONFIG[el.dataset.cfg]; if (v) el.textContent = v; });
  $('#directionsBtn').href = CONFIG.mapLink;

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- fit the door to small screens ---------- */
  const assembly = $('.door-assembly');
  function fitDoor() {
    const s = Math.min(1, (window.innerHeight - 290) / 540, (window.innerWidth - 60) / 330);
    assembly.style.setProperty('--s', Math.max(0.55, s).toFixed(3));
  }
  fitDoor(); window.addEventListener('resize', fitDoor);

  /* ---------- music ---------- */
  const audio = $('#bgm');
  const musicBtn = $('#musicBtn');
  let musicAvailable = !!CONFIG.music;
  if (musicAvailable) {
    audio.src = CONFIG.music;
    audio.volume = 0.55;
    audio.addEventListener('error', () => { musicAvailable = false; musicBtn.hidden = true; });
  } else { musicBtn.hidden = true; }
  function setMusic(on) {
    musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
  }
  function playMusic() {
    if (!musicAvailable) return;
    audio.play().then(() => setMusic(true)).catch(() => setMusic(false));
  }
  musicBtn.addEventListener('click', () => {
    if (audio.paused) playMusic(); else { audio.pause(); setMusic(false); }
  });

  /* ---------- petals (canvas, paused when not needed) ---------- */
  const canvas = $('#petals');
  const ctx = canvas.getContext('2d');
  const colors = ['#E7761C', '#F3A22E', '#E9AE22', '#C9463E', '#F6BE45'];
  let petals = [], rafId = null, petalsWanted = false, burstUntil = 0, dpr = 1;
  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  }
  function makePetal(top) {
    return {
      x: Math.random() * innerWidth, y: top ? -20 - Math.random() * innerHeight * 0.4 : Math.random() * innerHeight,
      r: 5 + Math.random() * 5, vy: 0.6 + Math.random() * 1.1, vx: -0.3 + Math.random() * 0.6,
      rot: Math.random() * Math.PI, vr: -0.03 + Math.random() * 0.06, sway: Math.random() * Math.PI * 2,
      c: colors[(Math.random() * colors.length) | 0]
    };
  }
  function drawPetal(p) {
    ctx.save(); ctx.translate(p.x * dpr, p.y * dpr); ctx.rotate(p.rot); ctx.scale(dpr, dpr);
    ctx.fillStyle = p.c; ctx.beginPath();
    ctx.moveTo(0, -p.r * 1.5);
    ctx.bezierCurveTo(p.r, -p.r * 0.6, p.r, p.r * 0.6, 0, p.r * 1.5);
    ctx.bezierCurveTo(-p.r, p.r * 0.6, -p.r, -p.r * 0.6, 0, -p.r * 1.5);
    ctx.fill(); ctx.restore();
  }
  function tick() {
    const now = performance.now();
    const target = now < burstUntil ? 70 : (petalsWanted ? 22 : 0);
    while (petals.length < target) petals.push(makePetal(true));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals = petals.filter(p => {
      p.sway += 0.02; p.x += p.vx + Math.sin(p.sway) * 0.4; p.y += p.vy; p.rot += p.vr;
      drawPetal(p);
      return p.y < innerHeight + 30;
    });
    if (petals.length === 0 && target === 0) { rafId = null; return; }
    rafId = requestAnimationFrame(tick);
  }
  function startPetals() { if (reduceMotion) return; if (!rafId) rafId = requestAnimationFrame(tick); }
  sizeCanvas(); window.addEventListener('resize', sizeCanvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) { cancelAnimationFrame(rafId); rafId = null; }
    else if (!document.hidden && (petalsWanted || performance.now() < burstUntil)) startPetals();
  });

  /* ---------- door open ---------- */
  const door = $('#door');
  const openBtn = $('#openBtn');
  const fabs = $('#fabs');
  openBtn.focus({ preventScroll: true });
  openBtn.addEventListener('click', () => {
    door.classList.add('open');
    playMusic();                                    // only after a tap — browsers block autoplay
    burstUntil = performance.now() + 3200; startPetals();
    setTimeout(() => {
      door.classList.add('gone');
      document.body.classList.remove('is-locked');
      fabs.hidden = false;
      $('#hero').scrollIntoView({ behavior: 'instant', block: 'start' });
      setTimeout(() => { door.hidden = true; }, 950);
    }, reduceMotion ? 400 : 2900);
  });

  /* ---------- hero petals only while hero is on screen ---------- */
  let doorOpened = false;
  openBtn.addEventListener('click', () => { doorOpened = true; });
  new IntersectionObserver(entries => {
    petalsWanted = doorOpened && entries[0].isIntersecting;
    if (petalsWanted) startPetals();
  }, { threshold: 0.15 }).observe($('#hero'));

  /* ---------- scroll reveal + footprints ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in', 'on'); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .foot-trail').forEach(el => revealIO.observe(el));

  /* ---------- countdown ---------- */
  const target = new Date(CONFIG.countdownTarget).getTime();
  const tD = $('#tDays'), tH = $('#tHours'), tM = $('#tMins'), tS = $('#tSecs');
  const pad = n => String(n).padStart(2, '0');
  let cdTimer;
  function renderCountdown() {
    const diff = target - Date.now();
    if (diff <= 0) {
      $('#timer').hidden = true; $('#arrived').hidden = false; clearInterval(cdTimer); return;
    }
    tD.textContent = pad(Math.floor(diff / 864e5));
    tH.textContent = pad(Math.floor(diff / 36e5) % 24);
    tM.textContent = pad(Math.floor(diff / 6e4) % 60);
    tS.textContent = pad(Math.floor(diff / 1e3) % 60);
  }
  renderCountdown(); cdTimer = setInterval(renderCountdown, 1000);

  /* ---------- map ---------- */
  const map = $('#mapEmbed');
  if (CONFIG.mapEmbed) map.src = CONFIG.mapEmbed; else map.closest('.map-frame').hidden = true;

  /* ---------- add to calendar (.ics) ---------- */
  const icsDate = iso => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const icsEsc = s => String(s).replace(/([,;\\])/g, '\\$1');
  function downloadIcs(ev) {
    const lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LeadLogic Solutions//Gruha Pravesha//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + ev.id + '-' + target + '@gruhapravesha',
      'DTSTAMP:' + icsDate(new Date().toISOString()),
      'DTSTART:' + icsDate(ev.start)
    ];
    if (ev.end) lines.push('DTEND:' + icsDate(ev.end));
    lines.push(
      'SUMMARY:' + icsEsc(ev.title + ' — ' + CONFIG.hostsShort),
      'LOCATION:' + icsEsc(CONFIG.houseName + ', ' + CONFIG.venueAddress),
      'URL:' + CONFIG.mapLink,
      'BEGIN:VALARM', 'TRIGGER:-PT12H', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(ev.title), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    );
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = ev.id + '-gruha-pravesha.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Calendar file downloaded');
  }
  $$('[data-cal]').forEach(btn => btn.addEventListener('click', () => downloadIcs(CONFIG.events[+btn.dataset.cal])));

  /* ---------- gallery ---------- */
  if (CONFIG.showGallery && CONFIG.galleryImages.length) {
    const track = $('#galleryTrack');
    CONFIG.galleryImages.forEach(img => {
      const el = document.createElement('img');
      el.src = img.src; el.alt = img.alt || ''; el.loading = 'lazy'; el.decoding = 'async';
      track.appendChild(el);
    });
    $('#gallery').hidden = false;
  }

  /* ---------- RSVP ---------- */
  const form = $('#rsvpForm');
  const attendFields = $('#attendFields');
  const waBtn = $('#waBtn');
  function readForm() {
    const fd = new FormData(form);
    return {
      attending: fd.get('attending'),
      name: (fd.get('name') || '').trim(),
      guests: fd.get('attending') === 'Yes' ? fd.get('guests') : '0',
      events: fd.get('attending') === 'Yes' ? fd.getAll('events').join(', ') : '',
      message: (fd.get('message') || '').trim()
    };
  }
  function waMessage(d) {
    const who = d.name || '[Your name]';
    let msg = d.attending === 'Yes'
      ? `Namaskara! ${who} will attend the Gruha Pravesha of ${CONFIG.houseName} on ${CONFIG.dateLabel} with ${d.guests} guest(s)` + (d.events ? ` for: ${d.events}` : '') + '.'
      : `Namaskara! ${who} is sorry to miss the Gruha Pravesha of ${CONFIG.houseName} on ${CONFIG.dateLabel}. Our blessings to you.`;
    if (d.message) msg += ' ' + d.message;
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(msg);
  }
  function syncForm() {
    const d = readForm();
    attendFields.hidden = d.attending !== 'Yes';
    waBtn.href = waMessage(d);
  }
  form.addEventListener('input', syncForm);
  form.addEventListener('change', syncForm);
  syncForm();

  function showThanks(d) {
    $('#thanksTitle').textContent = 'Thank you' + (d.name ? ', ' + d.name.split(' ')[0] : '');
    $('#thanksLine').textContent = d.attending === 'Yes'
      ? 'We look forward to welcoming you into our new home. Your blessings mean the world to us.'
      : 'We will miss you on the day — thank you for your blessings and good wishes.';
    form.hidden = true; $('#thanks').hidden = false; $('#thanks').focus();
    burstUntil = performance.now() + 2200; startPetals();
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = readForm();
    const nameErr = $('#nameError');
    if (!d.name) { nameErr.hidden = false; $('#gname').focus(); return; }
    nameErr.hidden = true;

    if (!CONFIG.rsvpEndpoint) {          // no Sheet connected yet → send via WhatsApp
      window.open(waMessage(d), '_blank', 'noopener');
      showThanks(d); return;
    }
    const btn = $('#rsvpSubmit'); btn.disabled = true; btn.textContent = 'Sending…';
    try {
      await fetch(CONFIG.rsvpEndpoint, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(Object.assign({ submittedAt: new Date().toISOString() }, d))
      });
      showThanks(d);
    } catch (err) {
      toast('Could not send — please use the WhatsApp button');
    } finally { btn.disabled = false; btn.textContent = 'Send RSVP'; }
  });
  $('#editRsvp').addEventListener('click', () => { $('#thanks').hidden = true; form.hidden = false; $('#gname').focus(); });

  /* ---------- share ---------- */
  $('#shareBtn').addEventListener('click', async () => {
    const data = { title: CONFIG.shareTitle, text: CONFIG.shareText, url: location.href.split('#')[0] };
    if (navigator.share) { try { await navigator.share(data); } catch (_) {} return; }
    window.open('https://wa.me/?text=' + encodeURIComponent(data.text + ' ' + data.url), '_blank', 'noopener');
  });
})();
