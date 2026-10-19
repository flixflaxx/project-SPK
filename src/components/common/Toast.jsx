import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

export function Toast({ toast, onDismiss }) {
  if (!toast) return null

  const isSuccess = toast.type === 'success'
  const isError = toast.type === 'error'

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        backgroundColor: isError
          ? 'var(--color-danger)'
          : isSuccess
            ? 'var(--color-green-900)'
            : 'var(--color-green-950)',
        color: 'var(--color-text-inverse)',
        padding: '12px 18px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '420px',
        fontSize: '13.5px',
        fontWeight: '500',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'slideUp 0.25s ease-out',
      }}
    >
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {isError ? <AlertTriangle size={18} /> : isSuccess ? <CheckCircle2 size={18} /> : <Info size={18} />}
      </span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px 4px',
          marginLeft: '4px',
        }}
      >
        <X size={15} />
      </button>
    </div>
  )
}
