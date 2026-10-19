import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { formatExact } from '@shared/domain/saw/fraction.js'

export function SawPreferenceView({ calculationRun, residents, candidates }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.pref-row'),
        opacity: [0, 1],
        translateY: [8, 0],
        delay: window.anime.stagger(40),
        duration: 400,
        easing: 'easeOutCubic',
      })
      window.anime({
        targets: containerRef.current.querySelectorAll('.pref-fill-bar'),
        width: (el) => [0, el.getAttribute('data-width') || '0%'],
        duration: 800,
        easing: 'easeOutCubic',
      })
    }
  }, [calculationRun])

  if (!calculationRun) {
    return (
      <div>
        <PageHeader
          featureNum={12}
          title="Perhitungan Nilai Preferensi (V)"
          description="Rincian kontribusi terbobot wⱼ × rᵢⱼ per kriteria dan akumulasi nilai preferensi V."
        />
        <Panel>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13.5px' }}>
            Belum ada hasil kalkulasi SAW.
          </p>
        </Panel>
      </div>
    )
  }

  const { criteria, results } = calculationRun

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={12}
        title="Perhitungan Nilai Preferensi (V)"
        description="Rincian nilai preferensi akhir hasil perkalian bobot kriteria dengan nilai ternormalisasi."
      />

      <Panel title="Tabel Kontribusi Terbobot & Nilai V Akhir">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '2px solid var(--color-line)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Alternatif Calon</th>
                {criteria.map((c) => (
                  <th key={c.code} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700' }}>
                    <div>w × r({c.code})</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                      (W={c.weightText})
                    </div>
                  </th>
                ))}
                <th
                  style={{
                    padding: '12px 18px',
                    textAlign: 'right',
                    fontWeight: '800',
                    backgroundColor: '#e8f7f0',
                    color: 'var(--color-green-950)',
                    width: '220px',
                  }}
                >
                  Nilai Preferensi (V)
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => {
                const cand = candidates.find((c) => c.id === row.candidateId)
                const res = residents.find((r) => r.id === cand?.residentId)
                const formatted = formatExact(row.preference.exact, 6)
                const vDec = parseFloat(formatted) || 0
                const vPct = Math.min(100, Math.max(0, Math.round(vDec * 100)))
                const isRankOne = row.rank === 1

                return (
                  <tr
                    key={row.candidateId}
                    className="pref-row"
                    style={{
                      borderBottom: '1px solid var(--color-line)',
                      backgroundColor: idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)',
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>
                          {res?.name || row.candidateId}
                        </span>
                        {isRankOne && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: '800',
                              backgroundColor: 'var(--color-lime)',
                              color: 'var(--color-green-950)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Sparkles size={11} /> Top
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        NIK: <code>{res?.nikMasked || '—'}</code>
                      </div>
                    </td>
                    {criteria.map((c) => {
                      const contrib = row.contributions[c.code]
                      return (
                        <td
                          key={c.code}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'right',
                          }}
                        >
                          <div style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {formatExact(contrib.exact, 4)}
                          </div>
                          <div style={{ fontSize: '9.5px', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>
                            [{contrib.exact}]
                          </div>
                        </td>
                      )
                    })}
                    <td
                      style={{
                        padding: '12px 18px',
                        backgroundColor: '#edf8f3',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                          V =
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: '800',
                            fontSize: '15px',
                            color: 'var(--color-green-700)',
                          }}
                        >
                          {formatExact(row.preference.exact, 6)}
                        </span>
                      </div>
                      {/* Visual progress bar */}
                      <div
                        style={{
                          height: '5px',
                          backgroundColor: '#d2ddd6',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          marginTop: '4px',
                        }}
                      >
                        <div
                          className="pref-fill-bar"
                          data-width={`${vPct}%`}
                          style={{
                            height: '100%',
                            width: `${vPct}%`,
                            background: 'linear-gradient(90deg, var(--color-green-700), var(--color-green-500))',
                            borderRadius: '9999px',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
