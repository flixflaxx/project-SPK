import { useState, useEffect, useRef } from 'react'
import { Plus, Users, CheckCircle2, Clock } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { Modal } from '../../components/common/Modal.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function CandidatesView({
  candidates,
  residents,
  activePeriod,
  onRegisterCandidate,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedResidentId, setSelectedResidentId] = useState('')
  const [error, setError] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.cand-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [])

  // Warga yang belum didaftarkan sebagai calon pada periode aktif
  const unregisteredResidents = residents.filter(
    (r) => !candidates.some((c) => c.residentId === r.id && c.periodId === activePeriod?.id)
  )

  const verifiedCount = candidates.filter((c) => c.verificationStatus === 'VERIFIED').length
  const pendingCount = candidates.filter((c) => c.verificationStatus === 'PENDING').length

  function handleRegister(e) {
    e.preventDefault()
    if (!selectedResidentId) {
      setError('Pilih warga yang akan didaftarkan.')
      return
    }
    const newCandidate = {
      id: `cand-${Date.now()}`,
      residentId: selectedResidentId,
      periodId: activePeriod.id,
      applicationStatus: 'APPLIED',
      verificationStatus: 'PENDING',
      verificationNotes: 'Pendaftaran baru, menunggu verifikasi berkas.',
      verifiedBy: null,
      verifiedAt: null,
      createdAt: new Date().toISOString(),
    }
    onRegisterCandidate(newCandidate)
    setIsModalOpen(false)
    setSelectedResidentId('')
    setError('')
  }

  const columns = [
    {
      key: 'resident',
      label: 'Nama Calon & NIK',
      width: '28%',
      render: (_, row) => {
        const res = residents.find((r) => r.id === row.residentId)
        return (
          <div>
            <div style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>
              {res?.name || row.residentId}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              NIK: <code>{res?.nikMasked || '—'}</code> · {res?.addressRtRw || '—'}
            </div>
          </div>
        )
      },
    },
    {
      key: 'verificationStatus',
      label: 'Status Verifikasi',
      width: '18%',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'verificationNotes',
      label: 'Catatan Kelayakan / Verifikasi',
      width: '32%',
      render: (val) => (
        <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
          {val || 'Belum ada catatan.'}
        </span>
      ),
    },
    {
      key: 'applicationStatus',
      label: 'Status Aplikasi',
      width: '12%',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'createdAt',
      label: 'Tgl Daftar',
      width: '10%',
      render: (val) => new Date(val).toLocaleDateString('id-ID'),
    },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={4}
        title="Calon Penerima Bansos"
        description="Pendaftaran alternatif warga calon penerima bantuan untuk periode aktif."
        actions={
          <button
            type="button"
            className="btn-action-glow"
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: 'var(--color-green-700)',
              color: 'var(--color-text-inverse)',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} />
            <span>Daftarkan Calon Penerima</span>
          </button>
        }
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
          className="cand-stat-card interactive-card"
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
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TOTAL CALON TERDAFTAR</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {candidates.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Periode {activePeriod?.name || 'Aktif'}
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
          className="cand-stat-card interactive-card"
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
              Memenuhi syarat masuk SAW
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
          className="cand-stat-card interactive-card"
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
              Dalam antrean periksa berkas
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

      <Panel
        title={`Daftar Calon — ${activePeriod?.name || 'Periode Aktif'}`}
        subtitle={`Total: ${candidates.length} calon terdaftar.`}
      >
        <DataTable columns={columns} data={candidates} />
      </Panel>

      {/* Modal Pendaftaran Calon */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Daftarkan Warga sebagai Calon Alternatif"
      >
        {error && (
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
            {error}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Pilih Warga (dari Data Master Warga)
            </label>
            <select
              value={selectedResidentId}
              onChange={(e) => setSelectedResidentId(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            >
              <option value="">— Pilih Warga —</option>
              {unregisteredResidents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (NIK: {r.nikMasked}) — RT/RW: {r.addressRtRw}
                </option>
              ))}
            </select>
            {unregisteredResidents.length === 0 && (
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '4px', display: 'block' }}>
                Semua warga telah terdaftar pada periode seleksi ini.
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={unregisteredResidents.length === 0}
              className="btn-action-glow"
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-green-700)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '13px',
                opacity: unregisteredResidents.length === 0 ? 0.6 : 1,
              }}
            >
              Daftarkan Calon
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
