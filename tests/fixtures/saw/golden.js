/**
 * Fixture emas SAW — DATA SINTETIS untuk pengujian, bukan data warga.
 *
 * Versi kriteria = seed prototipe PRD §6.1 (belum kebijakan resmi).
 * Nilai yang diharapkan dihitung MANUAL (independen dari implementasi) di bawah ini.
 *
 * Matriks X:
 *            C1 (cost)  C2 (ben)  C3 (ben)  C4 (ben)  C5 (cost)
 *   ALT-A    1.000.000      4         5         2         1
 *   ALT-B    2.000.000      2         3         1         2
 *   ALT-C    1.500.000      5         4         0         3
 *   ALT-D    2.500.000      3         2         1         1
 *
 * Pembanding: min C1 = 1.000.000; max C2 = 5; max C3 = 5; max C4 = 2; min C5 = 1.
 *
 * Matriks R:
 *   ALT-A: 1,      4/5, 1,   1,   1     → V = .30 + .20 + .20 + .15 + .10          = 0,95    = 19/20
 *   ALT-B: 1/2,    2/5, 3/5, 1/2, 1/2   → V = .15 + .10 + .12 + .075 + .05         = 0,495   = 99/200
 *   ALT-C: 2/3,    1,   4/5, 0,   1/3   → V = .20 + .25 + .16 + 0 + 1/30           = 193/300 ≈ 0,643333
 *   ALT-D: 2/5,    3/5, 2/5, 1/2, 1     → V = .12 + .15 + .08 + .075 + .10         = 0,525   = 21/40
 *
 * Ranking: ALT-A (1), ALT-C (2), ALT-D (3), ALT-B (4).
 */

export const SEED_CRITERIA_VERSION = Object.freeze({
  id: 'cv-seed-demo-1',
  label: 'v1 (seed prototipe, belum disahkan)',
  criteria: [
    { code: 'C1', name: 'Pendapatan per bulan', type: 'COST', weight: '0.30', unit: 'Rupiah' },
    { code: 'C2', name: 'Jumlah tanggungan', type: 'BENEFIT', weight: '0.25', unit: 'orang', scale: { min: 0 } },
    { code: 'C3', name: 'Kerentanan kondisi rumah', type: 'BENEFIT', weight: '0.20', unit: 'skor', scale: { min: 1, max: 5 } },
    { code: 'C4', name: 'Anggota keluarga rentan', type: 'BENEFIT', weight: '0.15', unit: 'skor', scale: { min: 0, max: 2 } },
    { code: 'C5', name: 'Skor kepemilikan aset produktif', type: 'COST', weight: '0.10', unit: 'skor', scale: { min: 1, max: 3 } },
  ],
})

export const GOLDEN_MATRIX = Object.freeze({
  'ALT-A': { C1: 1000000, C2: 4, C3: 5, C4: 2, C5: 1 },
  'ALT-B': { C1: 2000000, C2: 2, C3: 3, C4: 1, C5: 2 },
  'ALT-C': { C1: 1500000, C2: 5, C3: 4, C4: 0, C5: 3 },
  'ALT-D': { C1: 2500000, C2: 3, C3: 2, C4: 1, C5: 1 },
})

export const GOLDEN_EXPECTED = Object.freeze({
  order: ['ALT-A', 'ALT-C', 'ALT-D', 'ALT-B'],
  preference: { 'ALT-A': '19/20', 'ALT-B': '99/200', 'ALT-C': '193/300', 'ALT-D': '21/40' },
  normalized: {
    'ALT-A': { C1: '1/1', C2: '4/5', C3: '1/1', C4: '1/1', C5: '1/1' },
    'ALT-B': { C1: '1/2', C2: '2/5', C3: '3/5', C4: '1/2', C5: '1/2' },
    'ALT-C': { C1: '2/3', C2: '1/1', C3: '4/5', C4: '0/1', C5: '1/3' },
    'ALT-D': { C1: '2/5', C2: '3/5', C3: '2/5', C4: '1/2', C5: '1/1' },
  },
  // Kontribusi ALT-C (wⱼ × rᵢⱼ): .30×2/3, .25×1, .20×4/5, .15×0, .10×1/3
  contributionsAltC: { C1: '1/5', C2: '1/4', C3: '4/25', C4: '0/1', C5: '1/30' },
})

/**
 * @param {Record<string, Record<string, number | string | null>>} matrix
 * @returns {import('../../../shared/domain/saw/eligibility.js').EligibleAlternative[]}
 */
export function toAlternatives(matrix) {
  return Object.entries(matrix).map(([candidateId, values]) => ({
    candidateId,
    verificationStatus: 'VERIFIED',
    values: /** @type {Record<string, number | string>} */ (values),
  }))
}

/**
 * Bentuk snapshot kandidat + assessment untuk run resmi.
 * @param {Record<string, Record<string, number | string | null>>} matrix
 * @param {{ periodId?: string, statuses?: Record<string, string>, assessmentStatus?: Record<string, string> }} [options]
 */
export function toRunInput(matrix, options = {}) {
  const periodId = options.periodId ?? 'period-demo-2026'
  const candidates = Object.keys(matrix).map((id) => ({
    id,
    periodId,
    verificationStatus: /** @type {'PENDING' | 'VERIFIED' | 'REVISION_REQUIRED' | 'REJECTED'} */ (options.statuses?.[id] ?? 'VERIFIED'),
  }))
  const assessments = Object.entries(matrix).flatMap(([candidateId, values]) =>
    Object.entries(values).map(([criterionCode, value]) => ({
      candidateId,
      criterionCode,
      value,
      status: /** @type {'DRAFT' | 'VALID' | 'INVALID'} */ (options.assessmentStatus?.[`${candidateId}:${criterionCode}`] ?? 'VALID'),
    })),
  )
  return { candidates, assessments }
}

export const ACTIVE_PERIOD = Object.freeze({
  id: 'period-demo-2026',
  status: 'ACTIVE',
  criteriaVersionId: SEED_CRITERIA_VERSION.id,
})

export const RUN_CONTEXT = Object.freeze({
  runId: 'run-test-0001',
  executedAt: '2026-10-13T16:00:00.000Z',
  executedBy: 'user-operator-demo',
})
