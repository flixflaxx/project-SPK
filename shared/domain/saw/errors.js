/**
 * Kode error domain SAW (SYSTEM_DESIGN §6 "Error contract").
 * Kode bersifat stabil; pemetaan ke pesan Bahasa Indonesia ada di `SAW_ERROR_MESSAGES`
 * dan boleh digunakan langsung oleh UI/API.
 */
export const SAW_ERROR_CODES = Object.freeze({
  WEIGHT_SUM_INVALID: 'WEIGHT_SUM_INVALID',
  WEIGHT_INVALID: 'WEIGHT_INVALID',
  CRITERIA_VERSION_MISSING: 'CRITERIA_VERSION_MISSING',
  CRITERIA_INVALID: 'CRITERIA_INVALID',
  ASSESSMENT_MISSING: 'ASSESSMENT_MISSING',
  ASSESSMENT_NOT_VALIDATED: 'ASSESSMENT_NOT_VALIDATED',
  ASSESSMENT_DUPLICATE: 'ASSESSMENT_DUPLICATE',
  VALUE_INVALID: 'VALUE_INVALID',
  VALUE_OUT_OF_RANGE: 'VALUE_OUT_OF_RANGE',
  COST_VALUE_NON_POSITIVE: 'COST_VALUE_NON_POSITIVE',
  BENEFIT_MAX_INVALID: 'BENEFIT_MAX_INVALID',
  CANDIDATE_NOT_VERIFIED: 'CANDIDATE_NOT_VERIFIED',
  CANDIDATE_DUPLICATE: 'CANDIDATE_DUPLICATE',
  CANDIDATE_PERIOD_MISMATCH: 'CANDIDATE_PERIOD_MISMATCH',
  NO_ELIGIBLE_CANDIDATES: 'NO_ELIGIBLE_CANDIDATES',
  PERIOD_NOT_ACTIVE: 'PERIOD_NOT_ACTIVE',
  RUN_CONTEXT_INVALID: 'RUN_CONTEXT_INVALID',
})

/** @type {Readonly<Record<string, string>>} */
export const SAW_ERROR_MESSAGES = Object.freeze({
  WEIGHT_SUM_INVALID: 'Total bobot kriteria harus tepat 1,00. Periksa dan sesuaikan bobot pada versi kriteria baru.',
  WEIGHT_INVALID: 'Bobot kriteria harus berupa angka desimal yang tidak negatif.',
  CRITERIA_VERSION_MISSING: 'Versi kriteria belum ditetapkan untuk periode ini. Pilih atau buat versi kriteria terlebih dahulu.',
  CRITERIA_INVALID: 'Definisi kriteria tidak valid (kode ganda, tipe bukan benefit/cost, atau skala tidak konsisten).',
  ASSESSMENT_MISSING: 'Penilaian calon belum lengkap. Lengkapi nilai seluruh kriteria; nilai kosong tidak dianggap nol.',
  ASSESSMENT_NOT_VALIDATED: 'Penilaian belum berstatus tervalidasi sehingga tidak dapat masuk perhitungan resmi.',
  ASSESSMENT_DUPLICATE: 'Terdapat lebih dari satu penilaian aktif untuk calon dan kriteria yang sama. Selesaikan koreksi terlebih dahulu.',
  VALUE_INVALID: 'Nilai penilaian bukan angka yang valid.',
  VALUE_OUT_OF_RANGE: 'Nilai penilaian berada di luar skala kriteria yang ditetapkan.',
  COST_VALUE_NON_POSITIVE: 'Nilai kriteria bertipe cost harus lebih besar dari 0 karena digunakan sebagai pembagi.',
  BENEFIT_MAX_INVALID: 'Nilai maksimum kriteria benefit adalah 0 sehingga normalisasi tidak terdefinisi. Periksa data kolom tersebut.',
  CANDIDATE_NOT_VERIFIED: 'Calon belum berstatus terverifikasi sehingga dikecualikan dari perhitungan resmi.',
  CANDIDATE_DUPLICATE: 'Calon yang sama muncul lebih dari sekali dalam snapshot perhitungan.',
  CANDIDATE_PERIOD_MISMATCH: 'Calon tidak terdaftar pada periode seleksi yang dihitung.',
  NO_ELIGIBLE_CANDIDATES: 'Tidak ada calon yang memenuhi syarat (terverifikasi dan penilaian lengkap) untuk dihitung.',
  PERIOD_NOT_ACTIVE: 'Periode seleksi tidak berstatus aktif. Perhitungan resmi hanya dapat dibuat pada periode aktif.',
  RUN_CONTEXT_INVALID: 'Konteks run tidak lengkap (ID run, aktor, atau waktu eksekusi tidak tersedia).',
})

/**
 * @typedef {Object} SawIssue
 * @property {keyof typeof SAW_ERROR_CODES} code
 * @property {string} message Pesan Bahasa Indonesia yang dapat ditindaklanjuti.
 * @property {string} [candidateId]
 * @property {string} [criterionCode]
 * @property {string} [field]
 */

/**
 * Membuat issue dengan pesan default sesuai kode.
 * @param {keyof typeof SAW_ERROR_CODES} code
 * @param {Omit<SawIssue, 'code' | 'message'> & { message?: string }} [extra]
 * @returns {SawIssue}
 */
export function makeIssue(code, extra = {}) {
  const { message, ...rest } = extra
  return Object.freeze({ code, message: message ?? SAW_ERROR_MESSAGES[code], ...rest })
}

/**
 * Error validasi domain SAW. Tidak pernah membawa data pribadi (nama/NIK) — hanya ID internal
 * dan kode kriteria — sehingga aman diteruskan ke error contract API (ARCHITECTURE §5).
 */
export class SawValidationError extends Error {
  /**
   * @param {SawIssue[]} issues minimal satu issue
   */
  constructor(issues) {
    const list = issues.length > 0 ? issues : [makeIssue('RUN_CONTEXT_INVALID')]
    super(list[0].message)
    this.name = 'SawValidationError'
    /** Kode utama (issue pertama) untuk `error.code` pada API. */
    this.code = list[0].code
    /** @type {ReadonlyArray<SawIssue>} */
    this.issues = Object.freeze([...list])
  }
}
