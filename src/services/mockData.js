import { buildCalculationRun } from '@shared/domain/saw/run.js'
import { SEED_CRITERIA_VERSION } from '../../tests/fixtures/saw/golden.js'

export const DEMO_USERS = [
  {
    id: 'usr-admin',
    email: 'admin@bulakamah.desa.id',
    displayName: 'Bambang Irawan (Super Admin)',
    role: 'SUPER_ADMIN',
    permissions: [
      'all',
      'decision.approve',
      'decision.reject',
      'criteria.edit',
      'backup.trigger',
      'user.manage',
    ],
    status: 'ACTIVE',
  },
  {
    id: 'usr-operator',
    email: 'operator@bulakamah.desa.id',
    displayName: 'Siti Aminah (Operator Data)',
    role: 'OPERATOR',
    permissions: ['resident.manage', 'candidate.manage', 'assessment.input', 'saw.run'],
    status: 'ACTIVE',
  },
  {
    id: 'usr-verifier',
    email: 'verifikator@bulakamah.desa.id',
    displayName: 'Hendra Wijaya (Verifikator)',
    role: 'VERIFIER',
    permissions: ['verification.review', 'resident.read', 'candidate.read'],
    status: 'ACTIVE',
  },
  {
    id: 'usr-approver',
    email: 'lurah@bulakamah.desa.id',
    displayName: 'Drs. H. Mulyadi (Kepala Desa / Penyetuju)',
    role: 'APPROVER',
    permissions: ['decision.approve', 'decision.reject', 'report.read'],
    status: 'ACTIVE',
  },
  {
    id: 'usr-auditor',
    email: 'auditor@bulakamah.desa.id',
    displayName: 'Rina Kusuma (Auditor)',
    role: 'AUDITOR',
    permissions: ['audit.read', 'report.read', 'history.read'],
    status: 'ACTIVE',
  },
]

export const DEMO_PERIODS = [
  {
    id: 'period-2026-t1',
    name: 'Bantuan Sosial Pangan & Tunai Tahap I T.A. 2026',
    startDate: '2026-01-10',
    endDate: '2026-03-31',
    status: 'ACTIVE',
    quota: 3,
    criteriaVersionId: SEED_CRITERIA_VERSION.id,
    createdBy: 'usr-admin',
    activatedAt: '2026-01-10T08:00:00Z',
    lockedAt: null,
  },
  {
    id: 'period-2025-t4',
    name: 'Bantuan Sosial Tunai Dampak Inflasi Tahap IV T.A. 2025',
    startDate: '2025-10-01',
    endDate: '2025-12-20',
    status: 'CLOSED',
    quota: 2,
    criteriaVersionId: SEED_CRITERIA_VERSION.id,
    createdBy: 'usr-admin',
    activatedAt: '2025-10-01T08:00:00Z',
    lockedAt: '2025-12-20T17:00:00Z',
  },
]

export const DEMO_RESIDENTS = [
  {
    id: 'res-001',
    nikMasked: '320101******0001',
    nikLookupHash: 'hash-res-001',
    name: 'Kuswanto (Keluarga Prasejahtera)',
    birthDate: '1974-03-15',
    addressStreet: 'Kampung Bulak Amah RT 01/RW 03',
    addressRtRw: '001/003',
    phone: '0812-****-1101',
    documentCount: 3,
    createdAt: '2026-01-11T09:00:00Z',
  },
  {
    id: 'res-002',
    nikMasked: '320101******0002',
    nikLookupHash: 'hash-res-002',
    name: 'Marni binti Sanusi (Lansia Mandiri)',
    birthDate: '1958-11-20',
    addressStreet: 'Kampung Bulak Amah RT 02/RW 03',
    addressRtRw: '002/003',
    phone: '0813-****-2202',
    documentCount: 2,
    createdAt: '2026-01-11T09:30:00Z',
  },
  {
    id: 'res-003',
    nikMasked: '320101******0003',
    nikLookupHash: 'hash-res-003',
    name: 'Supardi (Buruh Harian Lepas)',
    birthDate: '1982-07-04',
    addressStreet: 'Kampung Bulak Amah RT 01/RW 04',
    addressRtRw: '001/004',
    phone: '0856-****-3303',
    documentCount: 3,
    createdAt: '2026-01-11T10:00:00Z',
  },
  {
    id: 'res-004',
    nikMasked: '320101******0004',
    nikLookupHash: 'hash-res-004',
    name: 'Endang Suhartini (Kepala Keluarga Perempuan)',
    birthDate: '1979-01-28',
    addressStreet: 'Kampung Bulak Amah RT 03/RW 03',
    addressRtRw: '003/003',
    phone: '0878-****-4404',
    documentCount: 3,
    createdAt: '2026-01-11T10:30:00Z',
  },
  {
    id: 'res-005',
    nikMasked: '320101******0005',
    nikLookupHash: 'hash-res-005',
    name: 'Rahmat Hidayat (Pedagang Gerobak)',
    birthDate: '1985-09-12',
    addressStreet: 'Kampung Bulak Amah RT 02/RW 04',
    addressRtRw: '002/004',
    phone: '0896-****-5505',
    documentCount: 1,
    createdAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'res-006',
    nikMasked: '320101******0006',
    nikLookupHash: 'hash-res-006',
    name: 'Zaenal Arifin (Disabilitas Fisik)',
    birthDate: '1990-04-18',
    addressStreet: 'Kampung Bulak Amah RT 03/RW 04',
    addressRtRw: '003/004',
    phone: '0812-****-6606',
    documentCount: 2,
    createdAt: '2026-01-12T08:30:00Z',
  },
]

