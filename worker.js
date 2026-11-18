// CekHoaks — pemindai red flag untuk pesan berantai WhatsApp (GenHacks 2026).
// Single-file Cloudflare Worker, zero npm dependencies.
// Bahasa Indonesia, phone-first. BUKAN penentu benar/salah: alat ini hanya
// menandai pola yang lazim muncul di hoaks & penipuan, lalu mengarahkan
// pengguna untuk memverifikasi ke pemeriksa fakta resmi.
// TIDAK ada panggilan LLM: semua deteksi deterministik, bekerja offline
// dari logika (sengaja — tanpa kunci API, tanpa paywall, tanpa data keluar).

// ---------------------------------------------------------------------------
// Data: daftar hoaks yang pernah dibantah pemeriksa fakta.
// Setiap entri DIVERIFIKASI dari sumber di bawah (dibaca 2026-11-18).
// Jangan tambah entri tanpa sumber. Jangan karang entri.
// ---------------------------------------------------------------------------
export const HOAXES = [
  {
    id: "whatsapp-gold-martinelli",
    title: "WhatsApp Gold & video “Martinelli” meretas HP",
    summary:
      "Pesan berantai lama (sejak 2016–2017) yang mengklaim video “Martinelli” akan meretas HP secara permanen dan ada versi premium “WhatsApp Gold”. Sudah dibantah Kepolisian Spanyol, Sophos, dan pemeriksa fakta Indonesia — tidak ada video atau virus seperti itu.",
    patterns: ["whatsapp gold", "martinelli", "dance of the pope", "video martinelli", "whatsapp plus"],
    minMatch: 1,
    source: { name: "TurnBackHoax (Mafindo)", url: "https://turnbackhoax.id/2020/11/24/salah-pesan-tentang-whatsapp-gold-dan-video-martinelli-dan-dance-of-the-pope-yang-dapat-meretas-ponsel/" },
  },
  {
    id: "vaksin-microchip",
    title: "Vaksin COVID-19 berisi microchip pelacak",
    summary:
      "Klaim vaksin COVID-19 berisi microchip untuk melacak manusia (dikaitkan dengan Bill Gates). Tidak ada bukti ilmiah; teknologi yang dirujuk adalah tinta pencatat riwayat vaksinasi, bukan alat pelacak — dan tidak pernah digabungkan dengan vaksin apa pun.",
    patterns: ["microchip", "chip dalam vaksin", "vaksin mengandung chip", "chip pelacak", "bill gates", "vaksin untuk depopulasi"],
    minMatch: 2,
    source: { name: "TurnBackHoax — verifikasi Tempo", url: "https://gfd.turnbackhoax.id/focus/23511" },
  },
  {
    id: "bawang-merah-virus",
    title: "Bawang merah kupas menyedot virus & kuman",
    summary:
      "Klaim bawang merah yang dikupas lalu ditaruh di mangkuk bisa menyedot dan membunuh virus/kuman di ruangan. Tidak ada bukti ilmiah — Snopes sudah membantahnya sejak 2009, dan National Onion Association menyebutnya mitos.",
    patterns: ["bawang merah", "menyedot virus", "menyerap virus", "menyerap kuman", "bawang dikupas"],
    minMatch: 2,
    source: { name: "TurnBackHoax (Mafindo)", url: "https://turnbackhoax.id/2020/03/23/salah-bawang-merah-yang-dikupas-bisa-menyedot-dan-membunuh-virus-dan-kuman/" },
  },
  {
    id: "bawang-putih-corona",
    title: "Air rebusan bawang putih menyembuhkan corona",
    summary:
      "Klaim pasien COVID-19 bisa sembuh dengan minum air rebusan bawang putih (8 siung + 7 gelas air). Tidak ada penelitian yang membuktikan bawang putih menyembuhkan corona — dikonfirmasi peneliti LIPI dan dokter FKUI.",
    patterns: ["bawang putih", "air rebusan bawang", "rebusan bawang putih", "menyembuhkan corona", "sembuh dari corona"],
    minMatch: 2,
    source: { name: "Tempo CekFakta", url: "https://cekfakta.tempo.co/fakta/582/faktaatauhoaksbenarkahpasienviruscoronawuhanbisasembuhdenganminumairbawangputih" },
  },
  {
    id: "token-listrik-gratis",
    title: "Token listrik gratis Rp300–500 ribu dari PLN",
    summary:
      "Klaim token listrik gratis via link / WhatsApp / Telegram mengatasnamakan PLN. PLN menegaskan tidak pernah ada promo itu — pola ini adalah phishing untuk mencuri data pribadi. Promo resmi hanya lewat PLN Mobile dan kanal resmi PLN.",
    patterns: ["token listrik gratis", "token gratis", "pln", "rp500 000", "rp 500 000", "rp300 000", "rp 300 000", "rp 300 ribu"],
    minMatch: 2,
    source: { name: "Jabar Saber Hoaks", url: "https://saberhoaks.jabarprov.go.id/v2/klarifikasi/detail/ADN016657/TOKEN-LISTRIK-GRATIS-RP.500.000-UNTUK-PENGGUNA-TELEGRAM" },
  },
  {
    id: "undangan-apk",
    title: "Undangan pernikahan digital berformat .apk",
    summary:
      "File .apk berkedok “Surat Undangan Pernikahan Digital” dikirim lewat WhatsApp. Setelah diinstal, aplikasi meminta akses SMS dan bisa membaca OTP / SMS-banking lalu menguras rekening. BSSN mengimbau: jangan instal APK dari chat, unduh aplikasi hanya dari toko resmi.",
    patterns: ["undangan pernikahan", "surat undangan", "undangan digital", ".apk", "apk"],
    minMatch: 2,
    source: { name: "BSSN", url: "https://bssn.go.id/imbauan-keamanan-modus-penipuan-menggunakan-undangan-pernikahan-elektronik-apk/" },
  },
  {
    id: "bansos-link-palsu",
    title: "Link pendaftaran bansos PKH / BLT palsu",
    summary:
      "Link pendaftaran bansos PKH dan BLT yang beredar di media sosial mengarah ke formulir yang meminta data pribadi (nama, NIK, nomor Telegram). Kemensos tidak pernah membuka pendaftaran lewat link acak — cek resmi hanya di cekbansos.kemensos.go.id atau aplikasi Cek Bansos.",
    patterns: ["bansos", "pkh", "blt", "daftar bansos", "link pendaftaran", "cek bansos"],
    minMatch: 2,
    source: { name: "TurnBackHoax (Mafindo)", url: "https://turnbackhoax.id/articles/31127" },
  },
  {
    id: "gempa-megathrust-tanggal",
    title: "Prediksi tanggal pasti gempa megathrust",
    summary:
      "Klaim gempa megathrust akan terjadi pada tanggal tertentu. BMKG menegaskan belum ada teknologi di dunia yang bisa memprediksi waktu gempa secara presisi — yang bisa dipetakan hanya potensi dan zona rawan, bukan tanggal dan jam.",
    patterns: ["megathrust", "gempa besar", "prediksi gempa", "ramalan gempa", "gempa akan terjadi"],
    minMatch: 2,
    source: { name: "JalaHoaks Jakarta (mengutip BMKG)", url: "https://jalahoaks.jakarta.go.id/detail/Hoaks-Gempa-Bumi-Besar-akan-Terjadi-di-Indonesia-Menjelang-Akhir-2026" },
  },
  {
    id: "etilang-palsu",
    title: "Surat tilang elektronik (ETLE) palsu via WA/SMS",
    summary:
      "Pesan tilang elektronik palsu via WhatsApp/SMS berisi link phishing atau file .apk. Tilang resmi tidak pernah dikirim sebagai APK dan tidak meminta transfer ke rekening pribadi. Cek tilang hanya di etilang.info atau konfirmasi-etle.polri.go.id.",
    patterns: ["e-tilang", "etilang", "surat tilang", "tilang elektronik", "tilang-kejaksaans"],
    minMatch: 2,
    source: { name: "Korlantas Polri & Kejaksaan RI (dirangkum AutoChem)", url: "https://autochem.id/Detail/Tips-Dan-Trik/1039/Modus-Penipuan-Berkedok-Tilang-Elektronik-Waspada-Jika-Menerima-Whatsapp-Dari-Nomor-Tidak-Jelas" },
  },
];

