import { ALGORITHM_VERSION, CRITERION_TYPES, ELIGIBLE_VERIFICATION_STATUS, TIE_BREAK_RULE } from './constants.js'
import { assertValidCriteriaVersion } from './criteria.js'
import { isMissingValue } from './eligibility.js'
import { makeIssue, SawValidationError } from './errors.js'
import {
  add,
  compare,
  div,
  isNegative,
  isPositive,
  isZero,
  mul,
  parseDecimal,
  toExactString,
  toNumber,
  ZERO,
} from './fraction.js'

/**
 * @typedef {import('./fraction.js').Fraction} Fraction
 * @typedef {import('./criteria.js').CriteriaVersionInput} CriteriaVersionInput
 * @typedef {import('./eligibility.js').EligibleAlternative} EligibleAlternative
 */

/**
 * Bilangan hasil perhitungan: `exact` adalah nilai eksak "n/d" (sumber kebenaran),
 * `value` adalah aproksimasi double untuk tampilan/grafik saja.
 * @typedef {Object} ExactNumber
 * @property {string} exact
 * @property {number} value
 */

/**
 * @typedef {Object} CriterionSummary
 * @property {string} code
 * @property {string} name
 * @property {'BENEFIT' | 'COST'} type
 * @property {ExactNumber} weight
 * @property {string} weightText
 * @property {ExactNumber} max Maksimum kolom.
 * @property {ExactNumber} min Minimum kolom.
 * @property {ExactNumber} normalizer Pembanding normalisasi (max untuk benefit, min untuk cost).
 * @property {number} tieBreakOrder Urutan kriteria dalam tie-break (1 = pertama).
 */

/**
 * @typedef {Object} TieInfo
 * @property {boolean} tiedOnPreference True bila ada alternatif lain dengan V eksak sama.
 * @property {number} tieGroupSize Jumlah alternatif dengan V sama (1 = tidak seri).
 * @property {string | null} resolvedBy `null`, `CRITERION:<kode>`, atau `CANDIDATE_ID`.
 */

/**
 * @typedef {Object} SawResultRow
 * @property {string} candidateId
 * @property {number} rank Peringkat unik 1..n setelah tie-break.
 * @property {Record<string, string>} raw Nilai mentah apa adanya (string).
 * @property {Record<string, ExactNumber>} normalized Matriks R.
 * @property {Record<string, ExactNumber>} contributions Kontribusi wⱼ × rᵢⱼ.
 * @property {ExactNumber} preference Nilai V.
 * @property {TieInfo} tie
 */

/**
 * @typedef {Object} SawCalculation
 * @property {string} algorithmVersion
 * @property {typeof TIE_BREAK_RULE} tieBreakRule
 * @property {CriterionSummary[]} criteria
 * @property {SawResultRow[]} results Terurut berdasarkan rank.
 */

/** @param {Fraction} f @returns {ExactNumber} */
const exactNumber = (f) => Object.freeze({ exact: toExactString(f), value: toNumber(f) })

/**
 * Menghitung SAW secara deterministik dan eksak atas alternatif yang SUDAH lolos gerbang
 * kelayakan. Fungsi tetap memvalidasi ulang (defense in depth) dan melempar
 * `SawValidationError` berisi seluruh masalah yang ditemukan — tidak pernah menghasilkan
 * ranking parsial.
 *
 * Formula (PRD §6.2): benefit rᵢⱼ = xᵢⱼ / max(xⱼ); cost rᵢⱼ = min(xⱼ) / xᵢⱼ;
 * Vᵢ = Σ wⱼ × rᵢⱼ; urut V menurun dengan tie-break `TIE_BREAK_RULE`.
 *
 * @param {Object} input
 * @param {CriteriaVersionInput} input.criteriaVersion
 * @param {EligibleAlternative[]} input.alternatives
 * @param {{ weightTolerance?: string | number }} [input.options]
 * @returns {SawCalculation}
 */