export const DEMO_CANDIDATES = [
  {
    id: 'cand-001',
    residentId: 'res-001',
    periodId: 'period-2026-t1',
    applicationStatus: 'PROCESSED',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'KK, KTP, dan surat keterangan penghasilan RT lengkap & valid.',
    verifiedBy: 'usr-verifier',
    verifiedAt: '2026-01-15T11:00:00Z',
    createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'cand-002',
    residentId: 'res-002',
    periodId: 'period-2026-t1',
    applicationStatus: 'PROCESSED',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Survei lapangan kondisi rumah terverifikasi sesuai foto.',
    verifiedBy: 'usr-verifier',
    verifiedAt: '2026-01-15T11:30:00Z',
    createdAt: '2026-01-12T10:15:00Z',
  },
  {
    id: 'cand-003',
    residentId: 'res-003',
    periodId: 'period-2026-t1',
    applicationStatus: 'PROCESSED',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Dokumen lengkap, anggota keluarga rentan balita terkonfirmasi.',
    verifiedBy: 'usr-verifier',
    verifiedAt: '2026-01-15T13:00:00Z',
    createdAt: '2026-01-12T10:30:00Z',
  },
  {
    id: 'cand-004',
    residentId: 'res-004',
    periodId: 'period-2026-t1',
    applicationStatus: 'PROCESSED',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Dokumen sah, pendapatan di bawah upah minimum.',
    verifiedBy: 'usr-verifier',
    verifiedAt: '2026-01-15T13:30:00Z',
    createdAt: '2026-01-12T11:00:00Z',
  },
  {
    id: 'cand-005',
    residentId: 'res-005',
    periodId: 'period-2026-t1',
    applicationStatus: 'APPLIED',
    verificationStatus: 'REVISION_REQUIRED',
    verificationNotes: 'Foto KK buram dan slip pendapatan belum ada cap basah RT.',
    verifiedBy: 'usr-verifier',
    verifiedAt: '2026-01-15T14:00:00Z',
    createdAt: '2026-01-12T11:30:00Z',
  },
  {
    id: 'cand-006',
    residentId: 'res-006',
    periodId: 'period-2026-t1',
    applicationStatus: 'APPLIED',
    verificationStatus: 'PENDING',
    verificationNotes: 'Menunggu jadwal kunjungan verifikator lapangan.',
    verifiedBy: null,
    verifiedAt: null,
    createdAt: '2026-01-12T12:00:00Z',
  },
]

