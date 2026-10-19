/**
 * Keputusan persetujuan human-in-the-loop (PRD fitur 15; SYSTEM_DESIGN §4.4–4.5).
 *
 * - Ranking/rekomendasi SAW tidak pernah otomatis menjadi keputusan.
 * - Setiap keputusan wajib beralasan, dibuat aktor berizin, dan bersifat append-only:
 *   koreksi dilakukan dengan REVOKED lalu keputusan baru, tidak pernah mengubah record lama.
 * - Hasil run (nilai V/rank) tidak diubah oleh keputusan.
 */

export const DECISION_OUTCOMES = Object.freeze({ APPROVED: 'APPROVED', REJECTED: 'REJECTED', REVOKED: 'REVOKED' })

export const DECISION_PERMISSION = 'decision.approve'

/** Status run yang boleh menerima keputusan. */
const DECIDABLE_RUN_STATUSES = new Set(['CALCULATED'])

export const DECISION_ERROR_MESSAGES = Object.freeze({
  DECISION_FORBIDDEN: 'Anda tidak memiliki izin untuk mencatat keputusan persetujuan.',
  DECISION_CONTEXT_INVALID: 'Konteks keputusan tidak lengkap (ID, waktu, atau aktor).',
  DECISION_OUTCOME_INVALID: 'Jenis keputusan harus Setujui, Tolak, atau Cabut.',
  DECISION_REASON_REQUIRED: 'Alasan keputusan wajib diisi.',
  DECISION_REASON_TOO_LONG: 'Alasan keputusan maksimal 1000 karakter.',
  DECISION_CANDIDATE_NOT_IN_RUN: 'Calon tidak termasuk dalam hasil run ini sehingga tidak dapat diputuskan.',
  DECISION_TRANSITION_INVALID: 'Transisi keputusan tidak valid. Cabut keputusan aktif terlebih dahulu sebelum membuat keputusan baru.',
  RUN_NOT_DECIDABLE: 'Run ini tidak dalam status yang dapat diputuskan.',
})

export class DecisionError extends Error {
  /** @param {keyof typeof DECISION_ERROR_MESSAGES} code */
  constructor(code) {
    super(DECISION_ERROR_MESSAGES[code])
    this.name = 'DecisionError'
    this.code = code
  }
}

export const REASON_MAX_LENGTH = 1000

/**
 * @typedef {Object} ApprovalDecisionRecord
 * @property {string} id
 * @property {string} runId
 * @property {string} candidateId
 * @property {'APPROVED' | 'REJECTED' | 'REVOKED'} outcome
 * @property {string} reason
 * @property {string} decidedBy
 * @property {string} decidedAt ISO-8601 UTC
 * @property {number} sequence Urutan keputusan untuk (run, kandidat), mulai 1.
 * @property {string | null} supersedesId Keputusan sebelumnya yang digantikan.
 * @property {boolean} isOverride True bila berbeda arah dengan rekomendasi.
 * @property {boolean} exceedsQuota True bila persetujuan melampaui kuota (peringatan).
 */

/**
 * Status keputusan efektif terkini untuk satu kandidat pada run.
 * @param {ApprovalDecisionRecord[]} decisions
 * @param {string} runId
 * @param {string} candidateId
 * @returns {ApprovalDecisionRecord | null}
 */
export function latestDecision(decisions, runId, candidateId) {
  let latest = null
  for (const decision of decisions) {
    if (decision.runId !== runId || decision.candidateId !== candidateId) continue
    if (!latest || decision.sequence > latest.sequence) latest = decision
  }
  return latest
}

/**
 * Menghitung jumlah kandidat yang keputusan efektifnya APPROVED pada run.
 * @param {ApprovalDecisionRecord[]} decisions
 * @param {string} runId
 */
export function countApproved(decisions, runId) {
  const ids = new Set(decisions.filter((d) => d.runId === runId).map((d) => d.candidateId))
  let total = 0
  for (const id of ids) if (latestDecision(decisions, runId, id)?.outcome === 'APPROVED') total += 1
  return total
}

/**
 * Membuat record keputusan baru (tidak memodifikasi `decisions`).
 *
 * @param {Object} input
 * @param {ApprovalDecisionRecord[]} input.decisions Riwayat keputusan yang ada.
 * @param {{ id: string, status: string, results: ReadonlyArray<{ candidateId: string }> }} input.run
 * @param {{ items: ReadonlyArray<{ candidateId: string, status: string }> }} input.recommendations
 * @param {number} input.quota
 * @param {{ id: string, permissions: ReadonlyArray<string> }} input.actor
 * @param {{ decisionId: string, decidedAt: string }} input.context
 * @param {{ candidateId: string, outcome: string, reason: string }} input.command
 * @returns {ApprovalDecisionRecord}
 */
export function recordDecision({ decisions, run, recommendations, quota, actor, context, command }) {
  if (!actor?.permissions?.includes(DECISION_PERMISSION)) throw new DecisionError('DECISION_FORBIDDEN')
  if (!context?.decisionId || !context?.decidedAt || Number.isNaN(Date.parse(context.decidedAt)) || !actor.id) {
    throw new DecisionError('DECISION_CONTEXT_INVALID')
  }
  if (!DECIDABLE_RUN_STATUSES.has(run.status)) throw new DecisionError('RUN_NOT_DECIDABLE')
  if (!Object.values(DECISION_OUTCOMES).includes(/** @type {never} */ (command.outcome))) {
    throw new DecisionError('DECISION_OUTCOME_INVALID')
  }
  const reason = typeof command.reason === 'string' ? command.reason.trim() : ''
  if (reason === '') throw new DecisionError('DECISION_REASON_REQUIRED')
  if (reason.length > REASON_MAX_LENGTH) throw new DecisionError('DECISION_REASON_TOO_LONG')
  if (!run.results.some((row) => row.candidateId === command.candidateId)) {
    throw new DecisionError('DECISION_CANDIDATE_NOT_IN_RUN')
  }

  const previous = latestDecision(decisions, run.id, command.candidateId)
  const hasActive = previous && previous.outcome !== 'REVOKED'
  if (command.outcome === 'REVOKED' ? !hasActive : hasActive) {
    throw new DecisionError('DECISION_TRANSITION_INVALID')
  }

  const recommendation = recommendations.items.find((item) => item.candidateId === command.candidateId)
  const isOverride =
    (command.outcome === 'APPROVED' && recommendation?.status !== 'RECOMMENDED') ||
    (command.outcome === 'REJECTED' && recommendation?.status === 'RECOMMENDED')
  const exceedsQuota = command.outcome === 'APPROVED' && countApproved(decisions, run.id) + 1 > quota

  return Object.freeze({
    id: context.decisionId,
    runId: run.id,
    candidateId: command.candidateId,
    outcome: /** @type {'APPROVED' | 'REJECTED' | 'REVOKED'} */ (command.outcome),
    reason,
    decidedBy: actor.id,
    decidedAt: context.decidedAt,
    sequence: (previous?.sequence ?? 0) + 1,
    supersedesId: previous?.id ?? null,
    isOverride,
    exceedsQuota,
  })
}
