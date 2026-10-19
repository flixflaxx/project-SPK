

export function Panel({ title, subtitle, actions, children, style = {} }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-line)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        marginBottom: 'var(--space-lg)',
        ...style,
      }}
    >
      {(title || actions) && (
        <div
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            borderBottom: '1px solid var(--color-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--color-green-950)',
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  marginTop: '2px',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding: 'var(--space-lg)' }}>{children}</div>
    </div>
  )
}
