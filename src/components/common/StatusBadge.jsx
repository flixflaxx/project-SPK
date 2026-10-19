

const STATUS_CONFIGS = {
  // Verification
  VERIFIED: { label: 'Terverifikasi', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' },
  PENDING: { label: 'Menunggu', bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: 'var(--color-warning-border)' },
  REVISION_REQUIRED: { label: 'Perlu Revisi', bg: '#fff4e5', color: '#b25e02', border: '#ffd8a8' },
  REJECTED: { label: 'Ditolak', bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'var(--color-danger-border)' },

  // Period & Run
  ACTIVE: { label: 'Aktif', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' },
  DRAFT: { label: 'Draf', bg: 'var(--color-surface-muted)', color: 'var(--color-text-muted)', border: 'var(--color-line-dark)' },
  CLOSED: { label: 'Ditutup', bg: '#f1f3f5', color: '#495057', border: '#dee2e6' },
  ARCHIVED: { label: 'Diarsipkan', bg: '#f1f3f5', color: '#868e96', border: '#dee2e6' },
  CALCULATED: { label: 'Telah Dihitung', bg: '#e6fcf5', color: '#0ca678', border: '#96f2d7' },

  // Recommendation
  RECOMMENDED: { label: 'Direkomendasikan', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' },
  RESERVE: { label: 'Cadangan', bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: 'var(--color-warning-border)' },
  NOT_ELIGIBLE: { label: 'Tidak Memenuhi Syarat', bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'var(--color-danger-border)' },
  REQUIRES_REVIEW: { label: 'Perlu Ulasan', bg: '#e7f5ff', color: '#1971c2', border: '#a5d8ff' },

  // Decisions
  APPROVED: { label: 'Disetujui', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' },
  REVOKED: { label: 'Dicabut', bg: '#fff0f6', color: '#c2255c', border: '#fcc2d7' },

  // Backup & Audit
  SUCCEEDED: { label: 'Berhasil', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' },
  RESTORE_TESTED: { label: 'Uji Restore Sukses', bg: '#ebfbee', color: '#2b8a3e', border: '#b2f2bb' },
  FAILED: { label: 'Gagal', bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'var(--color-danger-border)' },
  SUCCESS: { label: 'Berhasil', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' },
  FAILURE: { label: 'Gagal', bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'var(--color-danger-border)' },

  // Generic
  VALID: { label: 'Valid', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' },
  INVALID: { label: 'Tidak Valid', bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'var(--color-danger-border)' },
}

export function StatusBadge({ status, customLabel }) {
  const config = STATUS_CONFIGS[status] || {
    label: customLabel || status || '—',
    bg: 'var(--color-surface-muted)',
    color: 'var(--color-text-muted)',
    border: 'var(--color-line)',
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        fontSize: '12px',
        fontWeight: '600',
        borderRadius: 'var(--radius-full)',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {customLabel || config.label}
    </span>
  )
}
