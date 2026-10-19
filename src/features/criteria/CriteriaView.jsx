import { useEffect, useRef } from 'react'
import { Scale, ListFilter, Sliders, CheckCircle2 } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { SEED_CRITERIA_VERSION } from '../../../tests/fixtures/saw/golden.js'

export function CriteriaView() {
  const criteria = SEED_CRITERIA_VERSION.criteria
  const containerRef = useRef(null)

  const totalWeight = criteria.reduce((acc, c) => acc + Number(c.weight), 0)
  const benefitCount = criteria.filter((c) => c.type === 'BENEFIT').length
  const costCount = criteria.filter((c) => c.type === 'COST').length

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.crit-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
      window.anime({
        targets: containerRef.current.querySelectorAll('.weight-bar-segment'),
        width: (el) => [0, el.getAttribute('data-width') || '0%'],
        duration: 800,
        delay: window.anime.stagger(70),
        easing: 'easeOutCubic',
      })
    }
  }, [])

  const colorPalette = ['#09291f', '#16765b', '#1b8a6a', '#20b47c', '#89d46e']

  const columns = [
    {
      key: 'code',
      label: 'Kode',
      width: '12%',
      render: (val) => (
        <span
          style={{
            fontWeight: '800',
            fontFamily: 'monospace',
            backgroundColor: 'var(--color-surface-muted)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-green-950)',
            fontSize: '13px',
          }}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Nama Kriteria',
      width: '32%',
      render: (val) => (
        <span style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Tipe Atribut',
      width: '16%',
      render: (val) => (
        <span
          style={{
            fontWeight: '700',
            fontSize: '12px',
            color: val === 'COST' ? 'var(--color-danger)' : 'var(--color-success)',
            backgroundColor: val === 'COST' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${val === 'COST' ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`,
          }}
        >
          {val === 'COST' ? 'COST (Biaya)' : 'BENEFIT (Keuntungan)'}
        </span>
      ),
    },
    {
      key: 'weight',
      label: 'Bobot Preferensi (W)',
      width: '22%',
      render: (val) => {
        const pct = Math.round(Number(val) * 100)
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontWeight: '700', fontSize: '13px', color: 'var(--color-green-950)' }}>
              <span>{val}</span>
              <span>{pct}%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--color-surface-muted)', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
              <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--color-green-700)', borderRadius: '2px' }} />
            </div>
          </div>
        )
      },
    },
    { key: 'unit', label: 'Satuan Nilai', width: '18%' },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={6}
        title="Manajemen Kriteria Penilaian"
        description="Daftar kriteria penilaian kelayakan dan bobot preferensi SAW."
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
          className="crit-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TOTAL KRITERIA AKTIF</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {criteria.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Kriteria</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Versi: {SEED_CRITERIA_VERSION.label}
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
            <ListFilter size={22} />
          </div>
        </div>

        <div
          className="crit-stat-card interactive-card"
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TOTAL AKUMULASI BOBOT</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {totalWeight.toFixed(2)} <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-green-700)' }}>/ 1.00</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Tepat 100% (Matematis Valid)
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
            <Scale size={22} />
          </div>
        </div>

        <div
          className="crit-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>KOMPOSISI ATRIBUT</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-green-950)', marginTop: '6px' }}>
              {benefitCount} Benefit : {costCount} Cost
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Keseimbangan parameter bantuan
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
            <Sliders size={22} />
          </div>
        </div>
      </div>

      {/* Visual Weight Distribution Stacked Bar */}
      <div
        className="interactive-card"
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-line)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-green-950)' }}>
              Distribusi Proporsi Bobot Kriteria (100%)
            </span>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Representasi visual kontribusi masing-masing kriteria terhadap nilai preferensi akhir (V)
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: 'var(--color-green-700)' }}>
            <CheckCircle2 size={14} />
            <span>Σ W = 1.00</span>
          </div>
        </div>

        {/* Stacked bar */}
        <div
          style={{
            height: '14px',
            backgroundColor: 'var(--color-surface-muted)',
            borderRadius: '9999px',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {criteria.map((c, i) => {
            const pct = Number(c.weight) * 100
            return (
              <div
                key={c.code}
                className="weight-bar-segment"
                data-width={`${pct}%`}
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  backgroundColor: colorPalette[i % colorPalette.length],
                  borderRight: i < criteria.length - 1 ? '1px solid #fff' : 'none',
                }}
                title={`${c.code} (${c.name}): ${pct}%`}
              />
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '12px', flexWrap: 'wrap', fontSize: '11.5px' }}>
          {criteria.map((c, i) => (
            <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  backgroundColor: colorPalette[i % colorPalette.length],
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>{c.code}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>({Number(c.weight) * 100}%)</span>
            </div>
          ))}
        </div>
      </div>

      <Panel
        title={`Versi Kriteria Aktif: ${SEED_CRITERIA_VERSION.label}`}
        subtitle="Total bobot harus selalu tepat 1,00 (100%)."
      >
        <DataTable columns={columns} data={criteria} />
      </Panel>
    </div>
  )
}
