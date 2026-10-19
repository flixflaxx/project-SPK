# SYSTEM DESIGN — SPK Bansos Kampung Bulak Amah

> Kontrak pengalaman pengguna, logika domain, dan perilaku sistem. Perubahan besar pada alur, status, model SAW, atau komponen navigasi harus memperbarui dokumen ini dan PRD.

## 1. Prinsip desain

1. **Jelas dan dapat ditelusuri:** hasil SAW disertai rumus, nilai mentah, normalisasi, bobot, skor kontribusi, dan versi perhitungan.
2. **Human-in-the-loop:** ranking tidak mengeksekusi keputusan bantuan secara otomatis.
3. **Privacy by default:** NIK ditutupi di list; dokumen dan ekspor memakai izin terpisah.
4. **No silent mutation:** hasil yang telah dihitung/disetujui tidak ditimpa; koreksi menciptakan versi baru dengan audit event.
5. **Operationally useful:** dashboard menyorot antrean/verifikasi, error input, kuota, dan aksi berikutnya.
6. **Accessible and responsive:** seluruh aksi utama dapat dioperasikan dengan keyboard, memiliki label, fokus, state loading/error/success, dan layout kecil yang layak.
7. **Design system konsisten:** satu set token warna, jarak, tipografi, status, tombol, form, tabel, modal dan feedback.

## 2. Visual language

### Brand tokens

| Token | Value | Peran |
|---|---|---|
| `green-950` | `#09291F` | Sidebar, bidang gelap |
| `green-900` | `#0D382E` | Brand utama/hero |
| `green-700` | `#16765B` | Tombol utama, link aksi |
| `green-500` | `#20B47C` | Aksen progres dan data visualization |
| `lime` | `#B5F56A` | Highlight/aksi utama pada hero |
| `surface` | `#FFFFFF` | Kartu, modal dan tabel |
| `bg` | `#F6F8F7` | Latar kanvas |
| `line` | `#E8EEEB` | Pemisah dan batas komponen |
| `danger` | `#E25454` | Gagal, ditolak, tindakan berisiko |
| `warning` | `#D79B32` | Perlu tindakan atau menunggu |

- Font heading: Manrope; body: DM Sans; fallback sans-serif.
- Radius: 6–16 px berdasarkan hierarki; hindari sudut superbulat pada tabel yang padat.
- Elevation rendah; fokuskan hirarki lewat spacing, typography, dan border halus.
- Warna status selalu ditemani label teks, bukan warna saja.
- NIK di daftar selalu dimask; detail lengkap perlu izin, alasan akses, dan audit trail di backend.

## 3. Information architecture

### Navigasi

| Grup | Modul |
|---|---|
| Workspace | Dashboard Admin |
| Data & verifikasi | Data Warga, Calon Penerima, Verifikasi Warga |
| Konfigurasi SAW | Kriteria Penilaian, Subkriteria & Bobot, Periode Seleksi |
| Mesin perhitungan | Input Penilaian, Normalisasi Matriks, Nilai Preferensi, Perangkingan |
| Keputusan & laporan | Rekomendasi Bansos, Validasi & Persetujuan, Kuota Bantuan, Riwayat Seleksi, Laporan SAW |
| Administrasi | Pengguna & Hak Akses, Audit Log, Pencarian & Filter, Backup Database |

Login/logout hadir sebagai lapisan akses global; profil dan keluar tersedia pada menu pengguna.

### Pola halaman

- **Dashboard:** hero konteks periode, kartu KPI, progres proses, distribusi bobot, lima ranking tertinggi, aktivitas audit dan catatan mode demo.
- **Daftar data:** judul + deskripsi, tindakan primer, pencarian, filter, tabel, status, pagination, empty state. Perubahan data melalui modal/detail atau form spesifik.
- **Rangkaian SAW:** matriks mentah → matriks R → kontribusi bobot & nilai V → ranking → rekomendasi. Tiap layar menampilkan versi periode/kriteria dan label simulasi bila menggunakan fixture.
- **Keputusan:** tampilkan ranking dan eligibility bersebelahan; tindakan setuju/tolak butuh alasan; konfirmasi sebelum perubahan final.
- **Laporan:** ringkasan periode, konfigurasi, jumlah alternatif, matriks/score, keputusan, disclaimer, cetak PDF dan ekspor spreadsheet.
- **Admin:** role, audit, backup; tindakan sensitif selalu memerlukan konfirmasi dan pencatatan.

## 4. Alur dan state

### 4.1 Autentikasi

`LoggedOut → Submitting → Authenticated` atau `LoggedOut → Submitting → Error`. Login demo pada prototipe tidak mengautentikasi server; produksi harus memakai cookie sesi yang aman. Logout membersihkan sesi server dan state klien.

### 4.2 Verifikasi data

