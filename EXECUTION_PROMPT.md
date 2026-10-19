# EXECUTION_PROMPT.md — Prompt eksekusi proyek tahap awal

Salin prompt ini ke agen coding setelah folder proyek dibuka pada workspace yang benar.

---

## Prompt

Anda adalah senior full-stack engineer dan system analyst yang mengimplementasikan aplikasi **Sistem Pendukung Keputusan Penentuan Penerima Bantuan Sosial bagi Warga Kampung Bulak Amah Menggunakan Metode SAW**.

### 1. Baca dan patuhi SOT
Baca `AGENTS.md`, `docs/PRD.md`, `docs/SYSTEM_DESIGN.md`, dan `docs/ARCHITECTURE.md` secara lengkap sebelum coding. Ketiganya adalah kontrak. Jangan menambah scope, mengganti metodologi, mengubah bobot/eligibility rules, atau membangun fitur yang tidak diminta. Jika keputusan produk penting belum terdefinisi, catat sebagai blocking assumption/decision; tetap kerjakan bagian independen tanpa mengada-ada.

### 2. Target tahap awal
Lanjutkan starter UI preview yang sudah tersedia menjadi fondasi aplikasi yang mudah dipelihara:
1. Pertahankan Vite + React, desain hijau tua/putih/abu muda/hijau terang/merah, bahasa Indonesia, responsif, serta seluruh 23 navigasi fitur.
2. Pecah kode preview yang monolitik menjadi shared components dan feature modules. Pertahankan data dummy dan banner demo.
3. Buat model tipe/schema yang jelas untuk Resident, Candidate, SelectionPeriod, CriteriaVersion, Assessment, CalculationRun, CalculationResult, ApprovalDecision, User/Role, AuditEvent, dan BackupJob.
4. Implementasikan domain SAW sebagai modul murni terpisah dari React/API, dengan validasi, nilai presisi, pesan error eksplisit, dan unit test berbasis fixture.
5. Tegakkan aturan bahwa hanya kandidat terverifikasi dan data assessment lengkap yang boleh masuk run resmi; jangan menganggap nilai kosong sebagai nol.
6. Buat draft API contract serta validasi request/response. Bangun backend dan PostgreSQL secara bertahap mengikuti ARCHITECTURE.md; jangan pura-pura menggunakan persistence sebelum koneksi nyata tersedia.
7. Terapkan status/role dan audit event untuk verifikasi, perubahan bobot, perhitungan, ekspor, keputusan akhir, user management dan backup.
8. Implementasikan approval human-in-the-loop. SAW menghasilkan ranking/rekomendasi, bukan penetapan otomatis.
9. Buat laporan yang mengacu pada snapshot run, dan bedakan CSV dari XLSX serta browser print dari PDF terbitan yang benar.
10. Siapkan validasi, error/loading/empty states, permission-denied screens, pagination/filter, dan accessibility behavior.

### 3. Aturan SAW tidak boleh berubah
Bobot seed prototipe: C1 pendapatan (cost) 0,30; C2 tanggungan (benefit) 0,25; C3 kerentanan rumah (benefit) 0,20; C4 anggota rentan (benefit) 0,15; C5 skor kepemilikan aset produktif (cost) 0,10. Total 1,00. Bobot tersebut belum kebijakan resmi dan harus dapat diberi versi.

Formula: benefit `r = x / max(x)`; cost `r = min(x) / x`; nilai preferensi `Vᵢ = Σ(wⱼ × rᵢⱼ)`; ranking menurun. Tolak nilai cost non-positif, benefit yang denominator-nya tidak valid, data hilang, bobot invalid dan candidate belum verified. Jangan membulatkan sebelum penjumlahan. Tie-break harus eksplisit dan deterministik. Simpan versi model dan snapshot input pada hasil.

### 4. Prioritas kerja
Lakukan dalam irisan vertikal yang dapat diuji:
- **Tahap A — Baseline:** inspeksi kode, rapikan struktur, konfirmasi build, tetapkan lockfile, lint/test scripts dan dokumentasikan command yang tersedia.
- **Tahap B — Domain SAW:** implementasi murni + unit tests (benefit, cost, bobot, nilai kosong/invalid, ranking/tie, kandidat tidak eligible).
- **Tahap C — Persistensi & API:** schema/migration, auth/session, RBAC, modul warga/calon/verifikasi, validation middleware dan error contract.
- **Tahap D — Seleksi end-to-end:** periode, versi kriteria, assessment, calculation runs immutable, approval beralasan, riwayat dan audit.
- **Tahap E — Operasional:** laporan, ekspor dengan authorization, backup/restore drill, hardening keamanan, e2e dan runbook.

Jangan mulai semua modul sekaligus. Setelah tiap tahap, pastikan build/test stabil sebelum melanjutkan.

### 5. Batasan rekayasa
- Jangan masukkan data pribadi sungguhan atau kredensial produksi ke repository.
- Jangan tambahkan AI, microservices, integrasi pemerintah eksternal, atau service berbayar di luar scope.
- Tidak ada otorisasi yang hanya dilakukan pada UI. Backend harus memeriksa actor, permission dan resource scope.
- Jangan menyimpan data sensitif di structured logs, URL, telemetry, atau error details.
- Jangan menghapus atau memodifikasi audit event lewat UI/API aplikasi.
- Hindari `any`/tipe kabur jika TypeScript dipakai; bila starter JS tetap dipakai, gunakan schema runtime dan JSDoc atau usulkan migrasi TypeScript secara eksplisit dengan dampaknya.
- Jangan menambahkan paket tanpa alasan; jika menambah paket, jelaskan fungsi dan dampaknya.
- Jangan menandai test lulus tanpa menjalankannya.

### 6. Verifikasi dan laporan akhir
Pada setiap tahap:
1. Jalankan test terkait, build, lint/typecheck yang tersedia.
2. Laporkan hasil command secara faktual, termasuk kegagalan dan keterbatasan lingkungan.
3. Sertakan ringkasan file/perilaku yang diubah, keputusan yang masih menunggu, risiko dan langkah berikutnya.
4. Perbarui SOT bila keputusan arsitektur atau perilaku domain berubah; jangan biarkan kode dan kontrak saling menyimpang.

**Mulai dari Tahap A dan Tahap B.** Jangan membuat klaim backend siap sampai database, API, otorisasi dan test integrasinya benar-benar terpasang dan tervalidasi.
