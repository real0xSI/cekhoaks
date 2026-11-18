# CekHoaks — Pemindai Red Flag Pesan Berantai

Tempel pesan berantai WhatsApp, langsung ketahuan red flag-nya. Phone-first,
Bahasa Indonesia, tanpa akun, tanpa install.

**Live:** https://cekhoaks.digitalshoup.my.id/
**GenHacks 2026** · Track: AI, Agentic Systems, Cybersecurity, and Dev Tools
· Submit sebelum 26 Des 2026 12:00 AM ET.

## Bukan penentu benar/salah

CekHoaks adalah **pemindai red flag**, bukan alat penentu benar/salah.
Ia menandai pola yang lazim muncul di hoaks & penipuan, lalu mengarahkan
pengguna untuk memverifikasi ke pemeriksa fakta resmi (TurnBackHoax,
Tempo CekFakta). “Tidak ada red flag” bukan berarti isinya pasti benar.

## Cara kerja

1. **Cocokkan daftar hoaks** — teks dicocokkan dengan 9 hoaks Indonesia yang
   sudah dibantah pemeriksa fakta (WhatsApp Gold / video Martinelli, vaksin
   microchip, bawang merah penyedot virus, air bawang putih penyembuh corona,
   token listrik gratis PLN, undangan pernikahan .apk, link bansos palsu,
   prediksi gempa megathrust bertanggal, e-tilang palsu). Setiap entri punya
   sumber + tautan klarifikasi. Tidak ada entri yang dikarang.
2. **11 sinyal deterministik** — huruf kapital berlebih, ajakan meneruskan
   (“sebarkan”), bahasa mendesak, klaim otoritas tanpa nama, “jangan dihapus”,
   iming-iming gratis/hadiah, tanpa sumber, tanda seru berlebihan, file .apk,
   minta kode OTP, kata-kata menakut-nakuti.
3. **Verdict 3 tingkat** — 🟢 tidak ada red flag · 🟡 ada red flag, verifikasi
   dulu · 🔴 banyak red flag / cocok hoaks yang dibantah, jangan teruskan.

## Kenapa tanpa LLM

Sengaja. Deteksi deterministik berarti: tidak ada kunci API yang bisa bocor,
tidak ada paywall, tidak ada data yang dikirim ke pihak ketiga, dan verdict
tidak pernah bergantung pada model. Teks yang ditempel tidak disimpan —
diperiksa lalu dibuang.

## Stack

- Cloudflare Worker, satu file `worker.js`, **zero npm dependencies**.
- Tes: `node --test test.mjs` (29 tes, semua lolos).
- Deploy: `python3 deploy.py deploy` (Cloudflare API gratis, tanpa kartu).

## File

| File | Isi |
|---|---|
| `worker.js` | Aplikasi + data hoaks + detektor + UI |
| `test.mjs` | 29 tes (node:test) |
| `deploy.py` | Deploy ke Cloudflare Workers |
| `SUBMISSION.md` | Draft submission Devpost (siap tempel) |
| `DEMO-VIDEO-SCRIPT.md` | Naskah video demo ≤ 3 menit |
| `AGENTS.md` | Aturan proyek |

## Jalankan tes

```sh
node --test test.mjs
```

## Lisensi

MIT.
