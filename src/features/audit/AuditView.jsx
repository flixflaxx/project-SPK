import { useState, useEffect, useRef } from 'react'
import { Activity, ShieldCheck, Users, Clock, Filter, List, GitCommit } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function AuditView({ auditLogs }) {
  const [filterAction, setFilterAction] = useState('ALL')
  const [viewMode, setViewMode] = useState('timeline') // 'timeline' | 'table'
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.audit-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
      window.anime({
        targets: containerRef.current.querySelectorAll('.timeline-node-card'),
        opacity: [0, 1],
        translateX: [-12, 0],
        delay: window.anime.stagger(50),
        duration: 400,
        easing: 'easeOutCubic',
      })
    }
  }, [filterAction, viewMode])

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction === 'ALL') return true
    return log.action.includes(filterAction)
  })

  // Get distinct actors
  const distinctActors = Array.from(new Set(auditLogs.map((l) => l.actorName)))

  const columns = [
    {
      key: 'occurredAt',
      label: 'Waktu (UTC/Lokal)',
      width: '18%',
      render: (val) => (
        <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
          {new Date(val).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'actor',
      label: 'Aktor Pelaksana',
      width: '20%',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: '800', color: 'var(--color-green-950)' }}>{row.actorName}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Role: {row.role}</div>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Tindakan (Action)',
      width: '22%',
      render: (val) => (
        <span
          className="clay-badge"
          style={{
            fontWeight: '800',
            fontFamily: 'monospace',
            fontSize: '11px',
            backgroundColor: 'var(--color-surface-muted)',
            padding: '4px 10px',
            color: 'var(--color-green-900)',
          }}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'requestSummary',
      label: 'Rincian Aktivitas',
      width: '28%',
      render: (val, row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--color-text-main)' }}>
          {val || `${row.targetType}: ${row.targetId || '—'}`}
        </span>
      ),
    },
    {
      key: 'outcome',
      label: 'Hasil',
      width: '12%',
      render: (val) => <StatusBadge status={val} />,
    },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={21}
        title="Audit Log Aktivitas Pengguna"
        description="Pencatatan riwayat aktivitas pengguna dan perubahan data sistem."
        actions={
          <div
            className="clay-item"
            style={{
              display: 'flex',
              gap: '6px',
              padding: '4px',
              borderRadius: '9999px',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '800',
                backgroundColor: viewMode === 'timeline' ? 'var(--color-green-700)' : 'transparent',
                color: viewMode === 'timeline' ? '#ffffff' : 'var(--color-text-muted)',
                boxShadow: viewMode === 'timeline' ? '0 4px 12px rgba(22, 118, 91, 0.3)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <GitCommit size={14} />
              <span>Timeline Interaktif</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '800',
                backgroundColor: viewMode === 'table' ? 'var(--color-green-700)' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--color-text-muted)',
                boxShadow: viewMode === 'table' ? '0 4px 12px rgba(22, 118, 91, 0.3)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <List size={14} />
              <span>Tabel Lengkap</span>
            </button>
          </div>
        }
      />

      {/* Top 3 Squircle Metric Cards with Claymorphism */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          className="audit-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
              TOTAL PERISTIWA AUDIT
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {auditLogs.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Log</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Append-only tamper-proof log
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
            <Activity size={22} />
          </div>
        </div>

        <div
          className="audit-stat-card clay-card"
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
                INTEGRITAS SISTEM
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              100% <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-green-700)' }}>SUCCESS</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Tidak ada kegagalan otorisasi
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
          className="audit-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
              AKTOR BERTUGAS
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {distinctActors.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Operator</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              {distinctActors.slice(0, 3).join(', ')}
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
            <Users size={22} />
          </div>
        </div>
      </div>

      <Panel title="Jejak Aktivitas & Peristiwa Audit">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: '800', color: 'var(--color-text-muted)', marginRight: '6px' }}>
            <Filter size={14} />
            <span>Filter Aksi:</span>
          </div>
          {['ALL', 'PERIOD', 'VERIFIED', 'CALCULATION', 'DATA_EXPORTED', 'DECISION', 'BACKUP'].map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setFilterAction(act)}
              className="clay-badge"
              style={{
                fontSize: '11.5px',
                fontWeight: '800',
                padding: '5px 12px',
                backgroundColor: filterAction === act ? 'var(--color-green-950)' : 'var(--color-surface)',
                color: filterAction === act ? 'var(--color-lime)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {act}
            </button>
          ))}
        </div>

        {viewMode === 'table' ? (
          <DataTable columns={columns} data={filteredLogs} />
        ) : (
          /* Modern Interactive Vertical Timeline with Claymorphism */
          <div style={{ position: 'relative', paddingLeft: '32px', paddingTop: '8px' }}>
            {/* Timeline vertical bar */}
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: '16px',
                bottom: '16px',
                width: '4px',
                borderRadius: '4px',
                background: 'linear-gradient(180deg, var(--color-green-700), #a3e635)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredLogs.map((log) => {
                const initials = (log.actorName || 'US')
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <div
                    key={log.id}
                    className="timeline-node-card clay-item"
                    style={{
                      position: 'relative',
                      padding: '16px 20px',
                      borderRadius: '20px',
                    }}
                  >
                    {/* Node Dot on vertical line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-28px',
                        top: '22px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-green-700)',
                        border: '3px solid #ffffff',
                        boxShadow: '0 2px 6px rgba(22, 118, 91, 0.4)',
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Avatar initials */}
                        <div
                          className="clay-marble"
                          style={{
                            width: '36px',
                            height: '36px',
                            fontSize: '12.5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: '800', fontSize: '13.5px', color: 'var(--color-green-950)' }}>
                              {log.actorName}
                            </span>
                            <span className="clay-badge" style={{ fontSize: '11px', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-muted)', padding: '2px 8px' }}>
                              {log.role}
                            </span>
                            <span
                              className="clay-badge"
                              style={{
                                fontSize: '11px',
                                fontFamily: 'monospace',
                                fontWeight: '800',
                                backgroundColor: '#edf8f3',
                                color: 'var(--color-green-700)',
                                padding: '2px 8px',
                              }}
                            >
                              {log.action}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--color-text-main)', marginTop: '4px' }}>
                            {log.requestSummary || `${log.targetType}: ${log.targetId || '—'}`}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {new Date(log.occurredAt).toLocaleString('id-ID')}
                        </span>
                        <StatusBadge status={log.outcome} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}
