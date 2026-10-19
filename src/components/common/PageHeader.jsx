

export function PageHeader({ title, description, badge, actions }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-lg)',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--color-green-950)',
              letterSpacing: '-0.3px',
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-muted)',
              marginTop: '6px',
              maxWidth: '750px',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  )
}
