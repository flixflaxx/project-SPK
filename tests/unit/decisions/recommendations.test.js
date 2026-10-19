import { describe, expect, it } from 'vitest'
import { deriveRecommendations, RECOMMENDATION_STATUS } from '../../../shared/domain/decisions/recommendations.js'

describe('deriveRecommendations — penurunan rekomendasi dari kuota', () => {
  const dummyRun = {
    results: [
      { candidateId: 'ALT-1', rank: 1, tie: { tiedOnPreference: false } },
      { candidateId: 'ALT-2', rank: 2, tie: { tiedOnPreference: false } },
      { candidateId: 'ALT-3', rank: 3, tie: { tiedOnPreference: false } },
    ],
    excluded: [
      { candidateId: 'ALT-4', verificationStatus: 'REJECTED', reasons: [{ code: 'CANDIDATE_NOT_VERIFIED' }] },
      { candidateId: 'ALT-5', verificationStatus: 'PENDING', reasons: [{ code: 'ASSESSMENT_MISSING' }] },
    ],
  }

  it('menandai kandidat dalam kuota sebagai RECOMMENDED dan di luar kuota sebagai RESERVE', () => {
    // @ts-expect-error test dummy
    const recs = deriveRecommendations({ run: dummyRun, quota: 2 })
    expect(recs.programRulesApproved).toBe(false)
    expect(recs.quota).toBe(2)

    const alt1 = recs.items.find((i) => i.candidateId === 'ALT-1')
    expect(alt1?.status).toBe(RECOMMENDATION_STATUS.RECOMMENDED)
    expect(alt1?.requiresHumanApproval).toBe(true)

    const alt3 = recs.items.find((i) => i.candidateId === 'ALT-3')
    expect(alt3?.status).toBe(RECOMMENDATION_STATUS.RESERVE)

    const alt4 = recs.items.find((i) => i.candidateId === 'ALT-4')
    expect(alt4?.status).toBe(RECOMMENDATION_STATUS.NOT_ELIGIBLE)

    const alt5 = recs.items.find((i) => i.candidateId === 'ALT-5')
    expect(alt5?.status).toBe(RECOMMENDATION_STATUS.REQUIRES_REVIEW)
  })

  it('kuota negatif melempar RangeError', () => {
    // @ts-expect-error test dummy
    expect(() => deriveRecommendations({ run: dummyRun, quota: -1 })).toThrow(RangeError)
  })
})
