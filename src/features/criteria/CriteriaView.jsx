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
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (anime && containerRef.current) {
      anime({
        targets: containerRef.current.querySelectorAll('.crit-stat-card'),
        opacity: [0, 1],
        translateY: [16, 0],
        delay: anime.stagger(80),
        duration: 550,
        easing: 'easeOutBack',
      })
      anime({
        targets: containerRef.current.querySelectorAll('.weight-bar-segment'),
        width: (el) => [0, el.getAttribute('data-width') || '0%'],
        duration: 900,
        delay: anime.stagger(70),
        easing: 'easeOutQuart',
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
          className="clay-badge"
          style={{
            fontWeight: '800',
            fontFamily: 'monospace',
            backgroundColor: '#edf8f3',
            padding: '4px 12px',
            color: 'var(--color-green-950)',
            fontSize: '12.5px',
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
        <span style={{ fontWeight: '800', color: 'var(--color-green-950)' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Tipe Atribut',
      width: '18%',
      render: (val) => (
        <span
          className="clay-badge"
          style={{
            fontWeight: '700',
            fontSize: '11.5px',
            color: val === 'COST' ? 'var(--color-danger)' : 'var(--color-success)',
            backgroundColor: val === 'COST' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
            padding: '4px 10px',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontWeight: '800', fontSize: '13px', color: 'var(--color-green-950)' }}>
              <span>{val}</span>
              <span>{pct}%</span>
            </div>
            <div className="clay-sunken" style={{ height: '7px', width: '100%', marginTop: '6px' }}>
              <div className="clay-progress-fill" style={{ width: `${pct}%`, backgroundColor: 'var(--color-green-700)' }} />
            </div>
          </div>
        )
      },
    },
    { key: 'unit', label: 'Satuan Nilai', width: '16%' },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={6}
        title="Manajemen Kriteria Penilaian"
        description="Daftar kriteria penilaian kelayakan dan bobot preferensi SAW."
      />

      {/* Top 3 Squircle Metric Cards with Claymorphism */}
      <div
        className="responsive-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '18px',
          marginBottom: '26px',
        }}
      >
        <div
          className="crit-stat-card clay-card"
          style={{
            padding: '22px 24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              TOTAL KRITERIA AKTIF
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '6px', lineHeight: 1.1 }}>
              {criteria.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Kriteria</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Versi: {SEED_CRITERIA_VERSION.label}
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
            }}
          >
            <ListFilter size={22} />
          </div>
        </div>

        <div
          className="crit-stat-card clay-card"
          style={{
            padding: '22px 24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                TOTAL AKUMULASI BOBOT
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '6px', lineHeight: 1.1 }}>
              {totalWeight.toFixed(2)} <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-green-700)' }}>/ 1.00</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Tepat 100% (Matematis Valid)
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#edf8f3',
              color: 'var(--color-green-700)',
            }}
          >
            <Scale size={22} />
          </div>
        </div>

        <div
          className="crit-stat-card clay-card"
          style={{
            padding: '22px 24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              KOMPOSISI ATRIBUT
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-green-950)', marginTop: '8px', lineHeight: 1.1 }}>
              {benefitCount} Benefit : {costCount} Cost
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Keseimbangan parameter bantuan
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#fef3c7',
              color: 'var(--color-warning)',
            }}
          >
            <Sliders size={22} />
          </div>
        </div>
      </div>

      {/* Visual Weight Distribution Stacked Bar with Claymorphism */}
      <div
        className="clay-card"
        style={{
          padding: '22px 26px',
          borderRadius: '24px',
          marginBottom: '26px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--color-green-950)' }}>
              Distribusi Proporsi Bobot Kriteria (100%)
            </span>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Representasi visual kontribusi masing-masing kriteria terhadap nilai preferensi akhir (V)
            </div>
          </div>
          <div className="clay-badge" style={{ backgroundColor: '#edf8f3', color: 'var(--color-green-700)', padding: '5px 12px', fontSize: '12px' }}>
            <CheckCircle2 size={14} />
            <span>Σ W = 1.00</span>
          </div>
        </div>

        {/* 3D Sunken Stacked Bar */}
        <div
          className="clay-sunken"
          style={{
            height: '14px',
            width: '100%',
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
                  borderRight: i < criteria.length - 1 ? '1.5px solid #fff' : 'none',
                }}
                title={`${c.code} (${c.name}): ${pct}%`}
              />
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          {criteria.map((c, i) => (
            <div
              key={c.code}
              className="clay-badge"
              style={{
                backgroundColor: '#ffffff',
                fontSize: '12px',
                padding: '5px 12px',
              }}
            >
              <span
                className="clay-marble"
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: colorPalette[i % colorPalette.length],
                }}
              />
              <span style={{ fontWeight: '800', color: 'var(--color-green-950)' }}>{c.code}</span>
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
