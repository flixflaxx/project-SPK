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
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.candidate-calc-item'),
        opacity: [0, 1],
        translateX: [-10, 0],
        delay: window.anime.stagger(40),
        duration: 400,
        easing: 'easeOutCubic',
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>LOLOS GERBANG VERIFIKASI</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {verifiedCandidates.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Masuk perhitungan ranking
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>DIKECUALIKAN DARI RUN</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-danger)', marginTop: '4px' }}>
              {excludedCandidates.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Pending / berkas belum lengkap
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#fee2e2',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={22} />
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>ENGINE MATEMATIKA SAW</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-green-950)', marginTop: '8px' }}>
              {calculationRun ? 'Hasil Siap' : 'Belum Dihitung'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Simple Additive Weighting
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
            <Cpu size={22} />
          </div>
        </div>
      </div>

      {/* Execution status & action */}
      <div
        className="interactive-card"
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '22px 26px',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--color-green-700)',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-950)' }}>
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
          className="btn-calc-glow"
          style={{
            backgroundColor: 'var(--color-green-700)',
            color: 'var(--color-text-inverse)',
            padding: '11px 22px',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            fontSize: '14px',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 4px 14px rgba(22, 118, 91, 0.3)',
            cursor: isExecuting ? 'wait' : 'pointer',
            opacity: isExecuting ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isExecuting ? (
            <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <span className="calc-icon-spin">
              <Zap size={17} />
            </span>
          )}
          <span>{calculationRun ? 'Hitung Ulang SAW (Run Baru)' : 'Jalankan Perhitungan SAW'}</span>
        </button>
      </div>

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '13.5px',
          }}
        >
          <strong>Kalkulasi Gagal:</strong> {errorMsg}
        </div>
      )}

      {/* Snapshot breakdown panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <Panel
          title="Alternatif Lolos Gerbang Kelayakan"
          subtitle={`${verifiedCandidates.length} calon terverifikasi dengan data lengkap akan masuk run.`}
        >
          <ul style={{ listStyle: 'none' }}>
            {verifiedCandidates.map((c) => {
              const res = residents.find((r) => r.id === c.residentId)
              return (
                <li
                  key={c.id}
                  className="candidate-calc-item"
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid var(--color-line)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: '600', color: 'var(--color-green-950)' }}>{res?.name || c.id}</span>
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
          <ul style={{ listStyle: 'none' }}>
            {excludedCandidates.map((c) => {
              const res = residents.find((r) => r.id === c.residentId)
              return (
                <li
                  key={c.id}
                  className="candidate-calc-item"
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid var(--color-line)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-muted)' }}>{res?.name || c.id}</div>
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
