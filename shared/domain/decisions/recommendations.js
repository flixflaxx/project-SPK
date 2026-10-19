/**
 * Turunan rekomendasi dari run SAW + kuota (SYSTEM_DESIGN §4.5, §5 status rekomendasi).
 *
 * PENTING: rekomendasi BUKAN penetapan penerima. Aturan kelayakan program belum disahkan
 * (PRD §11.2), sehingga setiap rekomendasi membawa `requiresHumanApproval: true` dan
 * `programRulesApproved: false`. Penetapan hanya terjadi lewat ApprovalDecision eksplisit.
 */

/** @typedef {'RECOMMENDED' | 'RESERVE' | 'NOT_ELIGIBLE' | 'REQUIRES_REVIEW'} RecommendationStatus */

/**
 * @typedef {Object} Recommendation
 * @property {string} candidateId
 * @property {RecommendationStatus} status
 * @property {number | null} rank Null untuk kandidat yang dikecualikan dari run.
 * @property {string[]} reasonCodes Kode alasan (mis. WITHIN_QUOTA, CANDIDATE_NOT_VERIFIED).
 * @property {true} requiresHumanApproval
 */

export const RECOMMENDATION_STATUS = Object.freeze({
  RECOMMENDED: 'RECOMMENDED',
  RESERVE: 'RESERVE',
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',
  REQUIRES_REVIEW: 'REQUIRES_REVIEW',
})

/**
 * @param {Object} input
 * @param {Pick<import('../saw/run.js').CalculationRunRecord, 'results' | 'excluded'>} input.run
 * @param {number} input.quota Kuota penerima (bilangan bulat ≥ 0).
 * @returns {{ programRulesApproved: false, quota: number, items: Recommendation[] }}
 */
export function deriveRecommendations({ run, quota }) {
  if (!Number.isInteger(quota) || quota < 0) {
    throw new RangeError('Kuota harus bilangan bulat ≥ 0.')
  }
  /** @type {Recommendation[]} */
  const items = run.results.map((row) => ({
    candidateId: row.candidateId,
    status: row.rank <= quota ? RECOMMENDATION_STATUS.RECOMMENDED : RECOMMENDATION_STATUS.RESERVE,
    rank: row.rank,
    reasonCodes: [row.rank <= quota ? 'WITHIN_QUOTA' : 'OUTSIDE_QUOTA', ...(row.tie.tiedOnPreference ? ['TIE_BREAK_APPLIED'] : [])],
    requiresHumanApproval: true,
  }))

  for (const entry of run.excluded) {
    // Ditolak verifikator → tidak layak; selain itu perlu ditinjau/dilengkapi.
    const status =
      entry.verificationStatus === 'REJECTED' ? RECOMMENDATION_STATUS.NOT_ELIGIBLE : RECOMMENDATION_STATUS.REQUIRES_REVIEW
    items.push({
      candidateId: entry.candidateId,
      status,
      rank: null,
      reasonCodes: [...new Set(entry.reasons.map((reason) => reason.code))],
      requiresHumanApproval: true,
    })
  }

  return { programRulesApproved: false, quota, items }
}
