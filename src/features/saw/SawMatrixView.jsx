import { useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { formatExact } from '@shared/domain/saw/fraction.js'

export function SawMatrixView({ calculationRun, residents, candidates }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.matrix-row'),
        opacity: [0, 1],
        translateY: [8, 0],
        delay: window.anime.stagger(40),
        duration: 400,
        easing: 'easeOutCubic',
      })
    }
  }, [calculationRun])

  if (!calculationRun) {
    return (
      <div>
        <PageHeader
          featureNum={11}
          title="Normalisasi Matriks Keputusan (R)"
          description="Matriks R hasil transformasi nilai mentah sesuai tipe kriteria: Benefit (x/max) dan Cost (min/x)."
        />
        <Panel>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13.5px' }}>
            Belum ada data perhitungan tersimpan. Silakan jalankan kalkulasi pada menu Perhitungan SAW.
          </p>
        </Panel>
      </div>
    )
  }

  const { criteria, results } = calculationRun

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={11}
        title="Normalisasi Matriks Keputusan (R)"
        description="Hasil normalisasi rᵢⱼ berdasarkan atribut Benefit dan Cost kriteria."
      />

      {/* Normalizer statistics banner with Squircle icons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {criteria.map((c) => {
          const isCost = c.type === 'COST'
          return (
            <div
              key={c.code}
              className="interactive-card"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-line)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                  {c.code} · {c.type === 'COST' ? 'Cost (Biaya)' : 'Benefit'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-green-950)', marginTop: '4px' }}>
                  {isCost ? `Min: ${c.min.value}` : `Max: ${c.max.value}`}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                  {isCost ? 'Formula: Min / X' : 'Formula: X / Max'}
                </div>
              </div>

              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: isCost ? '#fef3c7' : '#edf8f3',
                  color: isCost ? 'var(--color-warning)' : 'var(--color-green-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isCost ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
              </div>
            </div>
          )
        })}
      </div>

      <Panel title="Matriks R (Ternormalisasi)">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '2px solid var(--color-line)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Alternatif / Calon</th>
                {criteria.map((c) => (
                  <th key={c.code} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700' }}>
                    <div>r({c.code})</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                      {c.type === 'COST' ? 'min/x' : 'x/max'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => {
                const cand = candidates.find((c) => c.id === row.candidateId)
                const res = residents.find((r) => r.id === cand?.residentId)

                return (
                  <tr
                    key={row.candidateId}
                    className="matrix-row"
                    style={{
                      borderBottom: '1px solid var(--color-line)',
                      backgroundColor: idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)',
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>
                        {res?.name || row.candidateId}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        NIK: <code>{res?.nikMasked || '—'}</code>
                      </div>
                    </td>
                    {criteria.map((c) => {
                      const norm = row.normalized[c.code]
                      const formatted = formatExact(norm.exact, 4)
                      const decVal = parseFloat(formatted) || 0
                      const pct = Math.min(100, Math.max(0, Math.round(decVal * 100)))

                      return (
                        <td
                          key={c.code}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'right',
                          }}
                        >
                          <div style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--color-green-700)', fontSize: '13.5px' }}>
                            {formatExact(norm.exact, 4)}
                          </div>
                          {/* Mini visual indicator bar */}
                          <div
                            style={{
                              width: '100%',
                              height: '4px',
                              backgroundColor: 'var(--color-surface-muted)',
                              borderRadius: '2px',
                              marginTop: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                backgroundColor: 'var(--color-green-600)',
                                borderRadius: '2px',
                              }}
                            />
                          </div>
                          <div style={{ fontSize: '9.5px', color: 'var(--color-text-subtle)', marginTop: '2px', fontFamily: 'monospace' }}>
                            [{norm.exact}]
                          </div>
                        </td>
                      )
                    })}
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
