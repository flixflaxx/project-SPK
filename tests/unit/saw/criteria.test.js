import { describe, expect, it } from 'vitest'
import { assertValidCriteriaVersion, validateCriteriaVersion } from '../../../shared/domain/saw/criteria.js'
import { toExactString } from '../../../shared/domain/saw/fraction.js'
import { SEED_CRITERIA_VERSION } from '../../fixtures/saw/golden.js'
import { captureSawIssues, codesOf } from '../../helpers/sawAssertions.js'

/**
 * Sengaja menerima bentuk tidak valid untuk menguji validasi.
 * @param {ReadonlyArray<Record<string, unknown>>} criteria
 */
const version = (criteria) => ({
  id: 'cv-test',
  label: 'test',
  criteria: /** @type {import('../../../shared/domain/saw/criteria.js').CriterionInput[]} */ (/** @type {unknown} */ (criteria)),
})

describe('validasi versi kriteria & bobot', () => {
  it('skenario 1: bobot seed 0.30+0.25+0.20+0.15+0.10 = 1.00 valid', () => {
    const result = validateCriteriaVersion(SEED_CRITERIA_VERSION)
    expect(result.ok).toBe(true)
    expect(result.issues).toEqual([])
    expect(toExactString(result.weightSum)).toBe('1/1')
    expect(result.criteria.map((c) => c.code)).toEqual(['C1', 'C2', 'C3', 'C4', 'C5'])
  })

  it('total bobot ≠ 1 ditolak dengan WEIGHT_SUM_INVALID', () => {
    const criteria = SEED_CRITERIA_VERSION.criteria.map((c) => (c.code === 'C5' ? { ...c, weight: '0.09' } : c))
    const result = validateCriteriaVersion(version(criteria))
    expect(result.ok).toBe(false)
    expect(codesOf(result.issues)).toEqual(['WEIGHT_SUM_INVALID'])
    expect(toExactString(result.weightSum)).toBe('99/100')
  })

  it('toleransi eksplisit dapat dikonfigurasi', () => {
    const criteria = SEED_CRITERIA_VERSION.criteria.map((c) => (c.code === 'C5' ? { ...c, weight: '0.0999' } : c))
    expect(validateCriteriaVersion(version(criteria)).ok).toBe(false)
    expect(validateCriteriaVersion(version(criteria), { weightTolerance: '0.0001' }).ok).toBe(true)
    expect(validateCriteriaVersion(version(criteria), { weightTolerance: '-1' }).ok).toBe(false)
  })

  it('bobot negatif atau bukan angka → WEIGHT_INVALID', () => {
    const negative = validateCriteriaVersion(
      version([
        { code: 'K1', name: 'a', type: 'BENEFIT', weight: '-0.5' },
        { code: 'K2', name: 'b', type: 'BENEFIT', weight: '1.5' },
      ]),
    )
    expect(codesOf(negative.issues)).toContain('WEIGHT_INVALID')
    const text = validateCriteriaVersion(version([{ code: 'K1', name: 'a', type: 'BENEFIT', weight: 'satu' }]))
    expect(codesOf(text.issues)).toEqual(['WEIGHT_INVALID'])
    const empty = validateCriteriaVersion(version([{ code: 'K1', name: 'a', type: 'BENEFIT', weight: '' }]))
    expect(codesOf(empty.issues)).toEqual(['WEIGHT_INVALID'])
  })

  it('kode ganda, tipe salah, dan skala terbalik → CRITERIA_INVALID', () => {
    const result = validateCriteriaVersion(
      version([
        { code: 'K1', name: 'a', type: 'BENEFIT', weight: '0.5' },
        { code: 'K1', name: 'b', type: 'COST', weight: '0.25' },
        { code: 'K3', name: 'c', type: 'SEDANG', weight: '0.25', scale: { min: 5, max: 1 } },
      ]),
    )
    expect(result.ok).toBe(false)
    expect(codesOf(result.issues).filter((code) => code === 'CRITERIA_INVALID')).toHaveLength(3)
  })

  it('versi kriteria tidak ada → CRITERIA_VERSION_MISSING', () => {
    expect(codesOf(validateCriteriaVersion(null).issues)).toEqual(['CRITERIA_VERSION_MISSING'])
    expect(codesOf(validateCriteriaVersion(version([])).issues)).toEqual(['CRITERIA_VERSION_MISSING'])
  })

  it('assertValidCriteriaVersion melempar SawValidationError', () => {
    const issues = captureSawIssues(() => assertValidCriteriaVersion(version([{ code: 'K1', name: 'a', type: 'BENEFIT', weight: '0.4' }])))
    expect(codesOf(issues)).toEqual(['WEIGHT_SUM_INVALID'])
  })
})
