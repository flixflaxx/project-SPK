import { useEffect, useRef } from 'react'
import { Calendar, Layers, Target, CheckCircle2 } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function PeriodsView({ periods, activePeriod, onSelectPeriod }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.period-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [])

  const totalQuotaAll = periods.reduce((sum, p) => sum + (p.quota || 0), 0)

  const columns = [
    {
      key: 'name',
      label: 'Nama Periode Seleksi',
      width: '32%',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>ID: <code>{row.id}</code></div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status Periode',
      width: '15%',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'quota',
      label: 'Pagu Kuota',
      width: '14%',
      render: (val) => (
        <span style={{ fontWeight: '700', fontFamily: 'monospace', color: 'var(--color-green-700)', fontSize: '13.5px' }}>
          {val} Calon
        </span>
      ),
    },
    {
      key: 'dates',
      label: 'Rentang Pelaksanaan',
      width: '23%',
      render: (_, row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
          {new Date(row.startDate).toLocaleDateString('id-ID')} s.d.{' '}
          {new Date(row.endDate).toLocaleDateString('id-ID')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      width: '16%',
      render: (_, row) => {
        const isCurrent = row.id === activePeriod?.id
        return (
          <button
            type="button"
            disabled={isCurrent}
            onClick={() => onSelectPeriod(row)}
            className={isCurrent ? '' : 'btn-action-glow'}
            style={{
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              backgroundColor: isCurrent ? 'var(--color-surface-muted)' : 'var(--color-green-700)',
              color: isCurrent ? 'var(--color-text-muted)' : '#ffffff',
              border: isCurrent ? '1px solid var(--color-line-dark)' : 'none',
              cursor: isCurrent ? 'default' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isCurrent ? (
              <>
                <CheckCircle2 size={13} />
                <span>Sedang Aktif</span>
              </>
            ) : (
              <span>Pilih Periode</span>
            )}
          </button>
        )
      },
    },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={8}
        title="Periode Seleksi"
        description="Pengaturan siklus periode seleksi bantuan sosial dan kuota penerima."
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
          className="period-stat-card interactive-card"
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>PERIODE TERPILIH</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '6px' }}>
              {activePeriod?.name || 'Belum Dipilih'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Pagu: {activePeriod?.quota} Calon Penerima
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
            <Calendar size={22} />
          </div>
        </div>

        <div
          className="period-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TOTAL SIKLUS TERDAFTAR</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {periods.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Periode</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Siklus penyaluran bansos desa
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
            <Layers size={22} />
          </div>
        </div>

        <div
          className="period-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>AKUMULASI PAGU KUOTA</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {totalQuotaAll} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Total seluruh periode tersimpan
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
            <Target size={22} />
          </div>
        </div>
      </div>

      <Panel title="Daftar Periode Penyaluran Bantuan Sosial">
        <DataTable columns={columns} data={periods} />
      </Panel>
    </div>
  )
}
