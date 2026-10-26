import { useEffect, useRef } from 'react'
import { Users, ShieldCheck, Lock } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function UsersView({ users }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.user-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [])

  const activeUsersCount = users.filter((u) => u.status === 'ACTIVE').length
  const distinctRoles = Array.from(new Set(users.map((u) => u.role))).length

  const columns = [
    {
      key: 'displayName',
      label: 'Nama Pengguna & Email',
      width: '28%',
      render: (val, row) => {
        const initials = val
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="clay-marble"
              style={{
                width: '38px',
                height: '38px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: '800', color: 'var(--color-green-950)' }}>{val}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{row.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      key: 'role',
      label: 'Peran (Role)',
      width: '18%',
      render: (val) => (
        <span
          className="clay-badge"
          style={{
            fontWeight: '800',
            fontSize: '11.5px',
            backgroundColor: '#edf8f3',
            color: 'var(--color-green-800)',
            padding: '4px 10px',
          }}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'permissions',
      label: 'Cakupan Izin (Permissions)',
      width: '38%',
      render: (perms) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {perms.map((p) => (
            <span
              key={p}
              className="clay-badge"
              style={{
                fontSize: '10.5px',
                fontFamily: 'monospace',
                backgroundColor: 'var(--color-surface-muted)',
                padding: '3px 8px',
                color: 'var(--color-green-700)',
                fontWeight: '700',
              }}
            >
              {p}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status Akun',
      width: '16%',
      render: (val) => <StatusBadge status={val} />,
    },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={20}
        title="Manajemen Pengguna & Hak Akses"
        description="Pengelolaan akun pengguna dan hak akses sistem."
      />

      {/* Top 3 Squircle Metric Cards with Claymorphism */}
      <div
        className="responsive-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          className="user-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
              PENGGUNA TERDAFTAR
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {users.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Akun</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Pengelola sistem SPK bansos
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={22} />
          </div>
        </div>

        <div
          className="user-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                AKUN AKTIF SAH
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {activeUsersCount} <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-green-700)' }}>Aktif</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Izin otorisasi tervalidasi
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#edf8f3',
              color: 'var(--color-green-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={22} />
          </div>
        </div>

        <div
          className="user-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
              PERAN OTORISASI
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {distinctRoles} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Role</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Admin, Verifikator, Penyetuju
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#fef3c7',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Lock size={22} />
          </div>
        </div>
      </div>

      <Panel title="Daftar Pengguna Sistem & Peran Terdaftar">
        <DataTable columns={columns} data={users} />
      </Panel>
    </div>
  )
}
