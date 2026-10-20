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
  clay = true,
}) {
  const isNumeric = typeof value === 'number' || (!Number.isNaN(Number(value)) && String(value).trim() !== '')

  const cardClass = highlight ? 'clay-card-dark' : 'clay-card'

  return (
    <div
      className={`kpi-card ${clay ? cardClass : ''} ${className}`.trim()}
      style={{
        borderRadius: '28px',
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '136px',
      }}
    >
      {/* Decorative background SVG pattern on highlighted dark card */}
      {highlight && decorativeSvg && (
        <svg
          width="140"
          height="140"
          viewBox="0 0 130 130"
          fill="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-15px',
            bottom: '-20px',
            pointerEvents: 'none',
            opacity: 0.18,
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

      {/* Top Header Row: Label & 3D Clay Bubble Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', zIndex: 1 }}>
        <span
          style={{
            fontSize: '12.5px',
            fontWeight: '800',
            color: highlight ? '#9fe8d0' : 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}
        >
          {title}
        </span>
        {icon && (
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '18px',
              backgroundColor: iconBg || (highlight ? 'rgba(181, 245, 106, 0.22)' : '#edf8f3'),
              color: iconColor || (highlight ? 'var(--color-lime)' : 'var(--color-green-700)'),
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>

      {/* Bottom Row: Counter Value & Subtitle */}
      <div style={{ marginTop: '16px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
          <span
            className={isNumeric ? 'counter-val' : undefined}
            data-target={isNumeric ? value : undefined}
            style={{
              fontSize: '36px',
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
              className="clay-badge"
              style={{
                fontSize: '11px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: highlight ? 'rgba(181, 245, 106, 0.18)' : '#edf8f3',
                color: highlight ? 'var(--color-lime)' : 'var(--color-success)',
                fontWeight: '700',
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
              fontSize: '12.5px',
              marginTop: '6px',
              color: highlight ? '#c8ded5' : 'var(--color-text-subtle)',
              fontWeight: '500',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
