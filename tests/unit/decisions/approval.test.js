import { describe, expect, it } from 'vitest'
import {
  countApproved,
  DECISION_PERMISSION,
  latestDecision,
  recordDecision,
} from '../../../shared/domain/decisions/approval.js'

describe('recordDecision — keputusan persetujuan human-in-the-loop', () => {
  const actor = { id: 'user-leader', permissions: [DECISION_PERMISSION] }
  const run = {
    id: 'run-1',
    status: 'CALCULATED',
    results: [{ candidateId: 'ALT-1' }, { candidateId: 'ALT-2' }],
  }
  const recommendations = {
    items: [
      { candidateId: 'ALT-1', status: 'RECOMMENDED' },
      { candidateId: 'ALT-2', status: 'RESERVE' },
    ],
  }
  const quota = 1

  it('berhasil mencatat persetujuan dengan alasan', () => {
    const decision = recordDecision({
      decisions: [],
      run,
      recommendations,
      quota,
      actor,
      context: { decisionId: 'dec-1', decidedAt: '2026-10-13T16:00:00.000Z' },
      command: { candidateId: 'ALT-1', outcome: 'APPROVED', reason: 'Memenuhi syarat kemiskinan ekstrem.' },
    })

    expect(decision.id).toBe('dec-1')
    expect(decision.outcome).toBe('APPROVED')
    expect(decision.isOverride).toBe(false)
    expect(decision.exceedsQuota).toBe(false)
    expect(decision.sequence).toBe(1)
  })

  it('menandai override bila menolak kandidat RECOMMENDED atau menyetujui kandidat RESERVE', () => {
    const overrideReject = recordDecision({
      decisions: [],
      run,
      recommendations,
      quota,
      actor,
      context: { decisionId: 'dec-1', decidedAt: '2026-10-13T16:00:00.000Z' },
      command: { candidateId: 'ALT-1', outcome: 'REJECTED', reason: 'Telah menerima bantuan program lain.' },
    })
    expect(overrideReject.isOverride).toBe(true)

    const overrideApprove = recordDecision({
      decisions: [],
      run,
      recommendations,
      quota,
      actor,
      context: { decisionId: 'dec-2', decidedAt: '2026-10-13T16:00:00.000Z' },
      command: { candidateId: 'ALT-2', outcome: 'APPROVED', reason: 'Diskresi pimpinan ada lansia sebatang kara.' },
    })
    expect(overrideApprove.isOverride).toBe(true)
  })

  it('menolak tanpa izin DECISION_PERMISSION', () => {
    expect(() =>
      recordDecision({
        decisions: [],
        run,
        recommendations,
        quota,
        actor: { id: 'user-operator', permissions: ['operator.read'] },
        context: { decisionId: 'dec-1', decidedAt: '2026-10-13T16:00:00.000Z' },
        command: { candidateId: 'ALT-1', outcome: 'APPROVED', reason: 'Alasan' },
      })
    ).toThrowError('Anda tidak memiliki izin')
  })

  it('alasan keputusan wajib diisi', () => {
    expect(() =>
      recordDecision({
        decisions: [],
        run,
        recommendations,
        quota,
        actor,
        context: { decisionId: 'dec-1', decidedAt: '2026-10-13T16:00:00.000Z' },
        command: { candidateId: 'ALT-1', outcome: 'APPROVED', reason: '   ' },
      })
    ).toThrowError('Alasan keputusan wajib diisi.')
  })

  it('transisi keputusan: tidak bisa menimpa keputusan aktif tanpa mencabut terlebih dahulu (REVOKED)', () => {
    const dec1 = recordDecision({
      decisions: [],
      run,
      recommendations,
      quota,
      actor,
      context: { decisionId: 'dec-1', decidedAt: '2026-10-13T16:00:00.000Z' },
      command: { candidateId: 'ALT-1', outcome: 'APPROVED', reason: 'Setuju awal' },
    })

    // Mencoba langsung tolak padahal ada keputusan aktif
    expect(() =>
      recordDecision({
        decisions: [dec1],
        run,
        recommendations,
        quota,
        actor,
        context: { decisionId: 'dec-2', decidedAt: '2026-10-13T16:05:00.000Z' },
        command: { candidateId: 'ALT-1', outcome: 'REJECTED', reason: 'Tiba-tiba tolak' },
      })
    ).toThrowError('Transisi keputusan tidak valid')

    // Cabut keputusan aktif
    const decRevoke = recordDecision({
      decisions: [dec1],
      run,
      recommendations,
      quota,
      actor,
      context: { decisionId: 'dec-2', decidedAt: '2026-10-13T16:05:00.000Z' },
      command: { candidateId: 'ALT-1', outcome: 'REVOKED', reason: 'Pencabutan persetujuan karena verifikasi ulang.' },
    })
    expect(decRevoke.outcome).toBe('REVOKED')
    expect(decRevoke.sequence).toBe(2)

    // Sekarang keputusan baru dapat dibuat
    const dec3 = recordDecision({
      decisions: [dec1, decRevoke],
      run,
      recommendations,
      quota,
      actor,
      context: { decisionId: 'dec-3', decidedAt: '2026-10-13T16:10:00.000Z' },
      command: { candidateId: 'ALT-1', outcome: 'REJECTED', reason: 'Ditolak setelah konfirmasi lapangan.' },
    })
    expect(dec3.outcome).toBe('REJECTED')
    expect(dec3.sequence).toBe(3)

    expect(latestDecision([dec1, decRevoke, dec3], 'run-1', 'ALT-1')?.outcome).toBe('REJECTED')
    expect(countApproved([dec1, decRevoke, dec3], 'run-1')).toBe(0)
  })
})
