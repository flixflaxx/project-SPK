
import { useEffect, useRef } from 'react'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calculator,
  Calendar,
  CheckCircle2,
  FileCheck,
  Target,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'
import { KpiCard } from '../../components/common/KpiCard.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'
import { formatExact } from '@shared/domain/saw/fraction.js'

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return (name.slice(0, 2) || 'AD').toUpperCase()
}

function getTimelineStyle(action = '') {
  if (action.includes('VERIF') || action.includes('RESIDENT')) {
    return {
      color: '#16a34a',
      bg: '#dcfce7',
      border: '#bbf7d0',
      icon: <UserCheck size={14} />,
    }
  }
  if (action.includes('CALCULATION')) {
    return {
      color: '#9333ea',
      bg: '#f3e8ff',
      border: '#e9d5ff',
      icon: <Zap size={14} />,
    }
  }
  if (action.includes('PERIOD') || action.includes('QUOTA')) {
    return {
      color: '#0284c7',
      bg: '#e0f2fe',
      border: '#bae6fd',
      icon: <Calendar size={14} />,
    }
  }
  if (action.includes('DECISION')) {
    return {
      color: '#d97706',
      bg: '#fef3c7',
      border: '#fde68a',
      icon: <FileCheck size={14} />,
    }
  }
  return {
    color: '#0f766e',
    bg: '#ccfbf1',
    border: '#99f6e4',
    icon: <Activity size={14} />,
  }
}

