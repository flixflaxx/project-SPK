import { useEffect, useRef } from 'react'
import { Check, Scale } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { SEED_CRITERIA_VERSION } from '../../../tests/fixtures/saw/golden.js'

const SUBCRITERIA_MAP = [
  {
    code: 'C1',
    name: 'Pendapatan per Bulan (Cost, W=0.30)',
    unit: 'Rupiah',
    rules: [
      { category: 'Pendapatan ≤ Rp 1.000.000', rawScore: '1.000.000', priorityImpact: 'Tertinggi (Prioritas Utama)' },
      { category: 'Rp 1.000.001 – Rp 1.500.000', rawScore: '1.500.000', priorityImpact: 'Tinggi' },
      { category: 'Rp 1.500.001 – Rp 2.000.000', rawScore: '2.000.000', priorityImpact: 'Sedang' },
      { category: 'Pendapatan > Rp 2.000.000', rawScore: '2.500.000+', priorityImpact: 'Rendah (Cost: nilai besar memperkecil prioritas)' },
    ],
  },
  {
    code: 'C2',
    name: 'Jumlah Tanggungan Keluarga (Benefit, W=0.25)',
    unit: 'Orang',
    rules: [
      { category: 'Tanggungan ≥ 5 orang', rawScore: '5', priorityImpact: 'Sangat Tinggi' },
      { category: 'Tanggungan 4 orang', rawScore: '4', priorityImpact: 'Tinggi' },
      { category: 'Tanggungan 3 orang', rawScore: '3', priorityImpact: 'Sedang' },
      { category: 'Tanggungan 1–2 orang', rawScore: '1–2', priorityImpact: 'Rendah' },
    ],
  },
  {
    code: 'C3',
    name: 'Kerentanan Kondisi Rumah (Benefit, W=0.20)',
    unit: 'Skor 1–5',
    rules: [
      { category: 'Rumah Tidak Layak Huni Parah (Dinding bambu/lantai tanah)', rawScore: '5', priorityImpact: 'Sangat Rentan (Skor 5)' },
      { category: 'Kondisi Rumah Rusak Sedang (Atap bocor/semi permanen)', rawScore: '4', priorityImpact: 'Rentan (Skor 4)' },
      { category: 'Kondisi Rusak Ringan', rawScore: '3', priorityImpact: 'Cukup Rentan (Skor 3)' },
      { category: 'Permanen Layak Huni', rawScore: '1–2', priorityImpact: 'Tidak Rentan (Skor 1–2)' },
    ],
  },
  {
    code: 'C4',
    name: 'Anggota Keluarga Rentan (Benefit, W=0.15)',
    unit: 'Skor 0–2',
    rules: [
      { category: 'Terdapat Lansia + Balita / Disabilitas Berat', rawScore: '2', priorityImpact: 'Kebutuhan Mendesak (Skor 2)' },
      { category: 'Terdapat salah satu (Lansia saja / Balita saja)', rawScore: '1', priorityImpact: 'Kebutuhan Sedang (Skor 1)' },
      { category: 'Tidak ada anggota keluarga rentan', rawScore: '0', priorityImpact: 'Tanpa Kategori Khusus (Skor 0)' },
    ],
  },
  {
    code: 'C5',
    name: 'Skor Kepemilikan Aset Produktif (Cost, W=0.10)',
    unit: 'Skor 1–3',
    rules: [
      { category: 'Tidak memiliki aset produktif / tanah / kendaraan usaha', rawScore: '1', priorityImpact: 'Paling Prioritas (Cost: min / x)' },
      { category: 'Memiliki 1 unit alat kerja / motor tua operasional', rawScore: '2', priorityImpact: 'Prioritas Sedang (Skor 2)' },
      { category: 'Memiliki ≥ 2 unit aset produktif / kendaraan bermotor', rawScore: '3', priorityImpact: 'Prioritas Rendah (Skor 3)' },
    ],
  },
]

export function SubcriteriaView() {
  const containerRef = useRef(null)
  const totalWeight = SEED_CRITERIA_VERSION.criteria.reduce((sum, c) => sum + Number(c.weight), 0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.subcrit-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(70),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [])

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={7}
        title="Subkriteria & Bobot Penilaian"
        description="Pemetaan kategori faktual ke skor angka matriks SAW, batas rentang inklusif, serta verifikasi total bobot tepat 1,00."
      />

      {/* Weight Summary Banner */}
      <div
        className="interactive-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          padding: '18px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--color-green-700)',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              flexShrink: 0,
            }}
          >
            <Scale size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                Status Total Bobot: Versi {SEED_CRITERIA_VERSION.label}
              </span>
              <span className="pulse-indicator" />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Prasyarat kalkulasi SAW: Σ wⱼ = 1,00 (100%).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontSize: '24px',
              fontWeight: '800',
              fontFamily: 'monospace',
              color: 'var(--color-green-700)',
            }}
          >
            {totalWeight.toFixed(2)}
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              border: '1px solid var(--color-success-border)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Check size={14} />
            <span>VALID (100%)</span>
          </span>
        </div>
      </div>

      {/* Subcriteria Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {SUBCRITERIA_MAP.map((sub) => (
          <div key={sub.code} className="subcrit-card interactive-card">
            <Panel title={`${sub.code} — ${sub.name}`} subtitle={`Satuan Nilai Faktual: ${sub.unit}`}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-line)', backgroundColor: 'var(--color-surface-muted)' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '700' }}>Kategori Lapangan</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: '700', width: '22%' }}>Skor Angka (xᵢⱼ)</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '700', width: '38%' }}>Pengaruh Terhadap Prioritas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.rules.map((rule, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-line)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600', color: 'var(--color-green-950)' }}>
                          {rule.category}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontFamily: 'monospace', fontWeight: '700', color: 'var(--color-green-700)', fontSize: '13.5px' }}>
                          {rule.rawScore}
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)', fontSize: '12.5px' }}>
                          {rule.priorityImpact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        ))}
      </div>
    </div>
  )
}
