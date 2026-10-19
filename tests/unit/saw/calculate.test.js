import { describe, expect, it } from 'vitest'
import { calculateSaw } from '../../../shared/domain/saw/calculate.js'
import { ALGORITHM_VERSION, TIE_BREAK_RULE } from '../../../shared/domain/saw/constants.js'
import { add, formatExact, parseExactString, toExactString, ZERO } from '../../../shared/domain/saw/fraction.js'
import { GOLDEN_EXPECTED, GOLDEN_MATRIX, SEED_CRITERIA_VERSION, toAlternatives } from '../../fixtures/saw/golden.js'
import { captureSawIssues, codesOf } from '../../helpers/sawAssertions.js'

const twoCriteria = (typeA = 'BENEFIT', typeB = 'BENEFIT') => ({
  id: 'cv-two',
  label: 'dua kriteria',
  criteria: [
    { code: 'K1', name: 'K1', type: /** @type {'BENEFIT' | 'COST'} */ (typeA), weight: '0.5' },
    { code: 'K2', name: 'K2', type: /** @type {'BENEFIT' | 'COST'} */ (typeB), weight: '0.5' },
  ],
})

describe('calculateSaw — fixture emas', () => {
  const calc = calculateSaw({ criteriaVersion: SEED_CRITERIA_VERSION, alternatives: toAlternatives(GOLDEN_MATRIX) })

  it('menghasilkan urutan peringkat menurun sesuai perhitungan manual', () => {
    expect(calc.results.map((row) => row.candidateId)).toEqual(GOLDEN_EXPECTED.order)
    expect(calc.results.map((row) => row.rank)).toEqual([1, 2, 3, 4])
  })

  it('nilai V eksak sama dengan perhitungan manual', () => {
    for (const row of calc.results) {
      expect(row.preference.exact).toBe(GOLDEN_EXPECTED.preference[row.candidateId])
    }
  })

  it('matriks R sesuai formula benefit x/max dan cost min/x', () => {
    for (const row of calc.results) {
      for (const [code, expected] of Object.entries(GOLDEN_EXPECTED.normalized[row.candidateId])) {
        expect(row.normalized[code].exact, `${row.candidateId}.${code}`).toBe(expected)
      }
    }
  })

  it('skenario 4: V = Σ kontribusi wⱼ × rᵢⱼ (tanpa pembulatan sebelum penjumlahan)', () => {
    const altC = calc.results.find((row) => row.candidateId === 'ALT-C')
    for (const [code, expected] of Object.entries(GOLDEN_EXPECTED.contributionsAltC)) {
      expect(altC.contributions[code].exact).toBe(expected)
    }
    for (const row of calc.results) {
      const sum = Object.values(row.contributions).reduce((acc, c) => add(acc, parseExactString(c.exact)), ZERO)
      expect(toExactString(sum)).toBe(row.preference.exact)
    }
    // Membulatkan kontribusi ke 2 desimal dulu akan memberi 0.64, bukan 0.6433.
    expect(formatExact(altC.preference.exact, 4)).toBe('0.6433')
  })

  it('menyimpan versi algoritme, aturan tie-break, dan pembanding kolom', () => {
    expect(calc.algorithmVersion).toBe(ALGORITHM_VERSION)
    expect(calc.tieBreakRule).toEqual(TIE_BREAK_RULE)
    expect(calc.tieBreakRule.approved).toBe(false)
    const c1 = calc.criteria.find((c) => c.code === 'C1')
    expect(c1.normalizer.exact).toBe('1000000/1')
    expect(calc.criteria.find((c) => c.code === 'C2').normalizer.exact).toBe('5/1')
    expect(calc.criteria.map((c) => c.tieBreakOrder)).toEqual([1, 2, 3, 4, 5])
  })

  it('tidak ada nilai seri pada fixture emas', () => {
    expect(calc.results.every((row) => !row.tie.tiedOnPreference && row.tie.resolvedBy === null)).toBe(true)
  })

  it('hasil immutable', () => {
    expect(Object.isFrozen(calc.results)).toBe(true)
    expect(() => {
      // @ts-expect-error uji immutabilitas
      calc.results[0].rank = 99
    }).toThrow(TypeError)
  })
})

describe('calculateSaw — normalisasi skenario SYSTEM_DESIGN §10.2', () => {
  it('benefit max=10, x=5 → r=0.5', () => {
    const calc = calculateSaw({
      criteriaVersion: twoCriteria('BENEFIT', 'BENEFIT'),
      alternatives: toAlternatives({ A: { K1: 10, K2: 1 }, B: { K1: 5, K2: 1 } }),
    })
    expect(calc.results.find((r) => r.candidateId === 'B').normalized.K1.exact).toBe('1/2')
  })

  it('cost min=100, x=200 → r=0.5', () => {
    const calc = calculateSaw({
      criteriaVersion: twoCriteria('COST', 'BENEFIT'),
      alternatives: toAlternatives({ A: { K1: 100, K2: 1 }, B: { K1: 200, K2: 1 } }),
    })
    expect(calc.results.find((r) => r.candidateId === 'B').normalized.K1.exact).toBe('1/2')
  })
})

