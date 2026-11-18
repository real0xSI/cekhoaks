# CekHoaks — Devpost submission draft (GenHacks 2026)

> DRAFT — paste into the Devpost form. Do NOT click Submit (user clicks it).
> Track: **AI, Agentic Systems, Cybersecurity, and Dev Tools**
> Deadline: Dec 26, 2026 12:00 AM ET.

## Project name

CekHoaks

## Tagline (elevator pitch)

Paste a WhatsApp forward, instantly see its red flags — a hoax red-flag scanner for Indonesian families.

## Description (About)

Every Indonesian family has received one: a forwarded WhatsApp message
warning about a "Martinelli" video that will hack your phone, a free
Rp500,000 electricity token from PLN, a wedding invitation that turns out
to be a malware APK. Most people forward first and check later — if ever.

CekHoaks is a phone-first web app, in Bahasa Indonesia, that answers one
question in seconds: **does this message look like the hoaxes and scams
that have already been debunked?** Paste the forward and get an instant
red-flag report:

- **Known-hoax match** — the text is checked against 9 Indonesian hoaxes
  that fact-checkers have already debunked (WhatsApp Gold / "Martinelli"
  video, COVID vaccine microchip, onion-absorbs-virus, garlic-water cures
  COVID, free PLN electricity token, wedding-invitation APK malware, fake
  PKH/BLT aid-registration links, dated megathrust-earthquake predictions,
  fake e-ticket/ETLE fines). Every entry carries its source and a link to
  the full clarification. No entry was invented.
- **11 sensational-language signals** — ALL-CAPS shouting, "forward this!"
  bait, urgency language, fake-authority claims ("according to doctors…"),
  "don't delete this", free-money bait, no checkable source, excessive
  "!!!", .apk files, OTP-code requests, fear words.
- **A 3-level verdict** — green (no red flags found), yellow (some red
  flags — verify first), red (matches a debunked hoax or many red flags —
  don't forward yet) — each with the exact flags found and links to
  fact-checkers (TurnBackHoax, Tempo CekFakta).

**Honest framing, everywhere:** CekHoaks is a red-flag scanner, never a
truth oracle. "No red flags" does not mean the message is true, and "many
red flags" does not mean it is false. The app says so on every screen and
in the video — the point is to make people pause and verify, not to
outsource judgment.

**Deliberately no LLM in the verdict path.** Detection is fully
deterministic: no API key to leak, no paywall, no data sent to any third
party, and the verdict never depends on a model. Pasted text is checked
and discarded — nothing is stored.

## Built with

Cloudflare Workers, JavaScript, Node.js

## Try it out

- Live app: https://cekhoaks.digitalshoup.my.id/
- Code: https://github.com/real0xSI/cekhoaks

## Demo video

(YouTube link — fill after upload; ≤ 3 min, shows the live app checking
three real messages: the Martinelli forward → red, the free-token forward
→ red, an ordinary family message → green.)

## How it was built

Single Cloudflare Worker, one file (`worker.js`), zero npm dependencies.
The hoax list was seeded only from published fact-checks read during the
build (TurnBackHoax/Mafindo, Tempo CekFakta, JalaHoaks Jakarta, Jabar
Saber Hoaks, BSSN, Kompas CekFakta). The detectors are plain functions
over normalized text — substring matching with word boundaries, a caps
ratio, and weighted scoring. 29 tests (`node --test test.mjs`) cover every
detector, every hoax match, the verdict bands, and the HTTP endpoints,
and all pass. The UI is one self-contained HTML page (no external assets),
designed phone-first.

AI tools used: Muse (AI coding assistant) helped write the code and the
tests. The product itself uses no AI/LLM in its detection — that is a
deliberate design choice, documented in the README.

## Testing instructions (for judges)

1. Open https://cekhoaks.digitalshoup.my.id/ on any phone or desktop.
2. Tap "Contoh 1: Video Martinelli" then "Periksa Sekarang" → expect a
   RED verdict with the matched "WhatsApp Gold & video Martinelli" hoax
   card and its TurnBackHoax source link.
3. Tap "Contoh 2: Token listrik gratis" → expect RED (matches the debunked
   free-PLN-token hoax + free-money and urgency signals).
4. Tap "Contoh 3: Pesan biasa" → expect GREEN ("Tidak ada red flag").
5. Paste any message of your own — try ALL CAPS + "sebarkan!!!" and watch
   the signals fire. Try the API directly:
   `curl -X POST https://cekhoaks.digitalshoup.my.id/api/check -H 'Content-Type: application/json' -d '{"text":"sebarkan!!!"}'`
6. `GET /api/hoaxes` lists all 9 verified hoax entries with sources.

## What I learned

The hardest part was not the code — it was the honesty. A scanner that
cries "hoax!" at everything is useless, and one that claims to know the
truth is dangerous. The real design work was the wording: three verdict
levels that say "pause and verify" instead of "true/false", a detector
that had to learn that "Unduh aplikasi resmi dari Play Store" is good
advice (not a scam signal), and a hoax list where every single entry had
to be verified against a published fact-check before it earned its place.

## Pre-existing work / disclosure

Built fresh for GenHacks, Nov 18, 2026, inside the event window. No code
from the author's other projects was reused as the submission. The hoax
entries quote public fact-checks (linked per entry); the code, detectors,
and UI are original.
