import { useState, useEffect, useRef } from 'react'
import { Target, CheckCircle2, PieChart, Save, AlertCircle } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { countApproved } from '@shared/domain/decisions/approval.js'

export function QuotaView({ activePeriod, calculationRun, decisions, onUpdateQuota }) {
  const [quotaInput, setQuotaInput] = useState(activePeriod?.quota ?? 3)
  const approvedTotal = calculationRun ? countApproved(decisions, calculationRun.id) : 0
  const quota = activePeriod?.quota ?? 3
  const remainingQuota = Math.max(0, quota - approvedTotal)
  const percentFilled = quota > 0 ? Math.min(100, Math.round((approvedTotal / quota) * 100)) : 0
  const containerRef = useRef(null)

  useEffect(() => {
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (anime && containerRef.current) {
      anime({
        targets: containerRef.current.querySelectorAll('.quota-stat-card'),
        opacity: [0, 1],
        translateY: [16, 0],
        delay: anime.stagger(90),
        duration: 550,
        easing: 'easeOutBack',
      })
      anime({
        targets: containerRef.current.querySelector('.quota-fill-bar'),
        width: [`0%`, `${percentFilled}%`],
        duration: 900,
        easing: 'easeOutQuart',
      })
    }
  }, [percentFilled])

  function handleSaveQuota(e) {
    e.preventDefault()
    const val = Number.parseInt(String(quotaInput), 10)
    if (Number.isNaN(val) || val < 0) {
      alert('Kuota harus berupa bilangan bulat ≥ 0.')
      return
    }
    onUpdateQuota(val)
  }

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={16}
        title="Kuota Bantuan"
        description="Pengaturan pagu kuota penerima dan pemantauan kapasitas terisi."
      />

      {/* 3 Top Squircle Metric Cards with Claymorphism */}
      <div
        className="responsive-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '18px',
          marginBottom: '26px',
        }}
      >
        {/* Pagu Kuota */}
        <div
          className="quota-stat-card clay-card"
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
              PAGU KUOTA PERIODE
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '6px', lineHeight: 1.1 }}>
              {quota} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Batas alokasi bantuan
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
            <Target size={22} />
          </div>
        </div>

        {/* Kuota Disetujui */}
        <div
          className="quota-stat-card clay-card"
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
                TELAH DISETUJUI
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '6px', lineHeight: 1.1 }}>
              {approvedTotal} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Keputusan pimpinan resmi
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
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Sisa Alokasi */}
        <div
          className="quota-stat-card clay-card"
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
              SISA ALOKASI KUOTA
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)',
                color: remainingQuota === 0 ? 'var(--color-danger)' : 'var(--color-warning)',
                marginTop: '6px',
                lineHeight: 1.1,
              }}
            >
              {remainingQuota} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              {remainingQuota === 0 ? 'Pagu terpenuhi penuh' : 'Slot masih tersedia'}
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: remainingQuota === 0 ? '#fee2e2' : '#fef3c7',
              color: remainingQuota === 0 ? 'var(--color-danger)' : 'var(--color-warning)',
            }}
          >
            <PieChart size={22} />
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Card with Claymorphism */}
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
            <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--color-green-950)' }}>
              Tingkat Keterisian Kuota Penyaluran
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {approvedTotal} dari {quota} pagu calon telah resmi disetujui
            </div>
          </div>
          <span
            className="clay-badge"
            style={{
              fontSize: '16px',
              fontWeight: '800',
              fontFamily: 'monospace',
              color: 'var(--color-green-700)',
              backgroundColor: '#edf8f3',
              padding: '4px 14px',
            }}
          >
            {percentFilled}%
          </span>
        </div>

        {/* 3D Sunken Progress Track */}
        <div
          className="clay-sunken"
          style={{
            height: '11px',
            width: '100%',
          }}
        >
          <div
            className="quota-fill-bar clay-progress-fill"
            style={{
              height: '100%',
              width: `${percentFilled}%`,
              background: 'linear-gradient(90deg, #16765b 0%, #20b47c 60%, #b5f56a 100%)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11.5px', color: 'var(--color-text-subtle)' }}>
          <span>0 Calon</span>
          <span>Kapasitas Pagu: {quota} Calon</span>
        </div>
      </div>

      {/* Pengaturan Pagu Form in Claymorphism */}
      <Panel title="Pengaturan Kuota Periode Aktif" subtitle={`Periode: ${activePeriod?.name}`}>
        <form onSubmit={handleSaveQuota} style={{ maxWidth: '460px' }}>
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-green-950)' }}>
              Pagu Kuota Penerima (Jumlah Orang)
            </label>
            <input
              type="number"
              min={0}
              value={quotaInput}
              onChange={(e) => setQuotaInput(Number(e.target.value))}
              style={{
                width: '100%',
                fontSize: '16px',
                fontWeight: '800',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              <AlertCircle size={14} style={{ flexShrink: 0, color: 'var(--color-green-700)' }} />
              <span>Perubahan kuota otomatis menyesuaikan status rekomendasi (Dalam Kuota vs Cadangan).</span>
            </div>
          </div>

          <button
            type="submit"
            className="clay-btn"
            style={{
              padding: '12px 24px',
              fontSize: '13.5px',
            }}
          >
            <Save size={16} />
            <span>Simpan Perubahan Kuota</span>
          </button>
        </form>
      </Panel>
    </div>
  )
}
