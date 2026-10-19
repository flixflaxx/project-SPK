import { CRITERION_TYPES, DEFAULT_WEIGHT_TOLERANCE } from './constants.js'
import { makeIssue, SawValidationError } from './errors.js'
import { abs, add, compare, isNegative, ONE, parseDecimal, sub, ZERO } from './fraction.js'

/**
 * @typedef {Object} CriterionInput
 * @property {string} code Kode stabil, mis. "C1".
 * @property {string} name Nama kriteria (tampilan).
 * @property {'BENEFIT' | 'COST'} type Arah atribut.
 * @property {number | string} weight Bobot desimal non-negatif.
 * @property {string} [unit]
 * @property {{ min?: number | string, max?: number | string }} [scale] Rentang inklusif nilai matriks.
 */

/**
 * @typedef {Object} CriteriaVersionInput
 * @property {string} id ID versi kriteria (immutable).
 * @property {string} label Label versi, mis. "v1-demo".
 * @property {CriterionInput[]} criteria
 */

/**
 * @typedef {Object} ValidatedCriterion
 * @property {string} code
 * @property {string} name
 * @property {'BENEFIT' | 'COST'} type
 * @property {import('./fraction.js').Fraction} weight
 * @property {string} weightText Representasi bobot apa adanya (string) untuk snapshot.
 * @property {import('./fraction.js').Fraction | null} min
 * @property {import('./fraction.js').Fraction | null} max
 * @property {string} [unit]
 */

/**
 * @typedef {Object} CriteriaValidationResult
 * @property {boolean} ok
 * @property {import('./errors.js').SawIssue[]} issues
 * @property {ValidatedCriterion[]} criteria Hanya terisi bila ok.
 * @property {import('./fraction.js').Fraction | null} weightSum
 */

/**
 * Memvalidasi versi kriteria: kode unik, tipe benefit/cost, bobot non-negatif,
 * skala konsisten, dan total bobot tepat 1 (± toleransi eksplisit).
 *
 * @param {CriteriaVersionInput | null | undefined} criteriaVersion
 * @param {{ weightTolerance?: string | number }} [options]
 * @returns {CriteriaValidationResult}
 */
export function validateCriteriaVersion(criteriaVersion, options = {}) {
  /** @type {import('./errors.js').SawIssue[]} */
  const issues = []
  if (!criteriaVersion || !Array.isArray(criteriaVersion.criteria) || criteriaVersion.criteria.length === 0) {
    return { ok: false, issues: [makeIssue('CRITERIA_VERSION_MISSING')], criteria: [], weightSum: null }
  }

  const tolerance = parseDecimal(options.weightTolerance ?? DEFAULT_WEIGHT_TOLERANCE)
  if (!tolerance || isNegative(tolerance)) {
    return {
      ok: false,
      issues: [makeIssue('CRITERIA_INVALID', { field: 'weightTolerance', message: 'Toleransi total bobot tidak valid.' })],
      criteria: [],
      weightSum: null,
    }
  }

  const seen = new Set()
  /** @type {ValidatedCriterion[]} */
  const validated = []
  let sum = ZERO
  let weightsParsable = true

  criteriaVersion.criteria.forEach((criterion, index) => {
    const code = typeof criterion?.code === 'string' ? criterion.code.trim() : ''
    const label = code || `#${index + 1}`
    if (!code) {
      issues.push(makeIssue('CRITERIA_INVALID', { field: `criteria[${index}].code`, message: `Kriteria ${label}: kode wajib diisi.` }))
    } else if (seen.has(code)) {
      issues.push(makeIssue('CRITERIA_INVALID', { criterionCode: code, message: `Kode kriteria ${code} digunakan lebih dari sekali.` }))
    }
    seen.add(code)

    if (criterion?.type !== CRITERION_TYPES.BENEFIT && criterion?.type !== CRITERION_TYPES.COST) {
      issues.push(makeIssue('CRITERIA_INVALID', { criterionCode: code || undefined, message: `Kriteria ${label}: tipe harus BENEFIT atau COST.` }))
    }

    const weight = parseDecimal(criterion?.weight)
    if (!weight || isNegative(weight)) {
      weightsParsable = false
      issues.push(makeIssue('WEIGHT_INVALID', { criterionCode: code || undefined, message: `Bobot kriteria ${label} harus angka desimal ≥ 0.` }))
    } else {
      sum = add(sum, weight)
    }

    const hasMin = criterion?.scale?.min !== undefined && criterion?.scale?.min !== null
    const hasMax = criterion?.scale?.max !== undefined && criterion?.scale?.max !== null
    const min = hasMin ? parseDecimal(criterion.scale.min) : null
    const max = hasMax ? parseDecimal(criterion.scale.max) : null
    if ((hasMin && !min) || (hasMax && !max) || (min && max && compare(min, max) > 0)) {
      issues.push(makeIssue('CRITERIA_INVALID', { criterionCode: code || undefined, message: `Skala kriteria ${label} tidak valid (min/max).` }))
    }

    if (weight && !isNegative(weight)) {
      validated.push({
        code,
        name: typeof criterion.name === 'string' ? criterion.name : code,
        type: criterion.type,
        weight,
        weightText: String(criterion.weight).trim(),
        min,
        max,
        unit: criterion.unit,
      })
    }
  })

  if (weightsParsable && compare(abs(sub(sum, ONE)), tolerance) > 0) {
    issues.push(makeIssue('WEIGHT_SUM_INVALID', { field: 'weights' }))
  }

  const ok = issues.length === 0
  return { ok, issues, criteria: ok ? validated : [], weightSum: weightsParsable ? sum : null }
}

/**
 * Sama dengan `validateCriteriaVersion` tetapi melempar `SawValidationError` bila tidak valid.
 * @param {CriteriaVersionInput | null | undefined} criteriaVersion
 * @param {{ weightTolerance?: string | number }} [options]
 * @returns {ValidatedCriterion[]}
 */
export function assertValidCriteriaVersion(criteriaVersion, options) {
  const result = validateCriteriaVersion(criteriaVersion, options)
  if (!result.ok) throw new SawValidationError(result.issues)
  return result.criteria
}