describe('calculateSaw — validasi nilai (skenario 3)', () => {
  it('nilai cost 0 atau negatif ditolak', () => {
    const zero = captureSawIssues(() =>
      calculateSaw({ criteriaVersion: twoCriteria('COST'), alternatives: toAlternatives({ A: { K1: 0, K2: 1 }, B: { K1: 5, K2: 1 } }) }),
    )
    expect(zero).toEqual([expect.objectContaining({ code: 'COST_VALUE_NON_POSITIVE', candidateId: 'A', criterionCode: 'K1' })])
    const negative = captureSawIssues(() =>
      calculateSaw({ criteriaVersion: twoCriteria('COST'), alternatives: toAlternatives({ A: { K1: -3, K2: 1 } }) }),
    )
    expect(codesOf(negative)).toEqual(['COST_VALUE_NON_POSITIVE'])
  })

  it('benefit dengan max = 0 ditandai BENEFIT_MAX_INVALID, bukan NaN', () => {
    const issues = captureSawIssues(() =>
      calculateSaw({ criteriaVersion: twoCriteria(), alternatives: toAlternatives({ A: { K1: 0, K2: 1 }, B: { K1: 0, K2: 2 } }) }),
    )
    expect(issues).toEqual([expect.objectContaining({ code: 'BENEFIT_MAX_INVALID', criterionCode: 'K1' })])
  })

  it('nilai kosong TIDAK dianggap nol → ASSESSMENT_MISSING', () => {
    for (const empty of [null, undefined, '', '  ']) {
      const issues = captureSawIssues(() =>
        calculateSaw({ criteriaVersion: twoCriteria(), alternatives: toAlternatives({ A: { K1: empty, K2: 1 }, B: { K1: 2, K2: 1 } }) }),
      )
      expect(issues).toEqual([expect.objectContaining({ code: 'ASSESSMENT_MISSING', candidateId: 'A', criterionCode: 'K1' })])
    }
  })

  it('nilai bukan angka → VALUE_INVALID', () => {
    for (const bad of ['abc', '1,5', Number.NaN, Infinity]) {
      const issues = captureSawIssues(() =>
        calculateSaw({ criteriaVersion: twoCriteria(), alternatives: toAlternatives({ A: { K1: bad, K2: 1 } }) }),
      )
      expect(codesOf(issues)).toEqual(['VALUE_INVALID'])
    }
  })

  it('nilai di luar skala atau benefit negatif → VALUE_OUT_OF_RANGE', () => {
    const outOfScale = captureSawIssues(() =>
      calculateSaw({ criteriaVersion: SEED_CRITERIA_VERSION, alternatives: toAlternatives({ A: { ...GOLDEN_MATRIX['ALT-A'], C3: 6 } }) }),
    )
    expect(outOfScale).toEqual([expect.objectContaining({ code: 'VALUE_OUT_OF_RANGE', criterionCode: 'C3' })])
    const negativeBenefit = captureSawIssues(() =>
      calculateSaw({ criteriaVersion: twoCriteria(), alternatives: toAlternatives({ A: { K1: -1, K2: 1 } }) }),
    )
    expect(codesOf(negativeBenefit)).toEqual(['VALUE_OUT_OF_RANGE'])
  })

  it('mengumpulkan semua masalah sekaligus dan tidak menghasilkan ranking parsial', () => {
    const issues = captureSawIssues(() =>
      calculateSaw({
        criteriaVersion: twoCriteria('COST', 'BENEFIT'),
        alternatives: toAlternatives({ A: { K1: 0, K2: null }, B: { K1: 'x', K2: 2 }, C: { K1: 4, K2: 1 } }),
      }),
    )
    expect(codesOf(issues).sort()).toEqual(['ASSESSMENT_MISSING', 'COST_VALUE_NON_POSITIVE', 'VALUE_INVALID'])
  })

  it('alternatif belum terverifikasi ditolak walau lolos ke fungsi inti (defense in depth)', () => {
    const issues = captureSawIssues(() =>
      calculateSaw({
        criteriaVersion: twoCriteria(),
        alternatives: [
          { candidateId: 'A', verificationStatus: /** @type {'VERIFIED'} */ (/** @type {unknown} */ ('PENDING')), values: { K1: 1, K2: 1 } },
        ],
      }),
    )
    expect(codesOf(issues)).toEqual(['CANDIDATE_NOT_VERIFIED'])
  })

  it('daftar alternatif kosong → NO_ELIGIBLE_CANDIDATES', () => {
    expect(codesOf(captureSawIssues(() => calculateSaw({ criteriaVersion: twoCriteria(), alternatives: [] })))).toEqual([
      'NO_ELIGIBLE_CANDIDATES',
    ])
  })

  it('bobot tidak valid menghentikan perhitungan', () => {
    const bad = { ...twoCriteria(), criteria: twoCriteria().criteria.map((c) => ({ ...c, weight: '0.4' })) }
    expect(codesOf(captureSawIssues(() => calculateSaw({ criteriaVersion: bad, alternatives: toAlternatives({ A: { K1: 1, K2: 1 } }) })))).toEqual([
      'WEIGHT_SUM_INVALID',
    ])
  })
})

