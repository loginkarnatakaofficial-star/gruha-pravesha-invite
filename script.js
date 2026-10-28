/* =========================================================
   CONFIG — everything that changes from one invitation to the next.
   Edit the values below; the page fills itself in from here.
   ========================================================= */
const CONFIG = {
  occasion: "Gruha Pravesha",
  houseName: "Suma Neelaya",

  hosts: {
    her: "Sundaramma",
    him: "Revannaswamy",
    full: "Smt. Sundaramma & Sri Revannaswamy",
    family: "Hemanth Kumar & Dhruva Kumar",   // shown under the hosts' names in the footer
    initials: ["S", "R"],
    village: "Moodalamayigowdanahalli Village, Halli Mysuru Hobli,\nHolenarasipura Taluk, Hassan District",
  },

  dateShort: "20 · November · 2026",
  dateLong: "Friday, 20 November 2026",

  // Countdown target (India time, +05:30)
  countdownTo: "2026-11-20T04:30:00+05:30",

  // Programme. icon: "kalasha" | "lotus" | "leaf". start/end are used for "Add to Calendar".
  events: [
    {
      id: "muhurtha", icon: "kalasha", short: "Muhurtha",
      title: "Gruha Pravesha Muhurtha", time: "4:30 – 6:15 AM",
      description: "Entering our new home at the auspicious hour.",
      start: "2026-11-20T04:30:00+05:30", end: "2026-11-20T06:15:00+05:30",
      featured: true,
    },
    {
      id: "pooja", icon: "lotus", short: "Lakshmi Pooja",
      title: "Lakshmi Pooja", time: "9:00 AM",
      description: "Worship of Goddess Lakshmi for the prosperity of the home.",
      start: "2026-11-20T09:00:00+05:30", end: "2026-11-20T10:00:00+05:30",
    },
    {
      id: "lunch", icon: "leaf", short: "Lunch",
      title: "Lunch", subtitle: "Bhojana", time: "1:00 PM",
      description: "Please join us for a traditional meal.",
      start: "2026-11-20T13:00:00+05:30", end: "2026-11-20T14:30:00+05:30",
    },
  ],

  venue: {
    short: "on Hassan Road, Kadavina Kote Badavane, Holenarasipura Town.",
    address: "Kadavina Kote Badavane, Hassan Road, Holenarasipura Taluk, Hassan District, Karnataka",
    lat: 12.808560,                    // exact pin of the house
    lng: 76.231682,
    mapLink: "https://maps.app.goo.gl/b2kjwheL8gbtfQBMA",
  },

  whatsapp: "918762860047",           // country code + number, digits only
  rsvpEndpoint: "",                    // Google Apps Script web-app URL. Empty = RSVP goes to WhatsApp.
  calendarFiles: true,                 // iPhone "Add to Calendar" uses the files in assets/calendar/ (regenerate if times change)
  music: "assets/music.mp3",           // if the file is missing, a soft tanpura drone plays instead
  showKannada: true,                   // show the Kannada invocation lines
  siteUrl: "",                         // final https:// address, used when sharing (empty = current page)
  credit: "LeadLogic Solution",

  // Gallery photos, e.g. { src: "assets/photos/house-1.jpg", alt: "Front of the new home", caption: "" }
  gallery: [],
};

/* ========================================================= */

