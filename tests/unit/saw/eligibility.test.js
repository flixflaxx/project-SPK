import { describe, expect, it } from 'vitest'
import { isMissingValue, selectEligibleCandidates } from '../../../shared/domain/saw/eligibility.js'
import { SEED_CRITERIA_VERSION } from '../../fixtures/saw/golden.js'
import { captureSawIssues, codesOf } from '../../helpers/sawAssertions.js'

describe('selectEligibleCandidates — gerbang kelayakan kandidat & assessment', () => {
  const criterionCodes = SEED_CRITERIA_VERSION.criteria.map((c) => c.code)
  const periodId = 'period-2026'

  it('lolos jika terverifikasi dan semua kriteria dinilai valid', () => {
    const candidates = [{ id: 'CAND-1', periodId, verificationStatus: /** @type {const} */ ('VERIFIED') }]
    const assessments = criterionCodes.map((code) => ({
      candidateId: 'CAND-1',
      criterionCode: code,
      value: 10,
      status: /** @type {const} */ ('VALID'),
    }))

    const { included, excluded } = selectEligibleCandidates({
      periodId,
      candidates,
      assessments,
      criterionCodes,
    })

    expect(included).toHaveLength(1)
    expect(excluded).toHaveLength(0)
    expect(included[0].candidateId).toBe('CAND-1')
    expect(included[0].verificationStatus).toBe('VERIFIED')
    expect(included[0].values.C1).toBe(10)
  })

  it('mengecualikan kandidat belum terverifikasi (PENDING, REVISION_REQUIRED, REJECTED)', () => {
    const candidates = [
      { id: 'CAND-1', periodId, verificationStatus: /** @type {const} */ ('PENDING') },
      { id: 'CAND-2', periodId, verificationStatus: /** @type {const} */ ('REVISION_REQUIRED') },
      { id: 'CAND-3', periodId, verificationStatus: /** @type {const} */ ('REJECTED') },
    ]
    const assessments = candidates.flatMap((c) =>
      criterionCodes.map((code) => ({
        candidateId: c.id,
        criterionCode: code,
        value: 10,
        status: /** @type {const} */ ('VALID'),
      }))
    )

    const { included, excluded } = selectEligibleCandidates({
      periodId,
      candidates,
      assessments,
      criterionCodes,
    })

    expect(included).toHaveLength(0)
    expect(excluded).toHaveLength(3)
    for (const exc of excluded) {
      expect(codesOf(exc.reasons)).toContain('CANDIDATE_NOT_VERIFIED')
    }
  })

  it('mengecualikan kandidat dengan assessment belum lengkap atau bernilai kosong', () => {
    const candidates = [{ id: 'CAND-1', periodId, verificationStatus: /** @type {const} */ ('VERIFIED') }]
    // C5 hilang, C4 kosong
    const assessments = [
      { candidateId: 'CAND-1', criterionCode: 'C1', value: 10, status: /** @type {const} */ ('VALID') },
      { candidateId: 'CAND-1', criterionCode: 'C2', value: 10, status: /** @type {const} */ ('VALID') },
      { candidateId: 'CAND-1', criterionCode: 'C3', value: 10, status: /** @type {const} */ ('VALID') },
      { candidateId: 'CAND-1', criterionCode: 'C4', value: '', status: /** @type {const} */ ('VALID') },
    ]

    const { included, excluded } = selectEligibleCandidates({
      periodId,
      candidates,
      assessments,
      criterionCodes,
    })

    expect(included).toHaveLength(0)
    expect(excluded).toHaveLength(1)
    expect(codesOf(excluded[0].reasons)).toEqual(['ASSESSMENT_MISSING', 'ASSESSMENT_MISSING'])
  })

  it('mengecualikan kandidat dengan assessment berstatus DRAFT atau INVALID', () => {
    const candidates = [{ id: 'CAND-1', periodId, verificationStatus: /** @type {const} */ ('VERIFIED') }]
    const assessments = criterionCodes.map((code) => ({
      candidateId: 'CAND-1',
      criterionCode: code,
      value: 10,
      status: code === 'C2' ? /** @type {const} */ ('DRAFT') : /** @type {const} */ ('VALID'),
    }))

    const { included, excluded } = selectEligibleCandidates({
      periodId,
      candidates,
      assessments,
      criterionCodes,
    })

    expect(included).toHaveLength(0)
    expect(excluded).toHaveLength(1)
    expect(codesOf(excluded[0].reasons)).toEqual(['ASSESSMENT_NOT_VALIDATED'])
  })

  it('menolak integritas data jika kandidat duplikat atau assessment duplikat', () => {
    const duplicateCandidates = [
      { id: 'CAND-1', periodId, verificationStatus: /** @type {const} */ ('VERIFIED') },
      { id: 'CAND-1', periodId, verificationStatus: /** @type {const} */ ('VERIFIED') },
    ]
    const issuesCand = captureSawIssues(() =>
      selectEligibleCandidates({
        periodId,
        candidates: duplicateCandidates,
        assessments: [],
        criterionCodes,
      })
    )
    expect(codesOf(issuesCand)).toEqual(['CANDIDATE_DUPLICATE'])

    const candidates = [{ id: 'CAND-1', periodId, verificationStatus: /** @type {const} */ ('VERIFIED') }]
    const duplicateAssessments = [
      { candidateId: 'CAND-1', criterionCode: 'C1', value: 10, status: /** @type {const} */ ('VALID') },
      { candidateId: 'CAND-1', criterionCode: 'C1', value: 20, status: /** @type {const} */ ('VALID') },
    ]
    const issuesAss = captureSawIssues(() =>
      selectEligibleCandidates({
        periodId,
        candidates,
        assessments: duplicateAssessments,
        criterionCodes,
      })
    )
    expect(codesOf(issuesAss)).toEqual(['ASSESSMENT_DUPLICATE'])
  })

  it('isMissingValue mendeteksi null, undefined, string kosong atau whitespace', () => {
    expect(isMissingValue(null)).toBe(true)
    expect(isMissingValue(undefined)).toBe(true)
    expect(isMissingValue('')).toBe(true)
    expect(isMissingValue('   ')).toBe(true)
    expect(isMissingValue(0)).toBe(false)
    expect(isMissingValue('0')).toBe(false)
    expect(isMissingValue(false)).toBe(false)
  })
})
