# CekHoaks — Demo video script (≤ 3 min)

- Format: 1920x1080, H.264 + AAC, 30 fps. English narration (male voice),
  Indonesian UI on screen with English captions/callouts.
- Pipeline: same as the Kiroween v2 video — Playwright screen capture of
  the LIVE app + Kokoro TTS narration + ffmpeg segment concat.
- Cover: designed, warm cream + deep teal + amber (match the app), NOT
  monotonous blue-black. Title: "CekHoaks — Don't forward. Check first."
- Framing line (spoken + on screen at least twice): "a red-flag scanner,
  not a truth oracle."

## Segments

### s1 — Cover + hook (0:00–0:15, ~15s)
- Shot: designed cover card (app logo + phone mock with a WhatsApp forward).
- Narration: "Every Indonesian family has received this message. A warning.
  A free gift. An invitation. Most people forward first — and check later.
  If ever."
- Caption: "CekHoaks — Don't forward. Check first."

### s2 — The problem (0:15–0:50, ~35s)
- Shots: the three example forwards as phone screenshots (Martinelli,
  free PLN token, wedding APK) — real hoaxes, already debunked.
- Narration: "These are real. The Martinelli video that hacks your phone.
  A free five-hundred-thousand-rupiah electricity token. A wedding
  invitation that is actually malware. All debunked by fact-checkers — all
  still circulating in family groups today."
- Caption: "Real hoaxes. Still forwarding."

### s3 — Demo 1: Martinelli → RED (0:50–1:20, ~30s)
- Shots: live app — tap "Contoh 1", tap "Periksa Sekarang", verdict card
  animates in (RED), matched-hoax card with TurnBackHoax source link.
- Narration: "Paste the forward. One tap. CekHoaks matches it against nine
  hoaxes that fact-checkers already debunked — and flags the shouting,
  the forward-bait, the fake authority. Red. Don't forward yet."
- Caption: "Match found: WhatsApp Gold / Martinelli — debunked 2020."

### s4 — Demo 2 + 3: token → RED, ordinary message → GREEN (1:20–1:50, ~30s)
- Shots: live app — Example 2 → RED verdict; Example 3 (ordinary family
  message) → GREEN verdict.
- Narration: "Same for the free-token scam — red. And an ordinary family
  message? Green. No red flags found. But green never means 'definitely
  true' — it means nothing suspicious was found."
- Caption: "Red = pause. Green = no red flags — still verify."

### s5 — How it works (1:50–2:20, ~30s)
- Shots: hoax-list section scrolling (9 entries with sources), then the
  "Cara kerja" card; terminal showing `node --test test.mjs` → 29 pass.
- Narration: "Nine verified hoaxes, eleven detectors, all deterministic.
  No AI in the verdict, no API key to leak, no data stored. Twenty-nine
  tests, all passing. One file, zero dependencies, running on Cloudflare."
- Caption: "Deterministic by design. No LLM in the verdict."

### s6 — Close (2:20–2:40, ~20s)
- Shots: live app home + repo page; live URL + repo URL on screen.
- Narration: "CekHoaks. A red-flag scanner, not a truth oracle. Live now —
  paste a forward, and check before you share."
- Caption: "cekhoaks.digitalshoup.my.id · github.com/real0xSI/cekhoaks"

## Shot checklist (for the capture run)

- [ ] s1 cover (designed HTML card, screenshot)
- [ ] s2 three forward screenshots (static cards, from the example texts)
- [ ] s3 live: home → Contoh 1 → Periksa → RED verdict + hoax card
- [ ] s4 live: Contoh 2 → RED; Contoh 3 → GREEN
- [ ] s5 live: hoax list scroll + Cara kerja card; terminal test run
- [ ] s6 live: home + GitHub repo page
- [ ] Narration WAVs (male Kokoro voice), one per segment
- [ ] Total ≤ 180s. Verify with ffprobe after concat.
