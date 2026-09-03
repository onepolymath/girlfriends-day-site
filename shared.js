/* chrome injection, petal canvas, tilt parallax, shared by every page */
(() => {
  const C = window.GFD;
  const body = document.body;
  const idx = +body.dataset.idx;
  const TOTAL = 6;

  /* ----- top chrome ----- */
  const top = document.createElement("header");
  top.className = "chrome-top";
  top.innerHTML = `
    <a class="monogram" href="index.html">${C.monogram}</a>
    <span>${String(idx).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}</span>`;
  body.prepend(top);

  /* ----- bottom chrome (progress + next) ----- */
  const bottom = document.createElement("footer");
  bottom.className = "chrome-bottom";
  let bars = "";
  for (let i = 1; i <= TOTAL; i++) bars += `<i class="${i <= idx ? "on" : ""}"></i>`;
  const next = body.dataset.next;
  bottom.innerHTML = `
    <div class="progress">${bars}</div>
    ${next ? `<a class="next-link" href="${next}">
        <span class="lbl">next</span>
        <span class="ttl">${body.dataset.nextTitle}</span>
        <span class="arrow">→</span>
      </a>` : ""}`;
  body.appendChild(bottom);

  /* Warm the next page while she's reading this one, so tapping "next" doesn't
     wait on the network. Idle-scheduled so it never competes with this page. */
  if (next) {
    const warm = () => {
      const add = (href, as) => {
        const l = document.createElement("link");
        l.rel = "prefetch";
        if (as) l.as = as;
        l.href = href;
        document.head.appendChild(l);
      };
      add(next);                                        // the next document
      if (body.dataset.nextBg) add(body.dataset.nextBg, "image");  // its backdrop
    };
    "requestIdleCallback" in window ? requestIdleCallback(warm, { timeout: 2000 })
                                    : setTimeout(warm, 600);
  }

  /* ----- pointer / gyro tilt on .tilt elements + backdrop drift ----- */
  const tilts = document.querySelectorAll(".tilt");
  const backdrop = document.querySelector(".backdrop");
  const applyTilt = (nx, ny) => { /* nx, ny in [-0.5, 0.5] */
    tilts.forEach(el => {
      el.style.transform = `rotateX(${ny * -10}deg) rotateY(${nx * 10}deg)`;
    });
    if (backdrop) backdrop.style.transform = `scale(1.06) translate(${nx * -14}px, ${ny * -10}px)`;
  };
  addEventListener("mousemove", e => applyTilt(
    e.clientX / document.documentElement.clientWidth - 0.5,
    e.clientY / document.documentElement.clientHeight - 0.5));
  addEventListener("deviceorientation", e => {
    if (e.beta === null) return;
    applyTilt(Math.max(-0.5, Math.min(0.5, e.gamma / 60)),
              Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 70)));
  }, true);

  /* ----- petal / ember canvas (soft drawn shapes, no emoji) ----- */
  const cvs = document.createElement("canvas");
  cvs.id = "petals";
  body.appendChild(cvs);
  const ctx = cvs.getContext("2d");
  const DPR = Math.min(2, devicePixelRatio || 1);
  const vw = () => document.documentElement.clientWidth;
  const vh = () => document.documentElement.clientHeight;
  let W, H;
  const size = () => { W = cvs.width = vw() * DPR; H = cvs.height = vh() * DPR; };
  size();
  addEventListener("resize", size);

  const PALETTE = [
    [232, 85, 125],   // rose
    [227, 178, 107],  // gold
    [255, 107, 147],  // hot rose
    [190, 140, 200]   // lavender
  ];
  const parts = [];
  const spawn = (x, y, vx, vy, s, life) => {
    parts.push({
      x, y, vx, vy, s, life, max: life,
      c: PALETTE[(Math.random() * PALETTE.length) | 0],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      depth: 0.35 + Math.random() * 0.65
    });
  };
  for (let i = 0; i < 22; i++) {
    spawn(Math.random() * vw(), Math.random() * vh(),
      (Math.random() - 0.5) * 0.1, -0.08 - Math.random() * 0.18,
      3 + Math.random() * 7, Infinity);
  }
  window.gfdBurst = (x, y, n = 26) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1.2 + Math.random() * 3.6;
      spawn(x, y, Math.cos(a) * sp, Math.sin(a) * sp - 1.4,
        4 + Math.random() * 8, 70 + Math.random() * 60);
    }
  };

  const heartPath = (s) => {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.32);
    ctx.bezierCurveTo(-s * 0.9, -s * 0.4, -s * 0.45, -s, 0, -s * 0.42);
    ctx.bezierCurveTo(s * 0.45, -s, s * 0.9, -s * 0.4, 0, s * 0.32);
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.001;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx + Math.sin(t + p.s) * 0.08 * p.depth;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.max !== Infinity) {
        p.vy += 0.045;
        if (--p.life <= 0) { parts.splice(i, 1); continue; }
      } else if (p.y < -20) {
        p.y = vh() + 20;
        p.x = Math.random() * vw();
      }
      const alpha = (p.max === Infinity ? 0.16 : 0.75 * (p.life / p.max)) * p.depth;
      const s = p.s * p.depth * DPR;
      ctx.save();
      ctx.translate(p.x * DPR, p.y * DPR);
      ctx.rotate(p.rot);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 1.4);
      g.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${alpha})`);
      g.addColorStop(1, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`);
      ctx.fillStyle = g;
      ctx.shadowColor = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${alpha * 0.9})`;
      ctx.shadowBlur = s * 1.6;
      heartPath(s);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  };
  draw();

  /* ----- background music: resumes across pages, fades in, mutable ----- */
  if (C.musicUrl) {
    const TARGET = typeof C.musicVolume === "number" ? C.musicVolume : 0.45;

    /* accepts 90, "90", "1:30", or "1:02:03" and returns seconds */
    const toSeconds = (v) => {
      if (typeof v === "number") return isFinite(v) && v > 0 ? v : 0;
      if (typeof v !== "string" || !v.trim()) return 0;
      const parts = v.trim().split(":").map(Number);
      if (parts.some(n => !isFinite(n) || n < 0)) return 0;
      return parts.reduce((total, p) => total * 60 + p, 0);
    };
    const START = toSeconds(C.musicStartAt);

    const audio = new Audio(C.musicUrl);
    // Native looping always returns to 0, and calling play() once a track has
    // ended rewinds it to 0 per spec. So when a start point is set we wrap just
    // before the end instead, which never enters the ended state.
    audio.loop = START === 0;
    audio.preload = "auto";
    audio.volume = 0;

    // first page of the visit starts at START; later pages resume where the
    // previous one left off, so the track never restarts mid-visit
    const stored = sessionStorage.getItem("gfd-time");
    const beginAt = stored === null ? START : parseFloat(stored) || 0;
    const wasMuted = sessionStorage.getItem("gfd-muted") === "1";

    const seek = (t) => {
      if (isFinite(audio.duration) && t > 0 && t < audio.duration) audio.currentTime = t;
    };
    audio.addEventListener("loadedmetadata", () => seek(beginAt));
    if (START > 0) {
      // timeupdate fires roughly 4x a second, so wrap with a little margin
      audio.addEventListener("timeupdate", () => {
        if (isFinite(audio.duration) && audio.currentTime >= audio.duration - 0.4) {
          audio.currentTime = START;
        }
      });
    }

    // toggle button, injected into the top chrome
    const btn = document.createElement("button");
    btn.className = "music-toggle";
    btn.type = "button";
    btn.title = C.musicTitle || "Background music";
    btn.innerHTML = `<span class="eq"><i></i><i></i><i></i><i></i></span>`;
    top.insertBefore(btn, top.lastElementChild);

    // if the audio file is missing or unplayable, remove the button rather than
    // leaving a control that does nothing
    audio.addEventListener("error", () => {
      btn.remove();
      console.warn(`[music] could not load "${C.musicUrl}". Drop the file next to index.html, or set musicUrl to "" in config.js`);
    });

    let muted = wasMuted;      // her mute toggle
    let silenced = false;      // playing, but muted only to satisfy autoplay policy
    let fade = null;
    const fadeTo = (to, done) => {
      clearInterval(fade);
      fade = setInterval(() => {
        const step = to > audio.volume ? 0.03 : -0.05;
        audio.volume = Math.min(1, Math.max(0, audio.volume + step));
        if (Math.abs(audio.volume - to) < 0.035) {
          audio.volume = to;
          clearInterval(fade);
          done && done();
        }
      }, 40);
    };

    const paint = () => {
      btn.classList.toggle("is-muted", muted || silenced || audio.paused);
      btn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
    };

    /* Start with sound. If the browser refuses (it will, on a cold first load),
       fall back to MUTED playback, which is always permitted. The track is then
       already decoded, buffered and running in sync, so the moment she touches
       the screen we just unmute and it comes in instantly rather than
       starting to load from scratch. */
    const start = () => {
      if (muted) { paint(); return Promise.resolve(false); }
      audio.muted = false;
      return audio.play()
        .then(() => { silenced = false; fadeTo(TARGET); paint(); return true; })
        .catch(() => {
          audio.muted = true;
          return audio.play()
            .then(() => { silenced = true; audio.volume = TARGET; paint(); return false; })
            .catch(() => { paint(); return false; });
        });
    };

    // the first touch anywhere brings the sound in
    const soundOn = () => {
      if (muted) return;
      silenced = false;
      audio.muted = false;
      if (audio.paused) { audio.play().catch(() => {}); }
      if (audio.volume < TARGET) { audio.volume = 0; fadeTo(TARGET); }
      paint();
    };
    window.gfdSoundOn = soundOn;

    const autoplayed = start();
    ["pointerdown", "keydown", "touchstart"].forEach(ev =>
      addEventListener(ev, soundOn, { once: true, passive: true }));

    btn.addEventListener("click", e => {
      e.stopPropagation();
      muted = !muted;
      sessionStorage.setItem("gfd-muted", muted ? "1" : "0");
      if (muted) fadeTo(0, () => { audio.pause(); paint(); });
      else soundOn();
      paint();
    });

    /* Opening gate, cover page only, and ONLY when the browser actually refused
       to autoplay with sound. If it let the song through (returning visitor, or
       an origin the browser already trusts) she gets music the instant the page
       opens and never sees a gate at all. Otherwise one deliberate tap opens the
       letter and starts the song, so from her side it still opens with music. */
    const mayGate = body.dataset.page === "cover"
                 && C.musicIntro !== false
                 && !muted
                 && sessionStorage.getItem("gfd-opened") !== "1";

    autoplayed.then(audible => {
      if (!mayGate || audible) { sessionStorage.setItem("gfd-opened", "1"); return; }

      const gate = document.createElement("div");
      gate.className = "open-gate";
      gate.innerHTML = `
        <div class="open-inner">
          <svg class="open-wave" viewBox="0 0 44 24" aria-hidden="true">
            <path d="M4 12h4l3-7 4 14 4-11 3 6h4" fill="none" stroke="currentColor"
                  stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 8a6 6 0 0 1 0 8" fill="none" stroke="currentColor"
                  stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>
            <path d="M32 5a10 10 0 0 1 0 14" fill="none" stroke="currentColor"
                  stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
          </svg>
          <div class="open-for">for ${C.herName}</div>
          <button class="open-btn" type="button">open the letter</button>
          <div class="open-note">best with sound on</div>
        </div>`;
      body.appendChild(gate);
      requestAnimationFrame(() => gate.classList.add("in"));

      const openIt = () => {
        sessionStorage.setItem("gfd-opened", "1");
        soundOn();
        gate.classList.add("out");
        setTimeout(() => gate.remove(), 700);
      };
      gate.addEventListener("click", openIt, { once: true });
    });

    // hand the playhead to the next page
    const remember = () => sessionStorage.setItem("gfd-time", audio.currentTime || 0);
    setInterval(remember, 500);
    addEventListener("pagehide", remember);
    addEventListener("beforeunload", remember);
    paint();
  }
})();
