# PRD — SPK Penentuan Penerima Bantuan Sosial Kampung Bulak Amah

> **Status:** Draft kontrak produk v0.1 · **Pemilik:** Pemerintah Kampung Bulak Amah · **Bahasa UI:** Indonesia  
> **Sumber kebenaran produk:** Dokumen ini, bersama `SYSTEM_DESIGN.md` dan `ARCHITECTURE.md`. Jika ada konflik, hentikan implementasi bagian yang terdampak dan minta revisi SOT sebelum memilih interpretasi sendiri.

## 1. Ringkasan

Membangun aplikasi web administratif untuk membantu proses penetapan prioritas penerima bantuan sosial dengan metode **Simple Additive Weighting (SAW)**. Sistem mendukung pengelolaan data warga dan calon penerima, verifikasi dokumen, konfigurasi kriteria dan bobot, perhitungan yang dapat diaudit, perangkingan, rekomendasi, validasi manual, pengelolaan kuota, laporan, keamanan akses, audit log, dan backup.

SAW menghasilkan **peringkat matematis**, bukan keputusan kelayakan final otomatis. Penerima yang ditetapkan wajib melalui pemeriksaan kelayakan dan persetujuan manusia sesuai kebijakan program yang berlaku.

## 2. Masalah dan tujuan

### Masalah
- Data dan dokumen calon penerima perlu dikelola secara konsisten.
- Penilaian berbasis banyak kriteria sulit dibandingkan jika rumus, bobot, dan jejak perubahan tidak seragam.
- Hasil seleksi perlu dapat dijelaskan, diulang, diperiksa, serta dilaporkan.
- Kuota program dan hasil hitung harus dipisahkan dari keputusan persetujuan final.

### Tujuan produk
1. Mengonsolidasikan data, verifikasi, penilaian, hasil hitung, persetujuan, dan laporan pada satu workspace.
2. Menyediakan kalkulasi SAW deterministik dengan rincian matriks, normalisasi, kontribusi bobot, nilai preferensi, dan peringkat.
3. Mempertahankan audit trail untuk tindakan penting dan versi perhitungan.
4. Melindungi data pribadi melalui akses minimum, masking pada layar, dan kontrol ekspor.
5. Menyediakan UI responsif berbahasa Indonesia yang siap diintegrasikan ke backend.

## 3. Pengguna dan hak akses

| Peran | Tanggung jawab utama | Batas akses |
|---|---|---|
| Super Admin | Konfigurasi sistem, pengguna/role, backup, semua modul | Aksi sensitif harus tercatat; tidak mengubah hasil historis secara diam-diam |
| Operator Data | Kelola data warga/calon, lengkapi atribut penilaian | Tidak boleh menyetujui hasil final atau mengubah audit log |
| Verifikator | Memeriksa dokumen dan menetapkan status verifikasi | Tidak dapat mengubah bobot atau mengesahkan hasil seleksi |
| Pimpinan/Penyetuju | Meninjau ranking, kuota, laporan, dan menyetujui/menolak rekomendasi | Hak persetujuan dibatasi pada periode/lingkup yang ditugaskan |
| Auditor/Pembaca | Membaca laporan, riwayat, dan audit log | Read-only; akses data pribadi dibatasi/ditutupi |

Hak akses di server menjadi sumber kebenaran; menyembunyikan tombol di frontend bukan kontrol keamanan.

## 4. Ruang lingkup fitur

Seluruh fitur berikut wajib mempunyai navigasi dan layar terkait. Fitur pada prototipe statis boleh memakai data dummy dan simulasi lokal; fitur produksi memerlukan API, persistensi, otorisasi backend, serta pengujian.

