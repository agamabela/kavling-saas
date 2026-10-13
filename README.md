# KavlingSaaS 🏡🇮🇩
**B2B SaaS Platform for Indonesian Residential Housing Sales, Approvals, and KPR Tracking**

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**. Fully compliant with Indonesia's Personal Data Protection Law (**UU No. 27 Tahun 2022 - UU PDP**).

---

## 🚀 Quick Start

1. Masuk ke direktori proyek:
   ```bash
   cd kavling-saas
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 👥 Peran Pengguna (Role-Based Access)

Anda dapat berganti peran secara langsung menggunakan **Role Switcher Pill** di pojok kanan atas:

1. **Sales Marketing (`Rian Pratama`)** &rarr; `/marketing`
   - Input prospek nasabah baru (nama, WA, email, NIK, penghasilan bulanan).
   - Tombol cepat **One-Click WhatsApp** (`wa.me`) dengan template sapaan otomatis.
   - Pemilihan unit kavling yang tersedia.
   - Simulasi KPR lengkap (Annuity, FLPP, perhitungan Debt-Service Ratio / DSR).
   - Catat log aktivitas pendekatan (*Call*, *WhatsApp*, *Site Visit*, *Meeting*) dan batas SLA follow-up.
   - Ajukan prospek yang siap ke Supervisor (SPV).

2. **Marketing Supervisor (`Siti Rahmawati`)** &rarr; `/spv`
   - Pantau kepatuhan SLA follow-up sales (peringatan *Overdue*).
   - Antrean review calon pembeli: beri arahan (*Teruskan ke Developer*, *Minta Revisi*, atau *Drop Lead*).

3. **Developer Direksi (`Bambang Wijaya`)** &rarr; `/developer`
   - Keputusan persetujuan deal (*Approve*, *Reject*, *Revision*).
   - **Auto-Hold Unit**: Deal yang disetujui otomatis mengunci status kavling menjadi `HOLD` (48 Jam).
   - Verifikasi bukti transfer booking fee &rarr; status unit beralih menjadi `BOOKED`.
   - Monitoring papan KPR bank (7 tahap: Kelengkapan Berkas &rarr; Kirim ke Bank &rarr; BI Checking/SLIK &rarr; Appraisal &rarr; SP3K Terbit &rarr; Akad Kredit &rarr; Unit `SOLD`).

4. **Project Management / Admin** &rarr; `/admin`
   - Master kavling, harga jual, luas tanah (LT) & luas bangunan (LB).
   - Konfigurasi rekanan bank (BTN, BCA, Mandiri, BSI) dan suku bunga KPR (Fix-then-Floating & FLPP Subsidi 5%).
   - Rekaman jejak audit pelindungan data pribadi (UU PDP).

---

## 🛡️ Kepatuhan UU PDP (Pelindungan Data Pribadi)
- Nomor NIK KTP dan NPWP disamarkan secara otomatis di antarmuka tampilan (`3201************`).
- Setiap perubahan status, persetujuan direksi, dan interaksi data dicatat secara *immutable* di log audit forensik.
