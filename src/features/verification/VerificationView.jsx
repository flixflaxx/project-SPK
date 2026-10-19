import { useState, useEffect, useRef } from 'react'
import { FileText, CheckCircle2, Clock, AlertTriangle, Edit3 } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { Modal } from '../../components/common/Modal.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function VerificationView({
  candidates,
  residents,
  currentUser,
  onUpdateVerification,
}) {
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [newStatus, setNewStatus] = useState('VERIFIED')
  const [notes, setNotes] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const containerRef = useRef(null)

  const verifiedCount = candidates.filter((c) => c.verificationStatus === 'VERIFIED').length
  const pendingCount = candidates.filter((c) => c.verificationStatus === 'PENDING').length
  const revisionOrRejectCount = candidates.filter(
    (c) => c.verificationStatus === 'REVISION_REQUIRED' || c.verificationStatus === 'REJECTED'
  ).length

  const percentVerified = candidates.length > 0 ? Math.round((verifiedCount / candidates.length) * 100) : 0

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.verif-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
      window.anime({
        targets: containerRef.current.querySelector('.verif-progress-bar'),
        width: ['0%', `${percentVerified}%`],
        duration: 850,
        easing: 'easeOutCubic',
      })
    }
  }, [candidates, percentVerified])

  const filteredCandidates = candidates.filter((c) => {
    if (filterStatus === 'ALL') return true
    return c.verificationStatus === filterStatus
  })

  function handleOpenModal(candidate) {
    setSelectedCandidate(candidate)
    setNewStatus(candidate.verificationStatus === 'PENDING' ? 'VERIFIED' : candidate.verificationStatus)
    setNotes(candidate.verificationNotes || '')
  }

  function handleSave(e) {
    e.preventDefault()
    if (!notes.trim()) {
      alert('Catatan verifikasi wajib diisi.')
      return
    }
    onUpdateVerification({
      candidateId: selectedCandidate.id,
      status: newStatus,
      notes: notes.trim(),
      verifierId: currentUser.id,
      verifiedAt: new Date().toISOString(),
    })
    setSelectedCandidate(null)
  }

  const columns = [
    {
      key: 'resident',
      label: 'Warga Calon',
      width: '24%',
      render: (_, row) => {
        const res = residents.find((r) => r.id === row.residentId)
        return (
          <div>
            <div style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>
              {res?.name || row.residentId}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              NIK: <code>{res?.nikMasked || '—'}</code> · RT/RW: {res?.addressRtRw || '—'}
            </div>
          </div>
        )
      },
    },
    {
      key: 'verificationStatus',
      label: 'Status Saat Ini',
      width: '16%',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'documents',
      label: 'Kelengkapan Bukti',
      width: '18%',
      render: (_, row) => {
        const res = residents.find((r) => r.id === row.residentId)
        return (
          <div style={{ fontSize: '12.5px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: 'var(--color-green-700)' }}>
              <FileText size={13} /> {res?.documentCount || 0} Bukti Unggah
            </span>
            <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
              (KTP, KK, Surat RT)
            </div>
          </div>
        )
      },
    },
    {
      key: 'verificationNotes',
      label: 'Catatan Petugas',
      width: '26%',
      render: (val, row) => (
        <div>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-main)' }}>{val || '—'}</div>
          {row.verifiedBy && (
            <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Petugas: {row.verifiedBy} · {row.verifiedAt ? new Date(row.verifiedAt).toLocaleDateString('id-ID') : ''}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Tindakan',
      width: '16%',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => handleOpenModal(row)}
          className="btn-action-glow"
          style={{
            fontSize: '12px',
            backgroundColor: 'var(--color-green-700)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Edit3 size={13} />
          <span>Periksa / Ubah</span>
        </button>
      ),
    },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={5}
        title="Verifikasi Berkas Warga"
        description="Pemeriksaan dokumen dan penetapan kelayakan berkas calon."
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
          className="verif-stat-card interactive-card"
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
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TERVERIFIKASI SAH</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {verifiedCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Siap masuk kalkulasi SAW
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
          className="verif-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>MENUNGGU VERIFIKASI</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {pendingCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Perlu tinjauan petugas lapangan
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

        <div
          className="verif-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>REVISI / GUGUR</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-danger)', marginTop: '4px' }}>
              {revisionOrRejectCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Dokumen kurang / tidak layak
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
              Kelengkapan Verifikasi Administrasi Calon
            </span>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              {verifiedCount} dari {candidates.length} calon telah terverifikasi lengkap
            </div>
          </div>
          <span style={{ fontSize: '17px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-green-700)' }}>
            {percentVerified}%
          </span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'var(--color-surface-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            className="verif-progress-bar"
            style={{
              height: '100%',
              width: `${percentVerified}%`,
              background: 'linear-gradient(90deg, var(--color-green-700), var(--color-green-500))',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>

      <Panel>
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Filter Status:</span>
          {['ALL', 'PENDING', 'VERIFIED', 'REVISION_REQUIRED', 'REJECTED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              style={{
                fontSize: '12px',
                fontWeight: '600',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: filterStatus === st ? 'var(--color-green-950)' : 'var(--color-surface-muted)',
                color: filterStatus === st ? 'var(--color-lime)' : 'var(--color-text-muted)',
                border: '1px solid var(--color-line-dark)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={filteredCandidates} />
      </Panel>

      {/* Modal Pemeriksaan Berkas */}
      <Modal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        title="Pemeriksaan & Verifikasi Dokumen Calon"
      >
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Status Verifikasi Kelayakan
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            >
              <option value="VERIFIED">TERVERIFIKASI (Lolos Syarat & Siap Masuk SPK)</option>
              <option value="PENDING">PENDING (Menunggu Pemeriksaan Lanjutan)</option>
              <option value="REVISION_REQUIRED">PERLU REVISI (Dokumen Belum Lengkap)</option>
              <option value="REJECTED">DITOLAK (Tidak Memenuhi Kriteria Dasar)</option>
            </select>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Catatan Faktual Petugas
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: KTP dan KK sudah dicocokkan dengan data RT. Kondisi fisik rumah dan penghasilan sesuai kriteria..."
              style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedCandidate(null)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-action-glow"
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-green-700)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '13px',
              }}
            >
              Simpan Verifikasi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
