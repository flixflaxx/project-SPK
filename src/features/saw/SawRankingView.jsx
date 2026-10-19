import { useEffect } from 'react'
import { AlertTriangle, ArrowRight, Check, Trophy, Users, Award, ShieldAlert } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { formatExact } from '@shared/domain/saw/fraction.js'

export function SawRankingView({ calculationRun, activePeriod, residents, candidates, onNavigate }) {
  const quota = activePeriod?.quota ?? 0
  const results = calculationRun?.results || []
  const tieBreakRule = calculationRun?.tieBreakRule

  // Anime.js animation on mount
  useEffect(() => {
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (!anime) return

    anime({
      targets: '.ranking-page-card',
      translateY: [16, 0],
      opacity: [0, 1],
      delay: anime.stagger(60, { start: 100 }),
      easing: 'easeOutCubic',
      duration: 600,
    })

    anime({
      targets: '.progress-v-fill-rank',
      width: (el) => [0, el.getAttribute('data-width') || '0%'],
      delay: anime.stagger(70, { start: 200 }),
      easing: 'easeOutQuart',
      duration: 1000,
    })
  }, [])

  if (!calculationRun) {
    return (
      <div>
        <PageHeader
          featureNum={13}
          title="Perangkingan Calon Penerima"
          description="Urutan prioritas penerima berdasarkan nilai preferensi V menurun dengan aturan tie-break deterministik."
        />
        <Panel>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13.5px' }}>
            Belum ada hasil kalkulasi SAW. Silakan jalankan kalkulasi pada menu Kalkulasi SAW terlebih dahulu.
          </p>
        </Panel>
      </div>
    )
  }

  const withinQuotaCount = results.filter((r) => r.rank <= quota).length
  const reserveCount = Math.max(0, results.length - withinQuotaCount)

  return (
    <div>
      <PageHeader
        featureNum={13}
        title="Perangkingan Calon Penerima"
        description="Urutan prioritas calon penerima berdasarkan nilai preferensi (V) metode SAW."
        actions={
          <button
            type="button"
            className="btn-action-glow"
            onClick={() => onNavigate('recommendations')}
            style={{
              backgroundColor: 'var(--color-green-700)',
              color: 'var(--color-text-inverse)',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span>Lanjut ke Rekomendasi & Kuota</span>
            <ArrowRight size={15} />
          </button>
        }
      />

      {/* 3 Quick Summary Mini Cards with Squircles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-line)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Total Alternatif
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-green-950)', marginTop: '2px' }}>
              {results.length} Calon
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={20} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-success-border)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--color-success)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator" />
              <span>Masuk Kuota</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-green-700)', marginTop: '2px' }}>
              {withinQuotaCount} Calon
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={20} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-line)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Cadangan Seleksi
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-main)', marginTop: '2px' }}>
              {reserveCount} Calon
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={20} />
          </div>
        </div>
      </div>

      {tieBreakRule && (
        <div
          style={{
            backgroundColor: 'var(--color-surface-muted)',
            border: '1px solid var(--color-line-dark)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            marginBottom: '20px',
            fontSize: '12.5px',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Trophy size={15} color="var(--color-green-700)" />
          <span>
            <strong>Aturan Tie-Break:</strong> {tieBreakRule.description}
          </span>
        </div>
      )}

      <Panel title={`Daftar Peringkat Resmi (Pagu Kuota: ${quota} Calon)`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map((row) => {
            const cand = candidates.find((c) => c.id === row.candidateId)
            const res = residents.find((r) => r.id === cand?.residentId)
            const isWithinQuota = row.rank <= quota

            // Compute exact decimal value for progress bar
            let valDecimal = 0
            if (row.preference?.exact && typeof row.preference.exact === 'object') {
              const num = Number(row.preference.exact.num || 0)
              const den = Number(row.preference.exact.den || 1)
              valDecimal = den > 0 ? num / den : 0
            } else if (typeof row.preference?.exact === 'number') {
              valDecimal = row.preference.exact
            }
            const progressWidthPercent = Math.min(100, Math.max(0, valDecimal * 100)).toFixed(1)

            return (
              <div
                key={row.candidateId}
                className="ranking-page-card ranking-item-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isWithinQuota ? '#edf8f3' : 'var(--color-surface)',
                  border: isWithinQuota ? '2px solid var(--color-success-border)' : '1px solid var(--color-line)',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: isWithinQuota ? 'var(--color-green-700)' : 'var(--color-surface-muted)',
                        color: isWithinQuota ? '#ffffff' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '16px',
                        fontFamily: 'var(--font-heading)',
                        boxShadow: isWithinQuota ? '0 2px 8px rgba(22, 118, 91, 0.3)' : 'none',
                        flexShrink: 0,
                      }}
                    >
                      {row.rank}
                    </div>

                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--color-green-950)' }}>
                        {res?.name || row.candidateId}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        NIK: {res?.nikMasked || '—'} · RT/RW: {res?.addressRtRw || '—'} · Telp: {res?.phone || '—'}
                      </div>
                      {row.tie.tiedOnPreference && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-warning)',
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <AlertTriangle size={13} />
                          <span>
                            Nilai V seri. Diputus oleh: <code>{row.tie.resolvedBy}</code>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '900',
                        fontFamily: 'monospace',
                        color: isWithinQuota ? 'var(--color-green-700)' : 'var(--color-text-main)',
                      }}
                    >
                      V = {formatExact(row.preference.exact, 4)}
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isWithinQuota ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                        color: isWithinQuota ? 'var(--color-success)' : 'var(--color-warning)',
                        border: isWithinQuota ? '1px solid var(--color-success-border)' : '1px solid var(--color-warning-border)',
                      }}
                    >
                      {isWithinQuota ? (
                        <>
                          <Check size={13} />
                          <span>Masuk Ambang Kuota</span>
                        </>
                      ) : (
                        <span>Cadangan (Di Luar Kuota)</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Progress Bar representasi V */}
                <div
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    height: '5px',
                    backgroundColor: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="progress-v-fill-rank"
                    data-width={`${progressWidthPercent}%`}
                    style={{
                      height: '100%',
                      width: `${progressWidthPercent}%`,
                      background: isWithinQuota
                        ? 'linear-gradient(90deg, #16765b 0%, #20b47c 65%, #b5f56a 100%)'
                        : 'linear-gradient(90deg, #d97706 0%, #f59e0b 60%, #fde68a 100%)',
                      borderRadius: '999px',
                      boxShadow: isWithinQuota ? '0 0 8px rgba(32, 180, 124, 0.35)' : 'none',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
