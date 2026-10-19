import { AlertTriangle } from 'lucide-react'

export function DemoBanner() {
  return (
    <div
      role="region"
      aria-label="Informasi Lingkungan Demo"
      style={{
        backgroundColor: '#fef8ee',
        borderBottom: '1px solid #fae4be',
        color: '#8f5b08',
        padding: '5px 16px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: '500',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <AlertTriangle size={13} color="#8f5b08" aria-hidden="true" style={{ flexShrink: 0 }} />
        <span>Mode Simulasi: Menggunakan data pratinjau sintetis.</span>
      </div>
      <span
        style={{
          fontSize: '10.5px',
          background: '#fae4be',
          padding: '1px 6px',
          borderRadius: '3px',
          fontWeight: '700',
          letterSpacing: '0.4px',
        }}
      >
        PREVIEW
      </span>
    </div>
  )
}
