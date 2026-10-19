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
          <div style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>{row.actorName}</div>
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
          style={{
            fontWeight: '700',
            fontFamily: 'monospace',
            fontSize: '11.5px',
            backgroundColor: 'var(--color-surface-muted)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-line)',
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
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--color-surface-muted)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: viewMode === 'timeline' ? 'var(--color-surface)' : 'transparent',
                color: viewMode === 'timeline' ? 'var(--color-green-950)' : 'var(--color-text-muted)',
                boxShadow: viewMode === 'timeline' ? 'var(--shadow-sm)' : 'none',
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
                gap: '5px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: viewMode === 'table' ? 'var(--color-surface)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-green-950)' : 'var(--color-text-muted)',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <List size={14} />
              <span>Tabel Lengkap</span>
            </button>
          </div>
        }
      />

      {/* Top 3 Squircle Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          className="audit-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TOTAL PERISTIWA AUDIT</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {auditLogs.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Log</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Append-only tamper-proof log
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
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
          className="audit-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>INTEGRITAS SISTEM</span>
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
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
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
          className="audit-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>AKTOR BERTUGAS</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {distinctActors.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Operator</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              {distinctActors.slice(0, 3).join(', ')}
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
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
        <div style={{ marginBottom: '18px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: '700', color: 'var(--color-text-muted)', marginRight: '6px' }}>
            <Filter size={14} />
            <span>Filter Aksi:</span>
          </div>
          {['ALL', 'PERIOD', 'VERIFIED', 'CALCULATION', 'DATA_EXPORTED', 'DECISION', 'BACKUP'].map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setFilterAction(act)}
              style={{
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: filterAction === act ? 'var(--color-green-950)' : 'var(--color-surface-muted)',
                color: filterAction === act ? 'var(--color-lime)' : 'var(--color-text-muted)',
                border: '1px solid var(--color-line-dark)',
                cursor: 'pointer',
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
          /* Modern Interactive Vertical Timeline */
          <div style={{ position: 'relative', paddingLeft: '28px', paddingTop: '8px' }}>
            {/* Timeline vertical bar */}
            <div
              style={{
                position: 'absolute',
                left: '11px',
                top: '12px',
                bottom: '12px',
                width: '2px',
                backgroundColor: 'var(--color-line-dark)',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                    className="timeline-node-card timeline-item-card"
                    style={{
                      position: 'relative',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-line)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {/* Node Dot on vertical line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-23px',
                        top: '16px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-green-700)',
                        border: '2px solid #ffffff',
                        boxShadow: '0 0 0 2px var(--color-green-600)',
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Avatar initials */}
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-green-950)',
                            color: 'var(--color-lime)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--color-green-950)' }}>
                              {log.actorName}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-muted)', padding: '2px 6px', borderRadius: '4px' }}>
                              {log.role}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                fontFamily: 'monospace',
                                fontWeight: '700',
                                backgroundColor: '#edf8f3',
                                color: 'var(--color-green-700)',
                                padding: '2px 6px',
                                borderRadius: '4px',
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
