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
        height: '72px',
        backgroundColor: '#eaf4ef',
        borderBottom: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Buka menu navigasi"
          className="clay-item mobile-menu-btn"
          style={{
            display: 'none',
            padding: '8px',
            color: 'var(--color-green-950)',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            cursor: 'pointer',
          }}
        >
          <Menu size={20} />
        </button>

        {/* Kotak Info Periode 3D Clay Timbul */}
        <div
          className="clay-badge"
          style={{
            backgroundColor: '#ffffff',
            padding: '6px 14px 6px 16px',
            borderRadius: '9999px',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontSize: '12.5px',
              fontWeight: '800',
              color: 'var(--color-green-950)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {activePeriod?.name || 'Periode Aktif'}
          </span>
          <span
            className="clay-badge"
            style={{
              fontSize: '11.5px',
              fontWeight: '800',
              backgroundColor: '#edf8f3',
              color: 'var(--color-green-700)',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}
          >
            Kuota: {activePeriod?.quota ?? 0}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Kolom Cari Data Pil 3D Clay */}
        <button
          type="button"
          onClick={onSearchClick}
          className="clay-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            padding: '8px 18px',
            borderRadius: '9999px',
            color: 'var(--color-text-muted)',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <Search size={15} style={{ color: 'var(--color-green-700)' }} aria-hidden="true" />
          <span>Cari data...</span>
        </button>

        {/* Dropdown Akun Pil 3D Clay */}
        <div
          className="clay-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            padding: '6px 14px 6px 16px',
            borderRadius: '9999px',
          }}
        >
          <label
            htmlFor="user-switcher"
            style={{
              fontSize: '11.5px',
              fontWeight: '700',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
            }}
          >
            Peran:
          </label>
          <select
            id="user-switcher"
            value={currentUser?.id}
            onChange={(e) => onUserChange(e.target.value)}
            style={{
              fontSize: '12.5px',
              fontWeight: '800',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-green-950)',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Keluar Pil 3D Clay */}
        <button
          type="button"
          onClick={onLogoutClick}
          title="Keluar dari sesi"
          className="clay-btn-danger"
          style={{
            padding: '8px 20px',
            fontSize: '12.5px',
            fontWeight: '800',
            borderRadius: '9999px',
            cursor: 'pointer',
          }}
        >
          Keluar
        </button>
      </div>
    </header>
  )
}
