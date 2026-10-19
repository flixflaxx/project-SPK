# AGENTS.md — Kontrak kerja agen

## Misi
Bangun aplikasi web SPK Penentuan Penerima Bantuan Sosial Kampung Bulak Amah sesuai source of truth di `docs/PRD.md`, `docs/SYSTEM_DESIGN.md`, dan `docs/ARCHITECTURE.md`. Utamakan akurasi domain, keamanan data warga, auditability, keterujian, dan UX yang mudah dipahami.

## Urutan sumber kebenaran
1. `docs/PRD.md` — tujuan, fitur, batasan, acceptance criteria.
2. `docs/SYSTEM_DESIGN.md` — workflow, state, SAW, UI behavior dan design tokens.
3. `docs/ARCHITECTURE.md` — batas modul, kontrak API, model data dan kontrol keamanan.
4. File implementasi dan test.

Jika dokumen konflik, jangan diam-diam menebak. Identifikasi bagian konflik, usulkan perubahan dokumen yang paling kecil, lalu lanjutkan hanya pada pekerjaan yang tidak terdampak. Jangan mengubah definisi kriteria/bobot atau aturan kelayakan secara mandiri.

## Aturan implementasi
- Gunakan Vite + React untuk frontend. Pertahankan bahasa UI Indonesia dan identitas visual hijau tua/putih/abu muda/hijau terang/merah.
- Implementasikan fitur secara modular per domain; pisahkan presentasi, state, akses API, domain calculation, dan infrastruktur.
- Metode SAW harus menjadi fungsi domain deterministik yang diuji secara independen; jangan menaruh rumus inti hanya di komponen UI atau controller.
- Jangan menghitung kandidat resmi yang belum terverifikasi atau memiliki penilaian wajib yang kosong/invalid.
- Jangan mengubah hasil run historis. Koreksi menghasilkan versi/run baru dan audit event.
- Rekomendasi SAW tidak sama dengan keputusan final; persetujuan selalu eksplisit dan dibuat aktor berwenang.
- Terapkan validasi server-side, default-deny authorization dan pemeriksaan hak akses pada setiap endpoint serta objek.
- Jangan menaruh secret, token, password, data NIK asli, dokumen warga, atau database dump ke repository/log/demo fixture.
- Data preview wajib sintetis, diberi label demo, dan dipisahkan dari data production.
- Aksi UI harus memiliki efek, feedback, loading/error state, atau disabled reason; hindari tombol dekoratif tanpa perilaku.
- Tabel/form/modal harus responsif, keyboard-operable, labelable, dan menggunakan status teks selain warna.
- Hindari menambah dependency kecuali ada kebutuhan nyata; kunci dependency dengan lockfile saat install dilakukan.
- Tidak boleh menginstal plugin/layanan eksternal atau mengirim data ke layanan luar tanpa persetujuan eksplisit pemilik proyek.

## Perintah verifikasi
Sebelum menyatakan task selesai, jalankan command yang tersedia dan laporkan hasil sebenarnya:
- `npm run build`
- `npm run lint` jika script telah ditambahkan
- unit/integration tests yang berhubungan dengan perubahan
- smoke test manual atau otomatis untuk alur terkait

Jangan mengklaim test/lint/DB migration lolos bila tidak dijalankan. Jika lingkungan belum memiliki dependency atau service, sebutkan keterbatasan dengan tepat.

## Format kerja tiap task
1. Petakan requirement/acceptance criterion yang disentuh.
2. Lakukan perubahan sekecil mungkin dengan struktur yang konsisten.
3. Tambahkan/ubah test untuk perilaku domain dan edge case.
4. Jalankan verifikasi yang relevan.
5. Ringkas file yang berubah, perilaku yang diimplementasikan, hasil verifikasi, risiko tersisa, dan keputusan yang perlu persetujuan.

## Stop conditions
Hentikan implementasi area yang relevan dan laporkan masalah apabila diminta untuk:
- menggunakan data warga nyata tanpa persetujuan, klasifikasi, dan kontrol keamanan;
- membuat ranking/kelayakan otomatis seolah keputusan sah tanpa aturan yang disahkan;
- mengubah bobot, skor atau tie-break tanpa versioning/approval;
- menonaktifkan audit, menghapus jejak keputusan atau melewati role check;
- mengekspos NIK/dokumen lewat public URL, log, atau export tanpa authorization;
- menyimpan secret dalam source control.

## Definition of Done
Task hanya selesai bila acceptance criteria terpenuhi, perubahan kompatibel dengan SOT, UI/error/loading states relevan diuji, test/build yang relevan dijalankan, tidak ada secret/data nyata tertinggal, dan catatan perubahan akurat. Untuk perubahan perilaku domain, perbarui dokumen/test terkait dalam commit yang sama.
