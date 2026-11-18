// CekHoaks tests — node:test, zero dependencies.
// Run: node --test test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import worker, { HOAXES, SIGNALS, analyzeText, norm } from "./worker.js";

const MARTINELLI =
  "PERHATIAN!!! Jangan buka video Martinelli besok, HP kamu bisa diretas permanen dan tidak bisa diperbaiki lagi! Sebarkan ke semua grup sebelum terlambat!!! Menurut para ahli, video ini mengandung virus berbahaya. Jangan dihapus!!!";
const TOKEN_LISTRIK =
  "Dapatkan token listrik gratis Rp500.000 dari PLN! Klik link ini sekarang juga sebelum kuota habis, daftar pakai nomor WhatsApp kamu. Sebarkan ke 5 grup biar tokennya cair!";
const BAWANG_MERAH =
  "Taruh bawang merah yang sudah dikupas di mangkuk di setiap kamar, bawang merah bisa menyedot virus dan kuman lalu membunuhnya. Sudah banyak yang membuktikan, sebarkan ke keluarga!";
const CLEAN =
  "Halo semua, jangan lupa pengajian rutin RT besok jam 19.30 di balai warga. Yang mau ikut bawa buku Yasin ya. Terima kasih.";
const MEDIUM =
  "Info penting sekali, tolong sebarkan ke grup keluarga. Menurut para ahli, kita harus segera waspada sebelum terlambat.";