export function DashboardView({
  activePeriod,
  residents,
  candidates,
  calculationRun,
  auditLogs,
  onNavigate,
}) {
  const chartCanvasRef = useRef(null)

  const verifiedCount = candidates.filter((c) => c.verificationStatus === 'VERIFIED').length
  const pendingCount = candidates.filter((c) => c.verificationStatus === 'PENDING').length
  const quota = activePeriod?.quota ?? 0
  const topRankings = calculationRun?.results?.slice(0, 5) || []

  // Initialize Anime.js animations
  useEffect(() => {
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (!anime) return

    // 1. Stagger fade-up for top statistic cards
    anime({
      targets: '.animate-card',
      translateY: [18, 0],
      opacity: [0, 1],
      delay: anime.stagger(90, { start: 100 }),
      easing: 'easeOutCubic',
      duration: 650,
    })

    // 2. Number counter naik dari 0 untuk angka statistik utama
    const counterElements = document.querySelectorAll('.counter-val')
    counterElements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0')
      if (Number.isNaN(target)) return
      const obj = { count: 0 }
      anime({
        targets: obj,
        count: target,
        round: 1,
        easing: 'easeOutExpo',
        duration: 1200,
        update: () => {
          el.textContent = Math.round(obj.count)
        },
      })
    })

    // 3. Stagger animasi daftar peringkat SAW
    anime({
      targets: '.animate-ranking-item',
      translateX: [-14, 0],
      opacity: [0, 1],
      delay: anime.stagger(70, { start: 250 }),
      easing: 'easeOutCubic',
      duration: 550,
    })

    // 4. Animasi Progress bar nilai V yang memanjang dari 0%
    anime({
      targets: '.progress-v-fill',
      width: (el) => [0, el.getAttribute('data-width') || '0%'],
      delay: anime.stagger(80, { start: 350 }),
      easing: 'easeOutQuart',
      duration: 1100,
    })
  }, [])

  // Initialize Donut Chart (Chart.js)
  useEffect(() => {
    const Chart = typeof window !== 'undefined' ? window.Chart : null
    if (!Chart || !chartCanvasRef.current) return

    const ctx = chartCanvasRef.current.getContext('2d')
    if (!ctx) return

    const otherCount = Math.max(0, residents.length - verifiedCount - pendingCount)
    const chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Terverifikasi', 'Menunggu Antrean', 'Warga Lainnya'],
        datasets: [
          {
            data: [verifiedCount, pendingCount, otherCount],
            backgroundColor: ['#16765b', '#f59e0b', '#94a3b8'],
            hoverBackgroundColor: ['#1b8a6a', '#fbbf24', '#cbd5e1'],
            borderWidth: 3,
            borderColor: '#ffffff',
            borderRadius: 6,
            spacing: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#09291f',
            titleFont: { family: "'Manrope Variable', sans-serif", weight: 'bold', size: 12 },
            bodyFont: { family: "'DM Sans Variable', sans-serif", size: 12 },
            padding: 10,
            cornerRadius: 8,
            boxPadding: 4,
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw} orang`,
            },
          },
        },
      },
    })

    return () => {
      chartInstance.destroy()
    }
  }, [verifiedCount, pendingCount, residents.length])

  return (
    <div>
      <PageHeader
        title="Dashboard Utama"
        description="Ringkasan pemrosesan SPK Bansos, progres verifikasi berkas warga, dan perangkingan SAW terkini."
        actions={
          <button
            type="button"
            className="btn-calc-glow"
            onClick={() => onNavigate('saw-calc')}
            style={{
              backgroundColor: 'var(--color-green-700)',
              color: 'var(--color-text-inverse)',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(22, 118, 91, 0.25)',
              cursor: 'pointer',
            }}
          >
            <span className="calc-icon-spin">
              <Calculator size={17} />
            </span>
            <span>Jalankan Hitung SAW</span>
          </button>
        }
      />

      {/* KPI Cards Grid (4 Cards with Squircle & Micro-details) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <KpiCard
          className="animate-card"
          title="Total Data Warga"
          value={residents.length}
          subtitle="Tercatat di basis data lokal"
          icon={<Users size={22} />}
          iconBg="#e0f2fe"
          iconColor="#0284c7"
        />
        <KpiCard
          className="animate-card"
          title="Calon Terverifikasi"
          value={verifiedCount}
          subtitle={`${pendingCount} berkas menunggu antrean`}
          icon={<CheckCircle2 size={22} />}
          iconBg="#dcfce7"
          iconColor="#16a34a"
          badge="Siap Hitung"
        />
        <KpiCard
          className="animate-card"
          highlight
          decorativeSvg
          title="Pagu Kuota Bantuan"
          value={quota}
          subtitle={`Periode: ${activePeriod?.name || 'Aktif'}`}
          icon={<Target size={22} />}
          iconBg="rgba(181, 245, 106, 0.18)"
          iconColor="var(--color-lime)"
          badge="Tahap I 2026"
        />
        <KpiCard
          className="animate-card"
          title="Status Run SAW"
          value={calculationRun ? 'Siap' : 'Belum'}
          subtitle={calculationRun ? `${calculationRun.results.length} alternatif dihitung` : 'Jalankan kalkulasi'}
          icon={<BarChart3 size={22} />}
          iconBg="#f3e8ff"
          iconColor="#9333ea"
          badge={calculationRun?.status || 'IDLE'}
          pulseBadge={Boolean(calculationRun)}
        />
      </div>

      {/* Main Content Layout: SAW Rankings (Left) & Verification Donut Chart (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Peringkat 5 Tertinggi dengan Progress Bar V */}
        <Panel
          title="Peringkat 5 Tertinggi (Hasil SAW)"
          subtitle="Nilai preferensi V dihitung murni dengan formula SAW."
          actions={
            <button
              type="button"
              onClick={() => onNavigate('saw-ranking')}
              style={{
                fontSize: '12.5px',
                color: 'var(--color-green-700)',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Lihat Semua</span>
              <ArrowRight size={14} />
            </button>
          }
        >
          {topRankings.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Belum ada hasil kalkulasi SAW.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topRankings.map((row) => {
                const cand = candidates.find((c) => c.id === row.candidateId)
                const resident = residents.find((r) => r.id === cand?.residentId)
                const isWithinQuota = row.rank <= quota

                // Compute exact decimal value for progress bar
                let valDecimal = 0
                if (row.preference?.exact && typeof row.preference.exact === 'object') {
                  const num = Number(row.preference.exact.num || 0)
                  const den = Number(row.preference.exact.den || 1)
                  valDecimal = den > 0 ? num / den : 0
                } else if (typeof row.preference?.exact === 'number') {
                  valDecimal = row.preference.exact
                }
                const progressWidthPercent = Math.min(100, Math.max(0, valDecimal * 100)).toFixed(1)

                return (
                  <div
                    key={row.candidateId}
                    className="animate-ranking-item ranking-item-card"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isWithinQuota ? '#edf8f3' : 'var(--color-surface)',
                      border: isWithinQuota ? '1px solid var(--color-success-border)' : '1px solid var(--color-line)',
                      padding: '12px 16px 14px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: isWithinQuota ? 'var(--color-green-700)' : 'var(--color-surface-muted)',
                            color: isWithinQuota ? '#ffffff' : 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '13.5px',
                            boxShadow: isWithinQuota ? '0 2px 6px rgba(22, 118, 91, 0.25)' : 'none',
                          }}
                        >
                          {row.rank}
                        </span>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-green-950)' }}>
                            {resident?.name || row.candidateId}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            NIK: {resident?.nikMasked || '—'} · RT/RW: {resident?.addressRtRw || '—'}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '15px',
                            fontWeight: '800',
                            fontFamily: 'monospace',
                            color: isWithinQuota ? 'var(--color-green-700)' : 'var(--color-text-main)',
                          }}
                        >
                          V = {formatExact(row.preference.exact, 4)}
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            color: isWithinQuota ? 'var(--color-success)' : 'var(--color-text-subtle)',
                            fontWeight: '700',
                          }}
                        >
                          {isWithinQuota ? 'Dalam Kuota' : 'Cadangan'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar horizontal representasi nilai V */}
                    <div
                      style={{
                        marginTop: '10px',
                        width: '100%',
                        height: '5px',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        className="progress-v-fill"
                        data-width={`${progressWidthPercent}%`}
                        style={{
                          height: '100%',
                          width: `${progressWidthPercent}%`,
                          background: isWithinQuota
                            ? 'linear-gradient(90deg, #16765b 0%, #20b47c 65%, #b5f56a 100%)'
                            : 'linear-gradient(90deg, #d97706 0%, #f59e0b 60%, #fde68a 100%)',
                          borderRadius: '999px',
                          boxShadow: isWithinQuota ? '0 0 8px rgba(32, 180, 124, 0.4)' : 'none',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>

        {/* Donut Chart: Proporsi Status Verifikasi & Kesiapan Kuota */}
        <Panel
          title="Distribusi Status Verifikasi Warga"
          subtitle={`Total ${residents.length} warga tercatat dalam database.`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px', height: '200px', margin: '6px 0 16px' }}>
              <canvas ref={chartCanvasRef} />
              {/* Central stat indicator */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '26px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-green-950)',
                    lineHeight: 1,
                  }}
                >
                  {verifiedCount}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginTop: '3px',
                  }}
                >
                  Siap Seleksi
                </span>
              </div>
            </div>

            {/* Interactive legend chips */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#16765b' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>Terverifikasi:</span>
                <strong style={{ color: 'var(--color-green-950)' }}>{verifiedCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#f59e0b' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>Antrean:</span>
                <strong style={{ color: 'var(--color-green-950)' }}>{pendingCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#94a3b8' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>Lainnya:</span>
                <strong style={{ color: 'var(--color-green-950)' }}>
                  {Math.max(0, residents.length - verifiedCount - pendingCount)}
                </strong>
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '10px 14px',
                backgroundColor: 'var(--color-surface-muted)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'var(--color-text-muted)' }}>Alokasi Kuota Bantuan:</span>
              <span style={{ fontWeight: '700', color: 'var(--color-green-900)' }}>
                {quota} Calon Terpilih
              </span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Vertical Timeline: Aktivitas Audit Terbaru */}
      <Panel
        title="Aktivitas Audit Terbaru"
        subtitle="Jejak aktivitas pencatatan sistem (append-only timeline)."
        actions={
          <button
            type="button"
            onClick={() => onNavigate('audit')}
            style={{
              fontSize: '12.5px',
              color: 'var(--color-green-700)',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Log Lengkap</span>
            <ArrowRight size={14} />
          </button>
        }
      >
        <div style={{ position: 'relative', paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Continuous vertical timeline connector line */}
          <div
            style={{
              position: 'absolute',
              left: '13px',
              top: '12px',
              bottom: '12px',
              width: '2px',
              backgroundColor: 'var(--color-line-dark)',
              zIndex: 0,
            }}
          />

          {auditLogs.slice(0, 4).map((log) => {
            const style = getTimelineStyle(log.action)
            const initials = getInitials(log.actorName)

            return (
              <div
                key={log.id}
                className="timeline-item-card"
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Node Dot on the timeline */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '14px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: style.bg,
                    color: style.color,
                    border: `2px solid ${style.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  }}
                  aria-hidden="true"
                >
                  {style.icon}
                </div>

                {/* Content row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--color-green-950)' }}>
                        {log.action}
                      </span>
                      <StatusBadge status={log.outcome} />
                    </div>

                    <div style={{ color: 'var(--color-text-muted)', fontSize: '12.5px', marginTop: '3px' }}>
                      {log.requestSummary || `${log.targetType} (${log.targetId})`}
                    </div>

                    {/* Actor Initial Avatar & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '8px' }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: '#dcfce7',
                          color: '#16765b',
                          fontSize: '10px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #bbf7d0',
                        }}
                        title={log.actorName}
                      >
                        {initials}
                      </div>
                      <span style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)' }}>
                        {log.actorName} · <span style={{ textTransform: 'capitalize' }}>{log.role?.toLowerCase() || 'petugas'}</span>
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '11.5px', color: 'var(--color-text-subtle)' }}>
                    {new Date(log.occurredAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
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