export function calculateSaw({ criteriaVersion, alternatives, options }) {
  const criteria = assertValidCriteriaVersion(criteriaVersion, options)

  if (!Array.isArray(alternatives) || alternatives.length === 0) {
    throw new SawValidationError([makeIssue('NO_ELIGIBLE_CANDIDATES')])
  }

  /** @type {import('./errors.js').SawIssue[]} */
  const issues = []
  const seenIds = new Set()
  /** @type {Array<{ candidateId: string, raw: Record<string, string>, x: Record<string, Fraction> }>} */
  const rows = []

  for (const alternative of alternatives) {
    const candidateId = alternative.candidateId
    if (seenIds.has(candidateId)) issues.push(makeIssue('CANDIDATE_DUPLICATE', { candidateId }))
    seenIds.add(candidateId)
    if (alternative.verificationStatus !== ELIGIBLE_VERIFICATION_STATUS) {
      issues.push(makeIssue('CANDIDATE_NOT_VERIFIED', { candidateId }))
    }

    /** @type {Record<string, string>} */
    const raw = {}
    /** @type {Record<string, Fraction>} */
    const x = {}
    for (const criterion of criteria) {
      const code = criterion.code
      const input = alternative.values?.[code]
      if (isMissingValue(input)) {
        issues.push(makeIssue('ASSESSMENT_MISSING', { candidateId, criterionCode: code }))
        continue
      }
      const parsed = parseDecimal(input)
      if (!parsed) {
        issues.push(makeIssue('VALUE_INVALID', { candidateId, criterionCode: code }))
        continue
      }
      if (criterion.type === CRITERION_TYPES.COST && !isPositive(parsed)) {
        issues.push(makeIssue('COST_VALUE_NON_POSITIVE', { candidateId, criterionCode: code }))
        continue
      }
      if (criterion.type === CRITERION_TYPES.BENEFIT && isNegative(parsed)) {
        issues.push(
          makeIssue('VALUE_OUT_OF_RANGE', {
            candidateId,
            criterionCode: code,
            message: 'Nilai kriteria benefit tidak boleh negatif.',
          }),
        )
        continue
      }
      if ((criterion.min && compare(parsed, criterion.min) < 0) || (criterion.max && compare(parsed, criterion.max) > 0)) {
        issues.push(makeIssue('VALUE_OUT_OF_RANGE', { candidateId, criterionCode: code }))
        continue
      }
      raw[code] = String(input).trim()
      x[code] = parsed
    }
    rows.push({ candidateId, raw, x })
  }

  if (issues.length > 0) throw new SawValidationError(issues)

  // Statistik kolom dan validasi pembagi.
  /** @type {Record<string, { max: Fraction, min: Fraction }>} */
  const stats = {}
  for (const criterion of criteria) {
    let max = rows[0].x[criterion.code]
    let min = max
    for (const row of rows) {
      const value = row.x[criterion.code]
      if (compare(value, max) > 0) max = value
      if (compare(value, min) < 0) min = value
    }
    if (criterion.type === CRITERION_TYPES.BENEFIT && isZero(max)) {
      issues.push(makeIssue('BENEFIT_MAX_INVALID', { criterionCode: criterion.code }))
    }
    stats[criterion.code] = { max, min }
  }
  if (issues.length > 0) throw new SawValidationError(issues)

  // Urutan kriteria untuk tie-break: bobot menurun, bobot sama → kode menaik.
  const tieOrder = [...criteria].sort((a, b) => compare(b.weight, a.weight) || (a.code < b.code ? -1 : a.code > b.code ? 1 : 0))

  const computed = rows.map((row) => {
    /** @type {Record<string, Fraction>} */
    const r = {}
    /** @type {Record<string, Fraction>} */
    const c = {}
    let v = ZERO
    for (const criterion of criteria) {
      const { max, min } = stats[criterion.code]
      const xij = row.x[criterion.code]
      const rij = criterion.type === CRITERION_TYPES.BENEFIT ? div(xij, max) : div(min, xij)
      const cij = mul(criterion.weight, rij)
      r[criterion.code] = rij
      c[criterion.code] = cij
      v = add(v, cij) // tanpa pembulatan sebelum agregasi
    }
    return { ...row, r, c, v }
  })

  /**
   * Mengembalikan pembanding dan level yang memutuskan urutan dua alternatif.
   * @param {typeof computed[number]} a
   * @param {typeof computed[number]} b
   * @returns {{ order: number, level: string | null }}
   */
  const comparePair = (a, b) => {
    const byV = compare(b.v, a.v)
    if (byV !== 0) return { order: byV, level: null }
    for (const criterion of tieOrder) {
      const byR = compare(b.r[criterion.code], a.r[criterion.code])
      if (byR !== 0) return { order: byR, level: `CRITERION:${criterion.code}` }
    }
    const byId = a.candidateId < b.candidateId ? -1 : a.candidateId > b.candidateId ? 1 : 0
    return { order: byId, level: 'CANDIDATE_ID' }
  }

  const sorted = [...computed].sort((a, b) => comparePair(a, b).order)

  // V sama selalu bersebelahan setelah pengurutan → ukuran grup seri dihitung linear.
  /** @type {number[]} */
  const groupSizes = new Array(sorted.length).fill(1)
  for (let start = 0; start < sorted.length; ) {
    let end = start + 1
    while (end < sorted.length && compare(sorted[end].v, sorted[start].v) === 0) end += 1
    for (let k = start; k < end; k += 1) groupSizes[k] = end - start
    start = end
  }

  /** @type {SawResultRow[]} */
  const results = sorted.map((row, index) => {
    const groupSize = groupSizes[index]

    let resolvedBy = null
    if (groupSize > 1) {
      const prev = sorted[index - 1]
      const next = sorted[index + 1]
      const neighbour = prev && compare(prev.v, row.v) === 0 ? comparePair(prev, row) : next ? comparePair(row, next) : null
      resolvedBy = neighbour?.level ?? null
    }
    /** @type {Record<string, ExactNumber>} */
    const normalized = {}
    /** @type {Record<string, ExactNumber>} */
    const contributions = {}
    for (const criterion of criteria) {
      normalized[criterion.code] = exactNumber(row.r[criterion.code])
      contributions[criterion.code] = exactNumber(row.c[criterion.code])
    }
    return Object.freeze({
      candidateId: row.candidateId,
      rank: index + 1,
      raw: Object.freeze({ ...row.raw }),
      normalized: Object.freeze(normalized),
      contributions: Object.freeze(contributions),
      preference: exactNumber(row.v),
      tie: Object.freeze({ tiedOnPreference: groupSize > 1, tieGroupSize: groupSize, resolvedBy }),
    })
  })

  /** @type {CriterionSummary[]} */
  const criteriaSummary = criteria.map((criterion) => {
    const { max, min } = stats[criterion.code]
    return Object.freeze({
      code: criterion.code,
      name: criterion.name,
      type: criterion.type,
      weight: exactNumber(criterion.weight),
      weightText: criterion.weightText,
      max: exactNumber(max),
      min: exactNumber(min),
      normalizer: exactNumber(criterion.type === CRITERION_TYPES.BENEFIT ? max : min),
      tieBreakOrder: tieOrder.findIndex((item) => item.code === criterion.code) + 1,
    })
  })

  return Object.freeze({
    algorithmVersion: ALGORITHM_VERSION,
    tieBreakRule: TIE_BREAK_RULE,
    criteria: Object.freeze(criteriaSummary),
    results: Object.freeze(results),
  })
}
