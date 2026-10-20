import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

export function Toast({ toast, onDismiss }) {
  if (!toast) return null

  const isSuccess = toast.type === 'success'
  const isError = toast.type === 'error'

  return (
    <div
      role="status"
      aria-live="polite"
      className={isError ? 'clay-card' : 'clay-card-dark'}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 2000,
        backgroundColor: isError ? '#fee2e2' : undefined,
        color: isError ? '#991b1b' : '#ffffff',
        padding: '14px 22px',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '440px',
        fontSize: '13.5px',
        fontWeight: '700',
        animation: 'slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {isError ? (
          <AlertTriangle size={20} color="#dc2626" />
        ) : isSuccess ? (
          <CheckCircle2 size={20} color="#b5f56a" />
        ) : (
          <Info size={20} color="#7dd3fc" />
        )}
      </span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="clay-bubble"
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          backgroundColor: isError ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
          color: isError ? '#991b1b' : '#ffffff',
          cursor: 'pointer',
          marginLeft: '4px',
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