describe('calculateSaw — nilai seri & tie-break deterministik (skenario 6)', () => {
  it('V seri diputus oleh r kriteria berbobot terbesar; bobot sama → kode kriteria menaik', () => {
    const calc = calculateSaw({
      criteriaVersion: twoCriteria(),
      alternatives: toAlternatives({ Y: { K1: 1, K2: 2 }, X: { K1: 2, K2: 1 } }),
    })
    expect(calc.results.map((r) => r.candidateId)).toEqual(['X', 'Y'])
    expect(calc.results[0].preference.exact).toBe(calc.results[1].preference.exact)
    expect(calc.results[0].tie).toEqual({ tiedOnPreference: true, tieGroupSize: 2, resolvedBy: 'CRITERION:K1' })
    expect(calc.results[1].tie.resolvedBy).toBe('CRITERION:K1')
  })

  it('seri eksak yang tak terdeteksi double (0.1+0.2 vs 0.7×3/7) tetap terdeteksi dan diputus', () => {
    const criteriaVersion = {
      id: 'cv-float',
      label: 'float trap',
      criteria: [
        { code: 'K1', name: 'K1', type: /** @type {const} */ ('BENEFIT'), weight: '0.1' },
        { code: 'K2', name: 'K2', type: /** @type {const} */ ('BENEFIT'), weight: '0.2' },
        { code: 'K3', name: 'K3', type: /** @type {const} */ ('BENEFIT'), weight: '0.7' },
      ],
    }
    const calc = calculateSaw({
      criteriaVersion,
      alternatives: toAlternatives({ P: { K1: 1, K2: 1, K3: 0 }, Q: { K1: 0, K2: 0, K3: 3 }, R: { K1: 1, K2: 1, K3: 7 } }),
    })
    expect(calc.results.map((r) => r.candidateId)).toEqual(['R', 'Q', 'P'])
    const [, q, p] = calc.results
    expect(q.preference.exact).toBe('3/10')
    expect(p.preference.exact).toBe('3/10')
    expect(q.tie.resolvedBy).toBe('CRITERION:K3')
  })

  it('alternatif identik diputus dengan ID kandidat menaik', () => {
    const calc = calculateSaw({
      criteriaVersion: twoCriteria(),
      alternatives: toAlternatives({ 'cand-b': { K1: 1, K2: 1 }, 'cand-a': { K1: 1, K2: 1 }, 'cand-c': { K1: 2, K2: 2 } }),
    })
    expect(calc.results.map((r) => r.candidateId)).toEqual(['cand-c', 'cand-a', 'cand-b'])
    expect(calc.results[1].tie).toEqual({ tiedOnPreference: true, tieGroupSize: 2, resolvedBy: 'CANDIDATE_ID' })
    expect(calc.results[0].tie.tiedOnPreference).toBe(false)
  })

  it('urutan input berbeda menghasilkan hasil identik', () => {
    const input = toAlternatives(GOLDEN_MATRIX)
    const a = calculateSaw({ criteriaVersion: SEED_CRITERIA_VERSION, alternatives: input })
    const b = calculateSaw({ criteriaVersion: SEED_CRITERIA_VERSION, alternatives: [...input].reverse() })
    expect(b).toEqual(a)
  })
})

describe('calculateSaw — kinerja', () => {
  it('5 kriteria × 1.000 alternatif selesai < 3 detik (target PRD §8)', () => {
    /** @type {Record<string, Record<string, number>>} */
    const matrix = {}
    let seed = 42
    const next = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648
      return seed
    }
    for (let i = 0; i < 1000; i += 1) {
      matrix[`ALT-${String(i).padStart(4, '0')}`] = {
        C1: 500000 + (next() % 4500000),
        C2: next() % 9,
        C3: 1 + (next() % 5),
        C4: next() % 3,
        C5: 1 + (next() % 3),
      }
    }
    const started = performance.now()
    const calc = calculateSaw({ criteriaVersion: SEED_CRITERIA_VERSION, alternatives: toAlternatives(matrix) })
    const elapsed = performance.now() - started
    expect(calc.results).toHaveLength(1000)
    expect(new Set(calc.results.map((r) => r.rank)).size).toBe(1000)
    expect(elapsed).toBeLessThan(3000)
  })
})
