import { ELIGIBLE_ASSESSMENT_STATUS, ELIGIBLE_VERIFICATION_STATUS } from './constants.js'
import { makeIssue, SawValidationError } from './errors.js'

/**
 * @typedef {Object} CandidateSnapshot
 * @property {string} id ID kandidat (internal, bukan NIK).
 * @property {string} periodId
 * @property {'PENDING' | 'VERIFIED' | 'REVISION_REQUIRED' | 'REJECTED'} verificationStatus
 */

/**
 * @typedef {Object} AssessmentSnapshot
 * @property {string} candidateId
 * @property {string} criterionCode
 * @property {number | string | null | undefined} value Nilai matriks keputusan
 *   (skor turunan bila kriteria memakai subkriteria, selain itu nilai mentah).
 * @property {'DRAFT' | 'VALID' | 'INVALID'} status Status validasi assessment.
 */

/**
 * @typedef {Object} EligibleAlternative
 * @property {string} candidateId
 * @property {'VERIFIED'} verificationStatus
 * @property {Record<string, number | string>} values Nilai per kode kriteria.
 */

/**
 * @typedef {Object} ExcludedCandidate
 * @property {string} candidateId
 * @property {string} verificationStatus
 * @property {import('./errors.js').SawIssue[]} reasons Minimal satu alasan tercatat.
 */

/**
 * Nilai kosong = tidak ada nilai. TIDAK PERNAH dianggap nol (PRD §6.3).
 * @param {unknown} value
 */
export function isMissingValue(value) {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
}

/**
 * Memisahkan kandidat menjadi alternatif yang boleh dihitung pada run resmi dan
 * kandidat yang dikecualikan beserta alasan tercatat.
 *
 * Aturan (PRD §5.3, §6.3; SYSTEM_DESIGN §4.2):
 * - kandidat harus terdaftar pada periode yang dihitung;
 * - status verifikasi harus VERIFIED;
 * - setiap kriteria pada versi aktif harus memiliki tepat satu assessment berstatus VALID
 *   dengan nilai terisi (nilai kosong ≠ 0).
 *
 * Pelanggaran integritas snapshot (ID kandidat ganda, assessment ganda) melempar
 * `SawValidationError` karena tidak boleh diselesaikan dengan menebak.
 *
 * @param {Object} input
 * @param {string} input.periodId
 * @param {CandidateSnapshot[]} input.candidates
 * @param {AssessmentSnapshot[]} input.assessments
 * @param {string[]} input.criterionCodes Kode kriteria dari versi kriteria tervalidasi.
 * @returns {{ included: EligibleAlternative[], excluded: ExcludedCandidate[] }}
 */
export function selectEligibleCandidates({ periodId, candidates, assessments, criterionCodes }) {
  /** @type {import('./errors.js').SawIssue[]} */
  const integrityIssues = []
  const candidateIds = new Set()
  for (const candidate of candidates) {
    if (candidateIds.has(candidate.id)) {
      integrityIssues.push(makeIssue('CANDIDATE_DUPLICATE', { candidateId: candidate.id }))
    }
    candidateIds.add(candidate.id)
  }

  const codeSet = new Set(criterionCodes)
  /** @type {Map<string, Map<string, AssessmentSnapshot>>} */
  const byCandidate = new Map()
  for (const assessment of assessments) {
    if (!candidateIds.has(assessment.candidateId) || !codeSet.has(assessment.criterionCode)) continue
    let perCriterion = byCandidate.get(assessment.candidateId)
    if (!perCriterion) {
      perCriterion = new Map()
      byCandidate.set(assessment.candidateId, perCriterion)
    }
    if (perCriterion.has(assessment.criterionCode)) {
      integrityIssues.push(
        makeIssue('ASSESSMENT_DUPLICATE', { candidateId: assessment.candidateId, criterionCode: assessment.criterionCode }),
      )
    }
    perCriterion.set(assessment.criterionCode, assessment)
  }

  if (integrityIssues.length > 0) throw new SawValidationError(integrityIssues)

  /** @type {EligibleAlternative[]} */
  const included = []
  /** @type {ExcludedCandidate[]} */
  const excluded = []

  for (const candidate of candidates) {
    /** @type {import('./errors.js').SawIssue[]} */
    const reasons = []
    if (candidate.periodId !== periodId) {
      reasons.push(makeIssue('CANDIDATE_PERIOD_MISMATCH', { candidateId: candidate.id }))
    }
    if (candidate.verificationStatus !== ELIGIBLE_VERIFICATION_STATUS) {
      reasons.push(makeIssue('CANDIDATE_NOT_VERIFIED', { candidateId: candidate.id }))
    }

    const perCriterion = byCandidate.get(candidate.id) ?? new Map()
    /** @type {Record<string, number | string>} */
    const values = {}
    for (const code of criterionCodes) {
      const assessment = perCriterion.get(code)
      if (!assessment || isMissingValue(assessment.value)) {
        reasons.push(makeIssue('ASSESSMENT_MISSING', { candidateId: candidate.id, criterionCode: code }))
        continue
      }
      if (assessment.status !== ELIGIBLE_ASSESSMENT_STATUS) {
        reasons.push(makeIssue('ASSESSMENT_NOT_VALIDATED', { candidateId: candidate.id, criterionCode: code }))
        continue
      }
      values[code] = /** @type {number | string} */ (assessment.value)
    }

    if (reasons.length > 0) {
      excluded.push({ candidateId: candidate.id, verificationStatus: candidate.verificationStatus, reasons })
    } else {
      included.push({ candidateId: candidate.id, verificationStatus: ELIGIBLE_VERIFICATION_STATUS, values })
    }
  }

  return { included, excluded }
}