`Menunggu → Terverifikasi | Perlu revisi | Ditolak`.
- `Perlu revisi` menyimpan catatan wajib dan pihak yang perlu menindaklanjuti.
- Perubahan status mencatat aktor, waktu, dokumen yang diperiksa, serta nilai sebelum/sesudah.
- Data tidak lengkap tidak dapat dimasukkan ke run resmi.

### 4.3 Periode seleksi

`Draft → Aktif → Ditutup → Diarsipkan`.
- Maksimal satu periode aktif pada lingkup program yang sama, kecuali policy eksplisit menyatakan sebaliknya.
- Periode aktif mengunci versi bobot dan kriteria ketika run dibuat.
- Re-open tidak mengubah run historis; proses baru harus menghasilkan run ID baru.

### 4.4 Kalkulasi SAW

`Draft input → Validating → Ready → Calculating → Calculated → Reviewed → Approved/Rejected → Archived`.
- `Validating`: periksa semua nilai, kelengkapan, bobot, tipe benefit/cost dan kandidat eligible.
- `Calculated`: hasil run immutable, setiap alternatif memiliki matriks normalisasi, komponen bobot, nilai V, rank dan data provenance.
- `Reviewed`: peran penyetuju mengulas hasil, pengecualian, kuota dan aturan program.
- `Approved/Rejected`: keputusan per alternatif memiliki alasan, aktor dan timestamp. Hasil run tetap tidak berubah.
- Kegagalan perhitungan mengembalikan error spesifik; tidak menghasilkan sebagian ranking seolah sukses.

### 4.5 Keputusan dan kuota

Kandidat dapat direkomendasikan bila terverifikasi, memiliki input lengkap, lulus aturan kelayakan program yang disahkan, dan termasuk dalam pertimbangan kuota. Urutan skor adalah satu pertimbangan yang transparan, bukan pengganti review. Override harus memiliki alasan, pengguna berizin, dan audit event.

## 5. Aturan domain

### Entitas dan relasi

- `Resident 1—N Candidate` sepanjang sejarah; satu calon unik per warga dan periode kecuali kebijakan menyebutkan lain.
- `SelectionPeriod 1—N Candidate`, `Assessment`, dan `CalculationRun`.
- `CriteriaSetVersion 1—N CriteriaVersion / SubcriteriaVersion` sesuai model implementasi yang dipilih.
- `CalculationRun 1—N CalculationResult`; `ApprovalDecision` mereferensikan run dan kandidat tertentu.
- `User 1—N AuditEvent`; backup memakai `BackupJob` terpisah.

### Status standar

| Domain | Status |
|---|---|
| Verifikasi | `PENDING`, `VERIFIED`, `REVISION_REQUIRED`, `REJECTED` |
| Periode | `DRAFT`, `ACTIVE`, `CLOSED`, `ARCHIVED` |
| Run | `DRAFT`, `VALIDATING`, `CALCULATING`, `CALCULATED`, `FAILED`, `APPROVED`, `ARCHIVED` |
| Rekomendasi | `RECOMMENDED`, `RESERVE`, `NOT_ELIGIBLE`, `REQUIRES_REVIEW` |
| Persetujuan | `PENDING`, `APPROVED`, `REJECTED`, `REVOKED` |
| Backup | `QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED`, `RESTORE_TESTED` |

Pemetaan ke label bahasa Indonesia dilakukan pada presentation layer; nilai database tetap enum/kode yang stabil.

## 6. Kontrak perhitungan SAW

### Pipeline

1. Ambil snapshot kandidat yang eligible dan assessment tervalidasi untuk satu periode.
2. Ambil versi criteria set dan bobot yang terkait; verifikasi total bobot `1.00 ± toleransi konfigurasi` dan rentang skor.
3. Bangun matriks keputusan `X` dengan baris alternatif dan kolom kriteria.
4. Normalisasi per kolom: benefit `x/max`; cost `min/x`. Tolak atau tandai kolom yang memiliki pembagi tidak valid.
5. Hitung kontribusi `cᵢⱼ = wⱼ × rᵢⱼ`.
6. Hitung preferensi `Vᵢ = Σ cᵢⱼ` pada presisi internal tinggi.
7. Ranking `Vᵢ` menurun, lalu terapkan tie-break deterministik yang disetujui. Selalu simpan nilai sebelum pembulatan.
8. Persist hasil run dan snapshot referensi secara transaksional; hasil yang sama dari snapshot dan versi algoritme yang sama harus identik.

### Auditability

Satu run setidaknya menyimpan: `run_id`, `period_id`, `criteria_set_version`, `algorithm_version`, waktu/aktor eksekusi, ID alternatif yang disertakan dan dikecualikan beserta alasan, referensi snapshot input, normalisasi, kontribusi tertimbang, nilai preferensi, rank, aturan tie-break, dan status review/approval.

### Error contract

