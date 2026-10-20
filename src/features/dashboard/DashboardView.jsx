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
      bg: 'linear-gradient(135deg, #bbf7d0, #86efac)',
      marbleShadow: '3px 5px 12px rgba(22, 163, 74, 0.25), inset 2px 2px 5px rgba(255, 255, 255, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.15)',
      icon: <UserCheck size={14} />,
    }
  }
  if (action.includes('CALCULATION')) {
    return {
      color: '#9333ea',
      bg: 'linear-gradient(135deg, #e9d5ff, #d8b4fe)',
      marbleShadow: '3px 5px 12px rgba(147, 51, 234, 0.25), inset 2px 2px 5px rgba(255, 255, 255, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.15)',
      icon: <Zap size={14} />,
    }
  }
  if (action.includes('PERIOD') || action.includes('QUOTA')) {
    return {
      color: '#0284c7',
      bg: 'linear-gradient(135deg, #bae6fd, #7dd3fc)',
      marbleShadow: '3px 5px 12px rgba(2, 132, 199, 0.25), inset 2px 2px 5px rgba(255, 255, 255, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.15)',
      icon: <Calendar size={14} />,
    }
  }
  if (action.includes('DECISION')) {
    return {
      color: '#d97706',
      bg: 'linear-gradient(135deg, #fde68a, #fcd34d)',
      marbleShadow: '3px 5px 12px rgba(217, 119, 6, 0.25), inset 2px 2px 5px rgba(255, 255, 255, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.15)',
      icon: <FileCheck size={14} />,
    }
  }
  return {
    color: '#0f766e',
    bg: 'linear-gradient(135deg, #99f6e4, #5eead4)',
    marbleShadow: '3px 5px 12px rgba(15, 118, 110, 0.25), inset 2px 2px 5px rgba(255, 255, 255, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.15)',
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

  // Initialize Anime.js animations with Claymorphism easeOutBack & Elasticity
  useEffect(() => {
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (!anime) return

    // 1. Stagger bouncy entrance for Claymorphism cards
    anime({
      targets: '.clay-anim-card',
      translateY: [24, 0],
      opacity: [0, 1],
      delay: anime.stagger(90, { start: 80 }),
      easing: 'easeOutBack',
      duration: 750,
    })

    // 2. Number counter animation counting up from 0 to target
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

    // 3. Stagger bouncy entrance for ranking capsule cards
    anime({
      targets: '.animate-ranking-item',
      translateX: [-16, 0],
      opacity: [0, 1],
      delay: anime.stagger(70, { start: 250 }),
      easing: 'easeOutBack',
      duration: 600,
    })

    // 4. 3D Clay Progress Bar fill animation
    anime({
      targets: '.progress-v-fill',
      width: (el) => [0, el.getAttribute('data-width') || '0%'],
      delay: anime.stagger(80, { start: 350 }),
      easing: 'easeOutQuart',
      duration: 1100,
    })

    // 5. Timeline items stagger
    anime({
      targets: '.animate-timeline-item',
      translateY: [12, 0],
      opacity: [0, 1],
      delay: anime.stagger(60, { start: 300 }),
      easing: 'easeOutBack',
      duration: 550,
    })
  }, [])

  // Initialize Donut Chart (Chart.js) with soft pastel clay colors
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
            borderWidth: 0,
            borderRadius: 8,
            spacing: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '74%',
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
            padding: 12,
            cornerRadius: 12,
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
            className="clay-btn"
            onClick={() => onNavigate('saw-calc')}
            style={{
              padding: '12px 24px',
              fontSize: '13.5px',
            }}
          >
            <span className="calc-icon-spin" style={{ display: 'inline-flex' }}>
              <Calculator size={18} />
            </span>
            <span>Jalankan Hitung SAW</span>
          </button>
        }
      />

      {/* 4 Kartu Statistik Atas Bergaya 3D Claymorphism */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '22px',
          marginBottom: '32px',
        }}
      >
        <KpiCard
          clay
          className="clay-card clay-anim-card"
          title="Total Data Warga"
          value={residents.length}
          subtitle="Tercatat di basis data lokal"
          icon={<Users size={24} />}
          iconBg="#dbeafe"
          iconColor="#0284c7"
          badge="Database Lokal"
        />
        <KpiCard
          clay
          className="clay-card clay-anim-card"
          title="Calon Terverifikasi"
          value={verifiedCount}
          subtitle={`${pendingCount} berkas menunggu antrean`}
          icon={<CheckCircle2 size={24} />}
          iconBg="#dcfce7"
          iconColor="#16a34a"
          badge="Siap Hitung"
          pulseBadge
        />
        <KpiCard
          clay
          highlight
          decorativeSvg
          className="clay-card-dark clay-anim-card"
          title="Pagu Kuota Bantuan"
          value={quota}
          subtitle={`Periode: ${activePeriod?.name || 'Aktif'}`}
          icon={<Target size={24} />}
          iconBg="rgba(181, 245, 106, 0.22)"
          iconColor="var(--color-lime)"
          badge="Tahap I 2026"
        />
        <KpiCard
          clay
          className="clay-card clay-anim-card"
          title="Status Run SAW"
          value={calculationRun ? 'Siap' : 'Belum'}
          subtitle={calculationRun ? `${calculationRun.results.length} alternatif dihitung` : 'Jalankan kalkulasi'}
          icon={<BarChart3 size={24} />}
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
          gap: '26px',
          marginBottom: '32px',
        }}
      >
        {/* Peringkat 5 Tertinggi Bergaya Claymorphism 3D */}
        <div
          className="clay-card clay-anim-card"
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '22px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: '800',
                    color: 'var(--color-green-950)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  Peringkat 5 Tertinggi (Hasil SAW)
                </h3>
                <span
                  className="clay-badge"
                  style={{
                    backgroundColor: '#edf8f3',
                    color: 'var(--color-green-700)',
                    padding: '4px 12px',
                    fontSize: '11px',
                  }}
                >
                  Metode SAW
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                Nilai preferensi V dihitung murni dengan formula deterministik SAW.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('saw-ranking')}
              className="clay-badge"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--color-green-700)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 14px',
              }}
            >
              <span>Lihat Semua</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Ranking List */}
          {topRankings.length === 0 ? (
            <div
              className="clay-item"
              style={{
                padding: '30px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '13.5px',
              }}
            >
              Belum ada hasil kalkulasi SAW. Klik tombol &quot;Jalankan Hitung SAW&quot; di atas untuk memulai.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
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
                } else if (typeof row.preference?.exact === 'string') {
                  const parts = row.preference.exact.split('/')
                  if (parts.length === 2 && Number(parts[1]) > 0) {
                    valDecimal = Number(parts[0]) / Number(parts[1])
                  } else {
                    valDecimal = parseFloat(row.preference.exact) || 0
                  }
                }
                const progressWidthPercent = Math.min(100, Math.max(0, valDecimal * 100)).toFixed(1)

                return (
                  <div
                    key={row.candidateId}
                    className="animate-ranking-item clay-item"
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Bola Nomor Urut 3D Clay Marble */}
                        <div
                          className="clay-marble"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: isWithinQuota
                              ? 'linear-gradient(135deg, #1b8a6a, #16765b)'
                              : 'linear-gradient(135deg, #94a3b8, #64748b)',
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            boxShadow: isWithinQuota
                              ? '4px 6px 14px rgba(22, 118, 91, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.65), inset -3px -3px 6px rgba(0, 0, 0, 0.25)'
                              : '4px 6px 14px rgba(100, 116, 139, 0.25), inset 3px 3px 6px rgba(255, 255, 255, 0.65), inset -3px -3px 6px rgba(0, 0, 0, 0.25)',
                          }}
                        >
                          #{row.rank}
                        </div>

                        <div>
                          <div style={{ fontWeight: '800', fontSize: '14.5px', color: 'var(--color-green-950)' }}>
                            {resident?.name || row.candidateId}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            NIK: <code>{resident?.nikMasked || '—'}</code> · RT/RW: {resident?.addressRtRw || '—'}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '15.5px',
                            fontWeight: '800',
                            fontFamily: 'monospace',
                            color: isWithinQuota ? 'var(--color-green-700)' : 'var(--color-text-main)',
                          }}
                        >
                          V = {formatExact(row.preference.exact, 4)}
                        </div>
                        <span
                          className="clay-badge"
                          style={{
                            marginTop: '4px',
                            fontSize: '11px',
                            padding: '3px 10px',
                            backgroundColor: isWithinQuota ? '#edf8f3' : '#fef8ee',
                            color: isWithinQuota ? 'var(--color-green-700)' : 'var(--color-warning)',
                          }}
                        >
                          {isWithinQuota ? 'Dalam Kuota' : 'Cadangan'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar 3D Cekung (Sunken Track + Puffy Fill) */}
                    <div
                      className="clay-sunken"
                      style={{
                        marginTop: '14px',
                        width: '100%',
                        height: '10px',
                      }}
                    >
                      <div
                        className="progress-v-fill clay-progress-fill"
                        data-width={`${progressWidthPercent}%`}
                        style={{
                          width: `${progressWidthPercent}%`,
                          background: isWithinQuota
                            ? 'linear-gradient(90deg, #16765b 0%, #20b47c 65%, #b5f56a 100%)'
                            : 'linear-gradient(90deg, #d97706 0%, #f59e0b 60%, #fde68a 100%)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Visualisasi Data: Donut Chart Status Verifikasi Bergaya 3D Clay */}
        <div
          className="clay-card clay-anim-card"
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '18px' }}>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: '800',
                color: 'var(--color-green-950)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Distribusi Status Verifikasi Warga
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
              Total {residents.length} warga tercatat dalam database sistem.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '220px', height: '210px', margin: '4px 0 18px' }}>
              <canvas ref={chartCanvasRef} />
              {/* Central Floating 3D Clay Stat Bubble */}
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
                <div
                  className="clay-bubble"
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '30px',
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
                      fontSize: '10px',
                      fontWeight: '800',
                      color: 'var(--color-green-700)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginTop: '3px',
                    }}
                  >
                    Siap Seleksi
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive 3D Clay Pill Legends */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
              <div
                className="clay-badge"
                style={{
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  padding: '6px 14px',
                }}
              >
                <span className="clay-marble" style={{ width: '10px', height: '10px', backgroundColor: '#16765b' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>Terverifikasi:</span>
                <strong style={{ color: 'var(--color-green-950)' }}>{verifiedCount}</strong>
              </div>

              <div
                className="clay-badge"
                style={{
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  padding: '6px 14px',
                }}
              >
                <span className="clay-marble" style={{ width: '10px', height: '10px', backgroundColor: '#f59e0b' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>Antrean:</span>
                <strong style={{ color: 'var(--color-green-950)' }}>{pendingCount}</strong>
              </div>

              <div
                className="clay-badge"
                style={{
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  padding: '6px 14px',
                }}
              >
                <span className="clay-marble" style={{ width: '10px', height: '10px', backgroundColor: '#94a3b8' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>Lainnya:</span>
                <strong style={{ color: 'var(--color-green-950)' }}>
                  {Math.max(0, residents.length - verifiedCount - pendingCount)}
                </strong>
              </div>
            </div>

            {/* Bottom 3D Clay Status Banner */}
            <div
              className="clay-item"
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px 20px',
                backgroundColor: '#edf8f3',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12.5px',
              }}
            >
              <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>Alokasi Pagu Bantuan:</span>
              <span
                className="clay-badge"
                style={{
                  backgroundColor: '#ffffff',
                  fontWeight: '800',
                  color: 'var(--color-green-900)',
                  fontSize: '12px',
                  padding: '4px 12px',
                }}
              >
                {quota} Calon Terpilih
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Timeline: Aktivitas Audit Terbaru Bergaya 3D Clay */}
      <div
        className="clay-card clay-anim-card"
        style={{
          padding: '28px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: '800',
                color: 'var(--color-green-950)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Aktivitas Audit Terbaru
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
              Jejak aktivitas pencatatan sistem (append-only timeline dengan verifikasi aktor).
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('audit')}
            className="clay-badge"
            style={{
              backgroundColor: '#ffffff',
              color: 'var(--color-green-700)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 14px',
            }}
          >
            <span>Log Lengkap</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Vertical Timeline */}
        <div style={{ position: 'relative', paddingLeft: '34px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Continuous vertical timeline connector rail */}
          <div
            className="clay-sunken"
            style={{
              position: 'absolute',
              left: '12px',
              top: '16px',
              bottom: '16px',
              width: '6px',
              zIndex: 0,
            }}
          />

          {auditLogs.slice(0, 4).map((log) => {
            const style = getTimelineStyle(log.action)
            const initials = getInitials(log.actorName)

            return (
              <div
                key={log.id}
                className="animate-timeline-item clay-item"
                style={{
                  position: 'relative',
                  padding: '16px 20px',
                }}
              >
                {/* 3D Clay Marble Node on the timeline */}
                <div
                  className="clay-marble"
                  style={{
                    position: 'absolute',
                    left: '-36px',
                    top: '18px',
                    width: '32px',
                    height: '32px',
                    background: style.bg,
                    color: style.color,
                    boxShadow: style.marbleShadow,
                    zIndex: 2,
                  }}
                  aria-hidden="true"
                >
                  {style.icon}
                </div>

                {/* Content row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--color-green-950)' }}>
                        {log.action}
                      </span>
                      <StatusBadge status={log.outcome} />
                    </div>

                    <div style={{ color: 'var(--color-text-muted)', fontSize: '12.5px', marginTop: '3px' }}>
                      {log.requestSummary || `${log.targetType} (${log.targetId})`}
                    </div>

                    {/* Actor Initial Avatar & Name with 3D Bubble */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                      <div
                        className="clay-bubble"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: '#dcfce7',
                          color: '#16765b',
                          fontSize: '11px',
                          fontWeight: '800',
                          border: 'none',
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

                  <div
                    className="clay-badge"
                    style={{
                      backgroundColor: '#f6f8f7',
                      fontSize: '11px',
                      color: 'var(--color-text-subtle)',
                      padding: '4px 12px',
                    }}
                  >
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
      </div>
    </div>
  )
}
