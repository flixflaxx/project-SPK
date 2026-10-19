import { calculateSaw } from './calculate.js'
import { canonicalJson } from './canonical.js'
import { RUN_ALLOWED_PERIOD_STATUS } from './constants.js'
import { validateCriteriaVersion } from './criteria.js'
import { selectEligibleCandidates } from './eligibility.js'
import { makeIssue, SawValidationError } from './errors.js'

/**
 * @typedef {Object} PeriodSnapshot
 * @property {string} id
 * @property {'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'} status
 * @property {string | null} criteriaVersionId Versi kriteria yang terkunci pada periode.
 */

/**
 * @typedef {Object} RunContext
 * @property {string} runId ID unik run baru (dibuat oleh lapisan aplikasi).
 * @property {string} executedAt Timestamp ISO-8601 UTC (dari server pada produksi).
 * @property {string} executedBy ID pengguna pelaksana.
 */

/**
 * @typedef {Object} CalculationRunRecord
 * @property {string} id
 * @property {string} periodId
 * @property {string} criteriaVersionId
 * @property {string} criteriaVersionLabel
 * @property {string} algorithmVersion
 * @property {typeof import('./constants.js').TIE_BREAK_RULE} tieBreakRule
 * @property {'CALCULATED'} status
 * @property {string} executedAt
 * @property {string} executedBy
 * @property {{ eligible: number, excluded: number, total: number }} counts
 * @property {string[]} includedCandidateIds
 * @property {import('./eligibility.js').ExcludedCandidate[]} excluded
 * @property {{ periodId: string, criteriaVersion: unknown, alternatives: import('./eligibility.js').EligibleAlternative[] }} snapshot
 * @property {string} snapshotCanonical JSON kanonik snapshot input (untuk di-hash oleh infrastruktur).
 * @property {import('./calculate.js').CriterionSummary[]} criteria
 * @property {import('./calculate.js').SawResultRow[]} results
 */

/** @template T @param {T} value @returns {T} */
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const key of Object.keys(value)) deepFreeze(/** @type {Record<string, unknown>} */ (value)[key])
  }
  return value
}

/**
 * Membuat CalculationRun resmi yang immutable. Fungsi murni: ID run, waktu, dan aktor
 * disuntikkan; tidak ada I/O. Run gagal melempar `SawValidationError` (tanpa hasil parsial).
 *
 * Urutan validasi (SYSTEM_DESIGN §4.4 "Validating"):
 * konteks run → status periode → versi kriteria terkunci → bobot/kriteria →
 * gerbang kelayakan kandidat → nilai & pembagi (di `calculateSaw`).
 *
 * @param {Object} input
 * @param {RunContext} input.context
 * @param {PeriodSnapshot} input.period
 * @param {import('./criteria.js').CriteriaVersionInput | null | undefined} input.criteriaVersion
 * @param {import('./eligibility.js').CandidateSnapshot[]} input.candidates
 * @param {import('./eligibility.js').AssessmentSnapshot[]} input.assessments
 * @param {{ weightTolerance?: string | number }} [input.options]
 * @returns {CalculationRunRecord}
 */
export function buildCalculationRun({ context, period, criteriaVersion, candidates, assessments, options }) {
  if (!context?.runId || !context?.executedBy || !context?.executedAt || Number.isNaN(Date.parse(context.executedAt))) {
    throw new SawValidationError([makeIssue('RUN_CONTEXT_INVALID')])
  }
  if (!period || period.status !== RUN_ALLOWED_PERIOD_STATUS) {
    throw new SawValidationError([makeIssue('PERIOD_NOT_ACTIVE')])
  }
  if (!criteriaVersion || !period.criteriaVersionId || period.criteriaVersionId !== criteriaVersion.id) {
    throw new SawValidationError([
      makeIssue('CRITERIA_VERSION_MISSING', {
        message: criteriaVersion
          ? 'Versi kriteria yang diberikan tidak sama dengan versi yang terkunci pada periode.'
          : undefined,
      }),
    ])
  }

  const criteriaCheck = validateCriteriaVersion(criteriaVersion, options)
  if (!criteriaCheck.ok) throw new SawValidationError(criteriaCheck.issues)

  const criterionCodes = criteriaCheck.criteria.map((criterion) => criterion.code)
  const { included, excluded } = selectEligibleCandidates({
    periodId: period.id,
    candidates,
    assessments,
    criterionCodes,
  })

  if (included.length === 0) {
    throw new SawValidationError([makeIssue('NO_ELIGIBLE_CANDIDATES')])
  }

  const calculation = calculateSaw({ criteriaVersion, alternatives: included, options })

  const snapshot = {
    periodId: period.id,
    criteriaVersion: {
      id: criteriaVersion.id,
      label: criteriaVersion.label,
      criteria: criteriaVersion.criteria.map((criterion) => ({
        code: criterion.code,
        name: criterion.name,
        type: criterion.type,
        weight: String(criterion.weight),
        unit: criterion.unit,
        scale: criterion.scale
          ? { min: criterion.scale.min === undefined ? undefined : String(criterion.scale.min), max: criterion.scale.max === undefined ? undefined : String(criterion.scale.max) }
          : undefined,
      })),
    },
    alternatives: included
      .map((alternative) => ({
        candidateId: alternative.candidateId,
        verificationStatus: alternative.verificationStatus,
        values: Object.fromEntries(criterionCodes.map((code) => [code, String(alternative.values[code]).trim()])),
      }))
      .sort((a, b) => (a.candidateId < b.candidateId ? -1 : a.candidateId > b.candidateId ? 1 : 0)),
    algorithmVersion: calculation.algorithmVersion,
    tieBreakRule: { id: calculation.tieBreakRule.id, version: calculation.tieBreakRule.version },
  }

  return deepFreeze({
    id: context.runId,
    periodId: period.id,
    criteriaVersionId: criteriaVersion.id,
    criteriaVersionLabel: criteriaVersion.label,
    algorithmVersion: calculation.algorithmVersion,
    tieBreakRule: calculation.tieBreakRule,
    status: /** @type {const} */ ('CALCULATED'),
    executedAt: context.executedAt,
    executedBy: context.executedBy,
    counts: { eligible: included.length, excluded: excluded.length, total: candidates.length },
    includedCandidateIds: included.map((alternative) => alternative.candidateId),
    excluded,
    snapshot,
    snapshotCanonical: canonicalJson(snapshot),
    criteria: calculation.criteria,
    results: calculation.results,
  })
}