Kesalahan seperti `WEIGHT_SUM_INVALID`, `ASSESSMENT_MISSING`, `COST_VALUE_NON_POSITIVE`, `BENEFIT_MAX_INVALID`, `CANDIDATE_NOT_VERIFIED`, `NO_ELIGIBLE_CANDIDATES`, `CRITERIA_VERSION_MISSING`, `PERIOD_NOT_ACTIVE` harus dipetakan ke pesan Indonesia yang dapat ditindaklanjuti; jangan hanya menampilkan “terjadi kesalahan”.

## 7. Komponen frontend dan interaksi

### Komponen bersama

- `AppShell`, `SidebarNav`, `Topbar`, `ProfileMenu`, `PeriodSwitcher`.
- `PageHeader`, `KpiCard`, `Panel`, `DataTable`, `FilterBar`, `StatusBadge`, `Pagination`.
- `FormField`, `ConfirmDialog`, `DetailDrawer/Modal`, `Toast`, `EmptyState`, `Skeleton`, `ErrorState`.
- `SawStepHeader`, `MatrixTable`, `WeightBreakdown`, `PreferenceBreakdown`, `RankBadge`, `ReportHeader`.

### Perilaku UX wajib

- Tombol mempunyai efek nyata atau diberi disabled state beserta alasannya.
- Form menampilkan error di dekat field, mencegah double submit, dan mempertahankan input valid ketika API gagal.
- Tindakan destruktif/approval meminta konfirmasi; alasan wajib untuk override/penolakan.
- Tabel punya loading, empty, error, dan no-results states; pencarian/filter tidak boleh membocorkan data lintas permission.
- Print memakai layout laporan yang ramah kertas; export menggunakan dataset/kolom yang terlihat dan diperbolehkan role.
- Semua aksi memberi feedback sukses/gagal; `window.alert` tidak digunakan pada produksi.

## 8. Mock/prototype vs produksi

| Area | Prototipe di ZIP | Target produksi |
|---|---|---|
| Login | Form lokal, akun demo, state browser | Auth server, cookie `HttpOnly`, secure, same-site, expiry, proteksi brute-force |
| Data | Seed JavaScript dan state lokal | API dan database relasional |
| SAW | Kalkulasi di browser atas alternatif terverifikasi pada dataset dummy | Service/domain function backend dengan fixture, transaction, versi algoritme |
| Approval | Tombol mengubah state demo | Endpoint berizin, validasi transisi, alasan, optimistic concurrency |
| CSV/Excel | CSV UTF-8 yang dapat dibuka dengan Excel | XLSX atau CSV terformat; izin dan audit |
| PDF | Browser print | PDF server/client teruji, metadata run/version, akses terkendali |
| Audit | Data demo dan toast | Append-only, aktor dan timestamp server, korelasi request |
| Backup | Metadata dummy, ekspor CSV metadata | Dump terenkripsi, akses terbatas, retensi dan restore drill |

Jangan menggambarkan simulasi sebagai autentikasi, ekspor XLSX, PDF final, atau backup database sesungguhnya.

## 9. Keamanan, aksesibilitas, dan privasi

- Masking NIK dan jangan log NIK lengkap, kata sandi, token, atau konten dokumen.
- Otorisasi dilakukan pada setiap endpoint dan setiap objek; gunakan policy/resource scope, bukan hanya role global.
- Gunakan validasi input server-side dan output encoding untuk melawan injection/XSS; gunakan ORM secara parameterized.
- Batasi ekspor massal, catat aktor/alasan bila diperlukan, dan hindari memasukkan data pribadi ke analytics.
- Modal mengembalikan fokus ke pemicu, dapat ditutup via Escape, dan menjaga urutan tab. Table punya header semantik.
- Gunakan warna + label; state error/sukses jangan hanya disampaikan melalui warna.
- Pesan error tidak mengungkap apakah identitas/akun tertentu ada di sistem.

## 10. Test scenarios minimum

1. Bobot 0.30+0.25+0.20+0.15+0.10 = 1.00.
2. Benefit max = 10, nilai x=5 memberi r=0.5; cost min=100, nilai x=200 memberi r=0.5.
3. Nilai cost 0 ditolak; benefit max=0 ditandai tidak valid.
4. Nilai V adalah penjumlahan kontribusi tertimbang, dan peringkat menurun.
5. Kandidat belum verified/assessment tidak lengkap tidak masuk run resmi.
6. Tie-break deterministik; dua run terhadap snapshot/model sama menghasilkan urutan yang sama.
7. Setelah run disahkan, perubahan bobot menciptakan versi/run baru dan tidak mengubah hasil lama.
8. Role operator tidak bisa memanggil endpoint approval, walaupun mengirim HTTP request langsung.
9. Penolakan/override wajib beralasan dan masuk audit event.
10. Ekspor, backup, print, modal dan layout tabel diuji untuk permission, keyboard, dan viewport kecil.