| # | Fitur | Hasil minimum yang diharapkan |
|---:|---|---|
| 1 | Login dan Logout | Form login, status sesi, keluar, penanganan kredensial salah, dan sesi aman di backend |
| 2 | Dashboard Admin | Ringkasan data, progres verifikasi, periode aktif, kuota, peringkat teratas, aktivitas terbaru |
| 3 | Manajemen Data Warga | CRUD, validasi identitas, domisili, pencarian, masking data sensitif |
| 4 | Manajemen Data Calon Penerima | Tautkan calon dengan warga, status kelayakan awal, cegah duplikasi alternatif per periode |
| 5 | Verifikasi Data Warga | Daftar antrean, bukti dokumen, status menunggu/terverifikasi/perlu revisi/ditolak, petugas dan waktu verifikasi |
| 6 | Manajemen Kriteria Penilaian | Definisi kode, nama, tipe benefit/cost, satuan, status dan versi konfigurasi |
| 7 | Manajemen Subkriteria dan Bobot | Pemetaan nilai mentah/kategori ke skor, validasi rentang, bobot desimal dan total tepat 1,00 |
| 8 | Manajemen Periode Seleksi | Buat periode, tanggal, status, kuota, versi kriteria, dan penguncian saat finalisasi |
| 9 | Input Penilaian Calon Penerima | Form matriks keputusan dengan provenance sumber data dan validasi nilai |
| 10 | Perhitungan SPK Metode SAW | Jalankan kalkulasi deterministik berdasarkan snapshot input dan versi bobot tertentu |
| 11 | Normalisasi Matriks Keputusan | Tampilkan matriks R; rumus sesuai jenis atribut dan nilai valid |
| 12 | Perhitungan Nilai Preferensi | Tampilkan kontribusi tiap kriteria dan total nilai V per alternatif |
| 13 | Perangkingan Calon Penerima | Urutkan nilai V menurun; penanganan nilai seri dan aturan tie-break terdokumentasi |
| 14 | Rekomendasi Penerima Bansos | Bandingkan peringkat, status verifikasi, prasyarat program, dan kuota; rekomendasi bukan penetapan otomatis |
| 15 | Validasi dan Persetujuan Penerima | Persetujuan/penolakan oleh role berwenang, alasan wajib, waktu, dan pelaku keputusan |
| 16 | Manajemen Kuota Bantuan | Atur kapasitas dan pagu; tampilkan terisi/sisa serta peringatan perubahan |
| 17 | Riwayat Hasil Seleksi | Riwayat immutable yang menaut ke periode, input snapshot, bobot, hasil, pelaksana dan persetujuan |
| 18 | Laporan Hasil Perhitungan SAW | Ringkasan metode, kriteria, bobot, matriks relevan, skor, ranking, keputusan dan disclaimer |
| 19 | Cetak dan Ekspor Laporan PDF/Excel | Print stylesheet/PDF dan ekspor spreadsheet; filter akses dan jejak audit |
| 20 | Manajemen Pengguna dan Hak Akses | CRUD pengguna, role/permission, nonaktifkan akun, sesi, dan aturan least privilege |
| 21 | Audit Log Aktivitas Pengguna | Log login, perubahan, verifikasi, hitung, ekspor, keputusan, backup; append-only untuk aplikasi |
| 22 | Pencarian dan Filter Data | Pencarian lintas modul dan filter terstruktur/paginasi, dengan batasan akses yang sama |
| 23 | Backup Database | Jalankan/atur backup, metadata, status, retensi, serta uji pemulihan terdokumentasi |

## 5. Workflow inti

1. Super Admin menyiapkan role, periode, kuota, dan versi kriteria.
2. Operator mengelola data warga serta mendaftarkan calon penerima untuk periode yang dipilih.
3. Verifikator meninjau identitas/dokumen. Hanya alternatif dengan data yang lengkap, valid, dan berstatus terverifikasi boleh masuk ke snapshot perhitungan produksi.
4. Operator mengisi atau mengimpor nilai kriteria berdasarkan bukti terverifikasi. Nilai mentah dan hasil pemetaan subkriteria harus bisa ditelusuri.
5. Sistem memvalidasi nilai dan total bobot, membuat snapshot input/configuration, menghitung SAW, lalu menyimpan matriks normalisasi, kontribusi, nilai V, dan ranking.
6. Pimpinan meninjau hasil, konteks program, prasyarat, potensi anomali, dan kuota. Sistem menghasilkan rekomendasi untuk membantu, bukan menggantikan, keputusan.
7. Penyetuju menyetujui/menolak calon terpilih dengan alasan. Penetapan tidak boleh menghapus/menimpa hasil hitung terdahulu.
8. Sistem menerbitkan laporan dan audit event. Riwayat seleksi yang telah disahkan bersifat immutable; koreksi dilakukan melalui versi atau proses pembatalan tercatat.

