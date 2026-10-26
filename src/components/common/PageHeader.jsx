export function PageHeader({ title, description, badge, actions }) {
  return (
    <div
      className="page-header-container"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-lg)',
        flexWrap: 'wrap',
        gap: '14px',
      }}
    >
      <div style={{ minWidth: 0, flex: '1 1 300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h1
            className="page-header-title"
            style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--color-green-950)',
              letterSpacing: '-0.3px',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p
            className="page-header-desc"
            style={{
              fontSize: '13.5px',
              color: 'var(--color-text-muted)',
              marginTop: '6px',
              maxWidth: '750px',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div
          className="page-header-actions"
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </div>
      )}
    </div>
  )
}
