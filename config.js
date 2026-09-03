/* ============================================================
   ✏️  CUSTOMIZE EACH ORDER HERE (the only file you edit)
   ============================================================ */
window.GFD = {
  herName: "Rahamah",
  yourName: "Yusu",
  monogram: "R · Y",

  // The day you got together (year, month 1-12, day)
  togetherSince: { year: 2021, month: 2, day: 14 },

  letter: [
    "Happy Girlfriend's Day. I've been trying to find the words all week, and every one of them came out too small for what I actually mean.",
    "Every single day with you feels like a gift I somehow got lucky enough to unwrap twice.",
    "You make me feel so loved, I feel entrapped and late night walks with you are heavenly.",
    "Today is your day, and I wanted the whole internet to know how loved you are."
  ],

  reasons: [
    { title: "Your laugh",      body: "You laugh at my worst jokes like they genuinely deserve it, and it rewires my whole day." },
    { title: "Your warmth",     body: "Rooms change temperature when you walk in. People feel it. I watch it happen." },
    { title: "Your taste",      body: "Your playlists read my mind. Your restaurant picks never miss. I've stopped doubting you." },
    { title: "Your generosity", body: "You always share your food. Eventually. After negotiations. I respect the process." },
    { title: "Your faith",      body: "You believe in me on the days I can't. That's carried me further than you know." },
    { title: "Your magic",      body: "You turn boring Tuesdays into core memories. It's a talent. It's my favorite one." }
  ],

  // Replace with her photo URLs. Leave [] to show styled placeholders.
  photos: [],
  photoCaptions: ["the first date", "that weekend away", "her favorite place", "the night it rained", "golden hour", "just us"],

  finalMessage: "I love you. Today, tomorrow, always.",

  /* ---------- BACKGROUND MUSIC ----------
     Save your audio file in THIS folder (next to index.html) named exactly:

         music.mp3

     …and it just works. Nothing else to change. .m4a / .wav / .ogg are fine too.
     Just match the name below to whatever you saved. A remote https:// URL also
     works. Set musicUrl to "" for a silent site.

     If the file isn't there yet, the site still runs fine and the music button
     simply doesn't appear, so you can keep building before you add the track.

     ⚠️  Licensing: for a site you SELL, use a track cleared for commercial use
     (see README). A copyrighted single is fine for your own private gift, but
     don't ship it to paying customers.                                        */
  musicUrl: "music.mp3",
  musicTitle: "",          // optional, shows on hover: "Golden Hour by Kioto"
  musicVolume: 0.45,       // 0 to 1

  /* Where the song starts. Skip a slow intro and open on the chorus.
       "0:00"  start at the beginning (default)
       "1:30"  start at one minute thirty
       "0:47"  start at forty-seven seconds
       90      plain seconds work too
     When the track finishes it loops back to this point, not to 0:00.
     Her first page starts here; later pages continue from where she was,
     so the song never restarts as she turns pages.                        */
  musicStartAt: "0:00",

  /* Browsers will not let any website play sound until the visitor taps once.
     So the cover shows a short "open the letter" screen, and her tap both opens
     the site and starts the song. From her side it opens with music playing.
     It appears once per visit, never on pages 2 to 6.
     Set to false to drop it (the music then waits for her first tap anywhere). */
  musicIntro: true
};
