import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, UserCheck, CheckCircle2, FileSignature, Check, RotateCcw } from 'lucide-react'
import { Modal } from '../../components/common/Modal.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'
import {
  DECISION_PERMISSION,
  latestDecision,
  recordDecision,
  countApproved,
} from '@shared/domain/decisions/approval.js'
import { deriveRecommendations } from '@shared/domain/decisions/recommendations.js'

export function DecisionsView({
  calculationRun,
  activePeriod,
  residents,
  candidates,
  decisions,
  currentUser,
  onRecordDecision,
}) {
  const [selectedCandidateId, setSelectedCandidateId] = useState(null)
  const [outcome, setOutcome] = useState('APPROVED')
  const [reason, setReason] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const containerRef = useRef(null)

  const hasPermission = currentUser?.permissions?.includes(DECISION_PERMISSION) || currentUser?.permissions?.includes('all')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.decision-card-item'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(50),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [calculationRun, decisions])

  function handleOpenDecisionModal(candidateId) {
    setSelectedCandidateId(candidateId)
    const current = calculationRun ? latestDecision(decisions, calculationRun.id, candidateId) : null
    if (current && current.outcome !== 'REVOKED') {
      setOutcome('REVOKED')
      setReason('')
    } else {
      setOutcome('APPROVED')
      setReason('')
    }
    setErrorMsg('')
  }

  function handleSaveDecision(e) {
    e.preventDefault()
    if (!calculationRun) return
    setErrorMsg('')

    try {
      const timestamp = new Date().toISOString()
      const newDecision = recordDecision({
        decisions,
        run: calculationRun,
        recommendations,
        quota,
        actor: currentUser,
        context: {
          decisionId: `dec-${timestamp.replace(/[-:.]/g, '')}`,
          decidedAt: timestamp,
        },
        command: {
          candidateId: selectedCandidateId,
          outcome,
          reason,
        },
      })

      onRecordDecision(newDecision)
      setSelectedCandidateId(null)
      setReason('')
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan keputusan.')
    }
  }

  if (!calculationRun) {
    return (
      <div>
        <PageHeader
          featureNum={15}
          title="Validasi dan Persetujuan Penerima"
          description="Persetujuan atau penolakan manusia dengan alasan wajib, aktor pencatat, dan jejak keputusan append-only."
        />
        <Panel>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13.5px' }}>
            Belum ada hasil kalkulasi SAW untuk periode aktif. Jalankan kalkulasi terlebih dahulu.
          </p>
        </Panel>
      </div>
    )
  }

  const quota = activePeriod?.quota ?? 0
  const recommendations = deriveRecommendations({ run: calculationRun, quota })
  const approvedCount = countApproved(decisions, calculationRun.id)

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={15}
        title="Persetujuan Penerima Bansos"
        description="Lembar penetapan persetujuan resmi penerima bantuan sosial."
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>ALTERNATIF PERINGKAT</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {calculationRun.results.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Siap diverifikasi penetapan
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
            <UserCheck size={22} />
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>RESMI DISETUJUI</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {approvedCount} / {quota} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Pagu</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Ketetapan pejabat desa
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>OTORISASI AKTIF</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: hasPermission ? 'var(--color-green-700)' : 'var(--color-warning)', marginTop: '8px' }}>
              {hasPermission ? 'Akses Penuh' : 'Hanya Lihat'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              {currentUser.displayName} ({currentUser.role})
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: hasPermission ? '#edf8f3' : '#fef3c7',
              color: hasPermission ? 'var(--color-green-700)' : 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileSignature size={22} />
          </div>
        </div>
      </div>

      {!hasPermission && (
        <div
          style={{
            backgroundColor: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning-border)',
            color: 'var(--color-warning)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '18px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Akses Terbatas:</strong> Peran saat ini ({currentUser.displayName}) hanya memiliki izin baca. Gunakan peran <strong>Penyetuju / Kepala Desa</strong> untuk menetapkan keputusan.
          </div>
        </div>
      )}

      <Panel title="Daftar Alternatif & Status Penetapan Resmi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {calculationRun.results.map((row) => {
            const cand = candidates.find((c) => c.id === row.candidateId)
            const res = residents.find((r) => r.id === cand?.residentId)
            const rec = recommendations.items.find((i) => i.candidateId === row.candidateId)
            const dec = latestDecision(decisions, calculationRun.id, row.candidateId)
            const isApproved = dec && dec.outcome === 'APPROVED'

            return (
              <div
                key={row.candidateId}
                className="decision-card-item interactive-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface)',
                  border: isApproved ? '1.5px solid var(--color-green-600)' : '1px solid var(--color-line)',
                  boxShadow: 'var(--shadow-sm)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: '800', fontSize: '15.5px', color: 'var(--color-green-950)' }}>
                      #{row.rank} {res?.name || row.candidateId}
                    </span>
                    <StatusBadge status={rec?.status} customLabel={`Rekomendasi: ${rec?.status}`} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    NIK: <code>{res?.nikMasked || '—'}</code> · Alamat: {res?.addressRtRw || '—'}
                  </div>
                  {dec && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-green-950)', backgroundColor: 'var(--color-surface-muted)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line)' }}>
                      <strong>Keputusan Terkini:</strong> <StatusBadge status={dec.outcome} /> — "{dec.reason}"
                      <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '3px' }}>
                        Oleh: {dec.decidedBy} ({new Date(dec.decidedAt).toLocaleString('id-ID')})
                        {dec.isOverride && <span style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}> [DISKRESI / OVERRIDE]</span>}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    disabled={!hasPermission}
                    onClick={() => handleOpenDecisionModal(row.candidateId)}
                    className={dec && dec.outcome !== 'REVOKED' ? '' : 'btn-action-glow'}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: dec && dec.outcome !== 'REVOKED' ? '#fff0f6' : 'var(--color-green-700)',
                      color: dec && dec.outcome !== 'REVOKED' ? '#c2255c' : '#ffffff',
                      border: dec && dec.outcome !== 'REVOKED' ? '1px solid #fcc2d7' : 'none',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      opacity: !hasPermission ? 0.5 : 1,
                      cursor: !hasPermission ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {dec && dec.outcome !== 'REVOKED' ? (
                      <>
                        <RotateCcw size={14} />
                        <span>Cabut Keputusan</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Tetapkan Keputusan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      {/* Modal Penetapan Keputusan */}
      <Modal
        isOpen={Boolean(selectedCandidateId)}
        onClose={() => setSelectedCandidateId(null)}
        title="Form Penetapan Keputusan Bantuan Sosial"
      >
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12.5px',
              marginBottom: '14px',
            }}
          >
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleSaveDecision}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Jenis Keputusan
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            >
              <option value="APPROVED">SETUJUI (Penerima Resmi Bansos)</option>
              <option value="REJECTED">TOLAK (Gugur / Tidak Ditetapkan)</option>
              <option value="REVOKED">CABUT KEPUTUSAN AKTIF (Untuk Koreksi Ulang)</option>
            </select>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Alasan Penetapan (Wajib Diisi Secara Transparan)
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Memenuhi kriteria kemiskinan ekstrem dan lansia tunggal sesuai hasil musyawarah desa..."
              style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedCandidateId(null)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-action-glow"
              style={{
                padding: '9px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-green-700)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '13px',
              }}
            >
              Simpan Keputusan Resmi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
