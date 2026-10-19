import { useEffect, useRef } from 'react'
import { CheckCircle2, AlertCircle, Users, ClipboardCheck } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'
import { SEED_CRITERIA_VERSION } from '../../../tests/fixtures/saw/golden.js'

export function AssessmentsView({ candidates, residents, assessments }) {
  const criteria = SEED_CRITERIA_VERSION.criteria
  const containerRef = useRef(null)

  // Build matrix row per candidate
  const matrixRows = candidates.map((candidate) => {
    const resident = residents.find((r) => r.id === candidate.residentId)
    const candidateAssessments = assessments.filter((a) => a.candidateId === candidate.id)
    const values = {}
    let allValid = true

    for (const c of criteria) {
      const ass = candidateAssessments.find((a) => a.criterionCode === c.code)
      values[c.code] = ass ? ass.rawValue : null
      if (!ass || ass.status !== 'VALID' || ass.rawValue === '' || ass.rawValue === null) {
        allValid = false
      }
    }

    return {
      candidateId: candidate.id,
      name: resident?.name || candidate.id,
      nik: resident?.nikMasked || '—',
      verificationStatus: candidate.verificationStatus,
      values,
      isComplete: allValid,
    }
  })

  const readyCount = matrixRows.filter((r) => r.isComplete && r.verificationStatus === 'VERIFIED').length
  const pendingCount = matrixRows.length - readyCount
  const percentComplete = matrixRows.length > 0 ? Math.round((readyCount / matrixRows.length) * 100) : 0

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.ass-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
      window.anime({
        targets: containerRef.current.querySelector('.ass-progress-bar'),
        width: ['0%', `${percentComplete}%`],
        duration: 850,
        easing: 'easeOutCubic',
      })
    }
  }, [candidates, assessments, percentComplete])

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={9}
        title="Input Penilaian Calon"
        description="Matriks data mentah (X) berdasarkan penilaian kriteria terverifikasi."
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
          className="ass-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TOTAL ALTERNATIF MATRIKS</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {matrixRows.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Terdaftar dalam siklus periode
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
            <Users size={22} />
          </div>
        </div>

        <div
          className="ass-stat-card interactive-card"
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>LENGKAP & SIAP HITUNG</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {readyCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Nilai C1–C5 valid & lolos verifikasi
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
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div
          className="ass-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>BELUM LENGKAP / PENDING</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {pendingCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Menunggu kelengkapan data
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
            <ClipboardCheck size={22} />
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Card */}
      <div
        className="interactive-card"
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '18px 22px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-line)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--color-green-950)' }}>
              Kesiapan Matriks Penilaian Calon (X)
            </span>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              {readyCount} dari {matrixRows.length} calon memiliki parameter lengkap untuk dieksekusi mesin SAW
            </div>
          </div>
          <span style={{ fontSize: '17px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-green-700)' }}>
            {percentComplete}%
          </span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'var(--color-surface-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            className="ass-progress-bar"
            style={{
              height: '100%',
              width: `${percentComplete}%`,
              background: 'linear-gradient(90deg, var(--color-green-700), var(--color-green-500))',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>

      <Panel title="Matriks Keputusan Mentah (X) Calon Penerima">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '2px solid var(--color-line)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700' }}>Alternatif / Calon</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700' }}>Status Verif.</th>
                {criteria.map((c) => (
                  <th key={c.code} style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '700' }}>
                    <div>{c.code}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                      {c.type === 'COST' ? 'Cost' : 'Benefit'}
                    </div>
                  </th>
                ))}
                <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700' }}>Kelengkapan</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row, idx) => (
                <tr
                  key={row.candidateId}
                  style={{
                    borderBottom: '1px solid var(--color-line)',
                    backgroundColor: idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)',
                  }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>{row.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>NIK: <code>{row.nik}</code></div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <StatusBadge status={row.verificationStatus} />
                  </td>
                  {criteria.map((c) => {
                    const val = row.values[c.code]
                    const isMissing = val === null || val === undefined || val === ''
                    return (
                      <td
                        key={c.code}
                        style={{
                          padding: '12px 14px',
                          textAlign: 'right',
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          color: isMissing ? 'var(--color-danger)' : 'var(--color-text-main)',
                          backgroundColor: isMissing ? 'var(--color-danger-bg)' : 'transparent',
                        }}
                      >
                        {isMissing ? 'KOSONG' : Number(val).toLocaleString('id-ID')}
                      </td>
                    )
                  })}
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {row.isComplete && row.verificationStatus === 'VERIFIED' ? (
                      <span
                        style={{
                          color: 'var(--color-success)',
                          backgroundColor: 'var(--color-success-bg)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: '700',
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Siap Hitung</span>
                      </span>
                    ) : (
                      <span
                        style={{
                          color: 'var(--color-warning)',
                          backgroundColor: 'var(--color-warning-bg)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: '600',
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <AlertCircle size={13} />
                        <span>Belum Lengkap</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
