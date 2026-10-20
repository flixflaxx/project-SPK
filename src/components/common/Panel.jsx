export function Panel({ title, subtitle, actions, children, style = {} }) {
  return (
    <div
      className="clay-card"
      style={{
        padding: '26px 28px',
        marginBottom: '28px',
        ...style,
      }}
    >
      {(title || actions) && (
        <div
          style={{
            marginBottom: '20px',
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
                  fontSize: '17px',
                  fontWeight: '800',
                  color: 'var(--color-green-950)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '12.5px',
                  color: 'var(--color-text-muted)',
                  marginTop: '3px',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {actions}
            </div>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
