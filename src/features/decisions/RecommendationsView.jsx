import { useEffect, useRef } from 'react'
import { Award, ListOrdered, Clock, ArrowRight } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'
import { deriveRecommendations } from '@shared/domain/decisions/recommendations.js'

export function RecommendationsView({ calculationRun, activePeriod, residents, candidates, onNavigate }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.rec-item-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(60),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [calculationRun])

  if (!calculationRun) {
    return (
      <div>
        <PageHeader
          featureNum={14}
          title="Rekomendasi Penerima Bansos"
          description="Sintesis komputasi ranking SAW, status verifikasi administrasi, dan pagu kuota program."
        />
        <Panel>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13.5px' }}>
            Jalankan perhitungan SAW terlebih dahulu untuk menghasilkan rekomendasi.
          </p>
        </Panel>
      </div>
    )
  }

  const quota = activePeriod?.quota ?? 0
  const recommendations = deriveRecommendations({ run: calculationRun, quota })
  const withinQuotaCount = recommendations.items.filter((i) => i.status === 'RECOMMENDED').length
  const reserveCount = recommendations.items.filter((i) => i.status === 'RESERVE').length

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={14}
        title="Rekomendasi Penerima Bansos"
        description="Hasil komputasi rekomendasi penerima. Sistem menetapkan status rekomendasi berdasarkan batas kuota dan verifikasi faktual."
        actions={
          <button
            type="button"
            className="btn-action-glow"
            onClick={() => onNavigate('decisions')}
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
            }}
          >
            <span>Lanjut ke Lembar Persetujuan</span>
            <ArrowRight size={15} />
          </button>
        }
      />

      {/* Top Squircle Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          className="interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TOTAL REKOMENDASI</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {recommendations.items.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Diproses dari run SAW
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
            <ListOrdered size={22} />
          </div>
        </div>

        <div
          className="interactive-card"
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>DALAM KUOTA PAGU</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {withinQuotaCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Prioritas alokasi bantuan
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
            <Award size={22} />
          </div>
        </div>

        <div
          className="interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>CADANGAN SELEKSI</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {reserveCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Daftar tunggu jika ada kuota kosong
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
            <Clock size={22} />
          </div>
        </div>
      </div>

      <Panel title={`Rekomendasi Sistem untuk Periode ${activePeriod?.name || 'Aktif'}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recommendations.items.map((item) => {
            const cand = candidates.find((c) => c.id === item.candidateId)
            const res = residents.find((r) => r.id === cand?.residentId)
            const isTop = item.rank === 1

            return (
              <div
                key={item.candidateId}
                className="rec-item-card interactive-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface)',
                  border: isTop ? '1.5px solid var(--color-green-600)' : '1px solid var(--color-line)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: item.rank ? (isTop ? 'var(--color-green-950)' : 'var(--color-green-700)') : '#e9ecef',
                      color: item.rank ? (isTop ? 'var(--color-lime)' : '#ffffff') : '#868e96',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      boxShadow: isTop ? '0 2px 8px rgba(9, 41, 31, 0.25)' : 'none',
                    }}
                  >
                    {item.rank ? `#${item.rank}` : '—'}
                  </span>

                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--color-green-950)' }}>
                      {res?.name || item.candidateId}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      NIK: <code>{res?.nikMasked || '—'}</code> · Kode Alasan: {item.reasonCodes.join(', ')}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <StatusBadge status={item.status} />
                    <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '3px' }}>
                      Wajib Persetujuan Manusia
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
