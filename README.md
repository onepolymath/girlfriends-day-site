# A Love Letter in Six Pages

A premium, six-page personalized love-letter site. Built to be sold: every order is a
one-file edit.

---

## Fulfilling an order (2 minutes)

Open **`config.js`** and change the values. Nothing else needs editing.

| Field | What it does |
|---|---|
| `herName` | Shown on the cover and the envelope |
| `yourName` | Signs the letter and the cover |
| `monogram` | The wax-seal initials, e.g. `"J · J"` |
| `togetherSince` | Start date; drives the live counter on page 5 |
| `letter[]` | The letter body. Each string is one paragraph |
| `reasons[]` | Six cards, each `{ title, body }` |
| `photos[]` | Her photo URLs. Leave `[]` to use the styled demo images |
| `photoCaptions[]` | Handwritten-style caption under each photo |
| `finalMessage` | The closing line on the last page |
| `musicUrl` | Optional background mp3 (`""` = silent) |

### Adding her photos
Upload the buyer's photos anywhere public (Cloudinary, imgur, even a GitHub repo),
then paste the direct URLs into `photos`. Six works best; the carousel is a hexagon.
Portrait crops look best in the polaroid frames.

---

## The six pages

| # | File | What happens |
|---|---|---|
| 1 | `index.html` | Cover: wax seal, her name, the invitation |
| 2 | `letter.html` | Folded paper; tap the seal to break it and unfold the letter |
| 3 | `gallery.html` | Draggable 3D polaroid carousel of their photos |
| 4 | `reasons.html` | Glass cards that flip away in 3D as she taps |
| 5 | `us.html` | Live day/hour/minute/second counter since their date |
| 6 | `forever.html` | Press the heart, petals burst, the final line appears |

Shared files: `config.js` (per-order data), `shared.css` (design system),
`shared.js` (page chrome, petals, parallax).

---

## The 3D interactions

1. **Page turns** use real cross-document View Transitions. Each page rotates away on the
   Y-axis and the next rotates in from the opposite side, with a depth push and blur.
   Browsers without support fall back to a depth-fade entrance.
2. **Parallax tilt**. The background photo and foreground cards counter-move against
   the pointer. On phones this runs off the **gyroscope**, so tilting the handset moves
   the scene. This is the effect that reads best on camera for TikTok.
3. **The polaroid carousel** is a true 3D ring; drag to spin it, release and it resumes
   its slow idle rotation.
4. **The wax seal**. The flap folds back on the X-axis, the paper drops away, and the
   letter rises in 3D.

---

## Design system

- **Type**: *Zodiak* (editorial serif, italic display) + *General Sans* (UI), both from
  Fontshare, free for commercial use.
- **Palette**: noir plum `#120810`, rose `#E8557D`, antique gold `#E3B26B`, paper `#FBF4EA`.
- **Backgrounds**: Unsplash photos (free, no attribution required), each behind a
  radial wash and a film-grain overlay so text always stays legible.
- **No emoji anywhere.** The seal, heart, and petals are hand-drawn SVG and canvas.

### Swapping a background
Each page has one line near the top of `<body>`:
```html
<div class="backdrop" style="background-image:url('...')"></div>
```
Any Unsplash URL works; append `?w=1600&q=80`. Sources worth browsing: Unsplash,
Pexels, and Cosmos for locking a look.

---

## Background music

The player is built and ready. It just needs a file. Drop an audio file into this
folder and name it in `config.js`:

```js
musicUrl: "music.mp3",
musicTitle: "Song Name by Artist",
musicVolume: 0.45
```

What it does: fades in on the first tap, loops, keeps playing **across all six pages
without restarting** (it hands the playhead to the next page), and shows an animated
equalizer button in the header that mutes and unmutes. Mute state and position both
survive navigation. Leave `musicUrl: ""` and the button never appears.

Browsers block autoplay until the visitor interacts, so the music starts on her first
tap. That's a platform rule, not something the code can bypass. That's why page 1
is a cover with a "next" button. Her first tap starts the song.

### Choosing a track you can legally sell

Commercial singles (James Arthur, Ed Sheeran, etc.) are **not licensed for
redistribution**. Putting one in a site you charge for is copyright infringement, and
it's the kind of thing that gets a Gumroad/Etsy shop taken down. Two clean paths:

**For the sites you sell**, use a track cleared for commercial use:

| Source | Terms |
|---|---|
| **Pixabay Music** (pixabay.com/music) | Free, **no attribution**, safe to resell. Best default |
| **Uppbeat** (uppbeat.io) | Free tier, but **requires artist credit** + monthly cap |
| **Tunetank** (tunetank.com) | Free **with attribution**; cinematic catalogue |
| **YouTube Audio Library** | Free, monetization-safe |

Search those for `acoustic wedding`, `romantic fingerstyle guitar`, `soft love ballad`,
or `emotional piano`. That's the lane a slow acoustic wedding-ballad sits in, and
Pixabay has a deep catalogue of instrumentals in exactly that style.

**For the buyer's own private copy**, if a customer wants *their* specific song, have
**them** supply the file, or tell them to host it themselves and give you the link.
That keeps the licensing decision with the person who owns the copy, not with your shop.

### For the TikTok video, use the real song

This is the important part: TikTok already licenses commercial music for in-app use.
Add the actual track from **TikTok's own sound library** when you post. It's licensed,
it's what the algorithm favours, and the song's audience is exactly your buyer. So the
marketing video gets the real record; the delivered product ships a cleared track.

---

## Hosting an order

Drag the folder onto **Netlify Drop** (netlify.com/drop). Free, instant, and gives a
shareable link. Vercel, Cloudflare Pages, and GitHub Pages all work the same way.
Rename the site to something like `for-jill` so the URL itself feels personal.

**Note:** fonts and demo photos load from Fontshare and Unsplash, so the finished
site needs an internet connection. To make it fully offline, download those assets
into the folder and switch the URLs to local paths.

---

## Selling it

- Record a screen capture scrolling the six pages with the phone tilting; the gyro
  parallax is what makes people stop.
- Hook: *"I made my girlfriend a website instead of buying a card."*
- Girlfriend's Day is **August 1**, so lead with the deadline.
- Comparable personalized-site gigs sell for **$10 to $25**. Offer a rush tier for
  same-day delivery.
