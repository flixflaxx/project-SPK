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
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (anime && containerRef.current) {
      anime({
        targets: containerRef.current.querySelectorAll('.verif-stat-card'),
        opacity: [0, 1],
        translateY: [16, 0],
        delay: anime.stagger(80),
        duration: 550,
        easing: 'easeOutBack',
      })
      anime({
        targets: containerRef.current.querySelector('.verif-progress-bar'),
        width: ['0%', `${percentVerified}%`],
        duration: 900,
        easing: 'easeOutQuart',
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
            <div style={{ fontWeight: '800', color: 'var(--color-green-950)' }}>
              {res?.name || row.residentId}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
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
            <span
              className="clay-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: '700',
                color: 'var(--color-green-700)',
                backgroundColor: '#edf8f3',
                padding: '4px 10px',
              }}
            >
              <FileText size={13} /> {res?.documentCount || 0} Bukti Unggah
            </span>
            <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '3px' }}>
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
            <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '3px' }}>
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
          className="clay-btn"
          style={{
            fontSize: '11.5px',
            padding: '7px 14px',
            gap: '6px',
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

      {/* Top 3 Squircle Metric Cards with Claymorphism */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '20px',
          marginBottom: '26px',
        }}
      >
        <div
          className="verif-stat-card clay-card"
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
                TERVERIFIKASI SAH
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '6px', lineHeight: 1.1 }}>
              {verifiedCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Siap masuk kalkulasi SAW
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
          className="verif-stat-card clay-card"
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
              MENUNGGU VERIFIKASI
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '6px', lineHeight: 1.1 }}>
              {pendingCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Perlu tinjauan petugas lapangan
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#fef3c7',
              color: 'var(--color-warning)',
            }}
          >
            <Clock size={22} />
          </div>
        </div>

        <div
          className="verif-stat-card clay-card"
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
              REVISI / GUGUR
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-danger)', marginTop: '6px', lineHeight: 1.1 }}>
              {revisionOrRejectCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Dokumen kurang / tidak layak
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
      </div>

      {/* Visual Progress Bar Card in Claymorphism */}
      <div
        className="clay-card"
        style={{
          padding: '20px 26px',
          borderRadius: '24px',
          marginBottom: '26px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-green-950)' }}>
              Kelengkapan Verifikasi Administrasi Calon
            </span>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {verifiedCount} dari {candidates.length} calon telah terverifikasi lengkap
            </div>
          </div>
          <span
            className="clay-badge"
            style={{
              fontSize: '15px',
              fontWeight: '800',
              fontFamily: 'monospace',
              color: 'var(--color-green-700)',
              backgroundColor: '#edf8f3',
              padding: '4px 14px',
            }}
          >
            {percentVerified}%
          </span>
        </div>
        <div className="clay-sunken" style={{ height: '10px', width: '100%' }}>
          <div
            className="verif-progress-bar clay-progress-fill"
            style={{
              height: '100%',
              width: `${percentVerified}%`,
              background: 'linear-gradient(90deg, #16765b, #20b47c, #b5f56a)',
            }}
          />
        </div>
      </div>

      <Panel>
        {/* Filter bar with 3D Clay Pills */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Filter Status:
          </span>
          {['ALL', 'PENDING', 'VERIFIED', 'REVISION_REQUIRED', 'REJECTED'].map((st) => {
            const isActive = filterStatus === st
            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className="clay-badge"
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '6px 14px',
                  backgroundColor: isActive ? 'var(--color-green-950)' : '#ffffff',
                  color: isActive ? 'var(--color-lime)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transform: isActive ? 'scale(1.04)' : undefined,
                }}
              >
                {st}
              </button>
            )
          })}
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
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-green-950)' }}>
              Status Verifikasi Kelayakan
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="VERIFIED">TERVERIFIKASI (Lolos Syarat & Siap Masuk SPK)</option>
              <option value="PENDING">PENDING (Menunggu Pemeriksaan Lanjutan)</option>
              <option value="REVISION_REQUIRED">PERLU REVISI (Dokumen Belum Lengkap)</option>
              <option value="REJECTED">DITOLAK (Tidak Memenuhi Kriteria Dasar)</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-green-950)' }}>
              Catatan Faktual Petugas
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: KTP dan KK sudah dicocokkan dengan data RT. Kondisi fisik rumah dan penghasilan sesuai kriteria..."
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setSelectedCandidate(null)}
              className="clay-badge"
              style={{ padding: '9px 18px', backgroundColor: '#ffffff', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '13px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="clay-btn"
              style={{
                padding: '9px 22px',
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
