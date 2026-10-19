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
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.quota-stat-card'),
        opacity: [0, 1],
        translateY: [14, 0],
        delay: window.anime.stagger(90),
        duration: 500,
        easing: 'easeOutCubic',
      })
      window.anime({
        targets: containerRef.current.querySelector('.quota-fill-bar'),
        width: [`0%`, `${percentFilled}%`],
        duration: 900,
        easing: 'easeOutCubic',
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

      {/* 3 Top Squircle Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Pagu Kuota */}
        <div
          className="quota-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '18px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>PAGU KUOTA PERIODE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {quota} <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Batas alokasi bantuan
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
              flexShrink: 0,
            }}
          >
            <Target size={22} />
          </div>
        </div>

        {/* Kuota Disetujui */}
        <div
          className="quota-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '18px 20px',
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TELAH DISETUJUI</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {approvedTotal} <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Keputusan pimpinan resmi
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
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Sisa Alokasi */}
        <div
          className="quota-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '18px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>SISA ALOKASI KUOTA</div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)',
                color: remainingQuota === 0 ? 'var(--color-danger)' : 'var(--color-warning)',
                marginTop: '4px',
              }}
            >
              {remainingQuota} <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              {remainingQuota === 0 ? 'Pagu terpenuhi penuh' : 'Slot masih tersedia'}
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: remainingQuota === 0 ? '#fee2e2' : '#fef3c7',
              color: remainingQuota === 0 ? 'var(--color-danger)' : 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PieChart size={22} />
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Card */}
      <div
        className="interactive-card"
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-line)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-green-950)' }}>
              Tingkat Keterisian Kuota Penyaluran
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {approvedTotal} dari {quota} pagu calon telah resmi disetujui
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-green-700)' }}>
            {percentFilled}%
          </div>
        </div>

        {/* Progress track */}
        <div
          style={{
            height: '12px',
            backgroundColor: 'var(--color-surface-muted)',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            className="quota-fill-bar"
            style={{
              height: '100%',
              width: `${percentFilled}%`,
              background: 'linear-gradient(90deg, var(--color-green-700) 0%, var(--color-green-500) 100%)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--color-text-subtle)' }}>
          <span>0 Calon</span>
          <span>Kapasitas Pagu: {quota} Calon</span>
        </div>
      </div>

      {/* Pengaturan Pagu Form */}
      <Panel title="Pengaturan Kuota Periode Aktif" subtitle={`Periode: ${activePeriod?.name}`}>
        <form onSubmit={handleSaveQuota} style={{ maxWidth: '440px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-green-950)' }}>
              Pagu Kuota Penerima (Jumlah Orang)
            </label>
            <input
              type="number"
              min={0}
              value={quotaInput}
              onChange={(e) => setQuotaInput(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-line-dark)',
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--color-green-950)',
                backgroundColor: 'var(--color-surface)',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              <AlertCircle size={13} style={{ flexShrink: 0, color: 'var(--color-green-700)' }} />
              <span>Perubahan kuota otomatis menyesuaikan status rekomendasi (Dalam Kuota vs Cadangan).</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-action-glow"
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--color-green-700)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
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
