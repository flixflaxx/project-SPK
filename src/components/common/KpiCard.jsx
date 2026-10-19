

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  highlight = false,
  badge,
  iconBg,
  iconColor,
  decorativeSvg = false,
  pulseBadge = false,
  className = '',
}) {
  const isNumeric = typeof value === 'number' || (!Number.isNaN(Number(value)) && String(value).trim() !== '')

  return (
    <div
      className={`kpi-card ${className}`.trim()}
      style={{
        backgroundColor: highlight ? 'var(--color-green-950)' : 'var(--color-surface)',
        color: highlight ? 'var(--color-text-inverse)' : 'var(--color-text-main)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        border: highlight ? '1px solid rgba(181, 245, 106, 0.3)' : '1px solid var(--color-line)',
        boxShadow: highlight
          ? '0 10px 25px rgba(9, 41, 31, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '124px',
        transition: 'all var(--transition-normal)',
      }}
    >
      {/* Decorative background SVG pattern on highlighted dark card */}
      {highlight && decorativeSvg && (
        <svg
          width="130"
          height="130"
          viewBox="0 0 130 130"
          fill="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-15px',
            bottom: '-20px',
            pointerEvents: 'none',
            opacity: 0.15,
          }}
        >
          <circle cx="65" cy="65" r="56" stroke="#b5f56a" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="65" cy="65" r="38" stroke="#b5f56a" strokeWidth="2" />
          <path
            d="M5 65C25 45 45 85 65 65C85 45 105 85 125 65"
            stroke="#b5f56a"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="95" cy="40" r="3.5" fill="#b5f56a" />
          <circle cx="35" cy="90" r="2.5" fill="#b5f56a" />
        </svg>
      )}

      {/* Top Header Row: Label & Squircle Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', zIndex: 1 }}>
        <span
          style={{
            fontSize: '12.5px',
            fontWeight: '700',
            color: highlight ? '#9fe8d0' : 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}
        >
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: iconBg || (highlight ? 'rgba(181, 245, 106, 0.18)' : '#edf8f3'),
              color: iconColor || (highlight ? 'var(--color-lime)' : 'var(--color-green-700)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: highlight
                ? '0 4px 12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(181, 245, 106, 0.25)'
                : '0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>

      {/* Bottom Row: Counter Value & Subtitle */}
      <div style={{ marginTop: '12px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
          <span
            className={isNumeric ? 'counter-val' : undefined}
            data-target={isNumeric ? value : undefined}
            style={{
              fontSize: '32px',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              color: highlight ? 'var(--color-lime)' : 'var(--color-green-950)',
              lineHeight: 1.1,
              letterSpacing: '-0.5px',
            }}
          >
            {value}
          </span>
          {badge && (
            <span
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: highlight ? 'rgba(181, 245, 106, 0.2)' : 'var(--color-success-bg)',
                color: highlight ? 'var(--color-lime)' : 'var(--color-success)',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: highlight ? '1px solid rgba(181, 245, 106, 0.3)' : '1px solid var(--color-success-border)',
              }}
            >
              {pulseBadge && <span className="pulse-indicator" aria-hidden="true" />}
              <span>{badge}</span>
            </span>
          )}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: '12px',
              marginTop: '5px',
              color: highlight ? '#c8ded5' : 'var(--color-text-subtle)',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
