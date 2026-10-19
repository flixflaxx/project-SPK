import { useEffect, useRef } from 'react'
import { History, ShieldCheck, Users, CheckCircle2, Clock } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function HistoryView({ calculationRun, activePeriod, periods }) {
  const containerRef = useRef(null)
  const historyRuns = calculationRun ? [calculationRun] : []

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.history-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [calculationRun])

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={17}
        title="Riwayat Hasil Seleksi"
        description="Riwayat eksekusi kalkulasi SAW dan snapshot data periode."
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
          className="history-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>RUN SAH TERSIMPAN</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {historyRuns.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Run</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Snapshot audit historis
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
            <History size={22} />
          </div>
        </div>

        <div
          className="history-stat-card interactive-card"
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>SNAPSHOT KANONIK</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              IMMUTABLE
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Hasil run historis terkunci permanen
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
          className="history-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>ALTERNATIF PERINGKAT</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {calculationRun?.results.length || 0} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Warga</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Hasil perangkingan SAW
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

      <Panel title="Daftar Run Perhitungan Tersimpan">
        {historyRuns.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13.5px' }}>
            Belum ada riwayat kalkulasi yang tercatat.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {historyRuns.map((run) => {
              const period = periods.find((p) => p.id === run.periodId) || activePeriod

              return (
                <div
                  key={run.id}
                  className="interactive-card"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-line)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 22px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                          Run ID: <code style={{ color: 'var(--color-green-700)' }}>{run.id}</code>
                        </span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <StatusBadge status={run.status} />
                          <span className="pulse-indicator" />
                        </div>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Periode: <strong>{period?.name || run.periodId}</strong> · Eksekutor: {run.executedBy}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>Waktu Eksekusi:</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-green-950)', marginTop: '2px' }}>
                        {new Date(run.executedAt).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--color-line)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '14px',
                      fontSize: '12.5px',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Versi Algoritme:</span>
                      <div style={{ fontWeight: '700', fontFamily: 'monospace', color: 'var(--color-green-950)' }}>{run.algorithmVersion}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Versi Kriteria:</span>
                      <div style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>{run.criteriaVersionLabel}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Statistik Alternatif:</span>
                      <div style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>
                        {run.counts.eligible} Dihitung · {run.counts.excluded} Dikecualikan
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Integritas Snapshot:</span>
                      <div
                        style={{
                          fontWeight: '700',
                          color: 'var(--color-success)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <CheckCircle2 size={14} />
                        <span>JSON Kanonik ({run.snapshotCanonical.length} B)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Panel>
    </div>
  )
}
