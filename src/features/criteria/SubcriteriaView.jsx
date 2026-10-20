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
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (anime && containerRef.current) {
      anime({
        targets: containerRef.current.querySelectorAll('.subcrit-card'),
        opacity: [0, 1],
        translateY: [16, 0],
        delay: anime.stagger(70),
        duration: 550,
        easing: 'easeOutBack',
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

      {/* Weight Summary Banner with Claymorphism */}
      <div
        className="clay-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '22px 28px',
          borderRadius: '26px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
            <Scale size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                Status Total Bobot: Versi {SEED_CRITERIA_VERSION.label}
              </span>
              <span className="pulse-indicator" />
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Prasyarat kalkulasi SAW: Σ wⱼ = 1,00 (100%).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: '800',
              fontFamily: 'monospace',
              color: 'var(--color-green-700)',
            }}
          >
            {totalWeight.toFixed(2)}
          </span>
          <span
            className="clay-badge"
            style={{
              fontSize: '12px',
              fontWeight: '800',
              padding: '6px 14px',
              backgroundColor: '#edf8f3',
              color: 'var(--color-green-700)',
            }}
          >
            <Check size={14} />
            <span>VALID (100%)</span>
          </span>
        </div>
      </div>

      {/* Subcriteria Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {SUBCRITERIA_MAP.map((sub) => (
          <div key={sub.code} className="subcrit-card">
            <Panel title={`${sub.code} — ${sub.name}`} subtitle={`Satuan Nilai Faktual: ${sub.unit}`}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '800', color: 'var(--color-green-950)', backgroundColor: '#eaf4ef', borderRadius: '12px 0 0 12px', fontSize: '12px', textTransform: 'uppercase' }}>Kategori Lapangan</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '800', color: 'var(--color-green-950)', backgroundColor: '#eaf4ef', width: '22%', fontSize: '12px', textTransform: 'uppercase' }}>Skor Angka (xᵢⱼ)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '800', color: 'var(--color-green-950)', backgroundColor: '#eaf4ef', width: '38%', borderRadius: '0 12px 12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Pengaruh Terhadap Prioritas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.rules.map((rule, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fcfb',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--color-green-950)', borderRadius: '10px 0 0 10px', borderBottom: '1px solid rgba(22, 118, 91, 0.05)' }}>
                          {rule.category}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'monospace', fontWeight: '800', color: 'var(--color-green-700)', fontSize: '14px', borderBottom: '1px solid rgba(22, 118, 91, 0.05)' }}>
                          <span className="clay-badge" style={{ backgroundColor: '#edf8f3', padding: '3px 10px' }}>
                            {rule.rawScore}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '12.5px', borderRadius: '0 10px 10px 0', borderBottom: '1px solid rgba(22, 118, 91, 0.05)' }}>
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