// --- Data integrity: every hoax entry is real, sourced, and well-formed. ---
test("hoax list: 9 entries, all with id/title/summary/patterns/source", () => {
  assert.equal(HOAXES.length, 9);
  const ids = new Set();
  for (const h of HOAXES) {
    assert.ok(h.id && typeof h.id === "string", "id");
    assert.ok(!ids.has(h.id), "duplicate id " + h.id);
    ids.add(h.id);
    assert.ok(h.title.length > 10, "title " + h.id);
    assert.ok(h.summary.length > 40, "summary " + h.id);
    assert.ok(Array.isArray(h.patterns) && h.patterns.length >= 4, "patterns " + h.id);
    assert.ok(h.patterns.every((p) => typeof p === "string" && p.trim().length > 0), "pattern strings " + h.id);
    assert.ok(Number.isInteger(h.minMatch) && h.minMatch >= 1, "minMatch " + h.id);
    assert.ok(h.source && h.source.name.length > 3, "source name " + h.id);
    assert.ok(/^https:\/\//.test(h.source.url), "source url https " + h.id);
  }
});

test("hoax patterns: no pattern is empty after normalization", () => {
  for (const h of HOAXES) {
    for (const p of h.patterns) assert.ok(norm(p).length > 0, h.id + ": " + p);
  }
});

// --- Hoax matching ---
test("match: Martinelli text matches whatsapp-gold-martinelli", () => {
  const r = analyzeText(MARTINELLI);
  assert.equal(r.match?.id, "whatsapp-gold-martinelli");
  assert.equal(r.verdict, "merah");
});

test("match: token listrik text matches token-listrik-gratis", () => {
  const r = analyzeText(TOKEN_LISTRIK);
  assert.equal(r.match?.id, "token-listrik-gratis");
  assert.equal(r.verdict, "merah");
});

test("match: bawang merah text matches bawang-merah-virus", () => {
  const r = analyzeText(BAWANG_MERAH);
  assert.equal(r.match?.id, "bawang-merah-virus");
  assert.equal(r.verdict, "merah");
});

test("match: clean text matches no hoax", () => {
  const r = analyzeText(CLEAN);
  assert.equal(r.match, null);
});

test("match: vaksin microchip text matches vaksin-microchip", () => {
  const r = analyzeText(
    "Awas, vaksin covid mengandung microchip dari Bill Gates untuk melacak manusia. Jangan mau divaksin, sebarkan!"
  );
  assert.equal(r.match?.id, "vaksin-microchip");
});

test("match: undangan APK text matches undangan-apk", () => {
  const r = analyzeText(
    "Halo, ini undangan pernikahan digital kami. Silakan unduh file apk-nya di sini dan instal aplikasi undangannya ya."
  );
  assert.equal(r.match?.id, "undangan-apk");
});

// --- Individual signals ---
test("signal caps: shouting text flagged, normal text not", () => {
  const sig = SIGNALS.find((s) => s.id === "caps");
  assert.ok(sig.test("PERHATIAN BESAR BAHAYA SEGERA BACA INI SEMUA ORANG HARUS TAHU"));
  assert.equal(sig.test("Halo, ini pesan biasa saja."), null);
  // Acronyms alone (HP, WA, PLN) must not trigger it.
  assert.equal(sig.test("Hubungi HP WA PLN di nomor resmi untuk info lebih lanjut ya."), null);
});

test("signal forward-bait: sebarkan/teruskan flagged", () => {
  const sig = SIGNALS.find((s) => s.id === "forward-bait");
  assert.ok(sig.test("Tolong sebarkan ke semua grup ya"));
  assert.equal(sig.test("Ini info dari rapat RT kemarin."), null);
});

test("signal urgency: mendesak flagged", () => {
  const sig = SIGNALS.find((s) => s.id === "urgency");
  assert.ok(sig.test("Klik sekarang juga sebelum kuota habis"));
  assert.equal(sig.test("Acara dimulai pukul sembilan pagi."), null);
});

test("signal fake-authority: menurut dokter / para ahli flagged", () => {
  const sig = SIGNALS.find((s) => s.id === "fake-authority");
  assert.ok(sig.test("Menurut dokter di China, ini sudah terbukti"));
  assert.ok(sig.test("Para ahli mengatakan hal yang sama"));
  assert.equal(sig.test("Saya baca di buku resep masakan."), null);
});

test("signal delete-warning: jangan dihapus flagged", () => {
  const sig = SIGNALS.find((s) => s.id === "delete-warning");
  assert.ok(sig.test("Pesan ini jangan dihapus ya"));
  assert.equal(sig.test("Silakan hapus pesan lama."), null);
});

test("signal money-bait: gratis + klik/daftar flagged", () => {
  const sig = SIGNALS.find((s) => s.id === "money-bait");
  assert.ok(sig.test("Dapatkan hadiah gratis, klik link ini"));
  assert.equal(sig.test("Parkir di sini gratis untuk warga."), null);
});

test("signal no-source: long claim without source flagged, linked text not", () => {
  const sig = SIGNALS.find((s) => s.id === "no-source");
  assert.ok(sig.test("Sebuah penelitian rahasia menemukan bahwa air minum kemasan mengandung zat berbahaya yang bisa menyebabkan penyakit kronis dalam jangka panjang. " + "x".repeat(60)));
  assert.equal(sig.test("Baca selengkapnya di https://turnbackhoax.id/ soal klaim ini."), null);
  assert.equal(sig.test("Pesan pendek saja."), null);
});

test("signal punctuation: !!! flagged", () => {
  const sig = SIGNALS.find((s) => s.id === "punctuation");
  assert.ok(sig.test("Awas!!! Bahaya!!! Sebarkan!!!"));
  assert.equal(sig.test("Halo, apa kabar hari ini?"), null);
});

test("signal apk-danger: .apk flagged", () => {
  const sig = SIGNALS.find((s) => s.id === "apk-danger");
  assert.ok(sig.test("Unduh file Surat_Undangan.apk di sini"));
  assert.equal(sig.test("Unduh aplikasi resmi dari Play Store."), null);
});

test("signal otp-phishing: kode OTP flagged", () => {
  const sig = SIGNALS.find((s) => s.id === "otp-phishing");
  assert.ok(sig.test("Tolong kirim kode OTP yang masuk ke HP kamu"));
  assert.equal(sig.test("Kode pos daerah kami adalah 42422."), null);
});

test("signal fear-words: two fear words flagged, one not", () => {
  const sig = SIGNALS.find((s) => s.id === "fear-words");
  assert.ok(sig.test("Ini bahaya dan bisa mematikan, hati-hati"));
  assert.equal(sig.test("Hati-hati di jalan ya."), null);
});

// --- Verdict bands ---
test("verdict: clean text is hijau with score 0", () => {
  const r = analyzeText(CLEAN);
  assert.equal(r.verdict, "hijau");
  assert.equal(r.score, 0);
  assert.equal(r.flags.length, 0);
});

test("verdict: medium text is kuning", () => {
  const r = analyzeText(MEDIUM);
  assert.equal(r.verdict, "kuning");
  assert.ok(r.score >= 2 && r.score < 6, "score " + r.score);
});

test("verdict: empty / whitespace input is hijau, never crashes", () => {
  assert.equal(analyzeText("").verdict, "hijau");
  assert.equal(analyzeText("   ").verdict, "hijau");
  assert.equal(analyzeText(null).verdict, "hijau");
  assert.equal(analyzeText(undefined).verdict, "hijau");
});

test("verdict: very long input is truncated safely", () => {
  const r = analyzeText("sebarkan ".repeat(5000));
  // "sebarkan" alone is one signal (weight 2) → kuning, not merah.
  assert.equal(r.verdict, "kuning");
  assert.ok(typeof r.score === "number");
});

// --- Safety: no user input is reflected in the output (evidence comes
// from our own pattern lists, never from the pasted text). ---
test("safety: unique marker in input never appears in output", () => {
  const r = analyzeText("ZZZUNIK123 sebarkan qqqwww999 " + "kata ".repeat(40));
  assert.ok(!JSON.stringify(r).includes("ZZZUNIK123"), "marker leaked");
  assert.ok(!JSON.stringify(r).includes("qqqwww999"), "marker leaked");
});

// --- HTTP handler ---
test("http: GET / returns 200 HTML containing CekHoaks", async () => {
  const res = await worker.fetch(new Request("https://cekhoaks.digitalshoup.my.id/"));
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /CekHoaks/);
  assert.match(html, /bukan penentu benar\/salah/i);
  assert.match(html, /Periksa Sekarang/);
});

test("http: POST /api/check returns verdict JSON", async () => {
  const res = await worker.fetch(
    new Request("https://cekhoaks.digitalshoup.my.id/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: TOKEN_LISTRIK }),
    })
  );
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.verdict, "merah");
  assert.equal(data.match.id, "token-listrik-gratis");
  assert.ok(Array.isArray(data.flags) && data.flags.length > 0);
});

test("http: POST /api/check with empty text returns 400", async () => {
  const res = await worker.fetch(
    new Request("https://cekhoaks.digitalshoup.my.id/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "   " }),
    })
  );
  assert.equal(res.status, 400);
});

test("http: GET /api/hoaxes returns the full list", async () => {
  const res = await worker.fetch(new Request("https://cekhoaks.digitalshoup.my.id/api/hoaxes"));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.count, 9);
  assert.equal(data.hoaxes.length, 9);
  assert.ok(data.hoaxes.every((h) => h.source.url.startsWith("https://")));
});

test("http: unknown path returns 404", async () => {
  const res = await worker.fetch(new Request("https://cekhoaks.digitalshoup.my.id/nope"));
  assert.equal(res.status, 404);
});
