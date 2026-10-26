import { useState, useEffect, useRef } from 'react'
import { Loader2, Zap, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'
import { SEED_CRITERIA_VERSION } from '../../../tests/fixtures/saw/golden.js'
import { buildCalculationRun } from '@shared/domain/saw/run.js'

export function SawCalculationView({
  activePeriod,
  candidates,
  residents,
  assessments,
  calculationRun,
  currentUser,
  onRunCalculated,
}) {
  const [errorMsg, setErrorMsg] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const containerRef = useRef(null)

  const verifiedCandidates = candidates.filter((c) => c.verificationStatus === 'VERIFIED')
  const excludedCandidates = candidates.filter((c) => c.verificationStatus !== 'VERIFIED')

  useEffect(() => {
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (anime && containerRef.current) {
      anime({
        targets: containerRef.current.querySelectorAll('.candidate-calc-item'),
        opacity: [0, 1],
        translateX: [-10, 0],
        delay: anime.stagger(40),
        duration: 450,
        easing: 'easeOutBack',
      })
    }
  }, [candidates])

  function handleExecuteRun() {
    setErrorMsg('')
    setIsExecuting(true)

    try {
      const runContext = {
        runId: `run-${Date.now()}`,
        executedAt: new Date().toISOString(),
        executedBy: currentUser.id,
      }

      const input = {
        context: runContext,
        period: activePeriod,
        criteriaVersion: SEED_CRITERIA_VERSION,
        candidates: candidates.map((c) => ({
          id: c.id,
          periodId: c.periodId,
          verificationStatus: c.verificationStatus,
        })),
        assessments: assessments.map((a) => ({
          candidateId: a.candidateId,
          criterionCode: a.criterionCode,
          value: a.rawValue,
          status: a.status,
        })),
      }

      // Pure domain execution!
      const newRun = buildCalculationRun(input)
      onRunCalculated(newRun)
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan kalkulasi SAW.')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={10}
        title="Perhitungan SPK Metode SAW"
        description="Eksekusi perhitungan SAW berdasarkan penilaian kriteria terverifikasi."
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
          className="clay-card"
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
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                LOLOS GERBANG VERIFIKASI
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '6px', lineHeight: 1.1 }}>
              {verifiedCandidates.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Masuk perhitungan ranking
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

        <div
          className="clay-card"
          style={{
            padding: '22px 24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              DIKECUALIKAN DARI RUN
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-danger)', marginTop: '6px', lineHeight: 1.1 }}>
              {excludedCandidates.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Pending / berkas belum lengkap
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#fee2e2',
              color: 'var(--color-danger)',
            }}
          >
            <AlertTriangle size={22} />
          </div>
        </div>

        <div
          className="clay-card"
          style={{
            padding: '22px 24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ENGINE MATEMATIKA SAW
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-green-950)', marginTop: '8px', lineHeight: 1.1 }}>
              {calculationRun ? 'Hasil Siap' : 'Belum Dihitung'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Simple Additive Weighting
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
            <Cpu size={22} />
          </div>
        </div>
      </div>

      {/* Execution status & action bar in Claymorphism */}
      <div
        className="clay-card"
        style={{
          padding: '24px 28px',
          borderRadius: '26px',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--color-green-950)' }}>
              Status Run Saat Ini:
            </span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <StatusBadge status={calculationRun ? 'CALCULATED' : 'DRAFT'} />
              {calculationRun && <span className="pulse-indicator" />}
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {calculationRun
              ? `Kalkulasi terakhir dieksekusi pada ${new Date(calculationRun.executedAt).toLocaleString('id-ID')} (${calculationRun.results.length} alternatif masuk ranking).`
              : 'Belum ada run tersimpan. Klik tombol untuk memulai kalkulasi SAW.'}
          </p>
        </div>

        <button
          type="button"
          disabled={isExecuting}
          onClick={handleExecuteRun}
          className="clay-btn"
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            cursor: isExecuting ? 'wait' : 'pointer',
            opacity: isExecuting ? 0.7 : 1,
          }}
        >
          {isExecuting ? (
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <span className="calc-icon-spin">
              <Zap size={18} />
            </span>
          )}
          <span>{calculationRun ? 'Hitung Ulang SAW (Run Baru)' : 'Jalankan Perhitungan SAW'}</span>
        </button>
      </div>

      {errorMsg && (
        <div
          className="clay-badge"
          style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px 18px',
            marginBottom: '22px',
            fontSize: '13.5px',
            width: '100%',
          }}
        >
          <strong>Kalkulasi Gagal:</strong> {errorMsg}
        </div>
      )}

      {/* Snapshot breakdown panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <Panel
          title="Alternatif Lolos Gerbang Kelayakan"
          subtitle={`${verifiedCandidates.length} calon terverifikasi dengan data lengkap akan masuk run.`}
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {verifiedCandidates.map((c) => {
              const res = residents.find((r) => r.id === c.residentId)
              return (
                <li
                  key={c.id}
                  className="candidate-calc-item clay-item"
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>{res?.name || c.id}</span>
                  <StatusBadge status={c.verificationStatus} />
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel
          title="Alternatif Dikecualikan dari Run"
          subtitle={`${excludedCandidates.length} calon belum berstatus terverifikasi / data belum lengkap.`}
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {excludedCandidates.map((c) => {
              const res = residents.find((r) => r.id === c.residentId)
              return (
                <li
                  key={c.id}
                  className="candidate-calc-item clay-item"
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--color-text-muted)' }}>{res?.name || c.id}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>{c.verificationNotes}</div>
                  </div>
                  <StatusBadge status={c.verificationStatus} />
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
