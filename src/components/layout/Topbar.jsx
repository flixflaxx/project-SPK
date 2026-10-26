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
      className="app-topbar"
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
        transition: 'padding 0.2s ease, height 0.2s ease',
      }}
    >
      {/* Sisi Kiri: Hamburger Menu + Periode Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Tombol Hamburger Mobile (Ditampilkan di < 1024px via CSS) */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Buka menu navigasi"
          className="clay-item mobile-menu-btn"
          style={{
            display: 'none',
            padding: '9px',
            color: 'var(--color-green-950)',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Menu size={20} />
        </button>

        {/* Kotak Info Periode 3D Clay Timbul */}
        <div
          className="clay-badge topbar-period-badge"
          style={{
            backgroundColor: '#ffffff',
            padding: '6px 14px 6px 16px',
            borderRadius: '9999px',
            gap: '8px',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontSize: '12.5px',
              fontWeight: '800',
              color: 'var(--color-green-950)',
              fontFamily: 'var(--font-heading)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {activePeriod?.name || 'Periode Aktif'}
          </span>
          <span
            className="clay-badge topbar-period-subtext"
            style={{
              fontSize: '11px',
              fontWeight: '800',
              backgroundColor: '#edf8f3',
              color: 'var(--color-green-700)',
              padding: '2px 8px',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
            }}
          >
            Pagu: {activePeriod?.quota ?? 0}
          </span>
        </div>
      </div>

      {/* Sisi Kanan: Cari, Peran, dan Tombol Keluar */}
      <div className="topbar-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Kolom Cari Data Pil 3D Clay (Di HP hanya ikon pencarian) */}
        <button
          type="button"
          onClick={onSearchClick}
          title="Pencarian terpadu data warga, calon, dan audit"
          className="clay-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            padding: '8px 16px',
            borderRadius: '9999px',
            color: 'var(--color-text-muted)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <Search size={16} style={{ color: 'var(--color-green-700)', flexShrink: 0 }} aria-hidden="true" />
          <span className="topbar-search-text">Cari data...</span>
        </button>

        {/* Dropdown Akun Pil 3D Clay */}
        <div
          className="clay-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            padding: '6px 12px 6px 14px',
            borderRadius: '9999px',
          }}
        >
          <label
            htmlFor="user-switcher"
            className="topbar-role-label"
            style={{
              fontSize: '11px',
              fontWeight: '800',
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
            className="topbar-user-select"
            style={{
              fontSize: '12px',
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
          title="Keluar dari sesi akun"
          className="clay-btn-danger topbar-btn-logout"
          style={{
            padding: '8px 18px',
            fontSize: '12px',
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