// Data penilaian matriks untuk calon yang terverifikasi (cand-001 s.d cand-004)
// dan penilaian parsial untuk cand-005 & cand-006
export const DEMO_ASSESSMENTS = [
  // cand-001 (Kuswanto)
  { id: 'ass-101', candidateId: 'cand-001', criterionCode: 'C1', rawValue: '1000000', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:00:00Z' },
  { id: 'ass-102', candidateId: 'cand-001', criterionCode: 'C2', rawValue: '4', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:00:00Z' },
  { id: 'ass-103', candidateId: 'cand-001', criterionCode: 'C3', rawValue: '5', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:00:00Z' },
  { id: 'ass-104', candidateId: 'cand-001', criterionCode: 'C4', rawValue: '2', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:00:00Z' },
  { id: 'ass-105', candidateId: 'cand-001', criterionCode: 'C5', rawValue: '1', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:00:00Z' },

  // cand-002 (Marni)
  { id: 'ass-201', candidateId: 'cand-002', criterionCode: 'C1', rawValue: '2000000', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:30:00Z' },
  { id: 'ass-202', candidateId: 'cand-002', criterionCode: 'C2', rawValue: '2', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:30:00Z' },
  { id: 'ass-203', candidateId: 'cand-002', criterionCode: 'C3', rawValue: '3', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:30:00Z' },
  { id: 'ass-204', candidateId: 'cand-002', criterionCode: 'C4', rawValue: '1', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:30:00Z' },
  { id: 'ass-205', candidateId: 'cand-002', criterionCode: 'C5', rawValue: '2', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T09:30:00Z' },

  // cand-003 (Supardi)
  { id: 'ass-301', candidateId: 'cand-003', criterionCode: 'C1', rawValue: '1500000', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:00:00Z' },
  { id: 'ass-302', candidateId: 'cand-003', criterionCode: 'C2', rawValue: '5', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:00:00Z' },
  { id: 'ass-303', candidateId: 'cand-003', criterionCode: 'C3', rawValue: '4', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:00:00Z' },
  { id: 'ass-304', candidateId: 'cand-003', criterionCode: 'C4', rawValue: '0', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:00:00Z' },
  { id: 'ass-305', candidateId: 'cand-003', criterionCode: 'C5', rawValue: '3', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:00:00Z' },

  // cand-004 (Endang)
  { id: 'ass-401', candidateId: 'cand-004', criterionCode: 'C1', rawValue: '2500000', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:30:00Z' },
  { id: 'ass-402', candidateId: 'cand-004', criterionCode: 'C2', rawValue: '3', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:30:00Z' },
  { id: 'ass-403', candidateId: 'cand-004', criterionCode: 'C3', rawValue: '2', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:30:00Z' },
  { id: 'ass-404', candidateId: 'cand-004', criterionCode: 'C4', rawValue: '1', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:30:00Z' },
  { id: 'ass-405', candidateId: 'cand-004', criterionCode: 'C5', rawValue: '1', status: 'VALID', authorId: 'usr-operator', createdAt: '2026-01-16T10:30:00Z' },

  // cand-005 (Parsial / draft)
  { id: 'ass-501', candidateId: 'cand-005', criterionCode: 'C1', rawValue: '1800000', status: 'DRAFT', authorId: 'usr-operator', createdAt: '2026-01-16T11:00:00Z' },
]

export const DEMO_AUDIT_LOGS = [
  {
    id: 'aud-001',
    actorId: 'usr-admin',
    actorName: 'Bambang Irawan',
    role: 'SUPER_ADMIN',
    action: 'PERIOD_ACTIVATED',
    targetType: 'SelectionPeriod',
    targetId: 'period-2026-t1',
    outcome: 'SUCCESS',
    occurredAt: '2026-01-10T08:00:00Z',
    requestSummary: 'Aktivasi periode seleksi Tahap 1 2026 dengan kuota 3.',
  },
  {
    id: 'aud-002',
    actorId: 'usr-verifier',
    actorName: 'Hendra Wijaya',
    role: 'VERIFIER',
    action: 'CANDIDATE_VERIFIED',
    targetType: 'Candidate',
    targetId: 'cand-001',
    outcome: 'SUCCESS',
    occurredAt: '2026-01-15T11:00:00Z',
    requestSummary: 'Verifikasi dokumen warga Kuswanto disetujui (lengkap).',
  },
  {
    id: 'aud-003',
    actorId: 'usr-operator',
    actorName: 'Siti Aminah',
    role: 'OPERATOR',
    action: 'CALCULATION_RUN_CREATED',
    targetType: 'CalculationRun',
    targetId: 'run-demo-001',
    outcome: 'SUCCESS',
    occurredAt: '2026-01-17T09:30:00Z',
    requestSummary: 'Eksekusi kalkulasi SAW atas 4 alternatif terverifikasi.',
  },
]

export const DEMO_BACKUP_JOBS = [
  {
    id: 'bkp-20260117-01',
    requestedAt: '2026-01-17T03:00:00Z',
    startedAt: '2026-01-17T03:00:05Z',
    completedAt: '2026-01-17T03:01:20Z',
    status: 'RESTORE_TESTED',
    storageKey: 'backups/2026/01/spk-bulakamah-snapshot-20260117.enc',
    checksum: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    byteSize: 1482910,
    retentionDays: 30,
    restoreTestResult: 'Uji restore terisolasi sukses pada PostgreSQL test-instance pada 2026-01-17 04:00 UTC.',
  },
  {
    id: 'bkp-20260110-01',
    requestedAt: '2026-01-10T03:00:00Z',
    startedAt: '2026-01-10T03:00:04Z',
    completedAt: '2026-01-10T03:01:15Z',
    status: 'SUCCEEDED',
    storageKey: 'backups/2026/01/spk-bulakamah-snapshot-20260110.enc',
    checksum: 'sha256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    byteSize: 1245192,
    retentionDays: 30,
    restoreTestResult: null,
  },
]

// Generate an official baseline CalculationRun using our pure domain!
export function createDemoCalculationRun() {
  const activePeriod = DEMO_PERIODS[0]
  const runInput = {
    context: {
      runId: 'run-demo-001',
      executedAt: '2026-01-17T09:30:00.000Z',
      executedBy: 'usr-operator',
    },
    period: activePeriod,
    criteriaVersion: SEED_CRITERIA_VERSION,
    candidates: DEMO_CANDIDATES.map((c) => ({
      id: c.id,
      periodId: c.periodId,
      verificationStatus: /** @type {'PENDING' | 'VERIFIED' | 'REVISION_REQUIRED' | 'REJECTED'} */ (c.verificationStatus),
    })),
    assessments: DEMO_ASSESSMENTS.map((a) => ({
      candidateId: a.candidateId,
      criterionCode: a.criterionCode,
      value: a.rawValue,
      status: /** @type {'DRAFT' | 'VALID' | 'INVALID'} */ (a.status),
    })),
  }
  return buildCalculationRun(runInput)
}
