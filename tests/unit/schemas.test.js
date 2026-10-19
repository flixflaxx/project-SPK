import { describe, expect, it } from 'vitest'
import {
  ApprovalDecisionSchema,
  AuditEventSchema,
  BackupJobSchema,
  CandidateSchema,
  CriteriaVersionSchema,
  ResidentSchema,
  SelectionPeriodSchema,
  UserSchema,
} from '../../shared/schemas/index.js'

describe('Zod Schemas — validasi model domain', () => {
  it('memvalidasi UserSchema', () => {
    const valid = {
      id: 'usr-1',
      email: 'operator@bulakamah.desa.id',
      displayName: 'Ahmad Operator',
      role: 'OPERATOR',
      status: 'ACTIVE',
      createdAt: '2026-10-13T00:00:00Z',
    }
    expect(UserSchema.parse(valid)).toEqual(valid)
  })

  it('ResidentSchema mewajibkan masking NIK yang tepat', () => {
    const valid = {
      id: 'res-1',
      nikMasked: '320101******0001',
      nikLookupHash: 'hash-lookup-1234',
      name: 'Budi Santoso',
      birthDate: '1980-05-12',
      addressStreet: 'Jl. Melati No. 12',
      addressRtRw: '002/005',
      documentCount: 2,
      createdAt: '2026-10-13T00:00:00Z',
    }
    expect(ResidentSchema.parse(valid)).toEqual(valid)

    // NIK plaintext tanpa masking ditolak oleh regex
    expect(() =>
      ResidentSchema.parse({
        ...valid,
        nikMasked: '3201011205800001',
      })
    ).toThrow()
  })

  it('SelectionPeriodSchema memvalidasi status dan kuota non-negatif', () => {
    const period = {
      id: 'per-1',
      name: 'Bansos Tahap 1 2026',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      status: 'ACTIVE',
      quota: 50,
      createdBy: 'admin-1',
    }
    expect(SelectionPeriodSchema.parse(period)).toMatchObject({ quota: 50 })
    expect(() => SelectionPeriodSchema.parse({ ...period, quota: -5 })).toThrow()
  })

  it('memvalidasi CriteriaVersionSchema, CandidateSchema, ApprovalDecisionSchema, AuditEventSchema, BackupJobSchema', () => {
    expect(
      CriteriaVersionSchema.parse({
        id: 'cv-1',
        label: 'Versi 1',
        status: 'ACTIVE',
        criteria: [{ code: 'C1', name: 'Pendapatan', type: 'COST', weight: '0.30' }],
      })
    ).toBeDefined()

    expect(
      CandidateSchema.parse({
        id: 'cand-1',
        residentId: 'res-1',
        periodId: 'per-1',
        createdAt: '2026-10-13T00:00:00Z',
      })
    ).toMatchObject({ verificationStatus: 'PENDING', applicationStatus: 'APPLIED' })

    expect(
      ApprovalDecisionSchema.parse({
        id: 'dec-1',
        runId: 'run-1',
        candidateId: 'cand-1',
        outcome: 'APPROVED',
        reason: 'Sangat layak menerima bantuan.',
        decidedBy: 'lurah-1',
        decidedAt: '2026-10-13T00:00:00Z',
        sequence: 1,
        supersedesId: null,
        isOverride: false,
        exceedsQuota: false,
      })
    ).toBeDefined()

    expect(
      AuditEventSchema.parse({
        id: 'aud-1',
        actorId: 'usr-1',
        actorName: 'Ahmad Operator',
        role: 'OPERATOR',
        action: 'RESIDENT_CREATED',
        targetType: 'Resident',
        outcome: 'SUCCESS',
        occurredAt: '2026-10-13T00:00:00Z',
      })
    ).toBeDefined()

    expect(
      BackupJobSchema.parse({
        id: 'bkp-1',
        requestedAt: '2026-10-13T00:00:00Z',
        status: 'SUCCEEDED',
        byteSize: 1048576,
      })
    ).toMatchObject({ retentionDays: 30 })
  })
})
