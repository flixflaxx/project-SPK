

import { Menu, Search } from 'lucide-react'

export function Topbar({
  activePeriod,
  currentUser,
  users,
  onUserChange,
  onSearchClick,
  onLogoutClick,
  onToggleMobileMenu,
}) {
  return (
    <header
      style={{
        height: '60px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Buka menu navigasi"
          style={{
            display: 'none',
            padding: '4px',
            color: 'var(--color-green-950)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        {/* Active Period Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12.5px',
              fontWeight: '600',
              color: 'var(--color-green-950)',
              backgroundColor: 'var(--color-surface-muted)',
              padding: '3px 9px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-line)',
            }}
          >
            {activePeriod?.name || 'Periode Aktif'}
          </span>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: '600',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-success-border)',
            }}
          >
            Kuota: {activePeriod?.quota ?? 0}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Quick Search Button */}
        <button
          type="button"
          onClick={onSearchClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-line)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)',
            fontSize: '12.5px',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-green-700)'
            e.currentTarget.style.color = 'var(--color-green-950)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-line)'
            e.currentTarget.style.color = 'var(--color-text-muted)'
          }}
        >
          <Search size={14} aria-hidden="true" />
          <span>Cari data...</span>
        </button>

        {/* User Role Switcher for preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="user-switcher" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Peran Aktif:
          </label>
          <select
            id="user-switcher"
            value={currentUser?.id}
            onChange={(e) => onUserChange(e.target.value)}
            style={{
              padding: '5px 8px',
              fontSize: '12.5px',
              fontWeight: '600',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-line-dark)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-green-950)',
              cursor: 'pointer',
            }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Logout action */}
        <button
          type="button"
          onClick={onLogoutClick}
          title="Keluar dari sesi"
          style={{
            padding: '6px 10px',
            fontSize: '12.5px',
            fontWeight: '600',
            color: 'var(--color-danger)',
            backgroundColor: 'var(--color-danger-bg)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-danger-border)',
            transition: 'all var(--transition-fast)',
          }}
        >
          Keluar
        </button>
      </div>
    </header>
  )
}
