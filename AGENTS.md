# AGENTS.md — CekHoaks (GenHacks 2026)

- Stack: Cloudflare Worker, one file `worker.js`, zero npm dependencies.
- Every behaviour change lands with a test in `test.mjs` first; run
  `node --test test.mjs` before claiming done.
- Never add a dependency, a real payment SDK, a secret, or an API key.
- Never put a secret in source. The app needs no secrets at all.
- Hoax list rule: every entry in `HOAXES` must be a real, documented hoax
  with a named fact-check source + URL, verified by reading the source.
  NEVER invent a hoax entry. If a source can't be verified, leave it out.
- Framing rule (non-negotiable): CekHoaks is a RED-FLAG SCANNER, never a
  truth oracle. Every verdict, UI string, video line, and submission text
  must say so. No "benar/salah" verdicts, ever.
- No LLM in the product: detection is deterministic only. (Deliberate:
  no key to leak, no paywall, works with the model off.)
- Deploy only via `python3 deploy.py deploy` (free Cloudflare API path).
- Demo video ≤ 3 minutes; script in DEMO-VIDEO-SCRIPT.md.
- Devpost: track "AI, Agentic Systems, Cybersecurity, and Dev Tools".
  Submit deadline Dec 26, 2026 12:00 AM ET. User clicks Submit himself.