(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), CONFIG);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const waLink = (text, number = CONFIG.whatsapp) => `https://wa.me/${number || ""}?text=${encodeURIComponent(text)}`;
  // Open in a new tab; if the browser blocks that (some in-app browsers do), open in this tab instead
  const openLink = (url) => {
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else location.href = url;
  };

  /* ---------- Motifs ---------- */
  const ICONS = {
    diya: `<svg viewBox="0 0 60 64">
      <defs><radialGradient id="dg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFD36A" stop-opacity=".75"/><stop offset="1" stop-color="#FFD36A" stop-opacity="0"/></radialGradient>
      <linearGradient id="df" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E97A1F"/><stop offset=".55" stop-color="#F6C453"/><stop offset="1" stop-color="#FFF1B8"/></linearGradient></defs>
      <circle class="flame-glow" cx="30" cy="22" r="20" fill="url(#dg)"/>
      <path class="flame" d="M30 6 C37 17 37 26 30 31 C23 26 23 17 30 6 Z" fill="url(#df)"/>
      <path class="flame" d="M30 17 C32.5 22 32.5 26 30 28.5 C27.5 26 27.5 22 30 17 Z" fill="#FFFBEA"/>
      <path d="M7 35 C11 50 49 50 53 35 C45 39 15 39 7 35 Z" fill="#C9822B"/>
      <path d="M50 34 C56 31 59 33 56.5 36.5 Z" fill="#B06A22"/>
      <ellipse cx="30" cy="35" rx="23" ry="4" fill="#8A4B1E"/>
      <ellipse cx="30" cy="34.4" rx="19" ry="2.4" fill="#E8B22B" opacity=".55"/>
      <g fill="#FFE29A"><circle cx="18" cy="42" r="1.1"/><circle cx="30" cy="44" r="1.1"/><circle cx="42" cy="42" r="1.1"/></g>
      <path d="M22 47 L38 47 L36 53 L24 53 Z" fill="#A9631F"/>
      <ellipse cx="30" cy="54" rx="11" ry="3" fill="#8A4B1E"/></svg>`,
    kalasha: `<svg viewBox="0 0 48 48" aria-hidden="true">
      <g fill="#2F6B3A"><path d="M24 15 C18 9 12 9 8 12 C13 15 18 16 24 15 Z"/><path d="M24 15 C30 9 36 9 40 12 C35 15 30 16 24 15 Z"/><path d="M24 15 C20 8 16 6 12 6 C15 11 19 14 24 15 Z"/><path d="M24 15 C28 8 32 6 36 6 C33 11 29 14 24 15 Z"/></g>
      <ellipse cx="24" cy="11" rx="5" ry="6" fill="#8A5A2B"/><path d="M21 7 Q24 3 27 7" stroke="#6B4320" fill="none" stroke-width="1"/>
      <rect x="18" y="16" width="12" height="4" rx="1.5" fill="#D9A23A" stroke="#85601F" stroke-width=".8"/>
      <path d="M15 22 C9 28 10 38 16 42 H32 C38 38 39 28 33 22 Z" fill="#E8B22B" stroke="#85601F" stroke-width="1"/>
      <path d="M12.5 30 H35.5" stroke="#A3202A" stroke-width="1.6"/><g fill="#A3202A"><circle cx="18" cy="35" r="1.2"/><circle cx="24" cy="36" r="1.2"/><circle cx="30" cy="35" r="1.2"/></g>
      <ellipse cx="24" cy="43" rx="8" ry="2" fill="#B8893A"/></svg>`,
    lotus: `<svg viewBox="0 0 48 48" aria-hidden="true">
      <g stroke="#8C1A22" stroke-width="1" stroke-linejoin="round">
      <path d="M24 38 C14 38 6 32 4 24 C12 24 19 29 24 38 Z" fill="#F3A8A0"/><path d="M24 38 C34 38 42 32 44 24 C36 24 29 29 24 38 Z" fill="#F3A8A0"/>
      <path d="M24 38 C15 34 11 25 13 15 C20 19 24 28 24 38 Z" fill="#EE8C88"/><path d="M24 38 C33 34 37 25 35 15 C28 19 24 28 24 38 Z" fill="#EE8C88"/>
      <path d="M24 38 C18 31 18 18 24 8 C30 18 30 31 24 38 Z" fill="#E36A6E"/></g>
      <path d="M8 42 Q24 46 40 42" stroke="#2F6B3A" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    leaf: `<svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M4 30 C6 16 22 8 44 10 C42 28 28 40 8 38 Z" fill="#3F8A4A" stroke="#245A2E" stroke-width="1"/>
      <path d="M6 36 C18 28 30 20 43 11" stroke="#BFE0A8" stroke-width="1.2" fill="none"/>
      <g stroke="#BFE0A8" stroke-width=".7" fill="none"><path d="M14 30 L12 22"/><path d="M20 26 L19 17"/><path d="M27 21 L27 13"/><path d="M15 31 L22 33"/><path d="M22 26 L30 27"/></g>
      <circle cx="22" cy="24" r="4.5" fill="#FFF8E8"/><circle cx="31" cy="22" r="3.2" fill="#F2B23A"/><circle cx="16" cy="31" r="3" fill="#E97A1F"/><circle cx="28" cy="30" r="2.6" fill="#FFF8E8"/></svg>`,
    leafToran: `<svg viewBox="0 0 20 44"><path d="M10 0 C17 8 18 24 10 44 C2 24 3 8 10 0 Z" fill="#2F6B3A"/><path d="M10 3 V40" stroke="#7FB069" stroke-width=".9"/></svg>`,
    strand: `<svg viewBox="0 0 20 52"><path d="M10 0 V48" stroke="#B8893A" stroke-width="1"/>
      <g stroke="#C85A12" stroke-width="1.2" stroke-dasharray="1.6 1.4"><circle cx="10" cy="9" r="7.5" fill="#E97A1F"/><circle cx="10" cy="24" r="7" fill="#F2A53A"/><circle cx="10" cy="38.5" r="6.5" fill="#E97A1F"/></g>
      <g fill="#E8B22B"><circle cx="10" cy="9" r="2.4"/><circle cx="10" cy="24" r="2.2"/><circle cx="10" cy="38.5" r="2"/></g></svg>`,
    milkpot: `<svg class="milkpot" viewBox="0 0 80 96" aria-hidden="true">
      <g class="mp-fire"><path d="M30 92 C26 86 30 80 33 77 C34 82 38 84 36 92 Z" fill="#E97A1F"/><path d="M42 92 C38 85 42 79 46 76 C47 82 51 85 48 92 Z" fill="#F6C453"/></g>
      <rect x="18" y="88" width="10" height="6" rx="2" fill="#8A7A6A"/><rect x="52" y="88" width="10" height="6" rx="2" fill="#8A7A6A"/>
      <path class="mp-drip mp-drip--l" d="M20 38 C17.5 46 17.5 56 20 60 C22.5 56 22.5 46 20 38 Z" fill="#FFFDF6" stroke="#E6DCC8" stroke-width=".6"/>
      <path class="mp-drip mp-drip--r" d="M60 38 C57.5 44 57.5 52 60 55 C62.5 52 62.5 44 60 38 Z" fill="#FFFDF6" stroke="#E6DCC8" stroke-width=".6"/>
      <path d="M20 42 C10 52 11 74 26 84 H54 C69 74 70 52 60 42 Z" fill="#C9973E" stroke="#6B4A1C" stroke-width="1.2"/>
      <path d="M14 60 H66" stroke="#A3202A" stroke-width="2"/><g fill="#A3202A"><circle cx="28" cy="68" r="1.6"/><circle cx="40" cy="70" r="1.6"/><circle cx="52" cy="68" r="1.6"/></g>
      <path d="M22 50 C26 54 30 55 34 55" stroke="#F4D58A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path class="mp-foam" d="M20 38 C24 31 30 33 34 30 C38 27 44 29 48 30 C53 28 58 31 60 38 Z" fill="#FFFDF6" stroke="#E6DCC8" stroke-width=".6"/>
      <rect x="18" y="36" width="44" height="7" rx="3.5" fill="#D8B66A" stroke="#6B4A1C" stroke-width="1"/></svg>`,
  };

  /* ---------- Fill text from CONFIG ---------- */
  $$("[data-c]").forEach((el) => {
    const v = get(el.dataset.c);
    if (v == null || v === "") return;
    el.textContent = "";
    String(v).split("\n").forEach((part, i) => {
      if (i) el.append(document.createElement("br"));
      el.append(part);
    });
  });
  if (!CONFIG.showKannada) $$('[lang="kn"]').forEach((el) => (el.hidden = true));

  $$("[data-diya]").forEach((el) => (el.innerHTML = ICONS.diya));
  $$("[data-icon]").forEach((el) => (el.innerHTML = ICONS[el.dataset.icon] || ""));
  $$("[data-toran]").forEach((el) => {
    const n = parseInt(el.dataset.toran, 10) || 13;
    let html = "";
    for (let i = 0; i < n; i++) {
      const leaf = i % 2 === 0;
      html += `<span class="toran__item ${leaf ? "toran__leaf" : "toran__strand"}" style="--i:${i}">${leaf ? ICONS.leafToran : ICONS.strand}</span>`;
    }
    el.innerHTML = html;
  });

  /* ---------- Programme timeline ---------- */
  $("#timeline").innerHTML = CONFIG.events.map((ev, i) => `
    <li class="tl-item reveal" style="--d:${i * 120}ms">
      <div class="tl-icon" aria-hidden="true">${ICONS[ev.icon] || ICONS.kalasha}</div>
      <article class="tl-card${ev.featured ? " tl-card--featured" : ""}">
        <p class="tl-time">${esc(ev.time)}</p>
        <h3>${esc(ev.title)}</h3>
        ${ev.subtitle ? `<p class="tl-sub">${esc(ev.subtitle)}</p>` : ""}
        <p class="tl-desc">${esc(ev.description)}</p>
        ${ev.id === "muhurtha" ? `<div class="milkpot-row">${ICONS.milkpot}<span class="milkpot-cap">Overflowing milk — a symbol of abundance</span></div>` : ""}
        <button type="button" class="btn btn--ghost btn--sm" data-ics="${i}" aria-label="Add ${esc(ev.title)} to calendar">+ Add to Calendar</button>
      </article>
    </li>`).join("");

  /* ---------- Add to Calendar ----------
     iPhone / iPad / Mac → opens the Apple Calendar "Add Event" sheet (.ics file, with reminders)
     Android / everything else → opens Google Calendar with the event filled in, ready to Save */
  const icsDate = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const icsText = (s) => String(s).replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.venue.lat},${CONFIG.venue.lng}`;
  const evDetails = (ev) =>
    `${CONFIG.occasion} of "${CONFIG.houseName}"\nHosted by ${CONFIG.hosts.full}\n\nDirections: ${directionsUrl}`;
  const evLocation = () => `${CONFIG.houseName}, ${CONFIG.venue.address}`;
  const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);

  function buildICS(ev) {
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Gruha Pravesha Invitation//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${ev.id}-${icsDate(ev.start)}@gruha-pravesha`,
      `DTSTAMP:${icsDate(ev.start)}`,
      `DTSTART:${icsDate(ev.start)}`,
      `DTEND:${icsDate(ev.end || ev.start)}`,
      `SUMMARY:${icsText(`${ev.title} — ${CONFIG.houseName}`)}`,
      `DESCRIPTION:${icsText(evDetails(ev))}`,
      `LOCATION:${icsText(evLocation())}`,
      `GEO:${CONFIG.venue.lat};${CONFIG.venue.lng}`,
      // Reminders: the day before, and 1 hour before
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${icsText(`Tomorrow: ${ev.title}`)}`, "END:VALARM",
      "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", `DESCRIPTION:${icsText(`In 1 hour: ${ev.title}`)}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
  }
  function googleCalUrl(ev) {
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: `${ev.title} — ${CONFIG.houseName}`,
      dates: `${icsDate(ev.start)}/${icsDate(ev.end || ev.start)}`,
      details: evDetails(ev),
      location: evLocation(),
      ctz: "Asia/Kolkata",
    });
    return `https://calendar.google.com/calendar/render?${p}`;
  }
  // Exposed so the ready-made files in assets/calendar/ can be regenerated after changing CONFIG
  window.buildICS = (id) => buildICS(CONFIG.events.find((e) => e.id === id));

  $("#timeline").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ics]");
    if (!btn) return;
    const ev = CONFIG.events[+btn.dataset.ics];
    if (isApple) {
      // A real .ics file on the website opens straight into Apple Calendar (also inside WhatsApp's browser)
      location.href = CONFIG.calendarFiles && location.protocol !== "file:"
        ? `assets/calendar/${ev.id}.ics`
        : `data:text/calendar;charset=utf-8,${encodeURIComponent(buildICS(ev))}`;
    } else {
      openLink(googleCalUrl(ev));
    }
  });

  /* ---------- Venue ---------- */
  // Google's official directions link: opens the Maps app (or website) with the route to the pin ready
  const pin = `${CONFIG.venue.lat},${CONFIG.venue.lng}`;
  $("#mapFrame").src = `https://maps.google.com/maps?q=${pin}&z=16&output=embed`;
  $("#directionsBtn").href = `https://www.google.com/maps/dir/?api=1&destination=${pin}&travelmode=driving`;

  /* ---------- Gallery ---------- */
  if (CONFIG.gallery.length) {
    $("#galleryTrack").innerHTML = CONFIG.gallery.map((p) => `
      <figure><img src="${esc(p.src)}" alt="${esc(p.alt || "")}" loading="lazy">${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}</figure>`).join("");
    $("#gallery").hidden = false;
  }

  /* ---------- Scroll reveal ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); revealIO.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, [data-lines]").forEach((el) => revealIO.observe(el));

  /* ---------- Countdown ---------- */
  const target = new Date(CONFIG.countdownTo).getTime();
  const cd = { d: $("#cd-days"), h: $("#cd-hours"), m: $("#cd-mins"), s: $("#cd-secs") };
  const pad = (n) => String(n).padStart(2, "0");
  let cdTimer;
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      cd.d.textContent = cd.h.textContent = cd.m.textContent = cd.s.textContent = "00";
      $("#arrived").hidden = false;
      clearInterval(cdTimer);
      return;
    }
    const sec = Math.floor(diff / 1000);
    cd.d.textContent = pad(Math.floor(sec / 86400));
    cd.h.textContent = pad(Math.floor((sec % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((sec % 3600) / 60));
    cd.s.textContent = pad(sec % 60);
  }
  tick();
  cdTimer = setInterval(tick, 1000);

  /* ---------- Falling marigold petals ---------- */
  const Petals = (() => {
    const canvas = $("#petals");
    if (reduceMotion || !canvas.getContext) return { level() {}, burst() {} };
    const ctx = canvas.getContext("2d");
    const colors = ["#E97A1F", "#F2A53A", "#E8B22B", "#D9531E", "#F6C453", "#C8432B"];
    const rand = (a, b) => a + Math.random() * (b - a);
    let w = 0, h = 0, petals = [], target = 0, raf = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(top) {
      return {
        x: rand(0, w), y: top ? rand(-h * 0.5, -10) : rand(-20, h),
        r: rand(5, 10), vy: rand(0.7, 1.7), vx: rand(-0.3, 0.3),
        rot: rand(0, Math.PI * 2), vr: rand(-0.035, 0.035),
        sway: rand(0.4, 1.3), phase: rand(0, Math.PI * 2),
        color: colors[(Math.random() * colors.length) | 0],
        a: 1, life: Infinity,
      };
    }
    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(t / 900 + p.phase) * p.sway * 0.5;
        p.rot += p.vr;
        p.life--;
        if (p.life <= 0 || (target === 0 && p.life === Infinity)) p.a -= 0.015; // fade extras instead of letting them linger
        if (p.a <= 0) { petals.splice(i, 1); continue; }
        if (p.y > h + 20) {
          if (petals.length > target) petals.splice(i, 1);
          else Object.assign(p, make(true), { y: -10 });
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(t / 600 + p.phase)));
        ctx.globalAlpha = Math.min(1, p.a);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.6, p.r * 0.7, p.r * 0.7, 0, p.r);
        ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.7, -p.r * 0.9, -p.r * 0.6, 0, -p.r);
        ctx.fill();
        ctx.strokeStyle = "rgba(120,40,10,.25)";
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(0, -p.r * 0.8); ctx.lineTo(0, p.r * 0.8); ctx.stroke();
        ctx.restore();
      }
      raf = petals.length && !document.hidden ? requestAnimationFrame(frame) : 0;
    }
    function run() { if (!raf && petals.length && !document.hidden) raf = requestAnimationFrame(frame); }
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", run);
    return {
      level(n) {
        target = n;
        if (n) petals.forEach((p) => { if (p.life === Infinity) p.a = 1; });
        while (petals.length < n) petals.push(make(true));
        run();
      },
      burst(n) {
        for (let i = 0; i < n; i++) petals.push(Object.assign(make(true), { y: rand(-80, h * 0.45), life: rand(140, 280) }));
        run();
      },
    };
  })();

  // Gentle petal fall only while the hero is on screen
  new IntersectionObserver(([en]) => {
    if (document.body.classList.contains("is-entered")) Petals.level(en.isIntersecting ? 14 : 0);
  }, { threshold: 0.2 }).observe($("#top"));

  /* ---------- Lakshmi footprints walking into the home ---------- */
  const padaWrap = $("#padas");
  let padas = [];
  function layoutPadas() {
    if (reduceMotion) return;
    padaWrap.innerHTML = "";
    const main = $("#main");
    const H = main.offsetHeight;
    const start = $("#top").offsetHeight + 40;
    const step = 210;
    for (let y = start, i = 0; y < H - 420; y += step, i++) {
      const img = document.createElement("img");
      img.src = "assets/pada.svg";
      img.alt = "";
      img.className = "pada" + (i % 2 ? " pada--r" : "");
      img.style.top = (i % 2 ? y + step / 2 - 70 : y) + "px";
      padaWrap.append(img);
    }
    padas = $$(".pada", padaWrap);
    revealPadas();
  }
  function revealPadas() {
    const mainTop = $("#main").getBoundingClientRect().top;
    const line = window.innerHeight * 0.82;
    padas.forEach((p) => { if (mainTop + p.offsetTop < line) p.classList.add("is-on"); });
  }
  let scrollQueued = false;
  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { scrollQueued = false; revealPadas(); });
  }, { passive: true });
  let resizeT;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(layoutPadas, 250); });

  /* ---------- Music ---------- */
  const Music = (() => {
    const btn = $("#musicBtn");
    let audio = null, useSynth = !CONFIG.music, playing = false;
    let actx = null, master = null, synthTimer = 0, synthOn = false;

    if (CONFIG.music) {
      audio = new Audio();
      audio.loop = true;
      audio.volume = 0.55;
      audio.preload = "none";
      audio.src = CONFIG.music;
      audio.addEventListener("error", () => { useSynth = true; if (playing) startSynth(); });
    }

    function ensureCtx() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!actx) {
        actx = new AC();
        master = actx.createGain();
        master.gain.value = 0;
        master.connect(actx.destination);
      }
      if (actx.state === "suspended") actx.resume();
      return actx;
    }
    // A soft tanpura-style drone (Pa · Sa · Sa · low Sa), used when no music file is present.
    function pluck(freq, t) {
      const g = actx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(1, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 4.2);
      const f = actx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(2600, t);
      f.frequency.exponentialRampToValueAtTime(700, t + 3.2);
      f.connect(g).connect(master);
      [0.5, 0.32, 0.22, 0.15, 0.1, 0.06].forEach((amp, i) => {
        const o = actx.createOscillator();
        const og = actx.createGain();
        o.frequency.value = freq * (i + 1) * (1 + i * 0.0012);
        og.gain.value = amp;
        o.connect(og).connect(f);
        o.start(t);
        o.stop(t + 4.4);
      });
    }
    function cycle() {
      const t = actx.currentTime + 0.05;
      const sa = 146.83;
      [[sa * 0.75, 0], [sa * 2, 1.1], [sa * 2, 2.2], [sa, 3.3]].forEach(([f, dt]) => pluck(f, t + dt));
    }
    function startSynth() {
      if (synthOn || !ensureCtx()) return;
      synthOn = true;
      master.gain.cancelScheduledValues(actx.currentTime);
      master.gain.setTargetAtTime(0.07, actx.currentTime, 0.8);
      cycle();
      synthTimer = setInterval(cycle, 4400);
    }
    function stopSynth() {
      if (!synthOn) return;
      synthOn = false;
      clearInterval(synthTimer);
      master.gain.setTargetAtTime(0, actx.currentTime, 0.3);
    }
    function setUI() {
      btn.setAttribute("aria-pressed", String(playing));
      btn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    }
    function play() {
      playing = true;
      setUI();
      ensureCtx(); // unlock audio inside the tap
      if (!useSynth && audio) {
        audio.play().catch(() => { useSynth = true; if (playing) startSynth(); });
      } else startSynth();
    }
    function pause() {
      playing = false;
      setUI();
      if (audio) audio.pause();
      stopSynth();
    }
    btn.addEventListener("click", () => (playing ? pause() : play()));
    document.addEventListener("visibilitychange", () => {
      if (!playing) return;
      if (document.hidden) { if (audio) audio.pause(); if (actx) actx.suspend(); }
      else if (!useSynth && audio) audio.play().catch(() => {});
      else if (actx) actx.resume();
    });
    return { play };
  })();

  /* ---------- Opening door ---------- */
  const opening = $("#opening");
  let entered = false;
  function enter() {
    if (entered) return;
    entered = true;
    opening.classList.add("is-open");
    Music.play();
    setTimeout(() => Petals.burst(60), reduceMotion ? 0 : 700);
    setTimeout(() => {
      opening.classList.add("is-gone");
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-entered");
      Petals.level(14);
      $(".hero__title").focus({ preventScroll: true });
      layoutPadas();
    }, reduceMotion ? 300 : 1900);
    setTimeout(() => opening.remove(), reduceMotion ? 1200 : 3400);
  }
  $("#openBtn").addEventListener("click", enter);
  $$(".door", opening).forEach((d) => d.addEventListener("click", enter));
  window.scrollTo(0, 0);

  /* ---------- Share ---------- */
  $("#shareBtn").addEventListener("click", async () => {
    const url = CONFIG.siteUrl || location.href.split("#")[0];
    const text = `You are invited to the ${CONFIG.occasion} of "${CONFIG.houseName}" — ${CONFIG.hosts.full}, ${CONFIG.dateLong}.`;
    if (navigator.share) {
      try { await navigator.share({ title: document.title, text, url }); } catch (_) { /* cancelled */ }
    } else {
      openLink(waLink(`${text}\n${url}`, ""));
    }
  });

  /* ---------- RSVP ---------- */
  const form = $("#rsvpForm");
  const errorEl = $("#formError");
  const attendFields = $("#attendFields");
  $("#eventChoices").innerHTML = CONFIG.events.map((ev) =>
    `<label class="choice"><input type="checkbox" name="events" value="${esc(ev.short)}" checked><span>${esc(ev.short)}</span></label>`).join("");

  if (!CONFIG.rsvpEndpoint) {
    // No Google Sheet connected: the main button sends the RSVP on WhatsApp
    $("#rsvpSubmit").textContent = "Send RSVP on WhatsApp";
    $("#rsvpSubmit").classList.replace("btn--primary", "btn--wa");
    $("#rsvpWa").hidden = true;
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "attending") {
      const no = e.target.value === "No";
      attendFields.hidden = no;
      $$("input", attendFields).forEach((i) => (i.disabled = no));
    }
  });

  function readForm() {
    const fd = new FormData(form);
    return {
      name: (fd.get("name") || "").trim(),
      attending: fd.get("attending") || "",
      guests: fd.get("attending") === "No" ? "0" : fd.get("guests") || "1",
      events: fd.get("attending") === "No" ? "" : fd.getAll("events").join(", "),
      message: (fd.get("message") || "").trim(),
    };
  }
  function rsvpText(d) {
    const lines = [`🙏 ${CONFIG.occasion} RSVP — ${CONFIG.houseName}`, ""];
    if (d.name) lines.push(`Name: ${d.name}`);
    if (d.attending) lines.push(`Attending: ${d.attending === "Yes" ? "Yes, we'll be there" : "Sorry, we can't make it"}`);
    if (d.attending === "Yes") {
      lines.push(`Guests: ${d.guests}`);
      if (d.events) lines.push(`Events: ${d.events}`);
    }
    if (d.message) lines.push(`Message: ${d.message}`);
    return lines.join("\n");
  }
  function validate(d) {
    if (!d.attending) return "Please let us know whether you can attend.";
    if (!d.name) return "Please enter your name.";
    if (d.attending === "Yes" && !d.events) return "Please choose at least one event.";
    return "";
  }
  function showThanks(d) {
    $("#thanksTitle").textContent = d.attending === "Yes" ? `Thank you, ${d.name}!` : `Thank you, ${d.name}`;
    $("#thanksMsg").textContent = d.attending === "Yes"
      ? `We look forward to welcoming you to "${CONFIG.houseName}".`
      : "You will be missed. Your blessings mean a great deal to us.";
    form.hidden = true;
    $("#thanks").hidden = false;
    $("#thanks").focus();
    Petals.burst(40);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = readForm();
    const err = validate(d);
    errorEl.textContent = err;
    if (err) return;

    if (!CONFIG.rsvpEndpoint) {
      openLink(waLink(rsvpText(d)));
      showThanks(d);
      return;
    }
    const btn = $("#rsvpSubmit");
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      await fetch(CONFIG.rsvpEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({ ...d, submittedAt: new Date().toISOString() }),
      });
      showThanks(d);
    } catch (_) {
      errorEl.textContent = "Sorry, that didn't go through. Please try again, or use the WhatsApp button below.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send RSVP";
    }
  });

  $("#rsvpWa").addEventListener("click", () => {
    const d = readForm();
    const text = d.name || d.attending ? rsvpText(d) : `🙏 Namaskara! RSVP for the ${CONFIG.occasion} of "${CONFIG.houseName}" on ${CONFIG.dateLong}.`;
    openLink(waLink(text));
  });

  $("#rsvpAgain").addEventListener("click", () => {
    $("#thanks").hidden = true;
    form.hidden = false;
    $("#guestName").focus();
  });

  /* ---------- Layout once fonts & images settle ---------- */
  window.addEventListener("load", () => { if (entered) layoutPadas(); });
})();
