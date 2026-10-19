
import { NAVIGATION_GROUPS } from '../../app/navigation.js'

export function SidebarNav({ activeView, onViewChange, isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 41, 31, 0.5)',
            zIndex: 40,
            display: 'block',
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--color-green-950)',
          color: 'var(--color-text-inverse)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {/* Brand header */}
        <div
          style={{
            padding: '20px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-green-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: 'var(--color-lime)',
              fontWeight: '900',
              fontFamily: 'var(--font-heading)',
            }}
          >
            SPK
          </div>
          <div>
            <h2
              style={{
                fontSize: '14.5px',
                fontWeight: '800',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.2px',
                lineHeight: 1.2,
              }}
            >
              Bansos Bulak Amah
            </h2>
            <p
              style={{
                fontSize: '11px',
                color: '#9fe8d0',
                fontWeight: '500',
                marginTop: '2px',
              }}
            >
              SPK Metode SAW
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 10px',
          }}
          aria-label="Navigasi Utama Sistem"
        >
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.id} style={{ marginBottom: '18px' }}>
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: '700',
                  color: '#709689',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  padding: '4px 10px 6px',
                }}
              >
                {group.title}
              </div>
              <ul style={{ listStyle: 'none' }}>
                {group.items.map((item) => {
                  const isActive = activeView === item.id
                  return (
                    <li key={item.id} style={{ marginBottom: '2px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          onViewChange(item.id)
                          if (onClose) onClose()
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isActive ? 'var(--color-green-700)' : 'transparent',
                          color: isActive ? '#ffffff' : '#c8ded5',
                          fontSize: '13px',
                          fontWeight: isActive ? '600' : '500',
                          textAlign: 'left',
                          transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                            e.currentTarget.style.color = '#ffffff'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = '#c8ded5'
                          }
                        }}
                      >
                        <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.85 }}>
                          {typeof item.icon === 'string' ? item.icon : item.icon ? <item.icon size={16} /> : null}
                        </span>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {isActive && (
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-lime)',
                            }}
                          />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* System identity footer */}
        <div
          style={{
            padding: '12px 14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11px',
            color: '#709689',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>v0.1.0</span>
          <span style={{ fontSize: '10.5px', color: '#709689' }}>Bulak Amah</span>
        </div>
      </aside>
    </>
  )
}
