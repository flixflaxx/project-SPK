import { describe, expect, it } from 'vitest'
import { canonicalJson } from '../../../shared/domain/saw/canonical.js'
import { buildCalculationRun } from '../../../shared/domain/saw/run.js'
import {
  ACTIVE_PERIOD,
  GOLDEN_MATRIX,
  RUN_CONTEXT,
  SEED_CRITERIA_VERSION,
  toRunInput,
} from '../../fixtures/saw/golden.js'
import { captureSawIssues, codesOf } from '../../helpers/sawAssertions.js'

describe('buildCalculationRun — pembuatan CalculationRun immutable & snapshot', () => {
  const { candidates, assessments } = toRunInput(GOLDEN_MATRIX)

  it('berhasil membuat run valid dengan snapshot kanonik lengkap', () => {
    const run = buildCalculationRun({
      context: RUN_CONTEXT,
      period: ACTIVE_PERIOD,
      criteriaVersion: SEED_CRITERIA_VERSION,
      candidates,
      assessments,
    })

    expect(run.id).toBe(RUN_CONTEXT.runId)
    expect(run.status).toBe('CALCULATED')
    expect(run.periodId).toBe(ACTIVE_PERIOD.id)
    expect(run.criteriaVersionId).toBe(SEED_CRITERIA_VERSION.id)
    expect(run.counts).toEqual({ eligible: 4, excluded: 0, total: 4 })
    expect(run.results).toHaveLength(4)
    expect(run.results[0].candidateId).toBe('ALT-A')
    expect(run.snapshotCanonical).toBeTypeOf('string')
    expect(JSON.parse(run.snapshotCanonical)).toMatchObject({
      periodId: ACTIVE_PERIOD.id,
      algorithmVersion: run.algorithmVersion,
    })
  })

  it('canonicalJson menghasilkan string identik tanpa memedulikan urutan key', () => {
    const objA = { z: 1, a: 2, m: { y: 10, x: 20 } }
    const objB = { a: 2, m: { x: 20, y: 10 }, z: 1 }
    expect(canonicalJson(objA)).toBe(canonicalJson(objB))
  })

  it('menolak jika periode tidak aktif → PERIOD_NOT_ACTIVE', () => {
    const issues = captureSawIssues(() =>
      buildCalculationRun({
        context: RUN_CONTEXT,
        period: { ...ACTIVE_PERIOD, status: 'CLOSED' },
        criteriaVersion: SEED_CRITERIA_VERSION,
        candidates,
        assessments,
      })
    )
    expect(codesOf(issues)).toEqual(['PERIOD_NOT_ACTIVE'])
  })

  it('menolak jika versi kriteria mismatch dengan periode → CRITERIA_VERSION_MISSING', () => {
    const issues = captureSawIssues(() =>
      buildCalculationRun({
        context: RUN_CONTEXT,
        period: { ...ACTIVE_PERIOD, criteriaVersionId: 'other-version' },
        criteriaVersion: SEED_CRITERIA_VERSION,
        candidates,
        assessments,
      })
    )
    expect(codesOf(issues)).toEqual(['CRITERIA_VERSION_MISSING'])
  })

  it('menolak jika konteks run tidak valid → RUN_CONTEXT_INVALID', () => {
    const issues = captureSawIssues(() =>
      buildCalculationRun({
        context: { runId: '', executedAt: 'invalid-date', executedBy: '' },
        period: ACTIVE_PERIOD,
        criteriaVersion: SEED_CRITERIA_VERSION,
        candidates,
        assessments,
      })
    )
    expect(codesOf(issues)).toEqual(['RUN_CONTEXT_INVALID'])
  })

  it('menolak jika tidak ada kandidat eligible → NO_ELIGIBLE_CANDIDATES', () => {
    const { candidates: unverified } = toRunInput(GOLDEN_MATRIX, {
      statuses: { 'ALT-A': 'PENDING', 'ALT-B': 'PENDING', 'ALT-C': 'PENDING', 'ALT-D': 'PENDING' },
    })
    const issues = captureSawIssues(() =>
      buildCalculationRun({
        context: RUN_CONTEXT,
        period: ACTIVE_PERIOD,
        criteriaVersion: SEED_CRITERIA_VERSION,
        candidates: unverified,
        assessments,
      })
    )
    expect(codesOf(issues)).toEqual(['NO_ELIGIBLE_CANDIDATES'])
  })
})
