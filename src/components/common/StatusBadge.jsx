const STATUS_CONFIGS = {
  // Verification
  VERIFIED: { label: 'Terverifikasi', bg: '#edf8f3', color: '#16765b' },
  PENDING: { label: 'Menunggu', bg: '#fef8ee', color: '#d97706' },
  REVISION_REQUIRED: { label: 'Perlu Revisi', bg: '#fff4e5', color: '#b25e02' },
  REJECTED: { label: 'Ditolak', bg: '#fdf2f2', color: '#dc2626' },

  // Period & Run
  ACTIVE: { label: 'Aktif', bg: '#edf8f3', color: '#16765b' },
  DRAFT: { label: 'Draf', bg: '#f1f5f3', color: '#576b61' },
  CLOSED: { label: 'Ditutup', bg: '#f1f3f5', color: '#495057' },
  ARCHIVED: { label: 'Diarsipkan', bg: '#f1f3f5', color: '#868e96' },
  CALCULATED: { label: 'Telah Dihitung', bg: '#e6fcf5', color: '#0ca678' },

  // Recommendation
  RECOMMENDED: { label: 'Direkomendasikan', bg: '#edf8f3', color: '#16765b' },
  RESERVE: { label: 'Cadangan', bg: '#fef8ee', color: '#d97706' },
  NOT_ELIGIBLE: { label: 'Tidak Memenuhi Syarat', bg: '#fdf2f2', color: '#dc2626' },
  REQUIRES_REVIEW: { label: 'Perlu Ulasan', bg: '#e7f5ff', color: '#1971c2' },

  // Decisions
  APPROVED: { label: 'Disetujui', bg: '#edf8f3', color: '#16765b' },
  REVOKED: { label: 'Dicabut', bg: '#fff0f6', color: '#c2255c' },

  // Backup & Audit
  SUCCEEDED: { label: 'Berhasil', bg: '#edf8f3', color: '#16765b' },
  RESTORE_TESTED: { label: 'Uji Restore Sukses', bg: '#ebfbee', color: '#2b8a3e' },
  FAILED: { label: 'Gagal', bg: '#fdf2f2', color: '#dc2626' },
  SUCCESS: { label: 'Berhasil', bg: '#edf8f3', color: '#16765b' },
  FAILURE: { label: 'Gagal', bg: '#fdf2f2', color: '#dc2626' },

  // Generic
  VALID: { label: 'Valid', bg: '#edf8f3', color: '#16765b' },
  INVALID: { label: 'Tidak Valid', bg: '#fdf2f2', color: '#dc2626' },
}

export function StatusBadge({ status, customLabel, clay = true }) {
  const config = STATUS_CONFIGS[status] || {
    label: customLabel || status || '—',
    bg: '#f1f5f3',
    color: '#576b61',
  }

  return (
    <span
      className={clay ? 'clay-badge' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        fontSize: '11.5px',
        fontWeight: '700',
        borderRadius: '9999px',
        backgroundColor: config.bg,
        color: config.color,
        border: 'none',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {customLabel || config.label}
    </span>
  )
}
