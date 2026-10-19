import { z } from 'zod'

// 1. Roles and Users
export const RoleEnum = z.enum([
  'SUPER_ADMIN',
  'OPERATOR',
  'VERIFIER',
  'APPROVER',
  'AUDITOR',
])

export const UserStatusEnum = z.enum(['ACTIVE', 'INACTIVE'])

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1),
  role: RoleEnum,
  status: UserStatusEnum,
  createdAt: z.string(),
  lastLoginAt: z.string().nullable().optional(),
})

// 2. Resident / Warga
export const ResidentSchema = z.object({
  id: z.string().min(1),
  nikMasked: z.string().regex(/^\d{6}\*{6}\d{4}$/, 'Format NIK masking harus 6 digit, 6 bintang, 4 digit'),
  nikLookupHash: z.string().min(8),
  name: z.string().min(1),
  birthDate: z.string(),
  addressStreet: z.string(),
  addressRtRw: z.string(),
  phone: z.string().optional(),
  documentCount: z.number().int().nonnegative().default(0),
  createdAt: z.string(),
})

// 3. SelectionPeriod / Periode Seleksi
export const PeriodStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED'])

export const SelectionPeriodSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  status: PeriodStatusEnum,
  quota: z.number().int().nonnegative(),
  criteriaVersionId: z.string().nullable().optional(),
  createdBy: z.string().min(1),
  activatedAt: z.string().nullable().optional(),
  lockedAt: z.string().nullable().optional(),
})

// 4. Candidate / Calon Penerima
export const VerificationStatusEnum = z.enum([
  'PENDING',
  'VERIFIED',
  'REVISION_REQUIRED',
  'REJECTED',
])

export const ApplicationStatusEnum = z.enum(['APPLIED', 'PROCESSED', 'WITHDRAWN'])

export const CandidateSchema = z.object({
  id: z.string().min(1),
  residentId: z.string().min(1),
  periodId: z.string().min(1),
  applicationStatus: ApplicationStatusEnum.default('APPLIED'),
  verificationStatus: VerificationStatusEnum.default('PENDING'),
  verificationNotes: z.string().optional(),
  verifiedBy: z.string().nullable().optional(),
  verifiedAt: z.string().nullable().optional(),
  createdAt: z.string(),
})

// 5. Criteria and CriteriaVersion
export const CriterionTypeEnum = z.enum(['BENEFIT', 'COST'])

export const CriterionSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  type: CriterionTypeEnum,
  weight: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  scale: z
    .object({
      min: z.union([z.number(), z.string()]).optional(),
      max: z.union([z.number(), z.string()]).optional(),
    })
    .optional(),
})

export const CriteriaVersionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  criteria: z.array(CriterionSchema).min(1),
})

// 6. Assessment / Penilaian Calon
export const AssessmentStatusEnum = z.enum(['DRAFT', 'VALID', 'INVALID'])

export const AssessmentSchema = z.object({
  id: z.string().min(1),
  candidateId: z.string().min(1),
  criterionCode: z.string().min(1),
  rawValue: z.union([z.number(), z.string()]),
  derivedScore: z.union([z.number(), z.string()]).optional(),
  status: AssessmentStatusEnum.default('VALID'),
  sourceProvenance: z.string().optional(),
  authorId: z.string().min(1),
  createdAt: z.string(),
})

// 7. CalculationRun & CalculationResult (SAW outputs)
export const ExactNumberSchema = z.object({
  exact: z.string(),
  value: z.number(),
})

export const CalculationResultRowSchema = z.object({
  candidateId: z.string().min(1),
  rank: z.number().int().positive(),
  raw: z.record(z.string(), z.string()),
  normalized: z.record(z.string(), ExactNumberSchema),
  contributions: z.record(z.string(), ExactNumberSchema),
  preference: ExactNumberSchema,
  tie: z.object({
    tiedOnPreference: z.boolean(),
    tieGroupSize: z.number().int().positive(),
    resolvedBy: z.string().nullable(),
  }),
})

export const CalculationRunSchema = z.object({
  id: z.string().min(1),
  periodId: z.string().min(1),
  criteriaVersionId: z.string().min(1),
  criteriaVersionLabel: z.string(),
  algorithmVersion: z.string(),
  status: z.literal('CALCULATED'),
  executedAt: z.string(),
  executedBy: z.string().min(1),
  counts: z.object({
    eligible: z.number().int().nonnegative(),
    excluded: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  }),
  includedCandidateIds: z.array(z.string()),
  results: z.array(CalculationResultRowSchema),
})

// 8. ApprovalDecision / Keputusan Persetujuan
export const DecisionOutcomeEnum = z.enum(['APPROVED', 'REJECTED', 'REVOKED'])

export const ApprovalDecisionSchema = z.object({
  id: z.string().min(1),
  runId: z.string().min(1),
  candidateId: z.string().min(1),
  outcome: DecisionOutcomeEnum,
  reason: z.string().min(1).max(1000),
  decidedBy: z.string().min(1),
  decidedAt: z.string(),
  sequence: z.number().int().positive(),
  supersedesId: z.string().nullable(),
  isOverride: z.boolean(),
  exceedsQuota: z.boolean(),
})

// 9. AuditEvent
export const AuditEventSchema = z.object({
  id: z.string().min(1),
  actorId: z.string().min(1),
  actorName: z.string().min(1),
  role: RoleEnum,
  action: z.string().min(1),
  targetType: z.string().min(1),
  targetId: z.string().optional(),
  outcome: z.enum(['SUCCESS', 'FAILURE']),
  occurredAt: z.string(),
  requestSummary: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

// 10. BackupJob
export const BackupJobStatusEnum = z.enum([
  'QUEUED',
  'RUNNING',
  'SUCCEEDED',
  'FAILED',
  'RESTORE_TESTED',
])

export const BackupJobSchema = z.object({
  id: z.string().min(1),
  requestedAt: z.string(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  status: BackupJobStatusEnum,
  storageKey: z.string().optional(),
  checksum: z.string().optional(),
  byteSize: z.number().int().nonnegative().optional(),
  retentionDays: z.number().int().positive().default(30),
  restoreTestResult: z.string().nullable().optional(),
})