## 6. Aturan SAW yang wajib

### 6.1 Model demo awal

Bobot berikut adalah **contoh untuk prototipe**, belum kebijakan resmi dan harus disahkan pemilik program sebelum digunakan pada produksi.

| Kode | Kriteria | Tipe | Bobot | Skala contoh |
|---|---|---|---:|---|
| C1 | Pendapatan per bulan | Cost | 0,30 | Rupiah positif; nilai lebih rendah menaikkan prioritas matematis |
| C2 | Jumlah tanggungan | Benefit | 0,25 | Jumlah orang; nilai lebih tinggi menaikkan prioritas |
| C3 | Kerentanan kondisi rumah | Benefit | 0,20 | Skor 1–5; skor tinggi berarti kondisi lebih rentan |
| C4 | Anggota keluarga rentan | Benefit | 0,15 | Skor 0–2; nilai tinggi berarti kebutuhan lebih besar |
| C5 | Skor kepemilikan aset produktif | Cost | 0,10 | Skor 1–3; 1 = tidak memiliki, 3 = memiliki ≥2 unit |

Total bobot wajib **1,00 (100%)**. Skor kategori dan arah atribut harus dijelaskan kepada pengguna; jangan mengubah skor secara implisit tanpa versi baru.

### 6.2 Formula

Untuk alternatif `i` dan kriteria `j`, `xᵢⱼ` adalah nilai mentah tervalidasi dan `rᵢⱼ` adalah nilai normalisasi.

- **Benefit:** `rᵢⱼ = xᵢⱼ / max(xⱼ)`.
- **Cost:** `rᵢⱼ = min(xⱼ) / xᵢⱼ`.
- **Preferensi:** `Vᵢ = Σ (wⱼ × rᵢⱼ)`.
- Urutan peringkat menggunakan `Vᵢ` menurun. Tie-break harus terkonfigurasi, deterministik, serta tampil pada laporan bila dipakai.

### 6.3 Validasi dan kasus batas

- Cost harus mempunyai nilai positif; tolak nol/negatif ketika rumus membagi dengan `xᵢⱼ`.
- Nilai benefit yang maksimum 0 menyebabkan pembagian tak terdefinisi; data harus ditandai tidak valid atau ditangani melalui aturan eksplisit yang disetujui, tidak dengan `NaN` atau angka diam-diam.
- Semua alternatif harus dinilai pada cakupan kriteria yang sama. Nilai kosong tidak dianggap nol secara otomatis.
- Bobot harus non-negatif dan totalnya tepat 1,00 setelah aturan presisi yang terdokumentasi.
- Alternatif yang belum terverifikasi/kurang data dikecualikan dari perhitungan resmi dengan alasan tercatat.
- Simpan presisi internal yang cukup; pembulatan hanya untuk presentasi, tidak sebelum agregasi.
- Setiap hasil mengikat versi kriteria, bobot, periode, alternatif yang dihitung, input snapshot, algoritme/version dan waktu eksekusi.

## 7. Data utama

- **Resident/Warga:** ID internal, NIK terenkripsi atau terproteksi, nama, tanggal lahir/usia bila perlu, alamat/RT-RW, kontak sesuai kebutuhan, status dan referensi dokumen.
- **Candidate/Calon:** ID calon, `resident_id`, `period_id`, status administrasi, status verifikasi, alasan kelayakan/ketidaklayakan.
- **Criteria/CriteriaVersion:** kode, nama, tipe, bobot, satuan, aturan normalisasi, status, versi efektif.
- **Subcriteria:** aturan skor kategori, rentang inklusif/eksklusif, skor hasil, versi dan validasi tumpang tindih.
- **Assessment:** ID alternatif/periode, kriteria, nilai mentah, skor turunan, sumber data, petugas, waktu, status validasi.
- **CalculationRun/Result:** snapshot input, versi model, matriks ternormalisasi, kontribusi berbobot, nilai V, rank, tie-break, hash/input summary.
- **Decision/Approval:** keputusan, penyetuju, alasan, waktu, perubahan status dan referensi hasil yang disetujui.
- **AuditEvent/BackupJob:** aktor, aksi, target, waktu, outcome, correlation ID dan metadata yang tidak membocorkan rahasia.

