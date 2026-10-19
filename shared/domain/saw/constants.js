/**
 * Versi algoritme dan aturan tie-break. Setiap perubahan perilaku perhitungan
 * WAJIB menaikkan versi ini dan memperbarui fixture emas di tests/fixtures/saw.
 */

/** Versi implementasi SAW yang disimpan di setiap CalculationRun. */
export const ALGORITHM_VERSION = 'saw-exact-rational@1.0.0'

/**
 * Aturan tie-break sementara (dipilih pemilik proyek pada 2026-10-13 untuk pengembangan;
 * BELUM DISAHKAN pemilik program — PRD §11.2). Urutan pembanding:
 *  1. Nilai preferensi V menurun (eksak).
 *  2. Nilai ternormalisasi r per kriteria, diurutkan dari bobot terbesar ke terkecil
 *     (bobot sama → kode kriteria menaik), menurun.
 *  3. ID kandidat menaik (perbandingan string ordinal), sebagai jaminan determinisme akhir.
 */
export const TIE_BREAK_RULE = Object.freeze({
  id: 'TB-V_DESC-R_BY_WEIGHT_DESC-ID_ASC',
  version: '0.1.0-draft',
  approved: false,
  description:
    'Nilai V menurun; bila seri, bandingkan nilai ternormalisasi kriteria berbobot terbesar ' +
    '(bobot sama → kode kriteria menaik) secara menurun; bila masih seri, ID kandidat menaik.',
})

/** Jenis atribut kriteria. */
export const CRITERION_TYPES = Object.freeze({ BENEFIT: 'BENEFIT', COST: 'COST' })

/** Status verifikasi kandidat yang boleh masuk run resmi. */
export const ELIGIBLE_VERIFICATION_STATUS = 'VERIFIED'

/** Status validasi assessment yang boleh masuk run resmi. */
export const ELIGIBLE_ASSESSMENT_STATUS = 'VALID'

/** Status periode yang diizinkan untuk membuat run resmi. */
export const RUN_ALLOWED_PERIOD_STATUS = 'ACTIVE'

/** Toleransi default total bobot (string desimal). "0" = harus tepat 1. */
export const DEFAULT_WEIGHT_TOLERANCE = '0'

/** Jumlah digit desimal untuk representasi presentasi di hasil run. */
export const PRESENTATION_DIGITS = 6