// ---------------------------------------------------------------------------
// Normalisasi & pencocokan (word-boundary, case-insensitive).
// ---------------------------------------------------------------------------
export function norm(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

function containsPhrase(text, phrase) {
  const t = " " + norm(text) + " ";
  const p = " " + norm(phrase) + " ";
  return p.trim().length > 0 && t.includes(p);
}

// ---------------------------------------------------------------------------
// Detektor sinyal sensasional / penipuan. Setiap sinyal punya bobot dan
// bukti berupa pola yang cocok (pola berasal dari daftar ini, BUKAN dari
// input pengguna — jadi tidak ada input pengguna yang dipantulkan mentah).
// ---------------------------------------------------------------------------
const CAPS_ALLOW = new Set(["hp", "wa", "pln", "ktp", "sim", "bpjs", "pkh", "blt", "bbm", "atm", "otp", "apk", "covid", "bmkg", "who", "nasa", "etle", "sms", "nik", "rt", "rw", "bumn", "polri", "tni", "rs", "puskesmas", "posyandu"]);

export const SIGNALS = [
  {
    id: "caps",
    label: "Huruf kapital berlebih (teriakan)",
    desc: "Banyak kata ditulis KAPITAL SEMUA — gaya khas pesan berantai yang dibuat untuk memancing panik.",
    weight: 2,
    test(text) {
      const words = String(text || "").split(/\s+/).filter(Boolean);
      if (words.length < 5) return null;
      const caps = words.filter((w) => {
        const letters = w.replace(/[^A-Za-z]/g, "");
        return letters.length >= 3 && letters === letters.toUpperCase() && !CAPS_ALLOW.has(letters.toLowerCase());
      });
      if (caps.length >= 3 && caps.length / words.length >= 0.2) return caps.length + " kata kapital terdeteksi";
      return null;
    },
  },
  {
    id: "forward-bait",
    label: "Ajakan meneruskan pesan",
    desc: "Pesan meminta disebarkan ke grup/teman — ciri utama pesan berantai, benar atau tidak isinya.",
    weight: 2,
    test(text) {
      const hit = ["sebarkan", "teruskan", "forward", "kirim ke", "share ke", "bagikan ke", "jangan berhenti di kamu", "viralkan", "bantu sebarkan", "teruskan ke"].find((p) => containsPhrase(text, p));
      return hit || null;
    },
  },
  {
    id: "urgency",
    label: "Bahasa mendesak / menakut-nakuti waktu",
    desc: "Kata-kata yang memaksa bertindak sekarang — trik agar korban tidak sempat berpikir.",
    weight: 1,
    test(text) {
      const hit = ["segera", "sekarang juga", "jangan ditunda", "sebelum dihapus", "sebelum terlambat", "darurat", "penting sekali", "batas waktu", "hari ini terakhir", "kuota terbatas", "sebelum kuota habis"].find((p) => containsPhrase(text, p));
      return hit || null;
    },
  },
  {
    id: "fake-authority",
    label: "Klaim otoritas tanpa nama jelas",
    desc: "“Menurut dokter / para ahli / penelitian membuktikan…” tanpa nama, lembaga, atau tautan yang bisa dicek.",
    weight: 1,
    test(text) {
      const hit = ["menurut dokter", "kata dokter", "dokter mengatakan", "para ahli", "penelitian membuktikan", "terbukti secara ilmiah", "sudah terbukti", "menurut penelitian", "menurut sumber terpercaya", "dokter di china", "dokter muslim"].find((p) => containsPhrase(text, p));
      return hit || null;
    },
  },
  {
    id: "delete-warning",
    label: "“Jangan dihapus” / “sebelum dihapus”",
    desc: "Pesan melarang dihapus — pola klasik agar pesan berantai terus hidup dan tidak sempat diverifikasi.",
    weight: 2,
    test(text) {
      const hit = ["jangan dihapus", "jangan sampai dihapus"].find((p) => containsPhrase(text, p));
      return hit || null;
    },
  },
  {
    id: "money-bait",
    label: "Iming-iming gratis / hadiah",
    desc: "Janji uang, token, atau hadiah gratis yang mengharuskan klik link / daftar / hubungi nomor — modus phishing paling umum.",
    weight: 2,
    test(text) {
      const t = norm(text);
      if (!t.includes("gratis") && !t.includes("hadiah")) return null;
      const hit = ["klik", "daftar", "klaim", "dapatkan", "hadiah", "token", "bantuan", "rp", "uang", "saldo"].find((p) => containsPhrase(text, p));
      return hit ? "gratis/hadiah + " + hit : null;
    },
  },
  {
    id: "no-source",
    label: "Tanpa sumber yang bisa dicek",
    desc: "Pesan panjang yang membuat klaim faktual tapi tidak menyertakan tautan, nama media, atau lembaga resmi.",
    weight: 1,
    test(text) {
      const s = String(text || "");
      if (s.length < 150) return null;
      if (/https?:\/\//i.test(s) || /www\./i.test(s)) return null;
      const known = ["kompas", "detik", "tempo", "liputan6", "cnn", "bbc", "turnbackhoax", "kemenkes", "bmkg", "kemensos", "polri", "bssn", "sumber:"];
      if (known.some((k) => norm(s).includes(k))) return null;
      return "tidak ada tautan / nama sumber";
    },
  },
  {
    id: "punctuation",
    label: "Tanda seru / tanya berlebihan",
    desc: "Deretan !!! atau ??? — gaya penulisan yang dirancang untuk memancing emosi, bukan menyampaikan fakta.",
    weight: 1,
    test(text) {
      const s = String(text || "");
      if (s.includes("!!!") || s.includes("???")) return "!!! / ???";
      if ((s.match(/!/g) || []).length >= 3) return "tanda seru 3x atau lebih";
      return null;
    },
  },
  {
    id: "apk-danger",
    label: "File .apk / unduhan aplikasi dari chat",
    desc: "File .apk yang dikirim lewat chat BUKAN undangan atau dokumen — itu aplikasi yang bisa mencuri SMS dan OTP. Jangan pernah instal.",
    weight: 3,
    test(text) {
      if (containsPhrase(text, ".apk") || containsPhrase(text, "apk")) return ".apk";
      // "Unduh aplikasi resmi dari Play Store" is legitimate advice, not a
      // scam — only flag unduh/instal-aplikasi when no official store is named.
      const safeStore =
        containsPhrase(text, "play store") || containsPhrase(text, "app store") || containsPhrase(text, "toko resmi");
      if (!safeStore && (containsPhrase(text, "unduh") || containsPhrase(text, "instal") || containsPhrase(text, "install")) && containsPhrase(text, "aplikasi")) return "unduh/instal aplikasi dari chat";
      return null;
    },
  },
  {
    id: "otp-phishing",
    label: "Meminta kode OTP / verifikasi",
    desc: "Pesan meminta kode OTP atau kode verifikasi — kode itu adalah kunci rekening dan akunmu. Pihak resmi tidak pernah memintanya.",
    weight: 3,
    test(text) {
      const hit = ["kode otp", "kode verifikasi", "minta kode", "kirim kode", "kode 6 digit", "kode otp"].find((p) => containsPhrase(text, p));
      return hit || null;
    },
  },
  {
    id: "fear-words",
    label: "Kata-kata menakut-nakuti",
    desc: "Dua atau lebih kata menakut-nakuti (bahaya, mati, racun…) dalam satu pesan — dipakai untuk mematikan nalar kritis.",
    weight: 1,
    test(text) {
      const hits = ["bahaya", "mati", "meninggal", "racun", "mematikan", "ancaman"].filter((p) => containsPhrase(text, p));
      return hits.length >= 2 ? hits.slice(0, 3).join(", ") : null;
    },
  },
];

// ---------------------------------------------------------------------------
// Analisis: cocokkan daftar hoaks + jalankan semua sinyal → verdict.
// Skor: MERAH jika cocok hoaks ATAU skor >= 6; KUNING jika skor >= 2;
// HIJAU jika 0–1. Bahasa verdict selalu hati-hati: ini pemindai red flag,
// BUKAN penentu benar/salah.
// ---------------------------------------------------------------------------
export const VERDICTS = {
  merah: {
    title: "Banyak red flag — jangan teruskan dulu",
    advice: "Pesan ini cocok dengan pola hoaks/penipuan yang sudah dibantah, atau mengandung banyak sinyal khas pesan berantai. Jangan diteruskan. Cek dulu ke pemeriksa fakta di bawah.",
  },
  kuning: {
    title: "Ada red flag — verifikasi dulu",
    advice: "Ada beberapa pola yang patut diwaspadai. Isinya belum tentu salah, tapi jangan langsung percaya dan jangan teruskan sebelum dicek ke sumber resmi.",
  },
  hijau: {
    title: "Tidak ada red flag terdeteksi",
    advice: "Tidak ditemukan pola hoaks atau penipuan pada teks ini. Ingat: “tidak ada red flag” bukan berarti isinya pasti benar — tetap cek sumbernya sebelum meneruskan.",
  },
};

export function analyzeText(rawText) {
  const text = String(rawText || "").slice(0, 10000);
  const flags = [];
  for (const sig of SIGNALS) {
    let evidence = null;
    try {
      evidence = sig.test(text);
    } catch {
      evidence = null;
    }
    if (evidence) flags.push({ id: sig.id, label: sig.label, desc: sig.desc, weight: sig.weight, evidence: String(evidence) });
  }
  const score = flags.reduce((a, f) => a + f.weight, 0);

  let match = null;
  let bestHits = 0;
  for (const hoax of HOAXES) {
    const hits = hoax.patterns.filter((p) => containsPhrase(text, p));
    if (hits.length >= hoax.minMatch && hits.length > bestHits) {
      bestHits = hits.length;
      match = { id: hoax.id, title: hoax.title, summary: hoax.summary, source: hoax.source, matchedPatterns: hits };
    }
  }

  const verdict = match || score >= 6 ? "merah" : score >= 2 ? "kuning" : "hijau";
  return {
    verdict,
    score,
    flags,
    match,
    counts: { hoaxesChecked: HOAXES.length, signalsChecked: SIGNALS.length },
  };
}

// ---------------------------------------------------------------------------
// Halaman utama (satu file, tanpa aset eksternal).
// Catatan: skrip klien di bawah TIDAK memakai backtick / ${} supaya aman
// di dalam template literal ini. Semua konten pengguna dirender dengan
// textContent — tidak ada innerHTML dari input pengguna.
// ---------------------------------------------------------------------------
export const PAGE = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CekHoaks — Pemindai Red Flag Pesan Berantai</title>
<meta name="description" content="Tempel pesan berantai WhatsApp, langsung ketahuan red flag-nya. Bukan penentu benar/salah — pemindai pola hoaks & penipuan.">
<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #FFF8EC; color: #1F2937; }
header { background: #0F5257; color: #FFF8EC; padding: 28px 20px 22px; }
header .wrap, main .wrap, footer .wrap { max-width: 640px; margin: 0 auto; }
.logo { font-size: 34px; font-weight: 800; letter-spacing: -0.5px; }
.logo span { color: #F59E0B; }
.tagline { margin: 6px 0 0; font-size: 16px; opacity: 0.92; }
.chip { display: inline-block; margin-top: 12px; background: #F59E0B; color: #1F2937; font-weight: 700; font-size: 13px; padding: 5px 10px; border-radius: 999px; }
main { padding: 20px 16px 8px; }
.card { background: #fff; border: 1px solid #F3D9A4; border-radius: 14px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(15,82,87,0.06); }
h2 { font-size: 18px; margin: 0 0 8px; color: #0F5257; }
p { line-height: 1.55; margin: 6px 0; }
.steps { display: flex; gap: 8px; }
.step { flex: 1; background: #0F5257; color: #FFF8EC; border-radius: 10px; padding: 10px 8px; text-align: center; font-size: 13px; font-weight: 600; }
.step b { display: block; font-size: 20px; color: #F59E0B; }
textarea { width: 100%; min-height: 150px; border: 2px solid #0F5257; border-radius: 12px; padding: 12px; font-size: 16px; font-family: inherit; resize: vertical; background: #FFFEFA; }
textarea:focus { outline: 3px solid #F59E0B; border-color: #F59E0B; }
.btn { display: block; width: 100%; border: 0; border-radius: 12px; background: #F59E0B; color: #1F2937; font-size: 18px; font-weight: 800; padding: 14px; cursor: pointer; margin-top: 10px; }
.btn:active { transform: scale(0.99); }
.btn:disabled { opacity: 0.6; }
.examples { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.ex { border: 1px solid #0F5257; background: #fff; color: #0F5257; border-radius: 999px; padding: 7px 12px; font-size: 13px; font-weight: 600; cursor: pointer; }
#result { display: none; }
.verdict { border-radius: 12px; padding: 14px; color: #fff; }
.verdict.merah { background: #DC2626; }
.verdict.kuning { background: #D97706; }
.verdict.hijau { background: #15803D; }
.verdict h3 { margin: 0 0 4px; font-size: 20px; }
.verdict p { margin: 0; font-size: 14px; opacity: 0.95; }
.score { margin-top: 10px; font-size: 14px; font-weight: 700; }
.flag { border-left: 4px solid #F59E0B; background: #FFF8EC; padding: 10px 12px; border-radius: 0 10px 10px 0; margin: 10px 0; }
.flag b { display: block; }
.flag small { color: #6B7280; }
.flag .ev { font-size: 13px; margin-top: 4px; }
.hoax { border: 2px solid #DC2626; border-radius: 12px; padding: 12px; margin: 12px 0; background: #FEF2F2; }
.hoax h4 { margin: 0 0 6px; color: #DC2626; }
.links a { display: block; background: #0F5257; color: #FFF8EC; text-decoration: none; font-weight: 700; padding: 12px; border-radius: 10px; margin: 8px 0; text-align: center; }
.hoaxitem { border-bottom: 1px solid #F3D9A4; padding: 10px 0; }
.hoaxitem:last-child { border-bottom: 0; }
.hoaxitem b { display: block; }
.hoaxitem a { color: #0F5257; font-size: 13px; }
footer { padding: 16px; font-size: 13px; color: #6B7280; }
footer .wrap { border-top: 1px solid #F3D9A4; padding-top: 12px; }
</style>
</head>
<body>
<header><div class="wrap">
<div class="logo">🛡️ Cek<span>Hoaks</span></div>
<p class="tagline">Tempel pesan berantai WhatsApp, langsung ketahuan red flag-nya.</p>
<span class="chip">Bukan penentu benar/salah — pemindai pola hoaks &amp; penipuan</span>
</div></header>
<main><div class="wrap">

<div class="card"><h2>Cara kerja</h2>
<div class="steps">
<div class="step"><b>1</b>Tempel pesan</div>
<div class="step"><b>2</b>Periksa red flag</div>
<div class="step"><b>3</b>Verifikasi sumber</div>
</div>
<p>Aplikasi mencocokkan teks dengan <b>daftar hoaks yang sudah dibantah</b> pemeriksa fakta, plus mendeteksi <b>11 sinyal khas pesan berantai</b> (ajakan meneruskan, bahasa mendesak, iming-iming gratis, file .apk, minta OTP, dan lain-lain). Semua pengecekan deterministik — tanpa AI, tanpa kunci API, teksmu tidak disimpan.</p>
</div>

<div class="card"><h2>Periksa pesan</h2>
<textarea id="input" placeholder="Tempel pesan berantai dari WhatsApp di sini…"></textarea>
<button class="btn" id="checkBtn">🔍 Periksa Sekarang</button>
<div class="examples">
<button class="ex" data-ex="0">Contoh 1: Video Martinelli</button>
<button class="ex" data-ex="1">Contoh 2: Token listrik gratis</button>
<button class="ex" data-ex="2">Contoh 3: Pesan biasa</button>
</div>
</div>

<div class="card" id="result"></div>

<div class="card"><h2>Cek juga di pemeriksa fakta</h2>
<p>Kalau masih ragu, verifikasi langsung ke sumbernya sebelum meneruskan:</p>
<div class="links">
<a href="https://turnbackhoax.id/" target="_blank" rel="noopener">TurnBackHoax (Mafindo)</a>
<a href="https://cekfakta.tempo.co/" target="_blank" rel="noopener">Tempo CekFakta</a>
<a href="https://cekbansos.kemensos.go.id/" target="_blank" rel="noopener">Cek Bansos Resmi (Kemensos)</a>
</div></div>

<div class="card"><h2>Daftar hoaks yang dikenali (<span id="hoaxCount">…</span>)</h2>
<p>Setiap entri di bawah sudah dibantah oleh pemeriksa fakta — klik sumbernya untuk baca klarifikasi lengkap.</p>
<div id="hoaxList"><p>Memuat daftar…</p></div>
</div>

</div></main>
<footer><div class="wrap">
<p><b>Penting:</b> CekHoaks adalah pemindai red flag, bukan penentu benar/salah. “Tidak ada red flag” bukan berarti isinya pasti benar, dan “banyak red flag” bukan berarti isinya pasti salah. Selalu verifikasi ke sumber resmi sebelum meneruskan pesan.</p>
<p>CekHoaks — GenHacks 2026 · Track: AI, Agentic Systems, Cybersecurity, and Dev Tools · Dibangun dengan Cloudflare Workers, zero dependency.</p>
</div></footer>
<script>
var EXAMPLES = [
"PERHATIAN!!! Jangan buka video Martinelli besok, HP kamu bisa diretas permanen dan tidak bisa diperbaiki lagi! Sebarkan ke semua grup sebelum terlambat!!! Menurut para ahli, video ini mengandung virus berbahaya. Jangan dihapus!!!",
"Dapatkan token listrik gratis Rp500.000 dari PLN! Klik link ini sekarang juga sebelum kuota habis, daftar pakai nomor WhatsApp kamu. Sebarkan ke 5 grup biar tokennya cair!",
"Halo semua, jangan lupa pengajian rutin RT besok jam 19.30 di balai warga. Yang mau ikut bawa buku Yasin ya. Terima kasih."
];
var VERDICT_TEXT = {
merah: { title: "Banyak red flag — jangan teruskan dulu", advice: "Pesan ini cocok dengan pola hoaks/penipuan yang sudah dibantah, atau mengandung banyak sinyal khas pesan berantai. Jangan diteruskan. Cek dulu ke pemeriksa fakta di atas." },
kuning: { title: "Ada red flag — verifikasi dulu", advice: "Ada beberapa pola yang patut diwaspadai. Isinya belum tentu salah, tapi jangan langsung percaya dan jangan teruskan sebelum dicek ke sumber resmi." },
hijau: { title: "Tidak ada red flag terdeteksi", advice: "Tidak ditemukan pola hoaks atau penipuan pada teks ini. Ingat: tidak ada red flag bukan berarti isinya pasti benar — tetap cek sumbernya sebelum meneruskan." }
};
function el(tag, text, cls) {
  var e = document.createElement(tag);
  if (text !== undefined && text !== null) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function renderResult(data) {
  var box = document.getElementById("result");
  box.innerHTML = "";
  box.style.display = "block";
  var v = el("div", null, "verdict " + data.verdict);
  v.appendChild(el("h3", VERDICT_TEXT[data.verdict].title));
  v.appendChild(el("p", VERDICT_TEXT[data.verdict].advice));
  box.appendChild(v);
  box.appendChild(el("p", "Skor red flag: " + data.score + "  ·  " + data.flags.length + " sinyal ditemukan  ·  " + data.counts.hoaxesChecked + " hoaks dicek", "score"));
  if (data.match) {
    var h = el("div", null, "hoax");
    h.appendChild(el("h4", "⚠️ Cocok dengan hoaks yang pernah dibantah:"));
    h.appendChild(el("b", data.match.title));
    h.appendChild(el("p", data.match.summary));
    var a = el("a", "Baca klarifikasi: " + data.match.source.name);
    a.href = data.match.source.url; a.target = "_blank"; a.rel = "noopener";
    h.appendChild(a);
    box.appendChild(h);
  }
  data.flags.forEach(function(f) {
    var d = el("div", null, "flag");
    d.appendChild(el("b", "🚩 " + f.label));
    d.appendChild(el("small", f.desc));
    d.appendChild(el("p", "Bukti: " + f.evidence, "ev"));
    box.appendChild(d);
  });
  if (data.flags.length === 0 && !data.match) {
    box.appendChild(el("p", "Tidak ada sinyal yang ditemukan pada teks ini."));
  }
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}
document.getElementById("checkBtn").addEventListener("click", function() {
  var text = document.getElementById("input").value;
  var btn = document.getElementById("checkBtn");
  if (!text.trim()) { alert("Tempel dulu pesannya."); return; }
  btn.disabled = true; btn.textContent = "Memeriksa…";
  fetch("/api/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: text }) })
    .then(function(r) { return r.json(); })
    .then(function(data) { renderResult(data); })
    .catch(function() { alert("Gagal memeriksa. Coba lagi."); })
    .finally(function() { btn.disabled = false; btn.textContent = "🔍 Periksa Sekarang"; });
});
document.querySelectorAll(".ex").forEach(function(b) {
  b.addEventListener("click", function() {
    document.getElementById("input").value = EXAMPLES[parseInt(b.getAttribute("data-ex"), 10)];
    document.getElementById("input").focus();
  });
});
fetch("/api/hoaxes").then(function(r) { return r.json(); }).then(function(d) {
  document.getElementById("hoaxCount").textContent = d.count;
  var list = document.getElementById("hoaxList");
  list.innerHTML = "";
  d.hoaxes.forEach(function(h) {
    var item = el("div", null, "hoaxitem");
    item.appendChild(el("b", h.title));
    item.appendChild(el("p", h.summary));
    var a = el("a", "Sumber: " + h.source.name);
    a.href = h.source.url; a.target = "_blank"; a.rel = "noopener";
    item.appendChild(a);
    list.appendChild(item);
  });
});
</script>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// HTTP handler.
// ---------------------------------------------------------------------------
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(PAGE, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/api/check" && request.method === "POST") {
      let body = {};
      try {
        body = await request.json();
      } catch {
        return json({ error: "body harus JSON {text}" }, 400);
      }
      if (typeof body.text !== "string" || !body.text.trim()) {
        return json({ error: "field text wajib diisi" }, 400);
      }
      return json(analyzeText(body.text));
    }
    if (url.pathname === "/api/hoaxes") {
      return json({
        count: HOAXES.length,
        hoaxes: HOAXES.map((h) => ({ id: h.id, title: h.title, summary: h.summary, source: h.source })),
      });
    }
    return new Response("Not found", { status: 404 });
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