## 8. Kebutuhan nonfungsional

- UI responsif pada desktop/tablet/mobile, navigasi keyboard, label input, fokus terlihat, dan kontras memadai.
- Keamanan: autentikasi aman, otorisasi server-side, CSRF protection sesuai mekanisme sesi, rate limit login, kebijakan kata sandi, session expiry, dan rahasia di environment.
- Privasi: prinsip minimisasi, masking NIK, akses dokumen terpisah, enkripsi in transit/at rest sesuai infrastruktur, serta audit akses/ekspor.
- Integritas: operasi perubahan keputusan/perhitungan transaksional; hasil final tidak dapat diedit langsung.
- Reliability: backup terenkripsi, retensi, uji restore periodik, health check, monitoring error, dan prosedur insiden.
- Kinerja target awal: list/pencarian umum <2 detik pada dataset 10.000 warga di lingkungan yang disepakati; kalkulasi 5 kriteria/1.000 alternatif <3 detik. Target perlu diukur, bukan diasumsikan.
- Maintainability: tipe/schema terpusat, unit test SAW, integrasi API, test role permissions, lint/build dalam CI, dan dokumen keputusan arsitektur.

## 9. KPI dan acceptance criteria

### KPI operasional awal
- 100% run SAW menyimpan versi kriteria, bobot, daftar alternatif dan timestamp.
- 100% keputusan final terhubung ke aktor, alasan, waktu dan hasil seleksi.
- 0 kandidat dengan data wajib kosong/invalid ikut dalam perhitungan resmi.
- Total bobot valid = 1,00 sebelum tombol hitung diaktifkan.
- Restore backup terbukti berhasil lewat uji yang tercatat.

### Acceptance criteria MVP produksi
- Seluruh 23 fitur di bagian 4 tersedia dengan alur sukses, empty/loading/error states, validasi dan izin akses.
- Perhitungan diuji dengan fixture deterministik yang dihitung independen; termasuk benefit/cost, nilai seri, input tak valid, dan pembulatan.
- Data calon yang belum verified tidak masuk ranking resmi.
- Role yang tidak berhak tidak dapat mengakses endpoint sensitif secara langsung.
- Laporan/ekspor mencerminkan snapshot run dan menunjukkan bahwa ranking adalah rekomendasi; ekspor tercatat dalam audit log.
- Audit log tidak mempunyai operasi edit/hapus dari UI aplikasi.
- Build, lint, unit test, integrasi, dan smoke test berjalan pada pipeline.
- Seluruh data demo jelas diberi label dan tidak pernah disalin menjadi data produksi.

## 10. Di luar cakupan MVP

- Integrasi langsung ke sistem pemerintah pusat/DTKS atau sumber identitas eksternal tanpa izin dan kontrak resmi.
- Pembayaran/disbursement bansos, pemrosesan bank, tanda tangan elektronik tersertifikasi.
- Penentuan kelayakan legal otomatis hanya dari skor SAW.
- AI/ML prediktif, facial recognition, pengambilan keputusan dari data sensitif yang tidak disahkan.
- Migrasi data nyata sebelum ada dasar pemrosesan, penanggung jawab, kontrol akses, dan rencana migrasi yang disetujui.

## 11. Asumsi dan keputusan yang masih perlu disahkan

1. Kriteria/bobot C1–C5 adalah seed demo, bukan rekomendasi kebijakan resmi.
2. Pemilik program menentukan persyaratan program, tie-break, aturan kandidat gugur, periode retensi, dan pejabat yang sah menyetujui.
3. NIK, alamat detail, dokumen kemiskinan/kesehatan, dan atribut rumah tangga dapat menjadi data sensitif; klasifikasi dan dasar pemrosesan harus direview sebelum produksi.
4. Mata uang dan tanggal mengikuti zona waktu `Asia/Jakarta`; simpan timestamp backend dalam UTC, tampilkan waktu lokal.
5. Prototipe saat ini tidak memiliki backend, database, autentikasi nyata, penyimpanan lintas sesi, atau dump backup sungguhan.
