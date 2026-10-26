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
      window.anime({
        targets: containerRef.current.querySelectorAll('.history-run-card'),
        opacity: [0, 1],
        translateY: [10, 0],
        delay: window.anime.stagger(100),
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
          className="history-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
              RUN SAH TERSIMPAN
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {historyRuns.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Run</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Snapshot audit historis
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
            <History size={22} />
          </div>
        </div>

        <div
          className="history-stat-card clay-card"
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
                SNAPSHOT KANONIK
              </span>
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
          className="history-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
              ALTERNATIF PERINGKAT
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {calculationRun?.results.length || 0} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Warga</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Hasil perangkingan SAW
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

      <Panel title="Daftar Run Perhitungan Tersimpan">
        {historyRuns.length === 0 ? (
          <div
            className="clay-item"
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: '13.5px',
            }}
          >
            Belum ada riwayat kalkulasi yang tercatat pada sistem.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {historyRuns.map((run) => {
              const period = periods.find((p) => p.id === run.periodId) || activePeriod

              return (
                <div
                  key={run.id}
                  className="history-run-card clay-item"
                  style={{
                    padding: '22px 26px',
                    borderRadius: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                          Run ID: <code style={{ color: 'var(--color-green-700)' }}>{run.id}</code>
                        </span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <StatusBadge status={run.status} />
                          <span className="pulse-indicator" />
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                        Periode: <strong style={{ color: 'var(--color-green-950)' }}>{period?.name || run.periodId}</strong> · Eksekutor: <strong>{run.executedBy}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        className="clay-badge"
                        style={{
                          fontSize: '11.5px',
                          color: 'var(--color-text-subtle)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 12px',
                        }}
                      >
                        <Clock size={13} />
                        <span>Waktu: <strong>{new Date(run.executedAt).toLocaleString('id-ID')}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '18px',
                      paddingTop: '16px',
                      borderTop: '2px dashed rgba(22, 118, 91, 0.12)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '16px',
                      fontSize: '12.5px',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Versi Algoritme:</span>
                      <div style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-green-950)', marginTop: '2px' }}>
                        {run.algorithmVersion}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Versi Kriteria:</span>
                      <div style={{ fontWeight: '800', color: 'var(--color-green-950)', marginTop: '2px' }}>
                        {run.criteriaVersionLabel}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Statistik Alternatif:</span>
                      <div style={{ fontWeight: '800', color: 'var(--color-green-950)', marginTop: '2px' }}>
                        {run.counts.eligible} Dihitung · {run.counts.excluded} Dikecualikan
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Integritas Snapshot:</span>
                      <div
                        style={{
                          fontWeight: '800',
                          color: 'var(--color-green-700)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '2px',
                        }}
                      >
                        <CheckCircle2 size={15} />
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
